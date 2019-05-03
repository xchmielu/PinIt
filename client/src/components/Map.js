import React, { useState, useEffect, useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/src/css/mapbox-gl.css'
import differenceInMinutes from 'date-fns/difference_in_minutes'

import { GET_PINS_QUERY } from '../graphql/queries'
import { DELETE_PIN_MUTATION } from '../graphql/mutations'
import { useClient } from '../client'
import Pin from './PinIcon'
import Context from '../context'
import Blog from '../components/Blog'
import { Typography } from '@material-ui/core'
import { Subscription } from 'react-apollo'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
} from '../graphql/subscriptions'

const INITIAL_VIEWPORT = {
  latitude: 52.219839344283194,
  longitude: 21.00785682483977,
  zoom: 13,
}

const Map = ({ classes }) => {
  const client = useClient()
  const { state, dispatch } = useContext(Context)
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)
  const [userPosition, setUserPosition] = useState(null)
  const [popup, setPopup] = useState(null)
  //remove popup

  useEffect(() => {
    const pinExists =
      popup && state.pins.findIndex(pin => pin._id === popup._id) > -1
    if (!pinExists) {
      setPopup(null)
    }
  }, [state.pins.length])

  const mobile = useMediaQuery('(max-width: 650px)')

  useEffect(() => {
    getUserPostion()
  }, [])
  //Show the Pins Array
  useEffect(() => {
    getPins()
  }, [])

  const getUserPostion = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        setViewport({ ...viewport, latitude, longitude })
        setUserPosition({ latitude, longitude })
      })
    }
  }

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return
    if (!state.draft) {
      dispatch({ type: 'CREATE_DRAFT' })
    }
    const [longitude, latitude] = lngLat
    dispatch({ type: 'UPDATE_DRAFT_LOC', payload: { longitude, latitude } })
  }

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY)
    dispatch({ type: 'GET_PINS', payload: getPins })
  }

  const hightlightNewPin = pin => {
    return differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
      ? 'green'
      : 'darkblue'
  }

  const handleSelectPin = pin => {
    setPopup(pin)
    dispatch({ type: 'SET_PIN', payload: pin })
  }

  const isAuth = () => state.currentUser._id === popup.author._id

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id }
    await client.request(DELETE_PIN_MUTATION, variables)
    setPopup(null)
  }
  return (
    <div className={mobile ? classes.rootMobile : classes.root}>
      <ReactMapGL
        height="calc(100vh - 64px)"
        width="100vw"
        scrollZoom={!mobile}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoibWNobWllbGV3c2tpIiwiYSI6ImNqdXB0YjFrcTAyMDEzeW55cHJodXdqYzkifQ.ZUm3zM12Hxjkr_eoIMnokg"
        onViewportChange={viewport => setViewport(viewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={viewport => setViewport(viewport)}
          />
        </div>
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <Pin size={40} color="black" />
          </Marker>
        )}

        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <Pin size={40} color="hotpink" />
          </Marker>
        )}
        {/* {show the pins} */}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <Pin
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={hightlightNewPin(pin)}
            />
          </Marker>
        ))}

        {/* Popup */}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
                {isAuth && (
                  <Button
                    onClick={() => {
                      handleDeletePin(popup)
                    }}
                  >
                    <DeleteIcon className={classes.deleteIcon} />
                  </Button>
                )}
              </Typography>
            </div>
          </Popup>
        )}
      </ReactMapGL>

      {/* subciption area */}

      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data
          console.log({ pinAdded })
          dispatch({ type: 'CREATE_PIN', payload: pinAdded })
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data
          console.log({ pinDeleted })
          dispatch({ type: 'DELETE_PIN', payload: pinDeleted })
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data
          console.log({ pinUpdated })
          dispatch({ type: 'CREATE_COMMENT', payload: pinUpdated })
        }}
      />

      <Blog />
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em',
  },
  deleteIcon: {
    color: 'red',
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover',
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
}

export default withStyles(styles)(Map)

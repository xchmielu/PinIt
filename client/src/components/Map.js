import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import 'mapbox-gl/src/css/mapbox-gl.css'



// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 52.219839344283194,
  longitude: 21.00785682483977,
  zoom: 13
}

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT)

  return (
    <div className={classes.root}>
      <ReactMapGL
      height="calc(100vh - 64px)"
      width="100vw"
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxApiAccessToken="pk.eyJ1IjoibWNobWllbGV3c2tpIiwiYSI6ImNqdXB0YjFrcTAyMDEzeW55cHJodXdqYzkifQ.ZUm3zM12Hxjkr_eoIMnokg"
      onViewportChange={viewport => setViewport(viewport)}
      {...viewport}
      >
        <div className={classes.navigationControl}>
        <NavigationControl
          onViewportChange={viewport => setViewport(viewport)}
        />
        </div>

      </ReactMapGL>
    </div>
    );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);

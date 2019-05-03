import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import MapIcon from '@material-ui/icons/Map'
import Typography from '@material-ui/core/Typography'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

import Context from '../context'
import Signout from '../components/Auth/Signout'

const Header = ({ classes }) => {
  const { state } = useContext(Context)
  const { currentUser } = state
  const mobile = useMediaQuery('(max-width: 650px)')
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* {logo} */}
          <div className={classes.grow}>
            <MapIcon className={classes.icon} />
            <Typography
              className={mobile ? classes.mobile : ''}
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
            >
              PinIt
            </Typography>
            {/* {user info} */}
            {currentUser && (
              <div className={classes.grow}>
                <img
                  className={classes.picture}
                  src={currentUser.picture}
                  alt={currentUser.name}
                />
                <Typography
                  className={mobile ? classes.mobile : ''}
                  variant="h5"
                  color="inherit"
                  noWrap
                >
                  {currentUser.name}
                </Typography>
              </div>
            )}
          </div>
          <Signout />
        </Toolbar>
      </AppBar>
    </div>
  )
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.unit,
    color: 'white',
    fontSize: 45,
  },
  mobile: {
    display: 'none',
  },
  picture: {
    height: '50px',
    borderRadius: '90%',
    marginRight: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(Header)

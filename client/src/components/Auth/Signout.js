import React, { useContext } from 'react'
import { GoogleLogout } from 'react-google-login'

import { withStyles } from '@material-ui/core/styles'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Typography from '@material-ui/core/Typography'
import Context from '../../context'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

const Signout = ({ classes }) => {
  const mobile = useMediaQuery('(max-width: 650px)')
  const { dispatch } = useContext(Context)

  const onSignOut = () => {
    dispatch({ type: 'SIGNOUT_USER' })
    console.log('User signout!')
  }

  return (
    <GoogleLogout
      onLogoutSuccess={onSignOut}
      render={({ onClick }) => (
        <span onClick={onClick} className={classes.root}>
          <Typography
            style={{ display: mobile ? 'none' : 'block' }}
            variant="body1"
            className={classes.buttonText}
          >
            Logout
          </Typography>
          <ExitToApp className={classes.buttonIcon} />
        </span>
      )}
    />
  )
}

const styles = {
  root: {
    cursor: 'pointer',
    display: 'flex',
  },
  buttonText: {
    color: 'white',
  },
  buttonIcon: {
    marginLeft: '5px',
    color: 'white',
  },
}

export default withStyles(styles)(Signout)

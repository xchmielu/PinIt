import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from "graphql-request";
import Typography from "@material-ui/core/Typography";

import Context from '../../context'
import {ME_QUERY} from '../../graphql/queries'

const Login = ({ classes }) => {

  const { dispatch } = useContext(Context)

  const onSuccess = async googleUser => {
   try {
    const idToken = googleUser.getAuthResponse().id_token
    const client = new GraphQLClient('http://localhost:4000/grphql', {
      headers: {authorization: idToken}
    })
    const {me} = await client.request(ME_QUERY)
      dispatch({
        type: "LOGIN_USER", payload: me
      })
   } catch (err) {
     onFailure(err)
   }
  }
  const onFailure = err => {
    console.error(`Error occured on login- ${err}`)
  }

  return (
  <div className={classes.root} >
  <Typography
    component="h1"
    variant="h3"
    gutterBottom
    noWrap
    style = {{color: "rgb(66,133,244)"}}
  >
    Welcome!
  </Typography>
  <GoogleLogin clientId="788175733094-c99oshh2kfcespkvts9bfe1v5ahl0gk3.apps.googleusercontent.com" 
  onSuccess={onSuccess} 
  isSignedIn={true} 
  onFailure={onFailure} 
  theme="dark" />
  </div>)
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);

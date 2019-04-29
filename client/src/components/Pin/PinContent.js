import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Context from '../../context'
import Typography from '@material-ui/core/Typography'
import AccessTime from '@material-ui/icons/AccessTime'
import Face from '@material-ui/icons/Face'
import format from 'date-fns/format'
import CreateComment from '../Comment/CreateComment'
import Comments from '../Comment/Comments'

const PinContent = ({ classes }) => {
  const { state } = useContext(Context)
  const { title, content, author, createdAt, comments } = state.currentPin

  return (
    <div className={classes.root}>
      <Typography component="h2" constiant="h4" color="primary" gutterBottom>
        {title}
      </Typography>
      <Typography
        className={classes.name}
        component="h3"
        constiant="h6"
        color="inherit"
        gutterBottom
      >
        <Face className={classes.icon} /> {author.name}
      </Typography>

      <Typography
        className={classes.text}
        constiant="subtitle2"
        color="inherit"
        gutterBottom
      >
        <AccessTime className={classes.icon} />
        {format(Number(createdAt), 'MMM Do, YYYY')}
      </Typography>

      <Typography className={classes.text} constiant="subtitle1" gutterBottom>
        {content}
      </Typography>

      {/* {pin comments} */}
      <CreateComment />
      <Comments comments={comments} />
    </div>
  )
}

const styles = theme => ({
  root: {
    padding: '1em 0.5em',
    textAlign: 'center',
    width: '100%',
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default withStyles(styles)(PinContent)

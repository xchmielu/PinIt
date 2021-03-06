import React, { useState, useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AddAPhotoIcon from '@material-ui/icons/AddAPhotoTwoTone'
import LandscapeIcon from '@material-ui/icons/LandscapeOutlined'
import ClearIcon from '@material-ui/icons/Clear'
import SaveIcon from '@material-ui/icons/SaveTwoTone'
import Context from '../../context'
import { CREATE_PIN_MUTATION } from '../../graphql/mutations'
import { useClient } from '../../client'
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery'

const CreatePin = ({ classes }) => {
  const mobile = useMediaQuery('(max-width: 650px)')
  const client = useClient()
  const [title, setTtile] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { state, dispatch } = useContext(Context)

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      setSubmitting(true)
      const url = await handleImageUpload()
      const { latitude, longitude } = state.draft
      console.log(state.currentUser)
      const variables = {
        title,
        image: url,
        content,
        latitude,
        longitude,
        author: state.currentUser._id,
      }
      await client.request(CREATE_PIN_MUTATION, variables)

      handleDeleteDraft()
    } catch (err) {
      setSubmitting(false)
      console.error(`Error at creating Pin- ${err}`)
    }
  }

  const handleDeleteDraft = () => {
    setTtile('')
    setImage('')
    setContent('')

    dispatch({ type: 'DELETE_DRAFT' })
  }

  const handleImageUpload = async () => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'pinitproject')
    data.append('cloud_name', 'xchmielu')

    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/xchmielu/image/upload',
      data
    )
    return res.data.url
  }

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      <div>
        <TextField
          onChange={e => setTtile(e.target.value)}
          name="title"
          label="title"
          placeholder="Insert Pin title"
        />
        <input
          accept="image/*"
          id="image"
          type="file"
          onChange={e => setImage(e.target.files[0])}
          className={classes.input}
        />
        <label htmlFor="image">
          <Button
            style={{ color: image && 'green' }}
            component="span"
            size="small"
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows={mobile ? '3' : '6'}
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discrad
        </Button>
        {/* Submit */}
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  )
}

const styles = theme => ({
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing.unit,
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '95%',
  },
  input: {
    display: 'none',
  },
  alignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit,
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0,
  },
})

export default withStyles(styles)(CreatePin)

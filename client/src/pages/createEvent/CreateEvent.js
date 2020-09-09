import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import frLocale from 'date-fns/locale/fr'
import { connect } from 'react-redux'
import { createEvent } from '../../redux/actions/eventActions'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { createEventStyles } from './CreateEventStyles'
import AutocompleteAddress from '../../components/autocompleteAddress/AutocompleteAddress'

const CreateEvent = ({ createEvent, history }) => {
  // HOOKS
  const classes = createEventStyles()
  const [formData, setFormData] = useState({
    eventName: '',
    type: '',
    address: '',
    lat: null,
    lng: null,
    date: new Date()
  })
  const { eventName, type, address, date, description } = formData

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDayChange = date => {
    setFormData({ ...formData, date })
  }

  const handleAddressChange = address => {
    setFormData({ ...formData, address })
  }

  const handleSelect = async address => {
    const res = await geocodeByAddress(address)
    const latLng = await getLatLng(res[0])
    console.log(res[0])
    console.log(latLng)
    setFormData({
      ...formData,
      address,
      lat: latLng.lat,
      lng: latLng.lng
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    createEvent(formData, history)
  }

  return (
    <Paper className={classes.root}>
      <form noValidate onSubmit={handleSubmit}>
        <Typography className={classes.formTitle} variant='h2' color='primary'>
          Créé ton event !!
        </Typography>
        <TextField
          className={classes.textFields}
          type='text'
          name='eventName'
          value={eventName}
          onChange={handleChange}
          placeholder='Donnes un titre'
          fullWidth
        />

        <FormControl className={classes.textFields} fullWidth>
          <InputLabel id='type-event'>Type</InputLabel>
          <Select labelId='type-event' name='type' value={type} onChange={handleChange}>
            <MenuItem value={'visite'}>Visite</MenuItem>
            <MenuItem value={'concert'}>Concert</MenuItem>
            <MenuItem value={'festival'}>Festival</MenuItem>
            <MenuItem value={'restaurant'}>Restaurant</MenuItem>
            <MenuItem value={'cinema'}>Cinéma</MenuItem>
          </Select>
        </FormControl>

        <AutocompleteAddress address={address} handleAddressChange={handleAddressChange} handleSelect={handleSelect} />

        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
          <DatePicker
            className={classes.datePicker}
            name='date'
            format='dd/MM/yyyy'
            value={date}
            onChange={handleDayChange}
          />
        </MuiPickersUtilsProvider>

        <TextField
          className={classes.textFields}
          name='description'
          multiline
          rows={5}
          value={description}
          onChange={handleChange}
          placeholder='Description'
          fullWidth
        />
        <Button variant='contained' color='primary' type='submit'>
          Envoyer
        </Button>
      </form>
    </Paper>
  )
}

CreateEvent.propTypes = {
  createEvent: PropTypes.func.isRequired
}

export default connect(null, { createEvent })(CreateEvent)

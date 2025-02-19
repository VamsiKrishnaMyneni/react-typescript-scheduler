import React, { useState } from 'react'
import { format, parse } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { TextField, Autocomplete, Box } from "@mui/material"

const StyledAutoComplete = styled(Autocomplete)(({ theme }) => ({
  color: 'inherit',
  width: '94%',
  display: 'inline-flex',
  margin: theme.spacing(.5, 1.5),
  transition: theme.transitions.create('width'),
  [theme.breakpoints.up('sm')]: {
    width: '100%'
  },
  [theme.breakpoints.up('md')]: {
    width: '27ch'
  },
  [theme.breakpoints.up('lg')]: {
    width: '27ch'
  },
}))

interface ToolbarSearchbarProps {
  events: Array<{
    id: string;
    groupLabel: string;
    date: string;
    startHour: string;
    endHour: string;
    color?: string;
  }>;
  onInputChange?: (value: string) => void;
}

function ToolbarSearchbar(props: ToolbarSearchbarProps) {
  const { events, onInputChange } = props
  const { t } = useTranslation(['common'])
  const [value, setValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  const handleOnChange = (event: React.SyntheticEvent, newValue: unknown) => {
    setValue(newValue as string)
    if (onInputChange) onInputChange(newValue as string)
  }

  return (
    <StyledAutoComplete
      value={value}
      id="scheduler-autocomplete"
      inputValue={inputValue}
      sx={{ mb: 0, display: 'inline-flex' }}
      onChange={(event, newValue) => handleOnChange(event, newValue as string)}
      options={events?.sort((a, b) => -b.groupLabel.localeCompare(a.groupLabel))}
      groupBy={(option) => (option as ToolbarSearchbarProps['events'][0]).groupLabel}
      /*
      (
          <Box sx={{display: "flex", alignItems: "center"}}>
            <Box
              component="span"
              sx={{
                width: 16,
                height: 16,
                mr: 1,
                borderRadius: "50%",
                backgroundColor: option?.color || theme.palette.secondary.main
              }}
            />
            {option?.groupLabel}
          </Box>
        )
       */
      getOptionLabel={(option) => {
        const event = option as ToolbarSearchbarProps['events'][0];
        return event ?
          `${event.groupLabel || ''} | (${event.startHour || ''} - ${event.endHour || ''})` : ''
      }}
      isOptionEqualToValue={(option, value) => (option as ToolbarSearchbarProps['events'][0])?.id === (value as ToolbarSearchbarProps['events'][0])?.id}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
        if (onInputChange) onInputChange(newInputValue)
      }}
      renderOption={(props, option, state, ownerState) => {
        const event = option as ToolbarSearchbarProps['events'][0];
        return (
          <Box component="li" sx={{ fontSize: 12 }} {...props}>
            {format(
              parse(event.date, 'yyyy-MM-dd', new Date()),
              'dd-MMMM-yyyy'
            )}
            ({event.startHour || ''} - {event.endHour || ''})
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          // label={t('search')}
          label="Search"
          InputProps={{ ...params.InputProps }}
        />
      )}
    />
  )
}
export default ToolbarSearchbar
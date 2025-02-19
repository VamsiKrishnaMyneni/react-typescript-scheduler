import React, { useState } from 'react'
import { styled } from "@mui/system"
import { useTheme } from '@mui/material/styles'
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, tableCellClasses, Tooltip
} from "@mui/material"
import { format, parse, add, differenceInMinutes, isValid } from 'date-fns'
import EventItem from "./EventItem"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    paddingLeft: 4,
    paddingRight: 4,
    borderTop: `1px solid #ccc !important`,
    borderBottom: `1px solid #ccc !important`,
    borderLeft: `1px solid #ccc !important`,
    '&:nth-of-type(1)': {
      borderLeft: `0px !important`
    }
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    height: 16,
    width: 128,
    maxWidth: 128,
    cursor: 'pointer',
    borderLeft: `1px solid #ccc`,
    '&:nth-of-type(1)': { borderLeft: 0 }
  },
  [`&.${tableCellClasses.body}:hover`]: {
    backgroundColor: "#eee"
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  '&::-webkit-scrollbar': {
    width: 7,
    height: 6
  },
  '&::-webkit-scrollbar-track': {
    WebkitBoxShadow: "inset 0 0 6px rgb(125, 161, 196, 0.5)"
  },
  '&::-webkit-scrollbar-thumb': {
    WebkitBorderRadius: 4,
    borderRadius: 4,
    background: "rgba(0, 172, 193, .5)",
    WebkitBoxShadow: "inset 0 0 6px rgba(25, 118, 210, .5)"
  },
  '&::-webkit-scrollbar-thumb:window-inactive': {
    background: "rgba(125, 161, 196, 0.5)"
  }
}))


type DayModeViewProps = {
  events?: any[],
  columns?: any[],
  rows?: any[],
  date?: string,
  options?: Record<string, any>,
  searchResult?: Record<string, any>,
  onTaskClick: (event: React.MouseEvent, task: any) => void,
  onCellClick: (event: React.MouseEvent, row: any, day: any) => void,
  onEventsChange: (event: any) => void,
  locale: string
}


function DayModeView(props: DayModeViewProps) {
  const {
    options,
    columns,
    rows,
    searchResult,
    onTaskClick,
    onCellClick,
    onEventsChange
  } = props
  const theme = useTheme()
  const [state, setState] = useState<{ columns: any[] | undefined; rows: any[] | undefined; itemTransfert?: any; transfertTarget?: any }>({ columns, rows })

  /**
   * @name onCellDragOver
   * @param e
   * @return void
   */
  const onCellDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  /**
   * @name onCellDragStart
   * @description
   * @param e
   * @param item
   * @param rowLabel
   * @param rowIndex
   * @param dayIndex
   * @return void
   */
  const onCellDragStart = (e: React.DragEvent, item: any, rowLabel: any, rowIndex: any, dayIndex: any) => {
    setState({
      ...state,
      itemTransfert: { item, rowLabel, rowIndex, dayIndex }
    }
    )
  }

  /**
   * @name onCellDragEnter
   * @description
   * @param e
   * @param rowLabel
   * @param rowIndex
   * @param dayIndex
   * @return void
   */
  const onCellDragEnter = (e: React.DragEvent, rowLabel: any, rowIndex: any, dayIndex: any) => {
    e.preventDefault()
    setState({ ...state, transfertTarget: { rowLabel, rowIndex, dayIndex } })
  }

  /**
   * @name onCellDragEnd
   * @description
   * @param e
   * @return void
   */
  const onCellDragEnd = (e: React.DragEvent) => {
    e.preventDefault()
    if (!state.itemTransfert || !state.transfertTarget) {
      return
    }
    let transfert = state.itemTransfert
    let transfertTarget = state.transfertTarget
    let rowsData = Array.from(rows || [])
    let day = rowsData[transfertTarget.rowIndex]?.days[transfertTarget.dayIndex]

    if (day) {
      let hourRegExp = /[0-9]{2}:[0-9]{2}/
      let foundEventIndex = day.data.findIndex((e: any) =>
        e.id === transfert.item.id &&
        e.startHour === transfert.item.startHour &&
        e.endHour === transfert.item.endHour
      )
      // Task already exists in the data array of the chosen cell
      if (foundEventIndex !== -1) {
        return
      }

      // Event cell item to transfert
      let prevEventCell = rowsData[transfert.rowIndex].days[transfert.dayIndex]
      // Timeline label (00:00 am, 01:00 am, etc.)
      let label = transfertTarget.rowLabel?.toUpperCase()
      let hourMatch = hourRegExp.exec(label)
      let hourLabel = hourMatch ? hourMatch[0] : ''
      // Event's end hour
      let endHourMatch = hourRegExp.exec(transfert.item.endHour)
      let endHour = endHourMatch ? endHourMatch[0] : ''
      let endHourDate = parse(endHour, 'HH:mm', day.date)
      // Event start hour
      let startHourMatch = hourRegExp.exec(transfert.item.startHour)
      let startHour = startHourMatch ? startHourMatch[0] : ''
      let startHourDate = parse(startHour, 'HH:mm', day.date)
      // Minutes difference between end and start event hours
      let minutesDiff = differenceInMinutes(endHourDate, startHourDate)
      // New event end hour according to it new cell
      let newEndHour = add(
        parse(hourLabel, 'HH:mm', day.date), { minutes: minutesDiff }
      )

      if (!isValid(startHourDate)) {
        startHourDate = day.date
        minutesDiff = differenceInMinutes(endHourDate, startHourDate)
        newEndHour = add(
          parse(hourLabel, 'HH:mm', day.date), { minutes: minutesDiff }
        )
      }

      prevEventCell?.data?.splice(transfert?.item?.itemIndex, 1)
      transfert.item.startHour = label
      transfert.item.endHour = format(newEndHour, 'HH:mm aaa')
      transfert.item.date = format(day.date, 'yyyy-MM-dd')
      day.data.push(transfert.item)
      setState({ ...state, rows: rowsData })
      onEventsChange && onEventsChange(transfert.item)
    }
  }

  /**
   * @name handleCellClick
   * @description
   * @param event
   * @param row
   * @param day
   * @return void
   */
  const handleCellClick = (event: React.MouseEvent, row: any, day: any) => {
    event.preventDefault()
    event.stopPropagation()
    //setState({...state, activeItem: day})
    onCellClick && onCellClick(event, row, day)
  }

  /**
   * @name renderTask
   * @description
   * @param tasks
   * @param rowLabel
   * @param rowIndex
   * @param dayIndex
   * @return {unknown[] | undefined}
   */
  const renderTask = (tasks: any[], rowLabel: any, rowIndex: any, dayIndex: any) => {
    return tasks?.map((task, itemIndex: number) => {
      let condition = (
        searchResult ?
          (
            task?.groupLabel === searchResult?.groupLabel ||
            task?.user === searchResult?.user
          ) : !searchResult
      )
      return (
        condition &&
        <EventItem
          draggable
          event={task}
          elevation={0}
          boxSx={{ px: 0.3 }}
          onClick={(e: React.MouseEvent) => handleTaskClick(e, task)}
          key={`item_id-${itemIndex}_r-${rowIndex}_d-${dayIndex}`}
          onDragStart={(e: React.DragEvent) => onCellDragStart(
            e, { ...task, itemIndex }, rowLabel, rowIndex, dayIndex
          )}
          sx={{
            py: 0, mb: .5, color: "#fff",
            backgroundColor: task?.color || theme.palette.primary.light
          }}
        />
      )
    })
  }

  /**
   * @name handleTaskClick
   * @description
   * @param event
   * @param task
   * @return void
   */
  const handleTaskClick = (event: React.MouseEvent, task: any) => {
    event.preventDefault()
    event.stopPropagation()
    onTaskClick && onTaskClick(event, task)
  }

  return (
    <StyledTableContainer
      as={Paper}
      sx={{ maxHeight: options?.maxHeight || 540 }}
    >
      <Table
        size="small"
        aria-label="simple table"
        stickyHeader sx={{ minWidth: options?.minWidth ?? 540 }}
      >
        <TableHead sx={{ height: 24 }}>
          <StyledTableRow>
            <StyledTableCell align="left" />
            {
              columns?.map((column, index) => (
                <StyledTableCell
                  align="center" colSpan={2}
                  key={`weekday-${column?.day}-${index}`}
                >
                  {column?.weekDay} {column?.month}/{column?.day}
                </StyledTableCell>
              ))
            }
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {
            rows?.map((row, rowIndex) => {
              let lineTasks = row.days?.reduce((prev: number, curr: any) => prev + curr?.data?.length, 0)
              return (
                <StyledTableRow
                  key={`timeline-${rowIndex}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <Tooltip
                    placement="right"
                    title={`${lineTasks} event${lineTasks > 1 ? 's' : ''} on this week timeline`}
                  >
                    <StyledTableCell
                      scope="row" align="center"
                      component="th" sx={{ px: 1 }}
                      onClick={(event: React.MouseEvent) => handleCellClick(event, row, null)}
                    >
                      <Typography variant="body2">{row?.label}</Typography>
                      {row?.data?.length > 0 && renderTask(row?.data, row.id, rowIndex, 0)}
                    </StyledTableCell>
                  </Tooltip>
                  {
                    row?.days?.map((day: any, dayIndex: number) => {
                      return (
                        <StyledTableCell
                          key={day?.id}
                          scope="row"
                          align="center"
                          component="th"
                          colSpan={2}
                          sx={{ px: .3, py: .5 }}
                          onDragEnd={onCellDragEnd}
                          onDragOver={onCellDragOver}
                          onDragEnter={(e: React.DragEvent) => onCellDragEnter(e, row?.label, rowIndex, dayIndex)}
                          onClick={(event: React.MouseEvent) => handleCellClick(
                            event, { rowIndex, ...row }, { dayIndex, ...day }
                          )}
                        >
                          {day?.data?.length > 0 && renderTask(day?.data, row?.label, rowIndex, dayIndex)}
                        </StyledTableCell>
                      )
                    })
                  }
                </StyledTableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </StyledTableContainer >
  )
}

export default DayModeView
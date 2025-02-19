import { Box, Paper, Typography } from "@mui/material"

interface EventItemProps {
  sx?: object;
  boxSx?: object;
  event: {
    id: string | number;
    label: string;
    startHour?: string;
    endHour?: string;
  };
  rowId?: string | number;
  isMonthMode?: boolean;
  onClick?: (event: React.MouseEvent, task: any) => void;
  onDragStart?: (e: React.DragEvent<HTMLTableCellElement>, item: any, rowLabel: any, rowIndex: any, dayIndex: any) => void;
  elevation: any;
  draggable: boolean;
}

function EventItem(props: EventItemProps) {
  const {
    event,
    rowId,
    sx,
    boxSx,
    elevation,
    onClick,
    onDragStart
  } = props

  return (
    <Paper
      component="div"
      sx={sx}
      draggable
      onClick={(e) => onClick && onClick(e, event)}
      onDragStart={(e: React.DragEvent<HTMLTableCellElement>) => onDragStart && onDragStart(e, event, rowId, 0, 0)}
      elevation={elevation || 0}
      key={`item-d-${event?.id}-${rowId}`}
    >
      <Box sx={boxSx}>
        {/*isMonthMode &&
        <Typography variant="caption" sx={{fontSize: 8}}>
          {event?.startHour} - {event?.endHour}
        </Typography>*/}
        <Typography variant="body2" sx={{ fontSize: 11 }}>
          {event?.label}
        </Typography>
      </Box>
    </Paper>
  )
}

export default EventItem
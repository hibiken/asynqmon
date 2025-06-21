import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { publishEvent } from '../api';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  textField: {
    width: '100%',
    fontFamily: 'monospace',
  },
  eventField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitButton: {
    marginLeft: theme.spacing(1),
  },
  alert: {
    marginBottom: theme.spacing(2),
  },
}));

interface EventPublisherProps {
  qname: string;
}

const defaultPayload = {
  "key1": "value1",
  "key2": 123,
};

export default function EventPublisher({ qname }: EventPublisherProps) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [event, setEvent] = useState('');
  const [payloadStr, setPayloadStr] = useState(JSON.stringify(defaultPayload, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    try {
      // Validate JSON payload
      const payload = JSON.parse(payloadStr);
      
      if (!event || event.trim() === '') {
        setError('Event name is required');
        return;
      }

      // Send to API
      const response = await publishEvent(qname, { payload, event });
      
      setSuccess(`Event "${event}" published successfully! Task ID: ${response.task_id}`);
      enqueueSnackbar(`Event "${event}" published successfully!`, { variant: 'success' });
    } catch (error: unknown) {
      console.error('Error publishing event:', error);
      
      if (error instanceof SyntaxError) {
        setError('Invalid JSON in payload');
      } else if (error instanceof Error) {
        // Handle standard Error objects
        setError(`Error: ${error.message}`);
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        // Handle axios error responses
        const axiosError = error as { response?: { data?: string } };
        const errorMsg = typeof axiosError.response?.data === 'string' 
          ? axiosError.response.data 
          : 'Unknown error occurred';
        setError(`Publishing error: ${errorMsg}`);
      } else {
        // Fallback for any other type of error
        setError('An unexpected error occurred');
      }
      
      enqueueSnackbar('Error publishing event', { variant: 'error' });
    }
  };

  return (
    <Card className={classes.root}>
      <CardHeader 
        title="Publish Event" 
        subheader="Send events to the processing queue"
        action={
          <IconButton
            className={expanded ? classes.expandOpen : classes.expand}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show/hide"
          >
            <ExpandMoreIcon />
          </IconButton>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {error && (
            <Alert 
              severity="error" 
              className={classes.alert}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setError(null)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success"
              className={classes.alert}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setSuccess(null)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {success}
            </Alert>
          )}
          <TextField
            className={classes.eventField}
            label="Event Name"
            variant="outlined"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            placeholder="Example: email:send"
            InputProps={{
              endAdornment: (
                <SendIcon color="action" />
              )
            }}
          />
          <TextField
            className={classes.textField}
            label="Payload (JSON)"
            multiline
            rows={8}
            variant="outlined"
            value={payloadStr}
            onChange={(e) => setPayloadStr(e.target.value)}
            InputProps={{
              style: { fontFamily: 'monospace' }
            }}
          />
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            onClick={handleSubmit}
            startIcon={<PlayArrowIcon />}
          >
            Publish
          </Button>
        </CardActions>
      </Collapse>
    </Card>
  );
}

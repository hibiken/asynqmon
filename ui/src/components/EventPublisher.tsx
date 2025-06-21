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
  "chave1": "valor1",
  "chave2": 123,
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
      // Validar JSON do payload
      const payload = JSON.parse(payloadStr);
      
      if (!event || event.trim() === '') {
        setError('O nome do evento é obrigatório');
        return;
      }

      // Enviar para API
      const response = await publishEvent(qname, { payload, event });
      
      setSuccess(`Evento "${event}" publicado com sucesso! ID da task: ${response.task_id}`);
      enqueueSnackbar(`Evento "${event}" publicado com sucesso!`, { variant: 'success' });
    } catch (err) {
      console.error('Erro ao publicar evento:', err);
      if (err instanceof SyntaxError) {
        setError('JSON inválido no payload');
      } else if (err.response) {
        setError(`Erro ao publicar: ${err.response.data || err.message}`);
      } else {
        setError(`Erro: ${err.message}`);
      }
      enqueueSnackbar('Erro ao publicar evento', { variant: 'error' });
    }
  };

  return (
    <Card className={classes.root}>
      <CardHeader 
        title="Publicar Evento" 
        subheader="Envie eventos para a fila de processamento"
        action={
          <IconButton
            className={expanded ? classes.expandOpen : classes.expand}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="mostrar/ocultar"
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
            label="Nome do Evento"
            variant="outlined"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            placeholder="Exemplo: email:send"
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
            Publicar
          </Button>
        </CardActions>
      </Collapse>
    </Card>
  );
}

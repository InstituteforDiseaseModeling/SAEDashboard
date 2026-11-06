/* eslint-disable max-len */
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Box, IconButton, Button, TextareaAutosize, CircularProgress,
  Typography, Paper, LinearProgress, List, ListItem, ListItemText,
  ListItemSecondaryAction} from '@mui/material';
import PropTypes from 'prop-types';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SendIcon from '@mui/icons-material/Send';
import AddCommentIcon from '@mui/icons-material/AddComment';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import withStyles from '@mui/styles/withStyles';
import ChatFormRenderer from './ChatFormRenderer';
import MarkdownContent from './MarkdownContent';
import ResourcesPanel from './ResourcesPanel';
import CodePreviewPanel from './CodePreviewPanel';
import KeyIcon from '@mui/icons-material/Key';
import {Collapse, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '440px',
    height: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#313A44',
    color: '#F5F3ED',
    minHeight: '64px',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    overflow: 'hidden',
  },
  chatArea: {
    flex: 1,
    overflow: 'auto',
    marginBottom: '12px',
  },
  chatMessage: {
    padding: '10px 14px',
    marginBottom: '8px',
    borderRadius: '12px',
    maxWidth: '90%',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
  userMessage: {
    backgroundColor: '#FBF4C9',
    color: '#313A44',
    marginLeft: 'auto',
    borderBottomRightRadius: '4px',
  },
  assistantMessage: {
    backgroundColor: '#E7E9EB',
    color: '#313A44',
    borderBottomLeftRadius: '4px',
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  modeChip: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
};

const API_BASE = '/mind';

const QAChat = (props) => {
  const {classes, closeDrawer, apiKey = '', onApiKeyChange, embedded = false, prefillText = '', prefillKey = 0, drawerWidth = 440} = props;
  const LS_KEY = 'aiva_analytical_session_id';
  const [showApiKey, setShowApiKey] = useState(false);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem(LS_KEY));
  const [mode, setMode] = useState('analytical');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [formSubmitted, setFormSubmitted] = useState({});
  const [currentModel, setCurrentModel] = useState(null);
  const [contextPct, setContextPct] = useState(null);
  const [showSessions, setShowSessions] = useState(false);
  const [sessionList, setSessionList] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [preview, setPreview] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  useEffect(() => {
    if (prefillKey && prefillText) {
      clearHandler();
      setInputText(prefillText);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [prefillKey]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem(LS_KEY, sessionId);
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [sessionId]);

  const loadSessionMessages = useCallback(async (sid) => {
    try {
      const resp = await fetch(`${API_BASE}/sessions/${sid}/messages`);
      if (!resp.ok) {
        setSessionId(null);
        return;
      }
      const data = await resp.json();
      if (data.mode) setMode(data.mode);
      setMessages((data.messages || []).map((m) => ({
        role: m.role, content: m.content,
        images: (m.files || []).filter((f) => f.match(/\.(png|jpg|jpeg|gif|svg)$/i)),
        resources: m.resources || null,
      })));
    } catch (_) {
      setSessionId(null);
    }
  }, []);

  const initialSessionRef = useRef(sessionId);
  useEffect(() => {
    if (initialSessionRef.current) {
      loadSessionMessages(initialSessionRef.current);
    }
  }, [loadSessionMessages]);

  const fetchSessions = useCallback(async () => {
    try {
      const resp = await fetch(`${API_BASE}/sessions?mode=analytical`);
      const data = await resp.json();
      setSessionList(data.sessions || []);
    } catch (_) { /* ignore */ }
  }, []);

  const resumeSession = (sid) => {
    setSessionId(sid);
    setShowSessions(false);
    loadSessionMessages(sid);
  };

  const deleteSession = async (sid) => {
    await fetch(`${API_BASE}/sessions/${sid}`, {method: 'DELETE'});
    if (sid === sessionId) {
      setSessionId(null);
      setMessages([]);
      setContextPct(null);
    }
    setDeleteConfirm(null);
    fetchSessions();
  };

  const processChatResponse = async (resp) => {
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantText = '';
    let streamingText = '';
    let formData = null;
    let inlineImages = [];
    let resources = null;
    let isStreaming = false;

    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, {stream: true});
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const event = JSON.parse(line.slice(6));
          if (event.type === 'progress') {
            setProgress(event.progress || 0);
            setProgressMsg(event.message || '');
            if (event.model) setCurrentModel(event.model);
          } else if (event.type === 'model_change') {
            if (event.model) setCurrentModel(event.model);
          } else if (event.type === 'text_delta') {
            streamingText += event.text;
            if (!isStreaming) {
              isStreaming = true;
              setMessages((prev) => [...prev, {role: 'assistant', content: streamingText, streaming: true}]);
            } else {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {...updated[updated.length - 1], content: streamingText};
                return updated;
              });
            }
          } else if (event.type === 'response') {
            assistantText = event.text || '';
            formData = event.form || null;
            if (event.model) setCurrentModel(event.model);
            if (event.context_pct != null) setContextPct(event.context_pct);
            if (event.mode) setMode(event.mode);
            if (event.session_id) setSessionId(event.session_id);
            if (event.files) {
              inlineImages = event.files.filter((f) => f.match(/\.(png|jpg|jpeg|gif|svg)$/i));
            }
            if (event.resources) resources = event.resources;
          } else if (event.type === 'mode_change') {
            setMode(event.mode);
          } else if (event.type === 'error') {
            assistantText = `Error: ${event.message}`;
          }
        } catch (_) { /* skip malformed SSE */ }
      }
    }

    const fileSavedRe = /FILE_SAVED:\s*(\S+)/g;
    let match;
    while ((match = fileSavedRe.exec(assistantText)) !== null) {
      const raw = match[1].replace(/^\/data\/tmp\//, '');
      if (raw.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
        inlineImages.push(raw);
      }
    }

    let cleanText = assistantText.replace(/FILE_SAVED:\s*\S+/g, '').trim();
    if (resources) {
      cleanText = cleanText.replace(/\n---\s*\n\*{0,2}Sources:?\*{0,2}\s*\n([\s\S]*)$/, '').trim();
    }

    if (isStreaming) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {role: 'assistant', content: cleanText, form: formData, images: inlineImages, resources};
        return updated;
      });
    } else {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: cleanText,
        form: formData,
        images: inlineImages,
        resources,
      }]);
    }
  };

  const sendChatMessage = async (message) => {
    setSending(true);
    setProgress(5);
    setProgressMsg('Thinking...');
    try {
      const resp = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({session_id: sessionId, message, api_key: apiKey || null}),
      });
      await processChatResponse(resp);
    } catch (e) {
      setMessages((prev) => [...prev, {role: 'assistant', content: `Error: ${e.message}`}]);
    }
    setSending(false);
    setProgress(0);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const msg = inputText.trim();
    setInputText('');
    setMessages((prev) => [...prev, {role: 'user', content: msg}]);
    await sendChatMessage(msg);
  };

  const handleFormSubmit = async (formResponse) => {
    setFormSubmitted((prev) => ({...prev, [formResponse.form_id]: true}));
    const summary = Object.entries(formResponse.values)
        .map(([k, v]) => `${k}: ${v}`).join('\n');
    setMessages((prev) => [...prev, {role: 'user', content: summary}]);
    await sendChatMessage(formResponse);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHandler = () => {
    setMessages([]);
    setSessionId(null);
    setMode('analytical');
    setFormSubmitted({});
    setCurrentModel(null);
    setContextPct(null);
    setPreview(null);
  };

  const renderMessage = (msg, idx) => {
    const isUser = msg.role === 'user';
    return (
      <Box key={idx} sx={{mb: 1}}>
        <Box sx={{display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start'}}>
          <Paper
            elevation={0}
            className={`${classes.chatMessage} ${isUser ? classes.userMessage : classes.assistantMessage}`}
            sx={{whiteSpace: 'normal'}}
          >
            <MarkdownContent content={msg.content} light={isUser} sessionId={sessionId} />
          </Paper>
        </Box>
        {msg.images && msg.images.length > 0 && !isUser && (
          <Box sx={{mt: 1}}>
            {msg.images.map((src, i) => (
              <img key={i}
                src={`${API_BASE}/files/${src}`}
                alt="output"
                style={{maxWidth: '100%', borderRadius: 4, marginBottom: 4}}
              />
            ))}
          </Box>
        )}
        {msg.resources && !isUser && (
          <ResourcesPanel
            resources={msg.resources}
            sessionId={sessionId}
            onPreviewFile={(path) => setPreview({type: 'file', path})}
            onPreviewDoc={(mdFile, title) => setPreview({type: 'doc', path: mdFile, title})}
          />
        )}
        {msg.form && !isUser && (
          <ChatFormRenderer
            form={msg.form}
            onSubmit={handleFormSubmit}
            disabled={sending || !!formSubmitted[msg.form.id]}
          />
        )}
      </Box>
    );
  };

  const modeColor = mode === 'onboarding' ? '#F85C02' : '#3AC9B1';
  const modelShort = currentModel ? currentModel.replace(/^claude-/, '') : null;

  const modelLabel = modelShort ? (contextPct != null ? `${modelShort} (ctx: ${contextPct}%)` : modelShort) : null;

  return (
    <main className={embedded ? undefined : classes.root}
      style={embedded ? {display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden'} : undefined}>
      {!embedded && (
        <div className={classes.header}>
          <IconButton onClick={closeDrawer}>
            <ChevronRightIcon style={{color: '#EBCB00'}}/>
          </IconButton>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant="subtitle1" style={{color: '#F5F3ED', fontWeight: 'bold'}}>
              AI Assistant
            </Typography>
            {modelLabel && (
              <Typography variant="caption" sx={{color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', lineHeight: 1}}>
                {modelLabel}
              </Typography>
            )}
          </Box>
          <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
            <span className={classes.modeChip} style={{backgroundColor: modeColor, color: '#fff'}}>
              {mode}
            </span>
            <IconButton size="small" onClick={() => { setShowSessions((v) => !v); if (!showSessions) fetchSessions(); }}
              title="Sessions"
              sx={{color: 'rgba(255,255,255,0.5)'}}>
              <HistoryIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => setShowApiKey((v) => !v)}
              title="API Key"
              sx={{color: apiKey ? '#3AC9B1' : 'rgba(255,255,255,0.5)'}}>
              <KeyIcon fontSize="small" />
            </IconButton>
          </Box>
        </div>
      )}

      <div className={classes.main}>
        {!embedded && (
          <Collapse in={showApiKey}>
            <Box sx={{mb: 1, p: 1, backgroundColor: '#FBF4C9', borderRadius: 1, border: '1px solid #EBCB00'}}>
              <Typography variant="caption" sx={{color: '#9B320D'}}>Anthropic API Key</Typography>
              <TextField
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange && onApiKeyChange(e.target.value)}
                placeholder="Enter Anthropic API key"
                fullWidth size="small"
                style={{backgroundColor: 'white', marginTop: 4}}
              />
            </Box>
          </Collapse>
        )}

        <Collapse in={showSessions}>
          <Box sx={{mb: 1, maxHeight: '200px', overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1}}>
            {sessionList.length === 0 && (
              <Typography variant="caption" sx={{p: 1, display: 'block', color: 'text.secondary'}}>No sessions</Typography>
            )}
            <List dense disablePadding>
              {sessionList.map((s) => (
                <ListItem key={s.session_id} button onClick={() => resumeSession(s.session_id)}
                  selected={s.session_id === sessionId}
                  sx={{py: 0.25}}>
                  <ListItemText
                    primary={`${s.title || 'Untitled'} (${s.message_count})`}
                    secondary={s.updated_at ? new Date(s.updated_at).toLocaleString() : 'unknown'}
                    primaryTypographyProps={{variant: 'caption', noWrap: true}}
                    secondaryTypographyProps={{variant: 'caption', fontSize: '0.65rem'}}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(s); }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </Collapse>

        <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle>Delete session?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete &quot;{deleteConfirm?.title || 'Untitled'}&quot;? This cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button color="error" onClick={() => deleteSession(deleteConfirm.session_id)}>Delete</Button>
          </DialogActions>
        </Dialog>

        {embedded && (
          <Box sx={{mb: 0.5, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1}}>
            {modelLabel && (
              <Typography variant="caption" color="textSecondary" sx={{fontSize: '0.7rem'}}>
                {modelLabel}
              </Typography>
            )}
            <IconButton size="small" onClick={() => { setShowSessions((v) => !v); if (!showSessions) fetchSessions(); }}
              title="Sessions" sx={{ml: 'auto', p: 0.25}}>
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {sending && (
          <Box sx={{mb: 1}}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="textSecondary">{progressMsg}</Typography>
          </Box>
        )}

        <div className={classes.chatArea}>
          {messages.map((msg, idx) => renderMessage(msg, idx))}
          <div ref={chatEndRef} />
        </div>

        <div className={classes.inputArea}>
          <TextareaAutosize
            ref={inputRef}
            placeholder="Ask a question about your indicators..."
            style={{flex: 1, minHeight: '40px', maxHeight: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '0.9rem', resize: 'none'}}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />
          <IconButton color="primary" onClick={sendMessage} disabled={sending || !inputText.trim()}>
            {sending ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
          <IconButton onClick={clearHandler} size="small" title="New session">
            <AddCommentIcon />
          </IconButton>
        </div>
      </div>

      {preview && (
        <CodePreviewPanel
          filePath={preview.path}
          fileType={preview.type}
          title={preview.title}
          onClose={() => setPreview(null)}
          drawerWidth={drawerWidth}
        />
      )}
    </main>
  );
};

QAChat.propTypes = {
  classes: PropTypes.object,
  closeDrawer: PropTypes.func,
  open: PropTypes.bool,
  embedded: PropTypes.bool,
  prefillText: PropTypes.string,
  prefillKey: PropTypes.number,
};

export default withStyles(styles)(QAChat);

/* eslint-disable object-curly-spacing */
/* eslint-disable brace-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Box, IconButton, Button, Typography, TextField, Collapse,
  List, ListItem, ListItemText, ListItemSecondaryAction, Switch,
  Chip, Tab, Tabs, LinearProgress, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress} from '@mui/material';
import PropTypes from 'prop-types';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import withStyles from '@mui/styles/withStyles';
import {FormattedMessage} from 'react-intl';
import ChatFormRenderer from './ChatFormRenderer';
import ChatHistoryDialog from './ChatHistoryDialog';
import MarkdownContent from './MarkdownContent';
import ResourcesPanel from './ResourcesPanel';
import CodePreviewPanel from './CodePreviewPanel';
import HistoryIcon from '@mui/icons-material/History';
import KeyIcon from '@mui/icons-material/Key';
import DownloadIcon from '@mui/icons-material/Download';
import BackupIcon from '@mui/icons-material/Backup';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AddCommentIcon from '@mui/icons-material/AddComment';
import QAChat from './QAChat';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#313A44',
    color: '#F5F3ED',
    minHeight: '64px',
    flexShrink: 0,
  },
  main: {
    padding: '16px',
    flex: 1,
    overflow: 'auto',
  },
  dropZone: {
    'border': '2px dashed #E7E9EB',
    'borderRadius': '4px',
    'padding': '24px',
    'textAlign': 'center',
    'cursor': 'pointer',
    'backgroundColor': '#fafafa',
    'transition': 'all 0.2s',
    'marginBottom': '16px',
    '&:hover': {
      backgroundColor: '#E7E9EB',
      borderColor: '#313A44',
    },
  },
  dropZoneActive: {
    border: '2px dashed #313A44',
    backgroundColor: '#FBF4C9',
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
  indicatorItem: {
    'borderBottom': '1px solid #eee',
    '&:last-child': {borderBottom: 'none'},
  },
};

const API_BASE = '/mind';

const IndicatorManager = (props) => {
  const {classes, closeDrawer, onIndicatorAdded, apiKey = '', onApiKeyChange, drawerWidth} = props;
  const [activeTab, setActiveTab] = useState(0);
  const [indicators, setIndicators] = useState([]);
  const [expandedIndicator, setExpandedIndicator] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [chatHistoryDialog, setChatHistoryDialog] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [chatHistoryMessages, setChatHistoryMessages] = useState([]);
  const [analyzePrefill, setAnalyzePrefill] = useState({text: '', ts: 0});

  // Chat state
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);
  // The drop zone shows automatically before a session starts; after that the
  // upload button in the input bar toggles it.
  const [showDropZone, setShowDropZone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState({});
  const [addedToDashboard, setAddedToDashboard] = useState(new Set());
  const [pendingUpload, setPendingUpload] = useState(null);
  const [currentModel, setCurrentModel] = useState(null);
  const [contextPct, setContextPct] = useState(null);
  const [preview, setPreview] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortRef = useRef(null);

  const fetchIndicators = useCallback(async () => {
    setLoadingIndicators(true);
    try {
      const resp = await fetch(`${API_BASE}/indicators`);
      const data = await resp.json();
      setIndicators(data.indicators || []);
    } catch (e) {
      console.error('Failed to fetch indicators:', e);
    }
    setLoadingIndicators(false);
  }, []);

  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setSending(true);
    setProgress(10);
    setProgressMsg('Uploading file...');

    try {
      const resp = await fetch(`${API_BASE}/upload`, {method: 'POST', body: formData});
      const data = await resp.json();

      const cols = data.validation.columns || [];
      const rows = (data.sample_rows || []).slice(0, 20); // limit to 20 rows for display
      let tableHtml = '';
      if (rows.length > 0) {
        tableHtml = '<div style="overflow-x:auto">' +
          '<table style="width:100%;border-collapse:collapse;font-size:0.75rem;margin:8px 0">' +
          '<tr>' + cols.map((c) => `<th style="border:1px solid #ccc;padding:3px 6px;background:#eee;text-align:left">${c}</th>`).join('') + '</tr>' +
          rows.map((r) => '<tr>' + cols.map((c) => `<td style="border:1px solid #ddd;padding:3px 6px">${r[c] != null ? r[c] : ''}</td>`).join('') + '</tr>').join('') +
          '</table></div>';
      }

      const summary = `File received: **${file.name}** (${data.validation.row_count} rows, ${cols.length} columns)` +
        `\n\nColumns: ${cols.join(', ')}` +
        (data.validation.sheets ? `\n\nSheets: ${data.validation.sheets.join(', ')}` : '') +
        (data.validation.issues.length > 0 ? `\n\nIssues: ${data.validation.issues.join(', ')}` : '');

      setMessages((prev) => [
        ...prev,
        {role: 'user', content: `Uploaded: ${file.name}`},
        {role: 'assistant', content: summary, tableHtml, showStartButton: true},
      ]);

      setSessionId(data.session_id);
      setPendingUpload({fileName: file.name, rowCount: data.validation.row_count, columns: cols});
      setShowDropZone(false);
    } catch (e) {
      setMessages((prev) => [...prev, {role: 'assistant', content: `Error uploading file: ${e.message}`}]);
    }
    setSending(false);
    setProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const startOnboarding = async () => {
    if (!pendingUpload) return;
    const {fileName, rowCount, columns} = pendingUpload;
    const userInstructions = inputText.trim();

    if (userInstructions) {
      setMessages((prev) => [...prev, {role: 'user', content: userInstructions}]);
    }
    setInputText('');
    setPendingUpload(null);

    setSending(true);
    setProgress(70);
    setProgressMsg('Analyzing uploaded file...');

    let bootMsg = `I uploaded a file: ${fileName} (${rowCount} rows, columns: ${columns.join(', ')}). Please validate it and show me the configuration form.`;
    if (userInstructions) {
      bootMsg = `I uploaded a file: ${fileName} (${rowCount} rows, columns: ${columns.join(', ')}).\n\nUser instructions: ${userInstructions}\n\nPlease validate it and show me the configuration form.`;
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const resp = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({session_id: sessionId, message: bootMsg, api_key: apiKey || null, user_instructions: userInstructions || null}),
        signal: ctrl.signal,
      });
      await processChatResponse(resp);
    } catch (e) {
      if (e.name !== 'AbortError') {
        setMessages((prev) => [...prev, {role: 'assistant', content: `Error: ${e.message}`}]);
      }
    }
    abortRef.current = null;
    setSending(false);
    setProgress(0);
  };

  const processChatResponse = async (resp) => {
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantText = '';
    let streamingText = '';
    let files = [];
    let formData = null;
    let indicatorCreated = false;
    let resources = null;
    let isStreaming = false;

    try {
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
              setProgress(event.progress);
              setProgressMsg(event.message);
              if (event.model) setCurrentModel(event.model);
            } else if (event.type === 'model_change') {
              if (event.model) setCurrentModel(event.model);
            } else if (event.type === 'text_delta') {
              streamingText += event.text;
              const text = streamingText;
              if (!isStreaming) {
                isStreaming = true;
                setMessages((prev) => [...prev, {role: 'assistant', content: text, streaming: true}]);
              } else {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {...updated[updated.length - 1], content: text};
                  return updated;
                });
              }
            } else if (event.type === 'response') {
              assistantText = event.text;
              files = event.files || [];
              formData = event.form || null;
              indicatorCreated = event.indicator_created || false;
              if (event.resources) resources = event.resources;
              if (event.model) setCurrentModel(event.model);
              if (event.context_pct != null) setContextPct(event.context_pct);
            } else if (event.type === 'error') {
              assistantText = `Error: ${event.message}`;
            }
          } catch (parseErr) {
            // skip malformed SSE
          }
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') return;
      throw e;
    }

    if (isStreaming) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {role: 'assistant', content: assistantText, form: formData, showAddButton: indicatorCreated, resources};
        return updated;
      });
    } else {
      setMessages((prev) => [...prev, {role: 'assistant', content: assistantText, form: formData, showAddButton: indicatorCreated, resources}]);
    }

    if (indicatorCreated) {
      fetchIndicators();
    }
  };

  const sendChatMessage = async (message) => {
    setSending(true);
    setProgress(5);
    setProgressMsg('Thinking...');
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const resp = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({session_id: sessionId, message, api_key: apiKey || null}),
        signal: ctrl.signal,
      });
      await processChatResponse(resp);
    } catch (e) {
      if (e.name !== 'AbortError') {
        setMessages((prev) => [...prev, {role: 'assistant', content: `Error: ${e.message}`}]);
      }
    }
    abortRef.current = null;
    setSending(false);
    setProgress(0);
  };

  const sendMessage = async () => {
    if (pendingUpload) {
      await startOnboarding();
      return;
    }
    if (!inputText.trim() || !sessionId) return;
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

  const toggleHide = async (indicatorId, currentHidden, country) => {
    await fetch(`${API_BASE}/indicators/${indicatorId}?country=${encodeURIComponent(country)}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({hidden: !currentHidden}),
    });
    if (onIndicatorAdded) onIndicatorAdded();
  };

  const openChatHistory = async (ind) => {
    setChatHistoryDialog(ind);
    setChatHistoryMessages([]);
    try {
      const resp = await fetch(`${API_BASE}/indicators/${ind.id}/chat`);
      const data = await resp.json();
      setChatHistoryMessages(data.messages || []);
    } catch (e) {
      setChatHistoryMessages([]);
    }
  };

  const triggerDownload = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    if (filename) a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadIndicator = (indicatorId) => {
    triggerDownload(`${API_BASE}/indicators/${indicatorId}/download`, `${indicatorId}.zip`);
  };

  const downloadBackup = () => {
    triggerDownload(`${API_BASE}/backup`);
  };

  const confirmDelete = async () => {
    if (!deleteDialog || deleteConfirmText !== deleteDialog.id) return;
    await fetch(`${API_BASE}/indicators/${deleteDialog.id}?country=${encodeURIComponent(deleteDialog.country)}`, {method: 'DELETE'});
    setDeleteDialog(null);
    setDeleteConfirmText('');
    fetchIndicators();
  };

  const clearChat = () => {
    if (abortRef.current) abortRef.current.abort();
    if (sessionId) {
      fetch(`${API_BASE}/sessions/${sessionId}`, {method: 'DELETE'}).catch(() => {});
    }
    setSessionId(null);
    setMessages([]);
    setInputText('');
    setSending(false);
    setPendingUpload(null);
    setFormSubmitted({});
    setAddedToDashboard(new Set());
    setCurrentModel(null);
    setContextPct(null);
    setProgress(0);
    setProgressMsg('');
    setShowDropZone(false);
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
            <MarkdownContent content={msg.content} light={isUser} />
            {msg.tableHtml && <div dangerouslySetInnerHTML={{__html: msg.tableHtml}} />}
          </Paper>
        </Box>
        {msg.resources && !isUser && (
          <ResourcesPanel resources={msg.resources} sessionId={sessionId}
            onPreviewFile={(path) => setPreview({type: 'file', path})} />
        )}
        {msg.form && !isUser && (
          <ChatFormRenderer
            form={msg.form}
            onSubmit={handleFormSubmit}
            disabled={sending || !!formSubmitted[msg.form.id]}
          />
        )}
        {msg.showStartButton && !isUser && pendingUpload && (
          <Box sx={{mt: 1}}>
            <Button
              variant="contained"
              size="small"
              onClick={startOnboarding}
              disabled={sending}
              sx={{textTransform: 'none', backgroundColor: '#313A44'}}
            >
              Start Onboarding
            </Button>
            <Typography variant="caption" display="block" sx={{mt: 0.5, color: 'text.secondary'}}>
              Click to start, or type instructions below and press send.
            </Typography>
          </Box>
        )}
        {msg.showAddButton && !isUser && (
          <Box sx={{mt: 1, display: 'flex', justifyContent: 'flex-start'}}>
            <Button
              variant="contained"
              size="small"
              disabled={addedToDashboard.has(idx)}
              onClick={() => {
                setAddedToDashboard((prev) => new Set([...prev, idx]));
                if (onIndicatorAdded) onIndicatorAdded();
              }}
              sx={{
                'textTransform': 'none',
                'backgroundColor': addedToDashboard.has(idx) ? '#3AC9B1' : '#313A44',
                '&:disabled': {backgroundColor: '#3AC9B1', color: '#fff'},
              }}
            >
              {addedToDashboard.has(idx) ? 'Added to Dashboard' : 'Add to Dashboard'}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <main className={classes.root}>
      <div className={classes.header}>
        <IconButton onClick={closeDrawer}>
          <ChevronRightIcon style={{color: '#EBCB00'}}/>
        </IconButton>
        <Typography variant="subtitle1" style={{color: '#F5F3ED', fontWeight: 'bold'}}>
          <FormattedMessage id='indicator_manager' defaultMessage='Indicators'/>
        </Typography>
        <IconButton size="small" onClick={() => setShowApiKey((v) => !v)}
          title="API Key"
          sx={{color: apiKey ? '#3AC9B1' : 'rgba(255,255,255,0.5)'}}>
          <KeyIcon fontSize="small" />
        </IconButton>
      </div>

      <Box sx={{borderBottom: 1, borderColor: 'divider', flexShrink: 0}}>
        <Tabs value={activeTab} onChange={(e, v) => {setActiveTab(v); if (v === 0) fetchIndicators();}} variant="fullWidth">
          <Tab label={<FormattedMessage id='indicator_list' defaultMessage='List'/>} />
          <Tab label={<FormattedMessage id='add_indicator' defaultMessage='Add'/>} />
          <Tab label={<FormattedMessage id='analyze_indicator' defaultMessage='Analyze'/>} />
        </Tabs>
      </Box>

      <Collapse in={showApiKey && activeTab !== 0}>
        <Box sx={{mx: 2, mt: 1, p: 1, backgroundColor: '#FBF4C9', borderRadius: 1, border: '1px solid #EBCB00'}}>
          <Typography variant="caption" sx={{color: '#9B320D'}}>API Key</Typography>
          <TextField
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange && onApiKeyChange(e.target.value)}
            placeholder="Enter API key"
            fullWidth size="small"
            style={{backgroundColor: 'white', marginTop: 4}}
          />
        </Box>
      </Collapse>

      {/* Tab 1: Indicator List */}
      {activeTab === 0 && (
        <div className={classes.main}>
          {loadingIndicators && <LinearProgress />}
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 1}}>
            <Button
              size="small"
              startIcon={<BackupIcon />}
              onClick={downloadBackup}
              variant="outlined"
              disabled={indicators.length === 0}
              title="Download a zip of all indicator metadata, CSV files, and chat history"
            >
              Backup All
            </Button>
          </Box>
          {indicators.length === 0 && !loadingIndicators && (
            <Typography variant="body2" color="textSecondary" style={{textAlign: 'center', marginTop: '40px'}}>
              No user-created indicators yet. Use the &quot;Add Indicator&quot; tab to create one.
            </Typography>
          )}
          <List>
            {indicators.map((ind) => {
              const compoundKey = `${ind.country}__${ind.id}`;
              return (
                <React.Fragment key={compoundKey}>
                  <ListItem
                    button
                    onClick={() => setExpandedIndicator(expandedIndicator === compoundKey ? null : compoundKey)}
                    className={classes.indicatorItem}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                          <Typography variant="subtitle2">{ind.display_name}</Typography>
                          <Chip label={ind.is_user_created ? 'Custom' : 'Default'} size="small"
                            color={ind.is_user_created ? 'primary' : 'default'}
                            style={{height: 20, fontSize: '0.7rem'}}
                          />
                          {ind.hidden && <Chip label="Not Listed" size="small" color="warning" style={{height: 20, fontSize: '0.7rem'}}/>}
                        </Box>
                      }
                      secondary={ind.country}
                    />
                    {expandedIndicator === compoundKey ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItem>
                  <Collapse in={expandedIndicator === compoundKey}>
                    <Box sx={{px: 2, py: 1, backgroundColor: '#fafafa'}}>
                      {ind.description && (
                        <Typography variant="body2" paragraph>{ind.description}</Typography>
                      )}
                      <Typography variant="caption" display="block" color="textSecondary">
                      Subgroups: {(ind.subgroups || []).join(', ')}
                      </Typography>
                      {ind.created_at && (
                        <Typography variant="caption" display="block" color="textSecondary">
                        Created: {new Date(ind.created_at).toLocaleDateString()}
                        </Typography>
                      )}
                      {ind.onboarding_notes && (
                        <Typography variant="caption" display="block" color="textSecondary" style={{marginTop: 4}}>
                        Notes: {ind.onboarding_notes}
                        </Typography>
                      )}
                      <Box sx={{mt: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                        <Button
                          size="small"
                          startIcon={<QueryStatsIcon />}
                          onClick={() => {setAnalyzePrefill({text: `For indicator ${ind.display_name} `, ts: Date.now()}); setActiveTab(2);}}
                          variant="outlined"
                        >
                        Analyze
                        </Button>
                        {ind.is_user_created && <>
                          <Button
                            size="small"
                            startIcon={<HistoryIcon />}
                            onClick={() => openChatHistory(ind)}
                            variant="outlined"
                          >
                          Chat History
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() => downloadIndicator(ind.id)}
                            variant="outlined"
                          >
                          Download
                          </Button>
                          <Button
                            size="small"
                            startIcon={ind.hidden ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            onClick={() => toggleHide(ind.id, ind.hidden, ind.country)}
                            variant="outlined"
                          >
                            {ind.hidden ? 'Add to Dashboard' : 'Remove from Dashboard'}
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeleteDialog(ind)}
                            variant="outlined"
                            color="error"
                          >
                          Delete
                          </Button>
                        </>}
                      </Box>
                    </Box>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>
        </div>
      )}

      {/* Tab 2: AI Chat — kept mounted to preserve onboarding state across tab switches */}
      <div className={classes.main} style={{display: activeTab === 1 ? 'flex' : 'none', flexDirection: 'column', minWidth: '400px'}}>
        {/* Drop zone */}
        {(!sessionId || showDropZone) && (
          <Box
            className={`${classes.dropZone} ${dragOver ? classes.dropZoneActive : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUploadIcon style={{fontSize: 48, color: '#313A44'}} />
            <Typography variant="body2" color="textSecondary" style={{marginTop: 8}}>
              <FormattedMessage id='upload_file' defaultMessage='Drag & drop a CSV or Excel file here'/>
            </Typography>
            <Typography variant="caption" color="textSecondary">
                or click to browse
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{display: 'none'}}
              onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
            />
          </Box>
        )}

        {/* Model name + context usage */}
        {currentModel && (
          <Box sx={{mb: 0.5}}>
            <Typography variant="caption" color="textSecondary" sx={{
              fontSize: '0.7rem',
            }}>
              {currentModel.replace(/^claude-/, '')}{contextPct != null ? ` (ctx: ${contextPct}%)` : ''}
            </Typography>
          </Box>
        )}

        {/* Progress bar */}
        {sending && (
          <Box sx={{mb: 1}}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="textSecondary">{progressMsg}</Typography>
          </Box>
        )}

        {/* Chat messages */}
        <Box sx={{flex: 1, overflow: 'auto', mb: 1, minHeight: '200px'}}>
          {messages.map((msg, idx) => renderMessage(msg, idx))}
          <div ref={chatEndRef} />
        </Box>

        {/* Input area */}
        {sessionId && (
          <Box sx={{display: 'flex', gap: 1, alignItems: 'flex-end'}}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              size="small"
              placeholder={pendingUpload ?
                  'Optional: describe how to handle this data...' :
                  'Describe your indicator...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
            />
            <IconButton color="primary" onClick={sendMessage} disabled={sending || (!inputText.trim() && !pendingUpload)}>
              {sending ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
            <IconButton
              onClick={() => setShowDropZone((v) => !v)}
              size="small"
              title={showDropZone ? 'Hide file upload' : 'Upload a file'}
              color={showDropZone ? 'primary' : 'default'}
              disabled={sending}
            >
              <CloudUploadIcon />
            </IconButton>
            <IconButton onClick={clearChat} size="small" title="New session">
              <AddCommentIcon />
            </IconButton>
          </Box>
        )}
      </div>

      {/* Tab 3: Analyze (QAChat) — kept mounted to preserve state across tab switches */}
      <Box sx={{flex: 1, flexDirection: 'column', overflow: 'hidden', minWidth: '400px',
        display: activeTab === 2 ? 'flex' : 'none'}}>
        <QAChat embedded apiKey={apiKey} onApiKeyChange={onApiKeyChange} open={activeTab === 2} prefillText={analyzePrefill.text} prefillKey={analyzePrefill.ts} drawerWidth={drawerWidth} />
      </Box>

      <ChatHistoryDialog
        open={!!chatHistoryDialog}
        onClose={() => setChatHistoryDialog(null)}
        messages={chatHistoryMessages}
        indicatorName={chatHistoryDialog?.display_name}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Indicator</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            This will permanently delete <strong>{deleteDialog?.display_name}</strong> and all its data.
          </Typography>
          <Typography variant="body2" paragraph>
            <FormattedMessage id='delete_confirm_1' defaultMessage={`Type indicator name `}/>
            ({deleteDialog?.id})
            <FormattedMessage id='delete_confirm_2' defaultMessage=" to confirm deletion."/>
          </Typography>
          <TextField
            fullWidth size="small"
            placeholder={deleteDialog?.id}
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setDeleteDialog(null); setDeleteConfirmText('');}}>Cancel</Button>
          <Button
            color="error" variant="contained"
            disabled={deleteConfirmText !== deleteDialog?.id}
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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

IndicatorManager.propTypes = {
  classes: PropTypes.object,
  closeDrawer: PropTypes.func,
  onIndicatorAdded: PropTypes.func,
  apiKey: PropTypes.string,
  onApiKeyChange: PropTypes.func,
  drawerWidth: PropTypes.number,
};

export default withStyles(styles)(IndicatorManager);

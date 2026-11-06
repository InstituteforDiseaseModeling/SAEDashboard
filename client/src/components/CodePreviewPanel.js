import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Light as SyntaxHighlighter} from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import markdown from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import {IconButton, Typography} from '@mui/material';

SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('markdown', markdown);

const langMap = {py: 'python', r: 'python', json: 'json', sh: 'bash', csv: 'plaintext', txt: 'plaintext', md: 'markdown'};

const CodePreviewPanel = ({filePath, fileType = 'file', title, onClose, drawerWidth = 440}) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const isDoc = fileType === 'doc';
  const fileName = title || filePath.split('/').pop();
  const ext = filePath.split('.').pop().toLowerCase();

  useEffect(() => {
    setContent(null);
    setError(null);
    const url = isDoc ? `/mind/docs/${filePath}/raw` : `/mind/files/${filePath}/raw`;
    fetch(url)
        .then((r) => r.ok ? r.text() : Promise.reject(new Error('File not found')))
        .then(setContent)
        .catch((e) => setError(e.message));
  }, [filePath, isDoc]);

  const panel = (
    <div style={{
      position: 'fixed', top: 64, right: drawerWidth,
      width: '33vw', minWidth: 320, maxWidth: 700,
      height: 'calc(100vh - 64px)',
      zIndex: 9999, backgroundColor: '#fff',
      boxShadow: '-2px 0 12px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px', backgroundColor: '#313A44', color: '#F5F3ED',
      }}>
        <Typography variant="caption" sx={{fontWeight: 600, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1}}>
          {fileName}
        </Typography>
        {!isDoc && (
          <IconButton size="small" component="a" href={`/mind/files/${filePath}`} download={filePath.split('/').pop()}
            sx={{color: '#F5F3ED', mx: 0.5}}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton size="small" onClick={onClose} sx={{color: '#F5F3ED'}}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <div style={{flex: 1, overflow: 'auto', fontSize: '0.8rem'}}>
        {error && <div style={{padding: 16, color: '#c62828'}}>{error}</div>}
        {!error && content === null && <div style={{padding: 16, color: '#888'}}>Loading...</div>}
        {!error && content !== null && (
          <SyntaxHighlighter
            language={langMap[ext] || 'plaintext'}
            style={docco}
            showLineNumbers={!isDoc}
            wrapLongLines={isDoc}
            customStyle={{margin: 0, padding: 12, minHeight: '100%', fontSize: '0.8rem'}}
          >
            {content}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(panel, document.body);
};

export default CodePreviewPanel;

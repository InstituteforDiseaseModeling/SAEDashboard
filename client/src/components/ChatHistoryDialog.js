import React from 'react';
import {Dialog, DialogTitle, DialogContent, IconButton, Box, Paper, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import MarkdownContent from './MarkdownContent';

const ChatHistoryDialog = ({open, onClose, messages, indicatorName}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper"
      sx={{'& .MuiDialog-container': {zIndex: 10002}}}>
      <DialogTitle sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
          Chat History: {indicatorName}
        </Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {messages.length === 0 && (
          <Typography variant="body2" color="textSecondary" sx={{textAlign: 'center', py: 4}}>
            No chat history available for this indicator.
          </Typography>
        )}
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <Box key={idx} sx={{display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', mb: 1}}>
              <Paper elevation={0} sx={{
                p: '10px 14px', borderRadius: '12px', maxWidth: '85%',
                fontSize: '0.85rem', lineHeight: 1.5, wordWrap: 'break-word',
                ...(isUser
                  ? {backgroundColor: '#FBF4C9', color: '#313A44', borderBottomRightRadius: '4px'}
                  : {backgroundColor: '#E7E9EB', color: '#313A44', borderBottomLeftRadius: '4px'}),
              }}>
                <MarkdownContent content={msg.content} light={isUser} />
              </Paper>
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

ChatHistoryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  indicatorName: PropTypes.string,
};

export default ChatHistoryDialog;

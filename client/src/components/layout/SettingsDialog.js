import React, {useState} from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Box, Tabs, Tab, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import IndicatorSettings from './IndicatorSettings';

const TabPanel = ({children, value, index}) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{flexGrow: 1, p: 3, overflowY: 'auto'}}
    >
      {value === index && children}
    </Box>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

const SettingsDialog = ({open, onClose}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      sx={{'& .MuiDialog-container': {zIndex: 10002}}}>
      <DialogTitle sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
          <FormattedMessage id="settings_title"/>
        </Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{p: 0}}>
        <Box sx={{display: 'flex', minHeight: 400}}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            sx={{borderRight: 1, borderColor: 'divider', minWidth: 160}}
          >
            <Tab label={<FormattedMessage id="settings_tab_indicators"/>} />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <IndicatorSettings />
          </TabPanel>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

SettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsDialog;

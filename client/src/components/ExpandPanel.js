
import React, {useState} from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import withStyles from '@mui/styles/withStyles';
import {Typography} from '@mui/material';
import PropTypes from 'prop-types';

const styles = {

  contributer: {
    display: 'flex',
  },
  icon: {
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#2196f3',
    paddingTop: 5,
    width: 15,
  },
  content: {
    fontFamily: '"Saira Condensed","Source Sans Pro","Montserrat","sans-serif"',
    paddingLeft: 5,
    marginLeft: 15,
    backgroundColor: 'darkgrey',
    color: 'white',
  },
  title: {
    fontFamily: '"Saira Condensed","Roboto",sans-serif',
    cursor: 'pointer',
  },

};

const ExpandPanel = (props) => {
  const {classes} = props;

  const [open, setOpen] = useState(false); // default to close

  return (
    <div>
      <div className={classes.contributer} onClick={()=>setOpen(!open)}>
        { !open && <AddIcon className={classes.icon}/> }
        { open && <RemoveIcon className={classes.icon}/> }

        <Typography className={classes.title}>{props.text}</Typography>
      </div>
      { open &&
      <div className={classes.content} onClick={()=>setOpen(!open)}>
        <Typography>{props.children}</Typography>
      </div>
      }
    </div>
  );
};

ExpandPanel.propTypes = {
  classes: PropTypes.any,
  children: PropTypes.any,
  text: PropTypes.string,
};

export default withStyles(styles)(ExpandPanel);

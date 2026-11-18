const LABEL_FONT = '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif';
const BODY_FONT = '"Noto Sans", -apple-system, "Segoe UI", system-ui, sans-serif';
const ACCENT_SAFFRON = '#EBCB00';

export const toolbarLabelSx = {
  'fontFamily': LABEL_FONT,
  'fontSize': 11,
  'fontWeight': 800,
  'letterSpacing': '0.08em',
  'textTransform': 'uppercase',
  'color': 'rgba(245, 243, 237, 0.7) !important',
  'transform': 'translate(0, -2px) scale(1)',
  '&.Mui-focused': {
    color: '#F5F3ED !important',
  },
};

export const toolbarSelectSx = {
  'fontFamily': BODY_FONT,
  'fontSize': 14,
  'fontWeight': 300,
  'color': '#F5F3ED',
  'border': '1px solid rgba(245, 243, 237, 0.25)',
  'borderRadius': '6px',
  'backgroundColor': 'rgba(245, 243, 237, 0.04)',
  'transition': 'border-color 140ms ease, background-color 140ms ease',
  // Fill the FormControl and allow it to shrink below the selected text's width.
  'width': '100%',
  'minWidth': 0,
  '& .MuiSelect-select': {
    padding: '6px 32px 6px 12px !important',
    minWidth: 40,
    borderRadius: '6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .MuiSelect-select:focus': {
    backgroundColor: 'transparent',
  },
  '& .MuiSvgIcon-root': {
    color: 'rgba(245, 243, 237, 0.75)',
    right: 6,
  },
  // Outline replaces the standard-variant underline.
  '&:before, &:after': {
    display: 'none',
  },
  '&:hover:not(.Mui-disabled)': {
    borderColor: 'rgba(245, 243, 237, 0.5)',
    backgroundColor: 'rgba(245, 243, 237, 0.07)',
  },
  '&.Mui-focused': {
    borderColor: ACCENT_SAFFRON,
  },
  '&.Mui-disabled': {
    opacity: 0.5,
  },
};

// FormControl wrapper for toolbar dropdowns: shrinks with the toolbar instead of
// holding its content width. `minWidth` is the floor it will not shrink past.
export const toolbarFormControlSx = (minWidth = 90) => ({
  minWidth,
  flex: '0 1 auto',
});

export const toolbarMenuPaperSx = {
  'maxHeight': 400,
  'borderRadius': 2,
  'marginTop': '4px',
  'boxShadow': '0 10px 28px rgba(49, 58, 68, 0.28)',
  'border': '1px solid rgba(49, 58, 68, 0.08)',
  '& .MuiMenuItem-root': {
    fontFamily: BODY_FONT,
    fontSize: 14,
    paddingTop: '6px',
    paddingBottom: '6px',
  },
  '& .MuiMenuItem-root.Mui-selected': {
    backgroundColor: 'rgba(49, 58, 68, 0.08)',
  },
  '& .MuiMenuItem-root.Mui-selected:hover': {
    backgroundColor: 'rgba(49, 58, 68, 0.12)',
  },
};

export const toolbarSwitchSx = {
  'width': 36,
  'height': 20,
  'padding': 0,
  'marginLeft': 1,
  'marginRight': 0.5,
  '& .MuiSwitch-switchBase': {
    'padding': 0,
    'margin': '2px',
    'transitionDuration': '180ms',
    '&.Mui-checked': {
      'transform': 'translateX(16px)',
      'color': '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: ACCENT_SAFFRON,
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
    boxShadow: '0 1px 2px rgba(49, 58, 68, 0.4)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    backgroundColor: 'rgba(245, 243, 237, 0.25)',
    opacity: 1,
    transition: 'background-color 180ms ease',
  },
};

export const toolbarSwitchLabelSx = {
  fontFamily: BODY_FONT,
  fontSize: 13,
  fontWeight: 300,
  color: '#F5F3ED',
  letterSpacing: '0.02em',
};

export const toolbarFormLabelSx = {
  fontFamily: LABEL_FONT,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(245, 243, 237, 0.7) !important',
  marginBottom: '2px',
  position: 'static',
  transform: 'none',
};

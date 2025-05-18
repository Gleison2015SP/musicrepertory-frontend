import { createTheme } from '@mui/material';

// Cores principais
const primaryBlue = '#1976d2';
const darkGrey = '#1e1e1e';
const darkerGrey = '#121212';
const lightGrey = '#999999';
const white = '#ffffff';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryBlue,
      light: '#42a5f5',
      dark: '#1565c0',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      lighter: 'rgba(244, 67, 54, 0.08)',
    },
    background: {
      default: darkerGrey,
      paper: darkGrey,
      card: darkGrey,
    },
    text: {
      primary: white,
      secondary: lightGrey,
    },
    action: {
      hover: '#2c2c2c',
      selected: 'rgba(25, 118, 210, 0.16)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: darkerGrey,
          color: '#fff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          borderRight: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: '#2c2c2c',
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          '&:last-child': {
            paddingBottom: '16px',
          },
        },
      },
    },
  },
});

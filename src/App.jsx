import React, { useState } from 'react';
import { ThemeProvider, Box, CssBaseline } from '@mui/material';
import { darkTheme } from './theme/darkTheme';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline enableColorScheme />
      <Box 
        sx={{ 
          display: 'flex', 
          minHeight: '100vh', 
          bgcolor: 'background.default',
          color: 'text.primary'
        }}
      >
        <Sidebar open={mobileOpen} onToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            bgcolor: 'background.default',
          }}
        >
          <Home />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

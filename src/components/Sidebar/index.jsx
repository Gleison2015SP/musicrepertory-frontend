import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  LibraryMusic as LibraryMusicIcon,
  QueueMusic as QueueMusicIcon,
  Add as AddIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ open, onToggle }) => {
  const menuItems = [
    { text: 'Home', icon: <HomeIcon /> },
    { text: 'Meu Repertório', icon: <LibraryMusicIcon /> },
    { text: 'Playlists', icon: <QueueMusicIcon /> },
  ];

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={onToggle}
        edge="start"
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
          },
        }}
      >
        {sidebarContent()}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
          },
        }}
        open
      >
        {sidebarContent()}
      </Drawer>
    </>
  );

  function sidebarContent() {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Music Repertory
        </Typography>
        
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text}
              sx={{
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  bgcolor: 'background.card'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  sx: { fontWeight: 'medium' }
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <List>
          <ListItem 
            button
            sx={{
              borderRadius: 1,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
                bgcolor: 'background.card'
              }
            }}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Criar Playlist" />
          </ListItem>
        </List>
      </Box>
    );
  }
};

export default Sidebar;

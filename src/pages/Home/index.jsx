import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  ButtonGroup,
  CircularProgress,
  Typography,
  Stack,
  InputAdornment,
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FilterListIcon from '@mui/icons-material/FilterList';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import SearchIcon from '@mui/icons-material/Search';
import SongCard from '../../components/SongCard';
import AddSongModal from '../../components/AddSongModal';
import FileHandler from '../../components/FileHandler';

// Funções auxiliares para localStorage
const loadSongsFromStorage = () => {
  const stored = localStorage.getItem('songs');
  return stored ? JSON.parse(stored) : [];
};

const saveSongsToStorage = (songs) => {
  localStorage.setItem('songs', JSON.stringify(songs));
};

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchSongs = () => {
    setLoading(true);
    try {
      const storedSongs = loadSongsFromStorage();
      setSongs(storedSongs);
    } catch (err) {
      console.error('Erro ao carregar músicas:', err);
      setError('Erro ao carregar músicas do armazenamento local');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Home useEffect triggered');
    fetchSongs();
  }, []);

  const handleAddSong = (songData) => {
    try {
      const currentSongs = loadSongsFromStorage();
      let updatedSongs;

      if (songData.id) {
        // Editar música existente
        updatedSongs = currentSongs.map(song => 
          song.id === songData.id ? { ...songData } : song
        );
      } else {
        // Adicionar nova música
        const newSong = {
          ...songData,
          id: Date.now(), // Usar timestamp como ID
          createdAt: new Date().toISOString()
        };
        updatedSongs = [...currentSongs, newSong];
      }

      saveSongsToStorage(updatedSongs);
      setSongs(updatedSongs);
      setModalOpen(false);
      setSelectedSong(null);
    } catch (error) {
      console.error('Erro ao salvar música:', error);
      alert('Erro ao salvar música. Tente novamente.');
    }
  };

  const handleDeleteSong = (songId) => {
    if (!songId) {
      console.error('ID da música não fornecido');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir esta música?')) {
      try {
        const currentSongs = loadSongsFromStorage();
        const updatedSongs = currentSongs.filter(song => song.id !== songId);
        saveSongsToStorage(updatedSongs);
        setSongs(updatedSongs);
      } catch (error) {
        console.error('Erro ao deletar música:', error);
        alert('Erro ao deletar música. Tente novamente.');
      }
    }
  };

  const handleEditSong = (song) => {
    setSelectedSong(song);
    setModalOpen(true);
  };

  // Filtra as músicas baseado no termo de busca e no filtro selecionado
  console.log('Estado atual:', {
    totalSongs: songs.length,
    searchTerm,
    filter,
    songs: songs
  });

  const filteredSongs = songs.filter(song => {
    // Primeiro filtra por texto (título ou artista)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const title = (song.title || '').toLowerCase();
      const artist = (song.artist || '').toLowerCase();
      if (!title.includes(search) && !artist.includes(search)) {
        return false;
      }
    }

    // Depois aplica o filtro de categoria
    switch (filter) {
      case 'favorites':
        return song.isFavorite;
      case 'recent':
        const sortedSongs = [...songs].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 10);
        return sortedSongs.some(s => s.id === song.id);
      default:
        return true;
    }
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <FileHandler onImport={songs => {
          saveSongsToStorage(songs);
          setSongs(songs);
        }} songs={songs} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            <PlaylistPlayIcon sx={{ mr: 1, fontSize: 40 }} />
            Meu Repertório
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedSong(null);
              setModalOpen(true);
            }}
            startIcon={<MusicNoteIcon />}
          >
            Adicionar Música
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
            <ButtonGroup variant="outlined" size="small">
              <Button 
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'contained' : 'outlined'}
              >
                Todas
              </Button>
              <Button 
                onClick={() => setFilter('favorites')}
                variant={filter === 'favorites' ? 'contained' : 'outlined'}
              >
                Favoritas
              </Button>
              <Button 
                onClick={() => setFilter('recent')}
                variant={filter === 'recent' ? 'contained' : 'outlined'}
              >
                Recentes
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Box>

      <TextField
        placeholder="Buscar música ou artista"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'primary.main' }} />
            </InputAdornment>
          ),
          sx: {
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          },
        }}
        sx={{
          width: '100%',
          mb: 3,
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
            opacity: 1,
          },
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ p: 3 }}>
          {error}
        </Typography>
      ) : filteredSongs.length === 0 ? (
        <Typography sx={{ p: 3, color: 'text.secondary', textAlign: 'center' }}>
          Nenhuma música encontrada
        </Typography>
      ) : (
        <Stack spacing={1}>
          {filteredSongs.map((song, index) => (
            <SongCard 
              key={song.Id || song._id || `song-${index}`}
              song={song} 
              onDelete={() => handleDeleteSong(song.id)}
              onEdit={() => handleEditSong(song)}
            />
          ))}
        </Stack>
      )}

      <AddSongModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSong(null);
        }}
        onSave={(song) => handleAddSong(song)}
        songToEdit={selectedSong}
      />
    </Box>
  );
};

export default Home;
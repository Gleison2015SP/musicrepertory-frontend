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
import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api') + '/songs';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchSongs = async () => {
    console.log('Iniciando busca de músicas...');
    setLoading(true);
    setError(null); // Limpa erro anterior

    try {
      console.log('Fazendo requisição para:', API_URL);
      const response = await axios.get(API_URL, {
        timeout: 5000, // 5 segundos de timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Resposta completa:', response);
      if (response.data) {
        console.log('Dados recebidos:', response.data);
        setSongs(response.data);
      } else {
        throw new Error('Resposta vazia do servidor');
      }
    } catch (err) {
      console.error('Erro ao carregar músicas:', err);
      console.error('Detalhes do erro:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });

      // Mensagem de erro mais amigável
      let errorMessage = 'Erro ao carregar músicas';
      if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint não encontrado no servidor.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Home useEffect triggered');
    fetchSongs();
  }, []);

  const handleAddSong = async (songData) => {
    try {
      console.log('Dados a serem enviados:', songData);
      let response;

      const dataToSend = {
        title: songData.title,
        artist: songData.artist,
        album: songData.album || null,
        releaseDate: songData.releaseDate || null,
        genre: songData.genre || null,
        youtubeLink: songData.youtubeLink || null,
        chordLink: songData.chordLink || null
      };

      if (songData.id) {
        // Editar música existente
        console.log('Editando música ID:', songData.id);
        response = await axios.put(`${API_URL}/${songData.id}`, dataToSend);
        console.log('Música atualizada:', response.data);
      } else {
        // Adicionar nova música
        response = await axios.post(API_URL, dataToSend);
        console.log('Nova música criada:', response.data);
      }

      setModalOpen(false);
      setSelectedSong(null);
      fetchSongs();
    } catch (error) {
      console.error('Erro ao salvar música:', error);
      alert('Erro ao salvar música. Tente novamente.');
    }
  };

  const handleDeleteSong = async (songId) => {
    if (!songId) {
      console.error('ID da música não fornecido');
      return;
    }

    console.log('handleDeleteSong chamado com ID:', songId);
    
    if (window.confirm('Tem certeza que deseja excluir esta música?')) {
      try {
        const url = `${API_URL}/${songId}`;
        console.log('Enviando requisição DELETE para:', url);
        
        const response = await axios.delete(url);
        console.log('Resposta do DELETE:', response.data);
        
        // Atualiza a lista de músicas
        await fetchSongs();
      } catch (err) {
        console.error('Erro ao deletar música:', err);
        setError(err.message);
      }
    }
  };

  const handleEditSong = async (song) => {
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
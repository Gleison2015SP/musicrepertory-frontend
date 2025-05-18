import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Autocomplete,
  CircularProgress
} from '@mui/material';
import { spotifyService } from '../../services/spotify';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


const AddSongModal = ({ open, onClose, onSave, songToEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtubeLink: '',
    chordLink: '',
    album: '',
    releaseDate: '',
    genre: ''
  });

  // Limpa o formulário quando o modal é aberto ou fechado
  useEffect(() => {
    if (!open) {
      // Limpa tudo quando o modal é fechado
      setFormData({
        title: '',
        artist: '',
        youtubeLink: '',
        chordLink: '',
        lyricLink: '',
        album: '',
        releaseDate: '',
        genre: ''
      });
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [open]);

  // Quando songToEdit mudar, atualizar o formData
  useEffect(() => {
    if (songToEdit) {
      setFormData({
        id: songToEdit.id,
        title: songToEdit.title || '',
        artist: songToEdit.artist || '',
        youtubeLink: songToEdit.youtubeLink || '',
        chordLink: songToEdit.chordLink || '',
        lyricLink: songToEdit.lyricLink || '',
        album: songToEdit.album || '',
        releaseDate: songToEdit.releaseDate || '',
        genre: songToEdit.genre || ''
      });
    }
  }, [songToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (query) => {
    if (!query) return;
    
    setSearching(true);
    try {
      const results = await spotifyService.searchTracks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
    } finally {
      setSearching(false);
    }
  };

  // Gera links de busca para YouTube e Cifras
  const generateSearchLinks = (title, artist) => {
    const youtubeQuery = `${title} ${artist}`;
    
    return {
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`,
      cifraclub: `https://www.cifraclub.com.br/${encodeURIComponent(artist.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}`,
      vagalume: `https://www.vagalume.com.br/${encodeURIComponent(artist.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}.html`,
      letras: `https://www.letras.mus.br/${encodeURIComponent(artist.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}/`
    };
  };

  const handleSpotifySelect = async (event, value) => {
    if (value) {
      const searchLinks = generateSearchLinks(value.title, value.artist);
      
      setFormData({
        ...formData,
        title: value.title,
        artist: value.artist,
        album: value.album,
        releaseDate: value.releaseDate,
        genre: value.genre,
        youtubeLink: searchLinks.youtube,
        chordLink: searchLinks.cifraclub,
        lyricLink: searchLinks.vagalume
      });
    }
  };


    window.open(searchLinks[type], '_blank');
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSubmit = () => {
    console.log('\n=== handleSubmit ===');
    console.log('formData a ser enviado:', formData);
    console.log('songToEdit:', songToEdit);
    onSave(formData);
    setFormData({
      title: '',
      artist: '',
      youtubeLink: '',
      chordLink: '',
      lyricLink: '',
      album: '',
      releaseDate: '',
      genre: ''
    });
    setSearchTerm('');
    setSearchResults([]);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="add-song-modal"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{songToEdit ? 'Editar Música' : 'Adicionar Nova Música'}</DialogTitle>
      <DialogContent sx={{ width: '500px', maxHeight: '80vh', pt: 2, pb: 3 }}>
          <Stack spacing={2}>
              {/* Busca no Spotify apenas quando estiver adicionando nova música */}
              {!songToEdit && (
                <Autocomplete
                  freeSolo
                  options={searchResults}
                  getOptionLabel={(option) => 
                    typeof option === 'string' ? option : `${option.title} - ${option.artist}`
                  }
                  inputValue={searchTerm}
                  onInputChange={(event, newValue) => setSearchTerm(newValue)}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'object') {
                      handleSpotifySelect(null, newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar música no Spotify"
                      placeholder="Digite o nome da música ou artista..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {searching ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => {
                    // Criando uma chave única usando id do Spotify ou combinação de título e artista
                    const uniqueKey = option.spotifyId || `${option.title}-${option.artist}-${option.album || ''}`;
                    return (
                      <ListItem {...props} key={uniqueKey}>
                        <ListItemText
                          primary={option.title}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2">
                                {option.artist}
                              </Typography>
                              {option.album && (
                                <Typography component="span" variant="body2" color="textSecondary">
                                  {` • ${option.album}`}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    );
                  }}
                />
              )}

              {/* Campos de edição - mostrados sempre ao editar ou quando uma música é selecionada */}
              {(formData.title || songToEdit) && (
                <Stack spacing={2}>
                  <TextField
                    name="title"
                    label="Nome da Música"
                    value={formData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    name="artist"
                    label="Artista"
                    value={formData.artist}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    name="album"
                    label="Álbum"
                    value={formData.album}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    name="releaseDate"
                    label="Data de Lançamento"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    name="genre"
                    label="Gênero"
                    value={formData.genre}
                    onChange={handleChange}
                    fullWidth
                  />
                  {/* Campos de Link - apenas na edição */}
                  {songToEdit && (
                    <>
                      <TextField
                        name="youtubeLink"
                        label="Link do Vídeo"
                        value={formData.youtubeLink}
                        onChange={handleChange}
                        fullWidth
                      />
                      <TextField
                        name="chordLink"
                        label="Link da Cifra"
                        value={formData.chordLink}
                        onChange={handleChange}
                        fullWidth
                      />
                    </>
                  )}
                </Stack>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={!formData.title || !formData.artist}
              >
                {songToEdit ? 'Salvar Alterações' : 'Adicionar Música'}
              </Button>
            </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongModal;

import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, styled } from '@mui/material';
import { 
  Delete as DeleteIcon,
  YouTube as YouTubeIcon,
  LibraryMusic as LibraryMusicIcon,
  Article as ArticleIcon,
  Search as SearchIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#2d2d2d',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  border: '1px solid #404040',
  width: '100%',
  '&:hover': {
    backgroundColor: '#363636',
    borderColor: theme.palette.primary.main,
  }
}));

const LinkButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}));

const SongCard = ({ song, onDelete, onEdit }) => {
  // Gera links de busca
  const generateSearchLinks = (title, artist) => {
    const youtubeQuery = `${title} ${artist}`;
    const cifraQuery = `${title} ${artist}`;
    
    return {
      youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`,
      cifraclub: `https://www.cifraclub.com.br/${encodeURIComponent(artist.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}`,
      vagalume: `https://www.vagalume.com.br/${encodeURIComponent(artist.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}.html`,
      letras: `https://www.letras.mus.br/${encodeURIComponent(artist.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}/`
    };
  };

  // Abre link em nova aba
  const handleSearchClick = (type) => {
    const searchLinks = generateSearchLinks(song.title, song.artist);
    window.open(searchLinks[type], '_blank');
  };
  return (
    <StyledCard>
      <CardContent sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: '16px !important',
        '&:last-child': { pb: '16px !important' }
      }}>
        {/* Título e Artista */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="subtitle1" 
            noWrap 
            sx={{ 
              fontWeight: 'medium',
              color: '#fff'
            }}
          >
            {song.title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            {song.artist}
          </Typography>
        </Box>

        {/* Links e Botões de Busca */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Links salvos */}
          {song.youtubeLink && (
            <Tooltip title="Abrir vídeo salvo">
              <LinkButton
                size="small"
                color="error"
                onClick={() => window.open(song.youtubeLink, '_blank')}
              >
                <YouTubeIcon />
              </LinkButton>
            </Tooltip>
          )}
          {song.chordLink && (
            <Tooltip title="Abrir cifra salva">
              <LinkButton
                size="small"
                color="primary"
                onClick={() => window.open(song.chordLink, '_blank')}
              >
                <LibraryMusicIcon />
              </LinkButton>
            </Tooltip>
          )}
          {song.lyricLink && (
            <Tooltip title="Abrir letra salva">
              <LinkButton
                size="small"
                color="info"
                onClick={() => window.open(song.lyricLink, '_blank')}
              >
                <ArticleIcon />
              </LinkButton>
            </Tooltip>
          )}

          {/* Separador */}
          {(song.youtubeLink || song.chordLink || song.lyricLink) && (
            <Box
              sx={{
                width: '1px',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                mx: 1
              }}
            />
          )}

          {/* Botões de Busca */}
          <Tooltip title="Buscar no YouTube">
            <LinkButton
              size="small"
              onClick={() => handleSearchClick('youtube')}
              sx={{ color: '#FF0000' }}
            >
              <YouTubeIcon />
            </LinkButton>
          </Tooltip>

          <Tooltip title="Buscar no CifraClub">
            <LinkButton
              size="small"
              onClick={() => handleSearchClick('cifraclub')}
              sx={{ color: '#1976d2' }}
            >
              <LibraryMusicIcon />
            </LinkButton>
          </Tooltip>

          <Tooltip title="Buscar letra no Letras.mus.br">
            <LinkButton
              size="small"
              onClick={() => handleSearchClick('letras')}
              sx={{ color: '#4caf50' }}
            >
              <ArticleIcon />
            </LinkButton>
          </Tooltip>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Botões de Ação */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            onClick={() => onEdit(song)}
            size="small"
            sx={{ 
              color: 'primary.light',
              opacity: 0.7,
              transition: 'all 0.2s ease',
              '&:hover': { 
                color: 'primary.main',
                opacity: 1,
                backgroundColor: 'primary.darker'
              }
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            onClick={() => onDelete(song.id)}
            size="small"
            sx={{ 
              color: 'error.light',
              opacity: 0.7,
              transition: 'all 0.2s ease',
              '&:hover': { 
                color: 'error.main',
                opacity: 1,
                backgroundColor: 'error.lighter'
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default SongCard;

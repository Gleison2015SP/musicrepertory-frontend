import axios from 'axios';
import { YOUTUBE_CONFIG } from '../config/youtube';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

class YouTubeService {
    async searchLyricsVideo(songTitle, artist) {
        try {
            // Busca por "nome da música artista lyrics" para priorizar vídeos com letra
            const query = `${songTitle} ${artist} lyrics`;
            
            const response = await axios.get(YOUTUBE_API_URL, {
                params: {
                    part: 'snippet',
                    maxResults: 1, // Pega apenas o primeiro resultado
                    q: query,
                    key: YOUTUBE_CONFIG.apiKey,
                    type: 'video', // Apenas vídeos, não playlists
                    videoCategoryId: '10', // Categoria Música
                    videoEmbeddable: true // Apenas vídeos que podem ser embedados
                }
            });

            if (response.data.items && response.data.items.length > 0) {
                const videoId = response.data.items[0].id.videoId;
                return `https://www.youtube.com/watch?v=${videoId}`;
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao buscar vídeo no YouTube:', error);
            return null;
        }
    }
}

export const youtubeService = new YouTubeService();

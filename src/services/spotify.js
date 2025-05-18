import axios from 'axios';
import { SPOTIFY_CONFIG } from '../config/spotify';

class SpotifyService {
    constructor() {
        this.token = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        console.log('Configuração Spotify:', {
            clientId: SPOTIFY_CONFIG.clientId,
            clientSecret: SPOTIFY_CONFIG.clientSecret
        });
        if (this.token && this.tokenExpiry > Date.now()) {
            return this.token;
        }

        const response = await axios.post('https://accounts.spotify.com/api/token', 
            new URLSearchParams({
                'grant_type': 'client_credentials'
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(SPOTIFY_CONFIG.clientId + ':' + SPOTIFY_CONFIG.clientSecret)
                }
            }
        );

        this.token = response.data.access_token;
        this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        return this.token;
    }

    async searchTracks(query) {
        console.log('Buscando músicas com query:', query);
        const token = await this.getAccessToken();
        
        // Busca músicas
        const tracksResponse = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                q: query,
                type: 'track',
                limit: 5
            }
        });

        // Para cada música, busca os detalhes do artista para obter os gêneros
        const tracks = await Promise.all(tracksResponse.data.tracks.items.map(async track => {
            const artistId = track.artists[0].id;
            const artistResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const firstGenre = artistResponse.data.genres?.[0] || '';
            return {
                spotifyId: track.id, // ID único do Spotify
                title: track.name.toUpperCase(),
                artist: track.artists[0].name.toUpperCase(),
                album: track.album.name.toUpperCase(),
                releaseDate: track.album.release_date,
                imageUrl: track.album.images[0]?.url,
                previewUrl: track.preview_url,
                spotifyUrl: track.external_urls.spotify,
                genre: firstGenre.toUpperCase(),
                duration: track.duration_ms
            };
        }));

        return tracks;
    }

    async getTrackDetails(trackId) {
        const token = await this.getAccessToken();
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const track = response.data;
        return {
            id: track.id,
            title: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            releaseDate: track.album.release_date,
            imageUrl: track.album.images[0]?.url,
            previewUrl: track.preview_url,
            spotifyUrl: track.external_urls.spotify,
            genre: track.album.genres?.[0],
            duration: track.duration_ms
        };
    }
}

export const spotifyService = new SpotifyService();

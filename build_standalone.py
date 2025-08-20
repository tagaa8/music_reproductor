#!/usr/bin/env python3
import base64
import os

def read_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return f.read()

def read_binary_file(filename):
    with open(filename, 'rb') as f:
        return f.read()

def main():
    print("Building standalone HTML file...")
    
    # Read CSS
    css_content = read_file('styles.css')
    
    # Read JavaScript  
    js_content = read_file('script.js')
    
    # Read and encode MP3 files
    mp3_files = [
        ('Grupo Frontera - ME GUSTAS (Audio).mp3', 'ME GUSTAS', 'Grupo Frontera', 197),
        ('Juan Gabriel- Así fue -  - 2025-08-20 00-11-08.mp3', 'Así fue', 'Juan Gabriel', 225),
        ('Julión Álvarez Y Su Norteño Banda - Terrenal (Audio).mp3', 'Terrenal', 'Julión Álvarez Y Su Norteño Banda', 268),
        ('Te Hubieras Ido Antes.mp3', 'Te Hubieras Ido Antes', 'Artista', 189)
    ]
    
    mp3_data = []
    for i, (filename, title, artist, duration) in enumerate(mp3_files, 1):
        print(f"Encoding {filename}...")
        audio_data = read_binary_file(filename)
        b64_data = base64.b64encode(audio_data).decode('utf-8')
        mp3_data.append({
            'id': i,
            'title': title,
            'artist': artist,
            'b64': b64_data,
            'duration': duration
        })
    
    # Generate the complete HTML
    html_template = f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rolitas Pal Héctor</title>
    <meta name="theme-color" content="#1db954">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Rolitas Pal Héctor">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <style>
{css_content}
    </style>
</head>
<body>
    <div class="app">
        <button class="menu-toggle" id="menuToggle" style="display: none;">
            <i class="fas fa-bars"></i>
        </button>

        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h1 class="logo">Rolitas Pal Héctor</h1>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#" class="nav-item active" data-section="home"><i class="fas fa-home"></i> Inicio</a></li>
                    <li><a href="#" class="nav-item" data-section="songs"><i class="fas fa-music"></i> Todas las Canciones</a></li>
                    <li><a href="#" class="nav-item" data-section="liked"><i class="fas fa-heart"></i> Me Gusta</a></li>
                    <li><a href="#" class="nav-item" data-section="playlists"><i class="fas fa-list-music"></i> Playlists</a></li>
                </ul>
            </nav>
        </div>

        <div class="main-content">
            <div class="main-header">
                <h1 class="main-title">🎵 Rolitas Pal Héctor 🎵</h1>
            </div>
            <div class="content-header">
                <h2 class="section-title" id="sectionTitle">Inicio</h2>
                <div class="search-bar">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar canciones..." id="searchInput">
                </div>
            </div>

            <div class="content-section" id="homeSection">
                <div class="quick-actions-small">
                    <button class="quick-btn liked-btn" data-section="liked">
                        <i class="fas fa-heart"></i>
                        <span>Me Gusta</span>
                    </button>
                    <button class="quick-btn playlists-btn" data-section="playlists">
                        <i class="fas fa-list-music"></i>
                        <span>Playlists</span>
                    </button>
                    <button class="quick-btn recent-btn" id="toggleRecentBtn">
                        <i class="fas fa-history"></i>
                        <span>Recientes</span>
                    </button>
                </div>
                <div class="all-songs-section" id="homeSongsList">
                    <h3>Todas las canciones</h3>
                    <div class="song-list" id="homeAllSongs"></div>
                </div>
                <div class="recent-section" id="recentSection" style="display: none;">
                    <h3>Tocadas recientemente</h3>
                    <div class="song-list" id="recentSongs"></div>
                </div>
            </div>

            <div class="content-section" id="songsSection" style="display: none;">
                <div class="section-controls">
                    <button class="btn-back-home" id="backHomeBtn3">
                        <i class="fas fa-home"></i> Inicio
                    </button>
                    <button class="btn-toggle-view" id="toggleViewBtn2">
                        <i class="fas fa-heart"></i> Ver Me Gusta
                    </button>
                    <button class="btn-play-all" id="playAllBtn">
                        <i class="fas fa-play"></i> Reproducir todo
                    </button>
                    <button class="btn-shuffle-all" id="shuffleAllBtn">
                        <i class="fas fa-random"></i> Aleatorio
                    </button>
                </div>
                <div class="song-list" id="allSongsList"></div>
            </div>

            <div class="content-section" id="likedSection" style="display: none;">
                <div class="section-controls">
                    <button class="btn-back-home" id="backHomeBtn">
                        <i class="fas fa-home"></i> Inicio
                    </button>
                    <button class="btn-toggle-view" id="toggleViewBtn">
                        <i class="fas fa-music"></i> Ver Todas
                    </button>
                    <button class="btn-play-all" id="playLikedBtn">
                        <i class="fas fa-play"></i> Reproducir todo
                    </button>
                </div>
                <div class="song-list" id="likedSongsList"></div>
            </div>

            <div class="content-section" id="playlistsSection" style="display: none;">
                <div class="section-controls">
                    <button class="btn-back-home" id="backHomeBtn2">
                        <i class="fas fa-home"></i> Inicio
                    </button>
                    <button class="btn-create-playlist" id="createPlaylistBtn">
                        <i class="fas fa-plus"></i> Nueva Playlist
                    </button>
                </div>
                <div class="playlists-grid" id="playlistsGrid"></div>
            </div>

        </div>

        <div class="player">
            <div class="player-info">
                <div class="song-artwork" id="currentArtwork"></div>
                <div class="song-details">
                    <div class="song-title" id="currentTitle">Selecciona una canción</div>
                    <div class="song-artist" id="currentArtist"></div>
                </div>
                <button class="btn-like" id="likeBtn">
                    <i class="far fa-heart"></i>
                </button>
            </div>

            <div class="player-controls">
                <div class="control-buttons">
                    <button class="btn-shuffle" id="shuffleBtn">
                        <i class="fas fa-random"></i>
                    </button>
                    <button class="btn-previous" id="prevBtn">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="btn-play-pause" id="playPauseBtn">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-next" id="nextBtn">
                        <i class="fas fa-step-forward"></i>
                    </button>
                    <button class="btn-repeat" id="repeatBtn">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
                <div class="progress-container">
                    <span class="time" id="currentTime">0:00</span>
                    <div class="progress-bar">
                        <div class="progress" id="progress"></div>
                        <input type="range" class="progress-input" id="progressInput" min="0" max="100" value="0">
                    </div>
                    <span class="time" id="totalTime">0:00</span>
                </div>
            </div>

            <div class="player-extra">
                <div class="volume-control">
                    <button class="btn-volume" id="volumeBtn">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="100">
                </div>
            </div>
        </div>
    </div>

    <audio id="audioPlayer" preload="metadata"></audio>
    
    <script>
    // Replace the loadSongs method with embedded base64 data
    const EMBEDDED_SONGS = ['''
    
    # Add MP3 data
    for mp3 in mp3_data:
        html_template += f'''
        {{
            id: {mp3['id']},
            title: "{mp3['title']}",
            artist: "{mp3['artist']}",
            file: "data:audio/mp3;base64,{mp3['b64']}",
            duration: {mp3['duration']}
        }},'''
    
    html_template += '''
    ];
    
    // Modified JavaScript with embedded songs
    class MusicPlayer {
        constructor() {
            console.log('🚀 DEBUG: MusicPlayer constructor starting...');
            this.audio = document.getElementById('audioPlayer');
            this.songs = EMBEDDED_SONGS || [];
            console.log('🚀 DEBUG: Loaded', this.songs.length, 'embedded songs');
            this.currentSongIndex = -1;
            this.isPlaying = false;
            this.isShuffle = false;
            this.repeatMode = 'none';
            this.currentPlaylist = null;
            this.currentSection = 'home';
            this.queue = [];
            this.originalQueue = [];
            this.playlists = JSON.parse(localStorage.getItem('playlists')) || [];
            this.likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
            this.recentSongsArray = JSON.parse(localStorage.getItem('recentSongs')) || [];
            this.playbackContext = 'all';
            this.contextPlaylistId = null;

            try {
                this.initializeElements();
                this.loadSongs();
                this.setupEventListeners();
                this.setupMediaSession();
                
                this.showSection('home');
                console.log('🚀 DEBUG: MusicPlayer initialization complete!');
            } catch(error) {
                console.error('❌ ERROR: MusicPlayer initialization failed:', error);
            }
        }

        loadSongs() {
            // Songs are already loaded from EMBEDDED_SONGS
            console.log('🎵 DEBUG: loadSongs called, songs:', this.songs.length);
            console.log('🎵 DEBUG: First song:', this.songs[0]);
            
            this.renderAllSongs();
            this.renderHomeAllSongs();
            this.renderLikedSongs();
            this.renderRecentSongs();
        }
    '''
    
    # Add the rest of the JavaScript (skip everything until initializeElements method)
    js_lines = js_content.split('\n')
    found_initialize = False
    
    for line in js_lines:
        if 'initializeElements()' in line and not found_initialize:
            found_initialize = True
            html_template += line + '\n'
        elif found_initialize:
            html_template += line + '\n'
    
    html_template += '''
    
    // Initialize the music player when page loads
    let musicPlayer;
    document.addEventListener('DOMContentLoaded', () => {
        musicPlayer = new MusicPlayer();
    });
    </script>
</body>
</html>'''
    
    # Write the final file
    with open('standalone_complete.html', 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    file_size = os.path.getsize('standalone_complete.html')
    print(f"Standalone file created: standalone_complete.html")
    print(f"File size: {file_size / (1024*1024):.1f} MB")

if __name__ == "__main__":
    main()
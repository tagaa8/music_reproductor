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
    print("Building mobile-optimized standalone HTML file...")
    
    # Read CSS and JavaScript
    css_content = read_file('styles.css')
    js_content = read_file('script.js')
    
    # Read MP3 files
    mp3_files = [
        ('Grupo Frontera - ME GUSTAS (Audio).mp3', 'ME GUSTAS', 'Grupo Frontera'),
        ('Juan Gabriel- Así fue -  - 2025-08-20 00-11-08.mp3', 'Así fue', 'Juan Gabriel'),
        ('Julión Álvarez Y Su Norteño Banda - Terrenal (Audio).mp3', 'Terrenal', 'Julión Álvarez Y Su Norteño Banda'),
        ('Te Hubieras Ido Antes.mp3', 'Te Hubieras Ido Antes', 'Artista Desconocido')
    ]
    
    # Encode MP3 files to base64
    mp3_data = []
    for i, (filename, title, artist) in enumerate(mp3_files):
        if os.path.exists(filename):
            print(f"Encoding {filename}...")
            audio_data = read_binary_file(filename)
            b64_data = base64.b64encode(audio_data).decode('utf-8')
            mp3_data.append({
                'id': i,
                'title': title,
                'artist': artist,
                'b64': b64_data
            })
        else:
            print(f"Warning: {filename} not found")
    
    # Modify JavaScript to use embedded songs
    js_modified = js_content.replace(
        """async loadSongs() {
        const songFiles = [
            'Grupo Frontera - ME GUSTAS (Audio).mp3',
            'Juan Gabriel- Así fue -  - 2025-08-20 00-11-08.mp3',
            'Julión Álvarez Y Su Norteño Banda - Terrenal (Audio).mp3',
            'Te Hubieras Ido Antes.mp3'
        ];

        this.songs = songFiles.map((filename, index) => ({
            id: index,
            title: this.extractTitle(filename),
            artist: this.extractArtist(filename),
            src: filename,
            duration: 0,
            artwork: this.getDefaultArtwork()
        }));

        // Load metadata for each song
        for (let song of this.songs) {
            await this.loadSongMetadata(song);
        }

        console.log('🎵 DEBUG: Loaded', this.songs.length, 'songs');
        console.log('📱 DEBUG: Songs list:', this.songs.map(s => s.title));

        this.renderAllSongs();
        this.renderLikedSongs();
        this.renderRecentSongs();
    }""",
        f"""async loadSongs() {{
        console.log('🎵 Loading embedded songs...');
        
        // Embedded songs data
        const embeddedSongs = [
            {", ".join([f'''{{
                id: {song['id']},
                title: "{song['title']}",
                artist: "{song['artist']}",
                src: "data:audio/mp3;base64,{song['b64']}",
                duration: 0,
                artwork: this.getDefaultArtwork()
            }}''' for song in mp3_data])}
        ];
        
        this.songs = embeddedSongs;
        
        // Load metadata for each song
        for (let song of this.songs) {{
            await this.loadSongMetadata(song);
        }}
        
        console.log('🎵 DEBUG: Loaded', this.songs.length, 'embedded songs');
        console.log('📱 DEBUG: Songs list:', this.songs.map(s => s.title));
        
        this.renderAllSongs();
        this.renderLikedSongs();
        this.renderRecentSongs();
    }}""")
    
    # Create complete HTML
    html = f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Rolitas Pal Héctor</title>
    <meta name="theme-color" content="#1db954">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Rolitas Pal Héctor">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <style>
{css_content}

/* Additional mobile optimizations */
* {{
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}}

.control-buttons button {{
    touch-action: manipulation;
    min-width: 44px;
    min-height: 44px;
}}

.song-item {{
    touch-action: manipulation;
    min-height: 72px;
}}

@media (max-width: 768px) {{
    .player {{
        padding-bottom: env(safe-area-inset-bottom);
    }}
    
    .main-content {{
        padding-bottom: calc(240px + env(safe-area-inset-bottom));
    }}
}}
    </style>
</head>
<body>
    <div class="app">
        <div class="sidebar">
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

            <div class="content-section playlist-view" id="playlistViewSection" style="display: none;">
                <div class="section-controls">
                    <button class="btn-back-playlists" id="backToPlaylistsBtn">
                        <i class="fas fa-arrow-left"></i> Playlists
                    </button>
                    <button class="btn-play-playlist" id="playPlaylistBtn" title="Reproducir playlist">
                        <i class="fas fa-play"></i> Reproducir todo
                    </button>
                    <button class="btn-edit-playlist" id="editPlaylistBtn" title="Editar playlist">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete-playlist" id="deletePlaylistBtn" title="Eliminar playlist">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
                <div class="playlist-info">
                    <h2 id="currentPlaylistName"></h2>
                    <p id="currentPlaylistInfo"></p>
                </div>
                <div class="song-list" id="playlistSongsList"></div>
            </div>
        </div>

        <div class="queue-panel" id="queuePanel">
            <div class="queue-header">
                <h3>Cola de reproducción</h3>
                <button class="btn-close-queue" id="closeQueueBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="queue-controls">
                <button class="btn-clear-queue" id="clearQueueBtn">Limpiar cola</button>
                <button class="btn-shuffle-queue" id="shuffleQueueBtn">
                    <i class="fas fa-random"></i>
                </button>
            </div>
            <div class="queue-list" id="queueList"></div>
        </div>

        <div class="player">
            <div class="player-info">
                <div class="song-artwork">
                    <img src="" alt="" id="currentArtwork">
                </div>
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
                <button class="btn-queue" id="queueBtn">
                    <i class="fas fa-list"></i>
                </button>
                <div class="volume-control">
                    <button class="btn-volume" id="volumeBtn">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="100">
                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="playlistModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Crear Playlist</h3>
                <button class="btn-close-modal" id="closeModalBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <input type="text" id="playlistNameInput" placeholder="Nombre de la playlist">
                <div class="modal-actions">
                    <button class="btn-cancel" id="cancelBtn">Cancelar</button>
                    <button class="btn-save" id="savePlaylistBtn">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <div class="context-menu" id="contextMenu">
        <ul>
            <li class="context-item" id="addToQueueCtx">
                <i class="fas fa-list"></i> Añadir a la cola
            </li>
            <li class="context-item" id="addToPlaylistCtx">
                <i class="fas fa-plus"></i> Añadir a playlist
            </li>
            <li class="context-item" id="removeFromPlaylistCtx" style="display: none;">
                <i class="fas fa-minus"></i> Quitar de playlist
            </li>
            <li class="context-item" id="deleteSongCtx">
                <i class="fas fa-trash"></i> Eliminar canción
            </li>
        </ul>
        <div class="playlist-submenu" id="playlistSubmenu">
            <div class="submenu-header">Seleccionar playlist:</div>
            <ul id="playlistSubmenuList"></ul>
            <li class="context-item" id="createNewPlaylistCtx">
                <i class="fas fa-plus"></i> Nueva playlist
            </li>
        </div>
    </div>

    <div class="confirm-dialog" id="confirmDialog">
        <div class="confirm-content">
            <h3>⚠️ Confirmar eliminación</h3>
            <p id="confirmMessage">¿Estás seguro de que quieres eliminar esta canción del sistema? Esta acción no se puede deshacer.</p>
            <div class="confirm-actions">
                <button class="btn-confirm-no" id="confirmNo">Cancelar</button>
                <button class="btn-confirm-yes" id="confirmYes">Eliminar</button>
            </div>
        </div>
    </div>

    <audio id="audioPlayer" preload="metadata"></audio>
    
    <script>
{js_modified}
    </script>
</body>
</html>'''
    
    # Write the final file
    output_file = 'mobile_standalone.html'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html)
    
    file_size = os.path.getsize(output_file)
    print(f"✅ Mobile standalone file created: {output_file}")
    print(f"📱 File size: {file_size / (1024*1024):.1f} MB")
    print(f"🎵 Embedded {len(mp3_data)} songs")
    print(f"\n📲 To use on mobile:")
    print(f"   1. Transfer {output_file} to your phone")
    print(f"   2. Open it with any browser")
    print(f"   3. Works offline - no server needed!")

if __name__ == "__main__":
    main()
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.songs = [];
        this.currentSongIndex = -1;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 'none'; // 'none', 'all', 'one'
        this.currentPlaylist = null;
        this.currentSection = 'home';
        this.queue = [];
        this.originalQueue = [];
        this.playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        this.likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
        this.recentSongsArray = JSON.parse(localStorage.getItem('recentSongs')) || [];
        this.playbackContext = 'all'; // 'all', 'liked', 'playlist', 'recent'
        this.contextPlaylistId = null; // ID of playlist if context is 'playlist'

        this.initializeElements();
        this.loadSongs();
        this.setupEventListeners();
        this.setupMediaSession();
        this.renderPlaylists();
        
        // Load and render initial data
        console.log('🚀 DEBUG: Initial liked songs from localStorage:', this.likedSongs);
        this.renderLikedSongs(); // Pre-render liked songs so they're ready
        
        this.showSection('home');
    }

    initializeElements() {
        // Player controls
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.likeBtn = document.getElementById('likeBtn');
        
        // Progress elements
        this.progressInput = document.getElementById('progressInput');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        
        // Volume controls
        this.volumeBtn = document.getElementById('volumeBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        
        // Queue elements
        this.queueBtn = document.getElementById('queueBtn');
        this.queuePanel = document.getElementById('queuePanel');
        this.closeQueueBtn = document.getElementById('closeQueueBtn');
        this.queueList = document.getElementById('queueList');
        this.clearQueueBtn = document.getElementById('clearQueueBtn');
        this.shuffleQueueBtn = document.getElementById('shuffleQueueBtn');
        
        // Display elements
        this.currentTitle = document.getElementById('currentTitle');
        this.currentArtist = document.getElementById('currentArtist');
        this.currentArtwork = document.getElementById('currentArtwork');
        
        // Sections
        this.allSongsList = document.getElementById('allSongsList');
        this.likedSongsList = document.getElementById('likedSongsList');
        this.playlistSongsList = document.getElementById('playlistSongsList');
        this.recentSongs = document.getElementById('recentSongs');
        
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item');
        this.sectionTitle = document.getElementById('sectionTitle');
        
        // Playlist management
        this.createPlaylistBtn = document.getElementById('createPlaylistBtn');
        this.playlistsGrid = document.getElementById('playlistsGrid');
        this.playlistModal = document.getElementById('playlistModal');
        this.playlistNameInput = document.getElementById('playlistNameInput');
        this.savePlaylistBtn = document.getElementById('savePlaylistBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.currentPlaylistName = document.getElementById('currentPlaylistName');
        this.currentPlaylistInfo = document.getElementById('currentPlaylistInfo');
        this.playPlaylistBtn = document.getElementById('playPlaylistBtn');
        this.editPlaylistBtn = document.getElementById('editPlaylistBtn');
        this.deletePlaylistBtn = document.getElementById('deletePlaylistBtn');
        
        // Search
        this.searchInput = document.getElementById('searchInput');
        
        // Context menu
        this.contextMenu = document.getElementById('contextMenu');
        this.playlistSubmenu = document.getElementById('playlistSubmenu');
        this.playlistSubmenuList = document.getElementById('playlistSubmenuList');
        this.addToQueueCtx = document.getElementById('addToQueueCtx');
        this.addToPlaylistCtx = document.getElementById('addToPlaylistCtx');
        this.removeFromPlaylistCtx = document.getElementById('removeFromPlaylistCtx');
        this.deleteSongCtx = document.getElementById('deleteSongCtx');
        this.createNewPlaylistCtx = document.getElementById('createNewPlaylistCtx');
        
        // Confirm dialog
        this.confirmDialog = document.getElementById('confirmDialog');
        this.confirmMessage = document.getElementById('confirmMessage');
        this.confirmYes = document.getElementById('confirmYes');
        this.confirmNo = document.getElementById('confirmNo');
        
        // Action buttons
        this.playAllBtn = document.getElementById('playAllBtn');
        this.shuffleAllBtn = document.getElementById('shuffleAllBtn');
        this.playLikedBtn = document.getElementById('playLikedBtn');
        this.playPlaylistBtn = document.getElementById('playPlaylistBtn');
        this.editPlaylistBtn = document.getElementById('editPlaylistBtn');
        this.deletePlaylistBtn = document.getElementById('deletePlaylistBtn');
    }

    async loadSongs() {
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
    }

    extractTitle(filename) {
        let title = filename.replace('.mp3', '');
        
        // Remove date pattern
        title = title.replace(/ - \d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}/, '');
        
        // Extract title after artist
        if (title.includes(' - ')) {
            const parts = title.split(' - ');
            return parts.length > 1 ? parts[1] : parts[0];
        }
        
        // Extract title with parentheses
        if (title.includes(' (Audio)')) {
            title = title.replace(' (Audio)', '');
            const parts = title.split(' - ');
            return parts.length > 1 ? parts[1] : parts[0];
        }
        
        return title;
    }

    extractArtist(filename) {
        let artist = filename.replace('.mp3', '');
        
        // Remove date pattern
        artist = artist.replace(/ - \d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2}/, '');
        
        // Extract artist before first dash
        if (artist.includes(' - ')) {
            return artist.split(' - ')[0];
        }
        
        return 'Artista Desconocido';
    }

    getDefaultArtwork() {
        // Crear SVG animado que reacciona al audio
        const animatedSVG = this.createAnimatedArtwork();
        return animatedSVG;
    }
    
    createAnimatedArtwork() {
        // Generar colores aleatorios para cada canción
        const colors = ['#1db954', '#1ed760', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        const primaryColor = colors[Math.floor(Math.random() * colors.length)];
        const secondaryColor = colors[Math.floor(Math.random() * colors.length)];
        
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#121212"/>
                        <stop offset="100%" stop-color="#1e1e1e"/>
                    </linearGradient>
                    <linearGradient id="colorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${primaryColor}"/>
                        <stop offset="100%" stop-color="${secondaryColor}"/>
                    </linearGradient>
                </defs>
                
                <rect width="100" height="100" rx="12" fill="url(#bgGrad)"/>
                
                <!-- Ecualizador visual -->
                <g class="equalizer">
                    <rect x="20" y="35" width="4" height="30" fill="url(#colorGrad)" rx="2">
                        <animate attributeName="height" 
                                values="10;30;15;25;20" 
                                dur="1.2s" 
                                repeatCount="indefinite"/>
                        <animate attributeName="y" 
                                values="45;35;42.5;37.5;40" 
                                dur="1.2s" 
                                repeatCount="indefinite"/>
                    </rect>
                    <rect x="28" y="40" width="4" height="20" fill="url(#colorGrad)" rx="2">
                        <animate attributeName="height" 
                                values="5;20;10;25;15" 
                                dur="0.8s" 
                                repeatCount="indefinite"/>
                        <animate attributeName="y" 
                                values="47.5;40;45;37.5;42.5" 
                                dur="0.8s" 
                                repeatCount="indefinite"/>
                    </rect>
                    <rect x="36" y="30" width="4" height="40" fill="url(#colorGrad)" rx="2">
                        <animate attributeName="height" 
                                values="15;40;25;35;20" 
                                dur="1.5s" 
                                repeatCount="indefinite"/>
                        <animate attributeName="y" 
                                values="42.5;30;37.5;32.5;40" 
                                dur="1.5s" 
                                repeatCount="indefinite"/>
                    </rect>
                    <rect x="44" y="45" width="4" height="10" fill="url(#colorGrad)" rx="2">
                        <animate attributeName="height" 
                                values="8;10;20;15;12" 
                                dur="0.9s" 
                                repeatCount="indefinite"/>
                        <animate attributeName="y" 
                                values="46;45;40;42.5;44" 
                                dur="0.9s" 
                                repeatCount="indefinite"/>
                    </rect>
                    <rect x="52" y="38" width="4" height="24" fill="url(#colorGrad)" rx="2">
                        <animate attributeName="height" 
                                values="12;24;18;30;16" 
                                dur="1.1s" 
                                repeatCount="indefinite"/>
                        <animate attributeName="y" 
                                values="44;38;41;35;42" 
                                dur="1.1s" 
                                repeatCount="indefinite"/>
                    </rect>
                    <rect x="60" y="42" width="4" height="16" fill="url(#colorGrad)" rx="2">
                        <animate attributeName="height" 
                                values="6;16;12;22;14" 
                                dur="1.3s" 
                                repeatCount="indefinite"/>
                        <animate attributeName="y" 
                                values="47;42;44;39;43" 
                                dur="1.3s" 
                                repeatCount="indefinite"/>
                    </rect>
                    <rect x="68" y="37" width="4" height="26" fill="url(#colorGrad)" rx="2">
                        <animate attributeName="height" 
                                values="10;26;16;20;18" 
                                dur="0.7s" 
                                repeatCount="indefinite"/>
                        <animate attributeName="y" 
                                values="45;37;42;40;41" 
                                dur="0.7s" 
                                repeatCount="indefinite"/>
                    </rect>
                    <rect x="76" y="40" width="4" height="20" fill="url(#colorGrad)" rx="2">
                        <animate attributeName="height" 
                                values="8;20;14;18;12" 
                                dur="1.4s" 
                                repeatCount="indefinite"/>
                        <animate attributeName="y" 
                                values="46;40;43;41;44" 
                                dur="1.4s" 
                                repeatCount="indefinite"/>
                    </rect>
                </g>
                
                <!-- Icono de música central -->
                <circle cx="50" cy="50" r="18" fill="url(#colorGrad)" opacity="0.3">
                    <animate attributeName="r" 
                            values="18;22;18" 
                            dur="2s" 
                            repeatCount="indefinite"/>
                    <animate attributeName="opacity" 
                            values="0.3;0.6;0.3" 
                            dur="2s" 
                            repeatCount="indefinite"/>
                </circle>
                
                <path d="M45 45 Q55 40 55 50 Q55 60 45 55 Z" fill="#ffffff" opacity="0.9">
                    <animateTransform attributeName="transform" 
                                    type="rotate" 
                                    values="0 50 50;360 50 50" 
                                    dur="3s" 
                                    repeatCount="indefinite"/>
                </path>
            </svg>
        `)}`;
    }

    async loadSongMetadata(song) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.addEventListener('loadedmetadata', () => {
                song.duration = audio.duration;
                resolve();
            });
            audio.addEventListener('error', () => {
                song.duration = 0;
                resolve();
            });
            audio.src = song.src;
        });
    }

    setupEventListeners() {
        // Player controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.likeBtn.addEventListener('click', () => this.toggleLike());

        // Progress control
        this.progressInput.addEventListener('input', (e) => this.seekTo(e.target.value));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleSongEnd());

        // Volume control
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

        // Queue
        this.queueBtn.addEventListener('click', () => this.toggleQueue());
        this.closeQueueBtn.addEventListener('click', () => this.closeQueue());
        this.clearQueueBtn.addEventListener('click', () => this.clearQueue());
        this.shuffleQueueBtn.addEventListener('click', () => this.shuffleQueue());

        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });
        
        // Toggle recent songs button
        const toggleRecentBtn = document.getElementById('toggleRecentBtn');
        if (toggleRecentBtn) {
            toggleRecentBtn.addEventListener('click', () => {
                const recentSection = document.getElementById('recentSection');
                const allSongsSection = document.getElementById('homeSongsList');
                if (recentSection && allSongsSection) {
                    if (recentSection.style.display === 'none') {
                        recentSection.style.display = 'block';
                        allSongsSection.style.display = 'none';
                        toggleRecentBtn.innerHTML = '<i class="fas fa-music"></i><span>Todas</span>';
                    } else {
                        recentSection.style.display = 'none';
                        allSongsSection.style.display = 'block';
                        toggleRecentBtn.innerHTML = '<i class="fas fa-history"></i><span>Recientes</span>';
                    }
                }
            });
        }

        // Search
        this.searchInput.addEventListener('input', (e) => this.searchSongs(e.target.value));

        // Playlist management
        if (this.createPlaylistBtn) {
            this.createPlaylistBtn.addEventListener('click', () => this.openPlaylistModal());
        }
        if (this.savePlaylistBtn) {
            this.savePlaylistBtn.addEventListener('click', () => this.savePlaylist());
        }
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.closePlaylistModal());
        }
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closePlaylistModal());
        }
        if (this.playPlaylistBtn) {
            this.playPlaylistBtn.addEventListener('click', () => this.playCurrentPlaylist());
        }
        if (this.editPlaylistBtn) {
            this.editPlaylistBtn.addEventListener('click', () => this.editCurrentPlaylist());
        }
        if (this.deletePlaylistBtn) {
            this.deletePlaylistBtn.addEventListener('click', () => this.deleteCurrentPlaylist());
        }

        // Action buttons
        this.playAllBtn.addEventListener('click', () => this.playAllSongs());
        this.shuffleAllBtn.addEventListener('click', () => this.shuffleAllSongs());
        this.playLikedBtn.addEventListener('click', () => this.playLikedSongs());
        
        // Toggle view buttons
        const toggleViewBtn = document.getElementById('toggleViewBtn');
        const toggleViewBtn2 = document.getElementById('toggleViewBtn2');
        
        if (toggleViewBtn) {
            toggleViewBtn.addEventListener('click', () => this.toggleToAllSongs());
        }
        if (toggleViewBtn2) {
            toggleViewBtn2.addEventListener('click', () => this.toggleToLikedSongs());
        }
        
        // Back to home buttons
        const backHomeBtn = document.getElementById('backHomeBtn');
        const backHomeBtn2 = document.getElementById('backHomeBtn2');
        const backHomeBtn3 = document.getElementById('backHomeBtn3');
        
        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', () => this.showSection('home'));
        }
        if (backHomeBtn2) {
            backHomeBtn2.addEventListener('click', () => this.showSection('home'));
        }
        if (backHomeBtn3) {
            backHomeBtn3.addEventListener('click', () => this.showSection('home'));
        }
        
        // Back to playlists button
        const backToPlaylistsBtn = document.getElementById('backToPlaylistsBtn');
        if (backToPlaylistsBtn) {
            backToPlaylistsBtn.addEventListener('click', () => this.showSection('playlists'));
        }
        
        this.playPlaylistBtn?.addEventListener('click', () => this.playCurrentPlaylist());
        this.editPlaylistBtn?.addEventListener('click', () => this.editCurrentPlaylist());
        this.deletePlaylistBtn?.addEventListener('click', () => this.deleteCurrentPlaylist());

        // Context menu
        document.addEventListener('click', () => this.hideContextMenu());
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.song-item') && !e.target.closest('.song-more-btn')) {
                e.preventDefault();
                this.showSongOptions(e, parseInt(e.target.closest('.song-item').dataset.songId));
            }
        });
        
        this.addToQueueCtx.addEventListener('click', () => {
            this.addToQueue(this.contextMenuSongId);
            this.hideContextMenu();
        });
        
        this.deleteSongCtx.addEventListener('click', () => {
            this.confirmDeleteSong(this.contextMenuSongId);
            this.hideContextMenu();
        });
        
        this.removeFromPlaylistCtx.addEventListener('click', () => {
            this.removeFromCurrentPlaylist(this.contextMenuSongId);
            this.hideContextMenu();
        });
        
        this.addToPlaylistCtx.addEventListener('mouseenter', () => {
            this.renderPlaylistSubmenu();
            this.playlistSubmenu.style.display = 'block';
        });
        
        this.contextMenu.addEventListener('mouseleave', () => {
            this.playlistSubmenu.style.display = 'none';
        });
        
        this.createNewPlaylistCtx.addEventListener('click', () => {
            this.hideContextMenu();
            this.openPlaylistModal();
        });
        
        // Confirm dialog
        this.confirmYes.addEventListener('click', () => this.deleteSongConfirmed());
        this.confirmNo.addEventListener('click', () => this.closeConfirmDialog());
        this.confirmDialog.addEventListener('click', (e) => {
            if (e.target === this.confirmDialog) {
                this.closeConfirmDialog();
            }
        });

        // Modal backdrop
        this.playlistModal.addEventListener('click', (e) => {
            if (e.target === this.playlistModal) {
                this.closePlaylistModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Quick action cards
        document.addEventListener('click', (e) => {
            const quickActionCard = e.target.closest('.quick-action-card');
            if (quickActionCard) {
                const section = quickActionCard.dataset.section;
                console.log('🎯 DEBUG: Quick action clicked, going to section:', section);
                this.showSection(section);
            }
        });
    }

    // Media Session API for system controls
    setupMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                if (!this.isPlaying && this.currentSongIndex !== -1) {
                    this.audio.play();
                }
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                if (this.isPlaying) {
                    this.audio.pause();
                }
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                this.previousSong();
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                this.nextSong();
            });

            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                const skipTime = details.seekOffset || 10;
                this.audio.currentTime = Math.max(this.audio.currentTime - skipTime, 0);
            });

            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                const skipTime = details.seekOffset || 10;
                this.audio.currentTime = Math.min(this.audio.currentTime + skipTime, this.audio.duration || 0);
            });

            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.seekTime) {
                    this.audio.currentTime = details.seekTime;
                }
            });
        }
    }

    updateMediaSession(song) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                album: 'Rolitas Pal Héctor',
                artwork: [
                    { src: song.artwork, sizes: '96x96', type: 'image/svg+xml' },
                    { src: song.artwork, sizes: '128x128', type: 'image/svg+xml' },
                    { src: song.artwork, sizes: '192x192', type: 'image/svg+xml' },
                    { src: song.artwork, sizes: '256x256', type: 'image/svg+xml' },
                    { src: song.artwork, sizes: '384x384', type: 'image/svg+xml' },
                    { src: song.artwork, sizes: '512x512', type: 'image/svg+xml' }
                ]
            });

            // Update playback state
            navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';

            // Update position state
            if (this.audio.duration) {
                navigator.mediaSession.setPositionState({
                    duration: this.audio.duration,
                    playbackRate: this.audio.playbackRate,
                    position: this.audio.currentTime
                });
            }
        }
    }

    togglePlayPause() {
        if (this.currentSongIndex === -1 && this.songs.length > 0) {
            this.playSong(0);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
    }

    async playSong(index, playlist = null) {
        if (index < 0 || index >= this.songs.length) return;

        this.currentSongIndex = index;
        this.currentPlaylist = playlist;
        const song = this.songs[index];

        this.audio.src = song.src;
        
        // Update display
        this.currentTitle.textContent = song.title;
        this.currentArtist.textContent = song.artist;
        this.currentArtwork.src = song.artwork;
        this.currentArtwork.alt = song.title;

        // Update like button
        this.updateLikeButton();

        // Update song items
        this.updateSongItems();

        // Add to recent songs
        this.addToRecentSongs(song);

        try {
            await this.audio.play();
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            
            // Update Media Session for system controls
            this.updateMediaSession(song);
            
            // Force update of display elements
            setTimeout(() => {
                this.updateSongItems();
                this.updateLikeButton();
            }, 100);
        } catch (error) {
            console.error('Error playing song:', error);
        }
    }

    previousSong() {
        if (this.queue.length > 0) {
            const currentSong = this.songs[this.currentSongIndex];
            const currentQueueIndex = this.queue.findIndex(song => song.id === currentSong.id);
            
            if (currentQueueIndex > 0) {
                // Get previous song from queue
                const prevSong = this.queue[currentQueueIndex - 1];
                const songIndex = this.songs.findIndex(s => s.id === prevSong.id);
                if (songIndex !== -1) {
                    this.playSong(songIndex);
                    return;
                }
            } else if (this.repeatMode === 'all' && this.queue.length > 0) {
                // Loop to end of queue
                const lastSong = this.queue[this.queue.length - 1];
                const songIndex = this.songs.findIndex(s => s.id === lastSong.id);
                if (songIndex !== -1) {
                    this.playSong(songIndex);
                    return;
                }
            }
        }
    }

    nextSong() {
        if (this.queue.length > 0) {
            const currentSong = this.songs[this.currentSongIndex];
            const currentQueueIndex = this.queue.findIndex(song => song.id === currentSong.id);
            
            if (currentQueueIndex !== -1 && currentQueueIndex < this.queue.length - 1) {
                // Get next song from queue
                const nextSong = this.queue[currentQueueIndex + 1];
                const songIndex = this.songs.findIndex(s => s.id === nextSong.id);
                if (songIndex !== -1) {
                    this.playSong(songIndex);
                    return;
                }
            } else if (this.repeatMode === 'all' && this.queue.length > 0) {
                // Loop back to start of queue
                const firstSong = this.queue[0];
                const songIndex = this.songs.findIndex(s => s.id === firstSong.id);
                if (songIndex !== -1) {
                    this.playSong(songIndex);
                    return;
                }
            }
        }
    }

    handleSongEnd() {
        switch (this.repeatMode) {
            case 'one':
                // Repeat the current song
                this.audio.currentTime = 0;
                this.audio.play();
                break;
            case 'all':
                // Check if we're in playlist mode and at the end of playlist
                if (this.currentPlaylist && this.queue.length > 0) {
                    const currentQueueIndex = this.queue.findIndex(song => song.id === this.songs[this.currentSongIndex].id);
                    if (currentQueueIndex >= this.queue.length - 1) {
                        // At the end of the playlist, restart from beginning
                        this.playSongById(this.queue[0].id);
                    } else {
                        // Continue to next song in playlist
                        this.nextSong();
                    }
                } else if (this.currentSongIndex >= this.songs.length - 1) {
                    // At the end of all songs, restart from beginning if repeat all is on
                    this.currentSongIndex = 0;
                    this.playSong(this.currentSongIndex);
                } else {
                    // Continue to next song
                    this.nextSong();
                }
                break;
            default:
                // No repeat mode
                if (this.queue.length > 0) {
                    const currentQueueIndex = this.queue.findIndex(song => song.id === this.songs[this.currentSongIndex].id);
                    if (currentQueueIndex < this.queue.length - 1) {
                        this.nextSong();
                    } else {
                        // End of queue/playlist
                        this.isPlaying = false;
                        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                } else if (this.currentSongIndex < this.songs.length - 1) {
                    this.nextSong();
                } else {
                    // End of all songs
                    this.isPlaying = false;
                    this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
        }
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }

    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        this.repeatBtn.classList.toggle('active', this.repeatMode !== 'none');
        this.repeatBtn.classList.toggle('repeat-one', this.repeatMode === 'one');
    }

    toggleLike() {
        if (this.currentSongIndex === -1) return;

        const song = this.songs[this.currentSongIndex];
        const isLiked = this.likedSongs.some(s => s.id === song.id);

        if (isLiked) {
            this.likedSongs = this.likedSongs.filter(s => s.id !== song.id);
        } else {
            this.likedSongs.push(song);
        }

        localStorage.setItem('likedSongs', JSON.stringify(this.likedSongs));
        this.updateLikeButton();
        this.renderLikedSongs();
    }

    updateLikeButton() {
        if (this.currentSongIndex === -1) return;

        const song = this.songs[this.currentSongIndex];
        const isLiked = this.likedSongs.some(s => s.id === song.id);
        
        this.likeBtn.classList.toggle('liked', isLiked);
        this.likeBtn.innerHTML = isLiked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    }

    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${progress}%`;
            this.progressInput.value = progress;
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
    }

    seekTo(percentage) {
        const time = (percentage / 100) * this.audio.duration;
        this.audio.currentTime = time;
    }

    setVolume(value) {
        this.audio.volume = value / 100;
        this.updateVolumeIcon(value);
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.audio.volume = 0;
            this.volumeSlider.value = 0;
        } else {
            this.audio.volume = 1;
            this.volumeSlider.value = 100;
        }
        this.updateVolumeIcon(this.volumeSlider.value);
    }

    updateVolumeIcon(value) {
        const icon = this.volumeBtn.querySelector('i');
        if (value == 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (value < 50) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // UI Rendering Methods
    renderAllSongs() {
        console.log('🎵 DEBUG: renderAllSongs called');
        console.log('📱 DEBUG: allSongsList element:', this.allSongsList);
        console.log('🎵 DEBUG: Number of songs to render:', this.songs.length);
        
        if (!this.allSongsList) {
            console.error('❌ ERROR: allSongsList element not found');
            return;
        }
        
        if (this.songs.length === 0) {
            this.allSongsList.innerHTML = '<div class="empty-state">No hay canciones disponibles.</div>';
            console.log('📱 DEBUG: No songs, showing empty state');
            return;
        }
        
        const songsHTML = this.songs.map(song => this.createSongItem(song)).join('');
        this.allSongsList.innerHTML = songsHTML;
        console.log('✅ DEBUG: Rendered', this.songs.length, 'songs in all songs list');
        
        // Check if content exceeds container height to confirm scroll is needed
        setTimeout(() => {
            const mainContent = document.querySelector('.main-content');
            const player = document.querySelector('.player');
            if (mainContent && player) {
                console.log('📏 DEBUG: Main content scrollHeight:', mainContent.scrollHeight);
                console.log('📏 DEBUG: Main content clientHeight:', mainContent.clientHeight);
                console.log('📏 DEBUG: Player height:', player.offsetHeight);
                console.log('📏 DEBUG: Window height:', window.innerHeight);
                console.log('🔄 DEBUG: Scroll needed:', mainContent.scrollHeight > mainContent.clientHeight);
                console.log('📱 DEBUG: Space for content:', window.innerHeight - player.offsetHeight);
            }
        }, 500); // More time for rendering
    }

    renderLikedSongs() {
        console.log('🔍 DEBUG: renderLikedSongs called');
        console.log('📱 DEBUG: likedSongs array:', this.likedSongs);
        console.log('📱 DEBUG: likedSongsList element:', this.likedSongsList);
        
        if (!this.likedSongsList) {
            console.error('❌ ERROR: likedSongsList element not found');
            return;
        }
        
        if (this.likedSongs.length === 0) {
            this.likedSongsList.innerHTML = '<div class="empty-state">No tienes canciones que te gusten aún. ¡Agrega algunas con el corazón! ❤️</div>';
            console.log('📱 DEBUG: No liked songs, showing empty state');
            return;
        }
        
        const songsHTML = this.likedSongs.map(song => this.createSongItem(song)).join('');
        this.likedSongsList.innerHTML = songsHTML;
        console.log('✅ DEBUG: Rendered', this.likedSongs.length, 'liked songs');
    }

    renderRecentSongs() {
        const recentContainer = document.getElementById('recentSongs');
        if (recentContainer) {
            // Change to list format instead of cards
            recentContainer.innerHTML = this.recentSongsArray.slice(0, 6).map(song => this.createSongItem(song)).join('');
        }
    }

    // Playlists functionality
    renderPlaylists() {
        if (this.playlistsGrid) {
            this.playlistsGrid.innerHTML = this.playlists.map(playlist => this.createPlaylistCard(playlist)).join('');
        }
    }

    createPlaylistCard(playlist) {
        return `
            <div class="playlist-card" onclick="musicPlayer.showPlaylistView(${playlist.id})">
                <div class="playlist-card-artwork">
                    <i class="fas fa-music"></i>
                </div>
                <div class="playlist-card-title">${playlist.name}</div>
                <div class="playlist-card-info">${playlist.songs.length} canciones</div>
            </div>
        `;
    }

    showPlaylistView(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        this.currentPlaylist = playlist;
        this.contextPlaylistId = playlistId; // Set the context playlist ID
        this.showSection('playlistView');
        
        this.currentPlaylistName.textContent = playlist.name;
        this.currentPlaylistInfo.textContent = `${playlist.songs.length} canciones`;
        
        if (this.playlistSongsList) {
            // Pass 'playlist' context when creating song items for playlist view
            this.playlistSongsList.innerHTML = playlist.songs.map(song => this.createSongItem(song, 'playlist')).join('');
        }
    }

    showSongOptions(event, songId) {
        event.stopPropagation();
        this.contextMenuSongId = songId;
        
        // Show/hide remove from playlist option
        const inPlaylistView = this.currentSection === 'playlistView' && this.currentPlaylist;
        this.removeFromPlaylistCtx.style.display = inPlaylistView ? 'block' : 'none';
        
        this.contextMenu.style.display = 'block';
        
        // Better positioning logic to avoid covering by player or going off-screen
        const menuWidth = 250;
        const menuHeight = 200;
        const playerHeight = 90; // Fixed player height
        const margin = 10; // Safety margin
        
        // Calculate best position
        let left = event.pageX;
        let top = event.pageY;
        
        // Prevent menu from going off-screen on the right
        if (left + menuWidth > window.innerWidth) {
            left = window.innerWidth - menuWidth - margin;
        }
        
        // Prevent menu from going off-screen on the left
        if (left < margin) {
            left = margin;
        }
        
        // Prevent menu from being covered by player at bottom
        if (top + menuHeight > window.innerHeight - playerHeight) {
            top = window.innerHeight - menuHeight - playerHeight - margin;
        }
        
        // Prevent menu from going off-screen at top
        if (top < margin) {
            top = margin;
        }
        
        this.contextMenu.style.left = left + 'px';
        this.contextMenu.style.top = top + 'px';
    }

    renderPlaylistSubmenu() {
        if (this.playlistSubmenuList) {
            this.playlistSubmenuList.innerHTML = this.playlists.map(playlist =>
                `<li class="context-item" onclick="musicPlayer.addSongToPlaylist(${this.contextMenuSongId}, ${playlist.id})">${playlist.name}</li>`
            ).join('');
        }
    }

    addSongToPlaylist(songId, playlistId) {
        const song = this.songs.find(s => s.id === songId);
        const playlist = this.playlists.find(p => p.id === playlistId);
        
        if (song && playlist && !playlist.songs.some(s => s.id === songId)) {
            const songWithTimestamp = { ...song, addedAt: Date.now() };
            playlist.songs.push(songWithTimestamp);
            localStorage.setItem('playlists', JSON.stringify(this.playlists));
            
            if (this.currentPlaylist && this.currentPlaylist.id === playlistId) {
                this.showPlaylistView(playlistId);
            }
            
            this.showNotification(`"${song.title}" añadido a ${playlist.name}`, 'success');
        }
        
        this.hideContextMenu();
    }

    removeFromCurrentPlaylist(songId) {
        if (!this.currentPlaylist) return;
        
        const song = this.songs.find(s => s.id === songId);
        if (!song) return;
        
        this.currentPlaylist.songs = this.currentPlaylist.songs.filter(s => s.id !== songId);
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
        
        // Update display
        this.showPlaylistView(this.currentPlaylist.id);
        this.showNotification(`"${song.title}" removido de la playlist`, 'info');
    }

    openPlaylistModal(playlist = null) {
        this.currentEditingPlaylist = playlist;
        if (this.playlistNameInput) {
            this.playlistNameInput.value = playlist ? playlist.name : '';
        }
        if (document.getElementById('modalTitle')) {
            document.getElementById('modalTitle').textContent = playlist ? 'Editar Playlist' : 'Crear Playlist';
        }
        this.playlistModal.classList.add('show');
    }

    closePlaylistModal() {
        this.playlistModal.classList.remove('show');
        this.currentEditingPlaylist = null;
        if (this.playlistNameInput) {
            this.playlistNameInput.value = '';
        }
    }

    savePlaylist() {
        const name = this.playlistNameInput.value.trim();
        if (!name) return;

        if (this.currentEditingPlaylist) {
            // Edit existing playlist
            this.currentEditingPlaylist.name = name;
        } else {
            // Create new playlist
            const newPlaylist = {
                id: Date.now(),
                name: name,
                songs: [],
                createdAt: Date.now()
            };
            
            // If creating from song context, add the song
            if (this.contextMenuSongId) {
                const song = this.songs.find(s => s.id === this.contextMenuSongId);
                if (song) {
                    newPlaylist.songs.push({ ...song, addedAt: Date.now() });
                }
                this.contextMenuSongId = null;
            }
            
            this.playlists.push(newPlaylist);
        }

        localStorage.setItem('playlists', JSON.stringify(this.playlists));
        this.renderPlaylists();
        this.closePlaylistModal();
        
        const action = this.currentEditingPlaylist ? 'actualizada' : 'creada';
        this.showNotification(`Playlist ${action} exitosamente`, 'success');
    }

    playCurrentPlaylist() {
        if (this.currentPlaylist && this.currentPlaylist.songs.length > 0) {
            this.queue = [...this.currentPlaylist.songs];
            const firstSongIndex = this.songs.findIndex(s => s.id === this.currentPlaylist.songs[0].id);
            if (firstSongIndex !== -1) {
                this.playSong(firstSongIndex);
            }
        }
    }

    editCurrentPlaylist() {
        if (this.currentPlaylist) {
            this.openPlaylistModal(this.currentPlaylist);
        }
    }

    deleteCurrentPlaylist() {
        if (this.currentPlaylist && confirm(`¿Estás seguro de que quieres eliminar la playlist "${this.currentPlaylist.name}"?`)) {
            this.playlists = this.playlists.filter(p => p.id !== this.currentPlaylist.id);
            localStorage.setItem('playlists', JSON.stringify(this.playlists));
            this.renderPlaylists();
            this.showSection('playlists');
            this.showNotification('Playlist eliminada', 'info');
        }
    }

    createSongItem(song, context = null) {
        const isLiked = this.likedSongs.some(s => s.id === song.id);
        const isPlaying = this.currentSongIndex !== -1 && this.songs[this.currentSongIndex].id === song.id;
        
        // Determine the context for this song item
        let songContext = context || (this.currentSection === 'liked' ? 'liked' : 
                                      this.currentSection === 'playlistView' ? 'playlist' : 
                                      this.currentSection === 'home' ? 'home' : 'all');
        
        return `
            <div class="song-item ${isPlaying ? 'playing' : ''}" data-song-id="${song.id}">
                <div class="song-artwork" onclick="musicPlayer.playSongById(${song.id}, '${songContext}')">
                    <div class="visual-effect ${isPlaying ? 'playing' : ''}">
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                    </div>
                </div>
                <div class="song-info" onclick="musicPlayer.playSongById(${song.id}, '${songContext}')">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="song-duration">${this.formatTime(song.duration)}</div>
                <div class="song-actions">
                    <button onclick="musicPlayer.toggleSongLike(${song.id})" title="${isLiked ? 'Quitar de Me Gusta' : 'Agregar a Me Gusta'}">
                        <i class="fas fa-heart ${isLiked ? 'liked' : ''}"></i>
                    </button>
                    <button class="song-more-btn" onclick="musicPlayer.showSongOptions(event, ${song.id})" title="Más opciones">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>
        `;
    }

    createSongCard(song) {
        return `
            <div class="song-card" data-song-id="${song.id}" onclick="musicPlayer.playSongById(${song.id})">
                <div class="song-artwork">
                    <img src="${song.artwork}" alt="${song.title}">
                </div>
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        `;
    }

    updateSongItems() {
        document.querySelectorAll('.song-item').forEach(item => {
            const songId = parseInt(item.dataset.songId);
            const isPlaying = this.currentSongIndex !== -1 && this.songs[this.currentSongIndex].id === songId;
            item.classList.toggle('playing', isPlaying);
        });
    }

    // Navigation and sections
    showSection(section) {
        console.log('🎯 DEBUG: showSection called with:', section);
        
        // Update navigation
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.style.display = 'none';
        });

        // Show selected section
        const sectionElement = document.getElementById(`${section}Section`);
        console.log('📱 DEBUG: Section element:', sectionElement);
        
        if (sectionElement) {
            sectionElement.style.display = 'block';
            console.log('✅ DEBUG: Shown section:', section);
        } else {
            console.error('❌ ERROR: Section element not found:', `${section}Section`);
        }
        
        // If showing home, render all songs list
        if (section === 'home') {
            this.renderHomeAllSongs();
        }

        // Update section title
        const titles = {
            'home': 'Inicio',
            'songs': 'Todas las Canciones',
            'liked': 'Me Gusta',
            'playlists': 'Playlists',
            'playlistView': 'Playlist'
        };
        this.sectionTitle.textContent = titles[section] || section;
        this.currentSection = section;
        
        console.log('🎯 DEBUG: Current section set to:', this.currentSection);
        
        // Render content for the current section
        this.renderCurrentSection();
    }

    // Playlist management
    openPlaylistModal(playlist = null) {
        this.currentEditingPlaylist = playlist;
        this.playlistNameInput.value = playlist ? playlist.name : '';
        document.getElementById('modalTitle').textContent = playlist ? 'Editar Playlist' : 'Crear Playlist';
        this.playlistModal.classList.add('show');
    }

    closePlaylistModal() {
        this.playlistModal.classList.remove('show');
        this.currentEditingPlaylist = null;
        this.playlistNameInput.value = '';
    }

    savePlaylist() {
        const name = this.playlistNameInput.value.trim();
        if (!name) return;

        if (this.currentEditingPlaylist) {
            // Edit existing playlist
            this.currentEditingPlaylist.name = name;
        } else {
            // Create new playlist
            const newPlaylist = {
                id: Date.now(),
                name: name,
                songs: []
            };
            this.playlists.push(newPlaylist);
        }

        localStorage.setItem('playlists', JSON.stringify(this.playlists));
        this.renderPlaylists();
        this.closePlaylistModal();
    }

    showPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        this.currentPlaylist = playlist;
        this.showSection('playlist');
        
        document.getElementById('currentPlaylistName').textContent = playlist.name;
        document.getElementById('currentPlaylistInfo').textContent = `${playlist.songs.length} canciones`;
        
        this.playlistSongsList.innerHTML = playlist.songs.map(song => this.createSongItem(song)).join('');
    }

    // Queue management
    toggleQueue() {
        this.queuePanel.classList.toggle('open');
        this.renderQueue();
    }

    closeQueue() {
        this.queuePanel.classList.remove('open');
    }

    addToQueue(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (song && !this.queue.some(s => s.id === songId)) {
            this.queue.push(song);
            this.renderQueue();
        }
    }

    clearQueue() {
        this.queue = [];
        this.renderQueue();
    }

    shuffleQueue() {
        for (let i = this.queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
        this.renderQueue();
    }

    renderQueue() {
        this.queueList.innerHTML = this.queue.map((song, index) => {
            const isPlaying = this.currentSongIndex !== -1 && this.songs[this.currentSongIndex].id === song.id;
            return `
                <div class="queue-item ${isPlaying ? 'current' : ''}" onclick="musicPlayer.playSongById(${song.id})">
                    <div class="song-artwork">
                        <img src="${song.artwork}" alt="${song.title}">
                    </div>
                    <div class="song-info">
                        <div class="song-title">${song.title}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                    <button onclick="event.stopPropagation(); musicPlayer.removeFromQueue(${index})" title="Quitar de la cola">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    removeFromQueue(index) {
        this.queue.splice(index, 1);
        this.renderQueue();
    }

    // Search functionality
    searchSongs(query) {
        if (!query.trim()) {
            this.renderCurrentSection();
            return;
        }

        let songsToSearch = [];
        switch (this.currentSection) {
            case 'songs':
                songsToSearch = this.songs;
                break;
            case 'liked':
                songsToSearch = this.likedSongs;
                break;
            case 'playlists':
                songsToSearch = [];
                break;
            case 'playlistView':
                songsToSearch = this.currentPlaylist ? this.currentPlaylist.songs : [];
                break;
            default:
                songsToSearch = this.songs;
        }

        const filteredSongs = songsToSearch.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        );

        this.renderSearchResults(filteredSongs);
    }

    renderSearchResults(songs) {
        let container;
        switch (this.currentSection) {
            case 'songs':
                container = this.allSongsList;
                break;
            case 'liked':
                container = this.likedSongsList;
                break;
            case 'playlists':
                container = null; // No search for playlists grid
                break;
            case 'playlistView':
                container = this.playlistSongsList;
                break;
            default:
                container = this.allSongsList;
        }
        
        if (container) {
            container.innerHTML = songs.map(song => this.createSongItem(song)).join('');
        }
    }

    renderCurrentSection() {
        console.log('🎨 DEBUG: renderCurrentSection called for:', this.currentSection);
        
        switch (this.currentSection) {
            case 'songs':
                console.log('🎵 DEBUG: Rendering all songs');
                this.renderAllSongs();
                break;
            case 'liked':
                console.log('💖 DEBUG: Rendering liked songs');
                this.renderLikedSongs();
                break;
            case 'playlists':
                console.log('📋 DEBUG: Rendering playlists');
                this.renderPlaylists();
                break;
            case 'playlistView':
                console.log('📋 DEBUG: Rendering playlist view');
                if (this.currentPlaylist) {
                    this.playlistSongsList.innerHTML = this.currentPlaylist.songs.map(song => this.createSongItem(song)).join('');
                }
                break;
            default:
                console.log('🏠 DEBUG: Default section, no special rendering');
        }
    }

    // Toggle between views
    toggleToAllSongs() {
        console.log('🔄 DEBUG: Toggling to all songs view');
        this.showSection('songs');
    }
    
    toggleToLikedSongs() {
        console.log('🔄 DEBUG: Toggling to liked songs view');
        this.showSection('liked');
    }

    // Utility methods
    playSongById(songId, context = null) {
        const index = this.songs.findIndex(s => s.id === songId);
        if (index !== -1) {
            // Set context based on where the song was clicked
            if (context) {
                this.playbackContext = context;
                if (context === 'playlist' && this.currentPlaylist) {
                    this.contextPlaylistId = this.currentPlaylist.id;
                    this.queue = [...this.currentPlaylist.songs];
                    this.originalQueue = [...this.currentPlaylist.songs];
                } else if (context === 'liked') {
                    const likedSongObjects = this.likedSongs.map(songId => 
                        this.songs.find(s => s.id === songId)
                    ).filter(song => song);
                    this.queue = [...likedSongObjects];
                    this.originalQueue = [...likedSongObjects];
                } else if (context === 'all' || context === 'home') {
                    this.queue = [...this.songs];
                    this.originalQueue = [...this.songs];
                } else if (context === 'recent') {
                    const recentSongObjects = this.recentSongsArray.map(songId => 
                        this.songs.find(s => s.id === songId)
                    ).filter(song => song);
                    this.queue = [...recentSongObjects];
                    this.originalQueue = [...recentSongObjects];
                }
            } else {
                // Auto-detect context based on current section
                if (this.currentSection === 'playlistView' && this.currentPlaylist) {
                    this.playbackContext = 'playlist';
                    this.contextPlaylistId = this.currentPlaylist.id;
                    this.queue = [...this.currentPlaylist.songs];
                    this.originalQueue = [...this.currentPlaylist.songs];
                } else if (this.currentSection === 'liked') {
                    this.playbackContext = 'liked';
                    const likedSongObjects = this.likedSongs.map(songId => 
                        this.songs.find(s => s.id === songId)
                    ).filter(song => song);
                    this.queue = [...likedSongObjects];
                    this.originalQueue = [...likedSongObjects];
                } else {
                    this.playbackContext = 'all';
                    this.queue = [...this.songs];
                    this.originalQueue = [...this.songs];
                }
            }
            
            this.updatePlaybackContextIndicator();
            this.playSong(index);
        }
    }

    toggleSongLike(songId) {
        console.log('💖 DEBUG: toggleSongLike called with songId:', songId);
        
        const song = this.songs.find(s => s.id === songId);
        if (!song) {
            console.error('❌ ERROR: Song not found with id:', songId);
            return;
        }
        
        console.log('📱 DEBUG: Found song:', song.title);

        const isLiked = this.likedSongs.some(s => s.id === songId);
        console.log('💖 DEBUG: Is currently liked:', isLiked);
        
        if (isLiked) {
            this.likedSongs = this.likedSongs.filter(s => s.id !== songId);
            console.log('➖ DEBUG: Removed from liked songs');
        } else {
            // Add timestamp when song was liked to maintain chronological order
            const likedSong = { ...song, likedAt: Date.now() };
            this.likedSongs.push(likedSong);
            console.log('➕ DEBUG: Added to liked songs with timestamp:', likedSong.likedAt);
        }

        // Sort by likedAt timestamp (newest first, but we'll reverse for display)
        this.likedSongs.sort((a, b) => (a.likedAt || 0) - (b.likedAt || 0));
        console.log('📱 DEBUG: Sorted liked songs:', this.likedSongs);

        localStorage.setItem('likedSongs', JSON.stringify(this.likedSongs));
        console.log('💾 DEBUG: Saved to localStorage');
        
        this.renderCurrentSection();
        console.log('🎨 DEBUG: Re-rendered current section');
        
        if (this.currentSongIndex !== -1 && this.songs[this.currentSongIndex].id === songId) {
            this.updateLikeButton();
            console.log('💖 DEBUG: Updated like button');
        }
    }

    addToRecentSongs(song) {
        this.recentSongsArray = this.recentSongsArray.filter(s => s.id !== song.id);
        this.recentSongsArray.unshift(song);
        this.recentSongsArray = this.recentSongsArray.slice(0, 10);
        localStorage.setItem('recentSongs', JSON.stringify(this.recentSongsArray));
        this.renderRecentSongs();
    }

    playAllSongs() {
        if (this.songs.length > 0) {
            this.playbackContext = 'all';
            this.contextPlaylistId = null;
            this.queue = [...this.songs];
            this.originalQueue = [...this.songs];
            this.updatePlaybackContextIndicator();
            this.playSong(0);
        }
    }
    
    renderHomeAllSongs() {
        const homeAllSongsContainer = document.getElementById('homeAllSongs');
        if (homeAllSongsContainer) {
            homeAllSongsContainer.innerHTML = this.songs.map(song => this.createSongItem(song)).join('');
        }
    }
    
    updatePlaybackContextIndicator() {
        const contextIndicator = document.getElementById('contextIndicator');
        if (!contextIndicator) {
            // Create context indicator if it doesn't exist
            const playerInfo = document.querySelector('.player-info');
            if (playerInfo) {
                const indicator = document.createElement('div');
                indicator.id = 'contextIndicator';
                indicator.className = 'context-indicator';
                playerInfo.insertBefore(indicator, playerInfo.firstChild);
            }
        }
        
        const indicator = document.getElementById('contextIndicator');
        if (indicator) {
            let contextText = '';
            if (this.playbackContext === 'playlist' && this.contextPlaylistId) {
                const playlist = this.playlists.find(p => p.id === this.contextPlaylistId);
                contextText = playlist ? `Reproduciendo desde: ${playlist.name}` : '';
            } else if (this.playbackContext === 'liked') {
                contextText = 'Reproduciendo desde: Me Gusta';
            } else if (this.playbackContext === 'recent') {
                contextText = 'Reproduciendo desde: Recientes';
            } else if (this.playbackContext === 'all' || this.playbackContext === 'home') {
                contextText = 'Reproduciendo desde: Todas las canciones';
            }
            indicator.textContent = contextText;
            indicator.style.display = contextText ? 'block' : 'none';
        }
    }

    shuffleAllSongs() {
        if (this.songs.length > 0) {
            const shuffled = [...this.songs].sort(() => Math.random() - 0.5);
            this.queue = shuffled;
            this.playSong(this.songs.findIndex(s => s.id === shuffled[0].id));
        }
    }

    playLikedSongs() {
        if (this.likedSongs.length > 0) {
            // Create queue in chronological order (as they appear in the list)
            this.queue = [...this.likedSongs];
            const firstSongIndex = this.songs.findIndex(s => s.id === this.likedSongs[0].id);
            if (firstSongIndex !== -1) {
                this.playSong(firstSongIndex);
            }
        }
    }

    playCurrentPlaylist() {
        if (this.currentPlaylist && this.currentPlaylist.songs.length > 0) {
            this.queue = [...this.currentPlaylist.songs];
            const firstSongIndex = this.songs.findIndex(s => s.id === this.currentPlaylist.songs[0].id);
            this.playSong(firstSongIndex);
        }
    }

    editCurrentPlaylist() {
        if (this.currentPlaylist) {
            this.openPlaylistModal(this.currentPlaylist);
        }
    }

    deleteCurrentPlaylist() {
        if (this.currentPlaylist && confirm(`¿Estás seguro de que quieres eliminar la playlist "${this.currentPlaylist.name}"?`)) {
            this.playlists = this.playlists.filter(p => p.id !== this.currentPlaylist.id);
            localStorage.setItem('playlists', JSON.stringify(this.playlists));
            this.renderPlaylists();
            this.showSection('home');
        }
    }

    // Context menu
    hideContextMenu() {
        this.contextMenu.style.display = 'none';
        this.playlistSubmenu.style.display = 'none';
    }


    // Song deletion methods
    confirmDeleteSong(songId) {
        const song = this.songs.find(s => s.id === songId);
        if (!song) return;
        
        this.songToDelete = song;
        this.confirmMessage.innerHTML = `¿Estás seguro de que quieres eliminar "<strong>${song.title}</strong>" de <strong>${song.artist}</strong> del sistema?<br><br>Esta acción eliminará permanentemente el archivo y no se puede deshacer.`;
        this.confirmDialog.classList.add('show');
    }
    
    deleteSongConfirmed() {
        if (!this.songToDelete) return;
        
        // Stop playing if this is the current song
        if (this.currentSongIndex !== -1 && this.songs[this.currentSongIndex].id === this.songToDelete.id) {
            this.audio.pause();
            this.audio.src = '';
            this.currentSongIndex = -1;
            this.isPlaying = false;
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            this.currentTitle.textContent = 'Selecciona una canción';
            this.currentArtist.textContent = '';
            this.currentArtwork.src = '';
        }
        
        // Remove from all data structures
        this.songs = this.songs.filter(s => s.id !== this.songToDelete.id);
        this.likedSongs = this.likedSongs.filter(s => s.id !== this.songToDelete.id);
        this.recentSongsArray = this.recentSongsArray.filter(s => s.id !== this.songToDelete.id);
        this.queue = this.queue.filter(s => s.id !== this.songToDelete.id);
        
        // Remove from all playlists
        this.playlists.forEach(playlist => {
            playlist.songs = playlist.songs.filter(s => s.id !== this.songToDelete.id);
        });
        
        // Update local storage
        localStorage.setItem('likedSongs', JSON.stringify(this.likedSongs));
        localStorage.setItem('recentSongs', JSON.stringify(this.recentSongsArray));
        localStorage.setItem('playlists', JSON.stringify(this.playlists));
        
        // Simulate file deletion (in real implementation, you would make an API call to delete the file)
        console.log(`Archivo ${this.songToDelete.src} eliminado del sistema`);
        
        // Update UI
        this.renderAllSongs();
        this.renderLikedSongs();
        this.renderRecentSongs();
        this.renderQueue();
        
        if (this.currentPlaylist) {
            this.showPlaylist(this.currentPlaylist.id);
        }
        
        this.closeConfirmDialog();
        
        // Show success message
        this.showNotification(`"${this.songToDelete.title}" ha sido eliminado del sistema`, 'success');
        
        this.songToDelete = null;
    }
    
    closeConfirmDialog() {
        this.confirmDialog.classList.remove('show');
        this.songToDelete = null;
    }
    
    // Notification system
    showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
                color: #ffffff;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                z-index: 3000;
                opacity: 0;
                transform: translateX(300px);
                transition: all 0.3s ease;
                max-width: 300px;
                border-left: 4px solid #1db954;
            `;
            document.body.appendChild(notification);
        }
        
        // Set colors based on type
        const colors = {
            'success': '#1db954',
            'error': '#e22e2e',
            'info': '#1db954',
            'warning': '#ffb347'
        };
        
        notification.style.borderLeftColor = colors[type] || colors.info;
        notification.textContent = message;
        
        // Show notification
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(300px)';
        }, 3000);
    }

    // Keyboard shortcuts
    handleKeyboard(event) {
        if (event.target.tagName === 'INPUT') return;

        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextSong();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousSong();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.setVolume(Math.min(100, this.volumeSlider.value + 10));
                this.volumeSlider.value = this.audio.volume * 100;
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.setVolume(Math.max(0, this.volumeSlider.value - 10));
                this.volumeSlider.value = this.audio.volume * 100;
                break;
            case 'Escape':
                event.preventDefault();
                if (this.confirmDialog.classList.contains('show')) {
                    this.closeConfirmDialog();
                } else if (this.playlistModal.classList.contains('show')) {
                    this.closePlaylistModal();
                } else if (this.queuePanel.classList.contains('open')) {
                    this.closeQueue();
                } else if (document.querySelector('.sidebar.open')) {
                    document.querySelector('.sidebar').classList.remove('open');
                }
                break;
        }
    }
}

// Initialize the music player when the page loads
let musicPlayer;
document.addEventListener('DOMContentLoaded', () => {
    musicPlayer = new MusicPlayer();
    
    // Register service worker for offline functionality (only if served from http/https)
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('Service Worker registrado exitosamente:', registration.scope);
                })
                .catch((error) => {
                    console.log('Error al registrar Service Worker:', error);
                });
        });
    }
});

// Audio event listeners
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');

    audio.addEventListener('play', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (musicPlayer) {
            musicPlayer.isPlaying = true;
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'playing';
            }
        }
    });

    audio.addEventListener('pause', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (musicPlayer) {
            musicPlayer.isPlaying = false;
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = 'paused';
            }
        }
    });

    // Add click handlers for song items
    document.addEventListener('click', (e) => {
        const songItem = e.target.closest('.song-item');
        if (songItem && !e.target.closest('.song-actions')) {
            const songId = parseInt(songItem.dataset.songId);
            musicPlayer.playSongById(songId);
        }
    });

    // Mobile menu toggle (if needed)
    const createMenuToggle = () => {
        if (window.innerWidth <= 768) {
            const header = document.querySelector('.content-header');
            if (!document.querySelector('.menu-toggle')) {
                const menuToggle = document.createElement('button');
                menuToggle.className = 'menu-toggle';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.addEventListener('click', () => {
                    document.querySelector('.sidebar').classList.toggle('open');
                });
                header.prepend(menuToggle);
            }
        }
    };

    createMenuToggle();
    window.addEventListener('resize', createMenuToggle);
});
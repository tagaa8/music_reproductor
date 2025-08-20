#!/bin/bash

# Create the beginning of the HTML file
cat > standalone_complete.html << 'HTMLSTART'
<!DOCTYPE html>
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
HTMLSTART

# Add CSS
echo "    <style>" >> standalone_complete.html
cat styles.css >> standalone_complete.html
echo "    </style>" >> standalone_complete.html

# Add HTML body from index.html (extract body content)
sed -n '/<body>/,/<\/body>/p' index.html >> standalone_complete.html

# Add JavaScript with real base64 MP3 data
cat >> standalone_complete.html << 'JSSTART'
    <script>
    class MusicPlayer {
        constructor() {
            this.audio = document.getElementById('audioPlayer');
            this.songs = [];
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

            this.initializeElements();
            this.loadSongs();
            this.setupEventListeners();
            this.setupMediaSession();
            
            this.showSection('home');
        }

        loadSongs() {
            this.songs = [
                {
                    id: 1,
                    title: "ME GUSTAS",
                    artist: "Grupo Frontera",
                    file: "data:audio/mp3;base64,JSSTART

# Add the base64 content for first MP3
cat mp3_1.b64 >> standalone_complete.html

echo '",' >> standalone_complete.html
echo '                    duration: 197' >> standalone_complete.html
echo '                },' >> standalone_complete.html
echo '                {' >> standalone_complete.html
echo '                    id: 2,' >> standalone_complete.html
echo '                    title: "Así fue",' >> standalone_complete.html
echo '                    artist: "Juan Gabriel",' >> standalone_complete.html
echo '                    file: "data:audio/mp3;base64,' >> standalone_complete.html

# Add the base64 content for second MP3
cat mp3_2.b64 >> standalone_complete.html

echo '",' >> standalone_complete.html
echo '                    duration: 225' >> standalone_complete.html
echo '                },' >> standalone_complete.html
echo '                {' >> standalone_complete.html
echo '                    id: 3,' >> standalone_complete.html
echo '                    title: "Terrenal",' >> standalone_complete.html
echo '                    artist: "Julión Álvarez Y Su Norteño Banda",' >> standalone_complete.html
echo '                    file: "data:audio/mp3;base64,' >> standalone_complete.html

# Add the base64 content for third MP3
cat mp3_3.b64 >> standalone_complete.html

echo '",' >> standalone_complete.html
echo '                    duration: 268' >> standalone_complete.html
echo '                },' >> standalone_complete.html
echo '                {' >> standalone_complete.html
echo '                    id: 4,' >> standalone_complete.html
echo '                    title: "Te Hubieras Ido Antes",' >> standalone_complete.html
echo '                    artist: "Artista",' >> standalone_complete.html
echo '                    file: "data:audio/mp3;base64,' >> standalone_complete.html

# Add the base64 content for fourth MP3
cat mp3_4.b64 >> standalone_complete.html

echo '",' >> standalone_complete.html
echo '                    duration: 189' >> standalone_complete.html
echo '                }' >> standalone_complete.html
echo '            ];' >> standalone_complete.html

# Add the rest of the JavaScript from script.js (without the loadSongs function)
echo '            this.renderAllSongs();' >> standalone_complete.html
echo '            this.renderHomeAllSongs();' >> standalone_complete.html
echo '            this.renderLikedSongs();' >> standalone_complete.html
echo '            this.renderRecentSongs();' >> standalone_complete.html
echo '        }' >> standalone_complete.html

# Add the rest of the methods from the original script
sed -n '/initializeElements/,$ p' script.js | sed '1d' >> standalone_complete.html

# Close the script and HTML
cat >> standalone_complete.html << 'HTMLEND'
    
    // Initialize the music player when page loads
    let musicPlayer;
    document.addEventListener('DOMContentLoaded', () => {
        musicPlayer = new MusicPlayer();
    });
    </script>
</body>
</html>
HTMLEND

echo "Standalone file created: standalone_complete.html"
ls -lah standalone_complete.html

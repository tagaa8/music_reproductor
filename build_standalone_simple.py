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
    
    # Read files
    css_content = read_file('styles.css')
    js_content = read_file('script.js')
    html_content = read_file('index.html')
    
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
    
    # Prepare the songs JavaScript array
    songs_js = "[\n"
    for i, mp3 in enumerate(mp3_data):
        songs_js += f'''        {{
            id: {mp3['id']},
            title: "{mp3['title']}",
            artist: "{mp3['artist']}",
            file: "data:audio/mp3;base64,{mp3['b64']}",
            duration: {mp3['duration']}
        }}'''
        if i < len(mp3_data) - 1:
            songs_js += ","
        songs_js += "\n"
    songs_js += "    ]"
    
    # Replace the loadSongs method in JavaScript
    js_content_modified = js_content.replace(
        '''async loadSongs() {
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

        this.renderAllSongs();
        this.renderHomeAllSongs();
        this.renderLikedSongs();
        this.renderRecentSongs();
    }''',
        f'''loadSongs() {{
        console.log('🎵 DEBUG: loadSongs called with embedded songs');
        this.songs = {songs_js};
        console.log('🎵 DEBUG: Loaded', this.songs.length, 'embedded songs');
        console.log('🎵 DEBUG: First song:', this.songs[0] ? this.songs[0].title : 'None');
        
        this.renderAllSongs();
        this.renderHomeAllSongs();
        this.renderLikedSongs();
        this.renderRecentSongs();
    }}'''
    )
    
    # Get body content from HTML
    body_start = html_content.find('<body>')
    body_end = html_content.find('</html>') + 7
    body_content = html_content[body_start:body_end].replace('<script src="script.js"></script>', f'<script>\n{js_content_modified}\n</script>')
    
    # Create complete HTML
    complete_html = f'''<!DOCTYPE html>
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
{body_content}'''
    
    # Write the final file
    with open('standalone_complete.html', 'w', encoding='utf-8') as f:
        f.write(complete_html)
    
    file_size = os.path.getsize('standalone_complete.html')
    print(f"Standalone file created: standalone_complete.html")
    print(f"File size: {file_size / (1024*1024):.1f} MB")

if __name__ == "__main__":
    main()
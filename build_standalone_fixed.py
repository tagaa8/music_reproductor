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
    
    # Read HTML structure
    html_content = read_file('index.html')
    
    # Replace script.js reference with embedded script
    js_modified = js_content.replace(
        'async loadSongs() {',
        '''loadSongs() {
            console.log('🎵 DEBUG: loadSongs called with embedded songs');
            // Songs are embedded in base64 format
            this.songs = ['''
    )
    
    # Add the songs data
    for i, mp3 in enumerate(mp3_data):
        js_modified += f'''
                {{
                    id: {mp3['id']},
                    title: "{mp3['title']}",
                    artist: "{mp3['artist']}",
                    file: "data:audio/mp3;base64,{mp3['b64']}",
                    duration: {mp3['duration']}
                }}{',' if i < len(mp3_data) - 1 else ''}'''
    
    # Close the songs array and continue with the rest of loadSongs
    js_modified += '''
            ];
            console.log('🎵 DEBUG: Loaded', this.songs.length, 'embedded songs');
            console.log('🎵 DEBUG: First song:', this.songs[0] ? this.songs[0].title : 'None');
            
            this.renderAllSongs();
            this.renderHomeAllSongs();
            this.renderLikedSongs();
            this.renderRecentSongs();
        }'''
    
    # Find and replace the rest of the loadSongs method
    import re
    # Remove the original loadSongs method completely
    js_modified = re.sub(
        r'async loadSongs\(\) \{.*?\n    \}',
        js_modified.split('loadSongs() {')[1].split('}')[0] + '}',
        js_content,
        flags=re.DOTALL
    )
    
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
{html_content.split('<head>')[1].split('</head>')[1]}

    <script>
        // Embedded songs data
        const EMBEDDED_SONGS = ['''
    
    # Add songs data to the HTML
    for i, mp3 in enumerate(mp3_data):
        complete_html += f'''
            {{
                id: {mp3['id']},
                title: "{mp3['title']}",
                artist: "{mp3['artist']}",
                file: "data:audio/mp3;base64,{mp3['b64']}",
                duration: {mp3['duration']}
            }}{',' if i < len(mp3_data) - 1 else ''}'''
    
    complete_html += '''
        ];

        // Replace the loadSongs method in the original script
        ''' + js_content.replace(
            js_content[js_content.find('async loadSongs()'):js_content.find('    }', js_content.find('async loadSongs()')) + 5],
            '''loadSongs() {
            console.log('🎵 DEBUG: loadSongs called with embedded songs');
            this.songs = EMBEDDED_SONGS || [];
            console.log('🎵 DEBUG: Loaded', this.songs.length, 'embedded songs');
            console.log('🎵 DEBUG: First song:', this.songs[0] ? this.songs[0].title : 'None');
            
            this.renderAllSongs();
            this.renderHomeAllSongs();
            this.renderLikedSongs();
            this.renderRecentSongs();
        }'''
        ) + '''
    </script>
</body>
</html>'''
    
    # Write the final file
    with open('standalone_complete.html', 'w', encoding='utf-8') as f:
        f.write(complete_html)
    
    file_size = os.path.getsize('standalone_complete.html')
    print(f"Standalone file created: standalone_complete.html")
    print(f"File size: {file_size / (1024*1024):.1f} MB")

if __name__ == "__main__":
    main()
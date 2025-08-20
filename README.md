# Rolitas Pal Héctor - Reproductor Musical Web

Un reproductor de música web tipo Spotify con diseño responsivo y funcionalidades avanzadas.

## Características

- 🎵 Reproductor de música completo con controles de reproducción
- ❤️ Sistema de canciones favoritas (Me Gusta)
- 📱 Diseño totalmente responsivo para móviles y escritorio
- 🎨 Interfaz moderna con efectos visuales animados
- 📋 Creación y gestión de playlists personalizadas
- 🔄 Modos de repetición y reproducción aleatoria
- 🎯 Media Session API para controles del sistema
- 💾 Almacenamiento local de preferencias y playlists
- 🌐 Progressive Web App (PWA) - instalable como aplicación

## Tecnologías Utilizadas

- **HTML5** - Estructura y elementos multimedia
- **CSS3** - Estilos, animaciones y diseño responsivo
- **JavaScript Vanilla** - Lógica del reproductor sin frameworks
- **Media Session API** - Integración con controles del sistema
- **Service Worker** - Funcionalidad offline y PWA
- **LocalStorage** - Persistencia de datos del usuario

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Archivos MP3 de tu música

## Instalación y Uso

### Opción 1: Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/music_reproductor.git

# Entrar al directorio
cd music_reproductor
```

### Opción 2: Descargar ZIP

1. Descarga el repositorio como ZIP
2. Descomprime en una carpeta local

## Configuración de Música

### Agregar tus canciones MP3

1. Coloca tus archivos MP3 en la carpeta raíz del proyecto
2. Edita el archivo `script.js` en la sección `loadSongs()` para agregar tus canciones:

```javascript
this.songs = [
    {
        id: 1,
        title: "Título de la canción",
        artist: "Nombre del artista", 
        file: "nombre-del-archivo.mp3",
        duration: 240 // duración en segundos
    },
    // Agrega más canciones aquí
];
```

## Ejecutar la Aplicación

### ⭐ Método 1: Archivo Único Standalone (RECOMENDADO)

**El modo más fácil - Un solo archivo que funciona en cualquier móvil:**

1. **Descarga solo el archivo `standalone_complete.html`** del repositorio (48MB)
2. **Transfiere este único archivo a tu teléfono** (por USB, email, Drive, etc.)
3. **Abre el archivo con cualquier navegador:**
   - **Android:** Chrome, Firefox, Samsung Internet, etc.
   - **iOS:** Safari, Chrome, Firefox, etc.
4. **¡Funciona inmediatamente!** - Todo está incluido en un solo archivo

**Ventajas del archivo standalone:**
- ✅ **Un solo archivo** - fácil de transferir y usar
- ✅ **Funciona en CUALQUIER navegador móvil** (Safari, Chrome, Firefox, etc.)
- ✅ **No necesita servidor web ni instalación**
- ✅ **Incluye toda la música y funcionalidad**
- ✅ **Solo abres el archivo y funciona todo perfectamente**

### Método 2: Proyecto completo (Para desarrolladores)

**Para Android:**
1. Descarga el repositorio como ZIP o clónalo en tu computadora
2. Transfiere toda la carpeta del proyecto a tu teléfono (en Descargas o cualquier carpeta)
3. Instala un navegador que soporte archivos locales como:
   - **Kiwi Browser** (recomendado) - disponible en Play Store
   - **Firefox** - también funciona bien con archivos locales
4. Abre el navegador en tu teléfono
5. Navega a la carpeta donde guardaste el proyecto
6. Toca el archivo `index.html` para abrirlo
7. ¡La aplicación debería cargar completamente con CSS y JavaScript!

**Para iOS:**
1. Descarga el repositorio y transfiérelo a tu iPhone/iPad
2. Usa la app **Documents by Readdle** (gratis en App Store)
3. Importa la carpeta del proyecto a Documents
4. Navega hasta el archivo `index.html` dentro de Documents
5. Toca el archivo para abrirlo en el navegador interno de Documents

**Nota importante:** El Service Worker (funcionalidad offline) no funcionará con archivos locales, pero todas las demás funciones sí funcionan perfectamente, incluyendo:
- Reproducción de música
- Playlists y favoritos
- Todas las animaciones y efectos visuales
- Controles de reproducción
- Búsqueda y navegación

### Método 3: Con Servidor Web (Funcionalidad completa + PWA)

### En Windows

1. Abre el archivo `index.html` directamente en tu navegador
2. O usa un servidor local:
```bash
# Si tienes Python instalado
python -m http.server 8000
# Luego abre http://localhost:8000
```

### En macOS

1. Abre Terminal en la carpeta del proyecto
2. Ejecuta:
```bash
# Con Python 3
python3 -m http.server 8000

# O con PHP
php -S localhost:8000

# O con Node.js (si tienes http-server instalado)
npx http-server
```
3. Abre `http://localhost:8000` en tu navegador

### En Linux

```bash
# Con Python
python3 -m http.server 8000

# Con PHP
php -S localhost:8000

# Con Node.js
npx http-server
```

### Acceso desde móvil a servidor en PC

1. Asegúrate de que tu computadora y móvil estén en la misma red WiFi
2. Encuentra tu IP local:
   - Windows: `ipconfig` 
   - Mac/Linux: `ifconfig` o `ip addr`
3. Inicia el servidor en tu computadora
4. En tu móvil, navega a `http://[TU-IP-LOCAL]:8000`

## Instalación como App (PWA)

### En Android
1. Abre el sitio en Chrome
2. Toca el menú (3 puntos)
3. Selecciona "Agregar a pantalla de inicio"

### En iOS
1. Abre el sitio en Safari
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"

### En Desktop
1. En Chrome/Edge, busca el ícono de instalación en la barra de direcciones
2. Click en "Instalar"

## Uso de la Aplicación

### Controles Principales
- **Play/Pausa** - Reproducir o pausar la canción actual
- **Siguiente/Anterior** - Navegar entre canciones
- **Barra de progreso** - Saltar a cualquier parte de la canción
- **Control de volumen** - Ajustar el volumen
- **Shuffle** - Reproducción aleatoria
- **Repeat** - Repetir canción o playlist

### Funciones
- **Me Gusta** - Click en el corazón para marcar favoritos
- **Playlists** - Crear y gestionar listas de reproducción personalizadas
- **Cola de reproducción** - Ver y gestionar las próximas canciones
- **Búsqueda** - Buscar canciones por título o artista
- **Menú contextual** - Click derecho o botón de 3 puntos para más opciones

## Atajos de Teclado

- `Espacio` - Play/Pausa
- `→` - Siguiente canción
- `←` - Canción anterior
- `↑` - Subir volumen
- `↓` - Bajar volumen

## Solución de Problemas

### Las canciones no se reproducen
- Verifica que los archivos MP3 estén en la carpeta correcta
- Confirma que los nombres de archivo en `script.js` coincidan exactamente
- Revisa la consola del navegador (F12) para errores

### El CSS no carga en móvil (archivos locales)
- **Solución recomendada:** Usa **Kiwi Browser** en Android - es el que mejor maneja archivos locales
- **Firefox móvil** también funciona bien
- **Chrome móvil** a veces bloquea archivos locales por seguridad
- Asegúrate de que TODA la carpeta del proyecto esté en tu teléfono, no solo el index.html

### No funciona en móvil
- Algunos navegadores móviles requieren interacción del usuario para reproducir audio
- Asegúrate de tocar play manualmente la primera vez
- Si usas iOS, usa **Documents by Readdle** para mejor compatibilidad

### Service Worker no funciona con file://
- El Service Worker requiere HTTPS o localhost
- Usa un servidor local en lugar de abrir el archivo directamente
- **Para archivos locales:** Las demás funciones funcionan perfectamente sin Service Worker

### Problemas específicos en iOS
- Safari móvil puede tener restricciones con archivos locales
- Usa **Documents by Readdle** para mejor experiencia
- Algunos archivos MP3 pueden necesitar formato específico para iOS

## Estructura del Proyecto

```
music_reproductor/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos y animaciones
├── script.js           # Lógica del reproductor
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker para offline
├── README.md          # Este archivo
└── *.mp3              # Tus archivos de música
```

## Notas Importantes

- Los archivos MP3 deben estar en formato compatible con navegadores web
- El proyecto usa almacenamiento local del navegador para guardar preferencias
- La aplicación funciona completamente offline una vez cargada
- No se requiere instalación de dependencias ni compilación

## Licencia

Proyecto de código abierto para uso personal y educativo.
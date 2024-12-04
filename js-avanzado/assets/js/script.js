document.addEventListener('DOMContentLoaded', function () {
    const miApiAlbums = 'https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts?_embed&categories=3&per_page=20'; // API para álbumes
    const miApiArtists = 'https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts?_embed&categories=2&per_page=20'; // API para artistas

    // Variables para los botones
    const mostrarAlbumBoton = document.getElementById('mostrar-albumes');
    const mostrarArtistaBoton = document.getElementById('mostrar-artistas');
    const contenedorTodo = document.getElementById('contenedor-todo');

    // ====================================
    // SECCIÓN 1: Cargar los álbumes
    // ====================================
    function loadAlbums() {
        fetch(miApiAlbums)
            .then(response => response.json())
            .then(posts => {
                contenedorTodo.innerHTML = ''; // Limpiar contenedor
                posts.forEach(post => {
                    const titulo = post.title.rendered;
                    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
                    const imagenUrl = featuredMedia ? featuredMedia.source_url : '';
                    const albumDiv = document.createElement('div');

                    albumDiv.classList.add('col-md-2', 'p-0', 'mx-3');
                    albumDiv.innerHTML = `
                        <a href="#" class="album-link" data-bs-toggle="offcanvas" data-bs-target="#albumOffcanvas" data-id="${post.id}">
                            <img src="${imagenUrl}" alt="${titulo}" class="img-fluid" style="border-radius: 10px;"/>
                            <h4>${titulo}</h4>
                        </a>
                    `;
                    contenedorTodo.appendChild(albumDiv);

                    // Asignar evento para abrir el offcanvas del álbum
                    albumDiv.querySelector('.album-link').addEventListener('click', handleAlbumClick);
                });
            })
            .catch(error => console.error('Error al obtener los álbumes:', error));
    }

    // ====================================
    // SECCIÓN 2: Cargar los artistas
    // ====================================
    function loadArtists() {
        fetch(miApiArtists)
            .then(response => response.json())
            .then(posts => {
                contenedorTodo.innerHTML = ''; // Limpiar contenedor
                posts.forEach(post => {
                    const nombreArtista = post.title.rendered;
                    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
                    const imagenUrl = featuredMedia ? featuredMedia.source_url : '';
                    const artistDiv = document.createElement('div');
                    artistDiv.classList.add('col-md-2', 'p-0', 'mx-3');
                    artistDiv.innerHTML = `
                        <a href="#" class="artist-link" data-bs-toggle="offcanvas" data-bs-target="#artistOffcanvas" data-id="${post.id}">
                            <img src="${imagenUrl}" alt="${nombreArtista}" class="img-fluid" style="border-radius: 10px;"/>
                            <h4>${nombreArtista}</h4>
                        </a>
                    `;
                    contenedorTodo.appendChild(artistDiv);

                    // Asignar evento para abrir el offcanvas del artista
                    artistDiv.querySelector('.artist-link').addEventListener('click', function (e) {
                        handleArtistClick.call(this, e);
                    });
                });
            })
            .catch(error => console.error('Error al obtener los artistas:', error));
    }

    // ====================================
    // SECCIÓN 3: Cargar álbumes en el carrusel
    // ====================================
    function loadCarouselAlbums() {
        fetch(miApiAlbums)
            .then(response => response.json())
            .then(posts => {
                // Se deben mostrar los álbumes específicos en el carrusel (por ejemplo, álbum-6, álbum-7, etc.)
                for (let i = 6; i <= 10; i++) {
                    const album = posts[i - 1]; // Obtener álbum correspondiente (album-6, album-7, ...)
                    if (album) {
                        const titulo = album.title.rendered;
                        const featuredMedia = album._embedded?.['wp:featuredmedia']?.[0];
                        const imagenUrl = featuredMedia ? featuredMedia.source_url : '';
                        const albumDiv = document.getElementById(`album-${i}`);

                        albumDiv.innerHTML = `
                            <a href="#" class="album-link" data-bs-toggle="offcanvas" data-bs-target="#albumOffcanvas" data-id="${album.id}">
                                <img src="${imagenUrl}" alt="${titulo}" class="img-fluid" style="border-radius: 10px;"/>
                                <h4>${titulo}</h4>
                            </a>
                        `;

                        // Asignar evento para abrir el offcanvas del álbum
                        albumDiv.querySelector('.album-link').addEventListener('click', handleAlbumClick);
                    }
                }
            })
            .catch(error => console.error('Error al obtener los álbumes para el carrusel:', error));
    }

    // ====================================
    // SECCIÓN 4: Manejar clic en los álbumes (Offcanvas Álbum)
    // ====================================
    function handleAlbumClick(e) {
        e.preventDefault();
        const albumId = this.getAttribute('data-id');
    
        fetch(`https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts/${albumId}?_embed`)
            .then(response => response.json())
            .then(album => {
                const tituloAlbum = album.title.rendered;
                const descripcionAlbum = album.acf.texto_album || 'Sin descripción disponible';
                const listaCanciones = album.acf.lista_de_canciones ? album.acf.lista_de_canciones.split('|') : [];
                const imagenAlbum = album._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
                const artistaId = album.acf['artista-selecto'];
    
                
                document.getElementById('album-title').innerHTML = tituloAlbum;
                document.getElementById('album-description').innerHTML = descripcionAlbum;
                document.getElementById('album-image').src = imagenAlbum;
    
                const songsList = document.getElementById('album-songs');
                songsList.innerHTML = listaCanciones.length
                    ? listaCanciones.map(song => `<li>${song.trim()}</li>`).join('')
                    : '<li>No disponible</li>';
    
                
                if (artistaId) {
                    fetch(`https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts/${artistaId}?_embed`)
                        .then(response => response.json())
                        .then(artista => {
                            const nombreArtista = artista.title.rendered;
                            const imagenArtista = artista._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    
                            
                            document.getElementById('artist-name-album').innerHTML = `
                                <a href="#" class="artist-link-album" data-id="${artistaId}">
                                    ${nombreArtista}
                                </a>
                            `;
                            document.getElementById('artist-image-album').src = imagenArtista;
    
                            
                            const artistLink = document.querySelector('.artist-link-album');
                            artistLink.addEventListener('click', handleArtistClickFromAlbum);
                        })
                        .catch(error => console.error('Error al cargar el artista:', error));
                } else {
                    
                    document.getElementById('artist-name-album').innerHTML = 'Artista no disponible';
                    document.getElementById('artist-image-album').src = '';
                }
    
                
                const offcanvas = new bootstrap.Offcanvas(document.getElementById('albumOffcanvas'));
                offcanvas.show();
            })
            .catch(error => console.error('Error al cargar el álbum:', error));
    }

    // ====================================
    // SECCIÓN 5: Manejar clic en los artistas (Offcanvas Artista) y edición de offcanvaa
    // ====================================
    function handleArtistClick() {
        
        const artistId = this.getAttribute('data-id');
    
        fetch(`https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts/${artistId}?_embed`)
            .then(response => response.json())
            .then(artista => {
                const tituloArtista = artista.title.rendered || 'Sin título';
                const bioArtista = artista.acf?.biografia_artista || 'Información no disponible';
                const imagenArtista = artista._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    
               
                const artistOffcanvasBody = `
                    <img id="artist-image" class="img-fluid mb-3" src="${imagenArtista}" alt="Imagen del artista" />
                    <h5 id="artist-title">${tituloArtista}</h5>
                    <p id="artist-bio">${bioArtista}</p>
                    <button id="edit-artist-btn" class="btn btn-warning">Editar</button>
                `;
                document.getElementById('artistOffcanvasBody').innerHTML = artistOffcanvasBody;
    
               
                document.getElementById('edit-artist-btn').addEventListener('click', function () {
                    enableArtistEditing(artistId, tituloArtista, bioArtista);
                });
    
                
                const offcanvas = new bootstrap.Offcanvas(document.getElementById('artistOffcanvas'));
                offcanvas.show();
            })
            .catch(error => console.error('Error al cargar el artista:', error));
    }

    function enableArtistEditing(artistId, currentTitle, currentBio) {
        const editForm = `
            <div>
                <label for="edit-artist-title" class="form-label">Título</label>
                <input type="text" id="edit-artist-title" class="form-control" value="${currentTitle}" />
            </div>
            <div class="mt-3">
                <label for="edit-artist-bio" class="form-label">Biografía</label>
                <textarea id="edit-artist-bio" class="form-control" rows="5">${currentBio}</textarea>
            </div>
            <div class="mt-3">
                <label for="edit-artist-image" class="form-label">Imagen destacada</label>
                <input type="file" id="edit-artist-image" class="form-control" />
            </div>
            <div class="mt-3">
                <button id="save-artist-btn" class="btn btn-success">Guardar</button>
                <button id="cancel-edit-artist-btn" class="btn btn-secondary">Cancelar</button>
            </div>
        `;
        document.getElementById('artistOffcanvasBody').innerHTML = editForm;
    
        
        document.getElementById('save-artist-btn').addEventListener('click', function () {
            const nuevoTitulo = document.getElementById('edit-artist-title').value;
            const nuevaBiografia = document.getElementById('edit-artist-bio').value;
            const nuevaImagen = document.getElementById('edit-artist-image').files[0];
    
            if (nuevaImagen) {
                
                subirImagen(nuevaImagen)
                    .then(mediaId => {
                        actualizarArtista(artistId, nuevoTitulo, nuevaBiografia, mediaId || null);

                    })
                    .catch(error => {
                        console.error('Error al subir la imagen:', error);
                        alert('No se pudo subir la imagen. Verifica el archivo e inténtalo nuevamente.');
                    });
            } else {
                
                actualizarArtista(artistId, nuevoTitulo, nuevaBiografia, null);
            }
        });
    
        document.getElementById('cancel-edit-artist-btn').addEventListener('click', function () {
            
            handleArtistClick.call({ getAttribute: () => artistId });
        });
    }

    async function actualizarArtista(artistId, nuevoTitulo, nuevaBiografia, mediaId) {
        const postData = {
            title: nuevoTitulo,
            acf: {
                biografia_artista: nuevaBiografia,
            },
        };
    
        if (mediaId) {
            postData.featured_media = mediaId;
        }
    
        try {
            const response = await fetch(`https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts/${artistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${btoa('admin:VLbp JTDe do60 dxtU cF6R ByHE')}`,
                },
                body: JSON.stringify(postData),
            });
    
            if (!response.ok) {
                throw new Error(`Error al actualizar el artista: ${response.statusText}`);
            }
    
            alert('Artista actualizado correctamente');
            handleArtistClick.call({ getAttribute: () => artistId }); // Recargar contenido actualizado
        } catch (error) {
            console.error('Error al actualizar el artista:', error);
            alert('Hubo un error al actualizar el artista.');
        }
    }
    async function subirImagen(imagen) {
        const formData = new FormData();
        formData.append('file', imagen);
        formData.append('title', imagen.name);
        formData.append('status', 'publish');
    
        try {
            const response = await fetch('https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/media', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${btoa('admin:VLbp JTDe do60 dxtU cF6R ByHE')}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`Error al subir la imagen: ${response.statusText}`);
            }
    
            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            throw error;
        }
    }
    
    
    

    // ====================================
    // SECCIÓN 6: Manejar clic en artistas desde el offcanvas del álbum para q se cierre y abra el otro
    // ====================================
    function handleArtistClickFromAlbum(e) {
        e.preventDefault();
        const artistId = this.getAttribute('data-id');
        
        
        const albumOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('albumOffcanvas'));
        if (albumOffcanvas) {
            albumOffcanvas.hide(); 
        }
        
      
        setTimeout(() => {
            
            handleArtistClick.call({ getAttribute: () => artistId }, e);
        }, 300); 
    }

    // ====================================
    // SECCIÓN 7: Alternar entre Álbumes y Artistas
    // ====================================
    mostrarAlbumBoton.addEventListener('click', function() {
        loadAlbums();
        mostrarAlbumBoton.classList.add('btn-primary');
        mostrarAlbumBoton.classList.remove('btn-secondary');
        mostrarArtistaBoton.classList.add('btn-secondary');
        mostrarArtistaBoton.classList.remove('btn-primary');
    });

    mostrarArtistaBoton.addEventListener('click', function() {
        loadArtists();
        mostrarAlbumBoton.classList.add('btn-secondary');
        mostrarAlbumBoton.classList.remove('btn-primary');
        mostrarArtistaBoton.classList.add('btn-primary');
        mostrarArtistaBoton.classList.remove('btn-secondary');
    });

    
    loadAlbums();
    loadCarouselAlbums();
});


// ====================================
// SECCIÓN PARA CRUD - Se cargan los albumes en la tabla
// ====================================
// ====================================

document.addEventListener('DOMContentLoaded', function () {
    const miApiAlbums = 'https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts?_embed&categories=3&per_page=30';
    const miApiArtistas = 'https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts?_embed&categories=2&per_page=30';
    const tablaAlbumes = document.getElementById('tabla-albumes');
    const tablaPlaylist = document.getElementById('tabla-playlist');

    // ====================================
    // SECCIÓN PARA CRUD - Se cargan los albumes en la tabla
    // ====================================
    // ====================================
    function cargarAlbumes() {
        fetch(miApiAlbums)
            .then(response => response.json())
            .then(posts => {
                tablaAlbumes.innerHTML = ''; // Limpiar tabla

                posts.forEach((post, index) => {
                    const titulo = post.title.rendered;
                    const artistaId = post.acf['artista-selecto'];
                    const spotifyLink = post.acf.link_spotify || 'No disponible';
                    const canciones = [
                        post.acf.cancion1,
                        post.acf.cancion2,
                        post.acf.cancion3,
                        post.acf.cancion4,
                        post.acf.cancion5,
                    ].filter(Boolean);
                    const imagenUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>
                            <div class="accordion acordeonclase me-2" id="acordeon-${index}">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="heading-${index}">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="false" aria-controls="collapse-${index}">
                                            ${titulo}
                                        </button>
                                    </h2>
                                    <div id="collapse-${index}" class="accordion-collapse collapse" aria-labelledby="heading-${index}" data-bs-parent="#acordeon-${index}">
                                        <div class="accordion-body">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <h5>Canciones:</h5>
                                                    <ul id="lista-canciones-${index}">
                                                        ${
                                                            canciones.length
                                                                ? canciones.map(cancion => `<li>${cancion}</li>`).join('')
                                                                : '<li>No hay canciones disponibles</li>'
                                                        }
                                                    </ul>
                                                </div>
                                                <div class="col-md-3">
                                                <img src="${imagenUrl}" alt="${titulo}" class="img-fluid mb-3" style="border-radius: 10px;">
                                                    
                                                </div>
                                                
                                        
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td data-artista-id="${artistaId}">Cargando artista...</td>
                        <td>
                            <button class="btn btn-warning btn-sm editar-album" data-index="${index}" data-id="${post.id}">Editar</button>
                            <button class="btn btn-danger btn-sm eliminar-album" data-id="${post.id}">Eliminar</button>
                            <button class="btn btn-primary btn-sm crear-playlist" 
                                data-id="${post.id}" 
                                data-title="${titulo}" 
                                data-link="${spotifyLink}">
                                Añadir a playlist
                            </button>
                        </td>
                    `;
                    tablaAlbumes.appendChild(fila);

                    if (artistaId) {
                        fetch(`https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts/${artistaId}`)
                            .then(response => response.json())
                            .then(artistaData => {
                                fila.querySelector('[data-artista-id]').innerText = artistaData.title.rendered;
                            })
                            .catch(error => console.error('Error al cargar el artista:', error));
                    } else {
                        fila.querySelector('[data-artista-id]').innerText = 'Artista desconocido';
                    }
                });

                configurarEventosBotones();
            })
            .catch(error => console.error('Error al obtener los álbumes:', error));
    }

    // ====================================
    // SECCIÓN PARA CRUD - Eventos en los botones
    // ====================================
    // ====================================
    function configurarEventosBotones() {
        document.querySelectorAll('.editar-album').forEach(boton => {
            boton.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                const postId = this.getAttribute('data-id');
                const fila = this.closest('tr');
                const titulo = fila.querySelector('.accordion-button').innerText;
                const canciones = Array.from(fila.querySelector(`#lista-canciones-${index}`).children).map(li => li.innerText);
                const artistaId = fila.querySelector('[data-artista-id]').dataset.artistaId;
                const linkSpotify = fila.querySelector('.crear-playlist').getAttribute('data-link');

                mostrarFormularioEdicion(fila, postId, titulo, canciones, index, artistaId, linkSpotify);
            });
        });
        

        document.querySelectorAll('.crear-playlist').forEach(boton => {
            boton.addEventListener('click', function () {
                const titulo = this.getAttribute('data-title');
                const linkSpotify = this.getAttribute('data-link');

                crearFilaPlaylist(titulo, linkSpotify);
                mostrarOffcanvasPlaylist();
            });
        });

        document.querySelectorAll('.eliminar-album').forEach(boton => {
            boton.addEventListener('click', function () {
                const postId = this.getAttribute('data-id');
                const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar el album?');
                if (confirmacion) {
                    eliminarAlbum(postId);
                }
            });
        });
    }

     // ====================================
    // SECCIÓN PARA CRUD - Creacion de la playlist
    // ====================================
    // ====================================

    function mostrarOffcanvasPlaylist() {
        const offcanvas = new bootstrap.Offcanvas(document.getElementById('playlistOffcanvas'));
        offcanvas.show();
    }

    function crearFilaPlaylist(titulo, linkSpotify) {
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
            <td>${titulo}</td>
            <td><a href="${linkSpotify}" target="_blank">Escuchar en Spotify</a></td>
            <td>
            <button class="btn btn-danger btn-sm eliminar-playlist">Eliminar</button>
            </td>
        `;
        
            nuevaFila.querySelector('.eliminar-playlist').addEventListener('click', function () {
                nuevaFila.remove(); // Eliminar la fila del DOM
            });

        tablaPlaylist.appendChild(nuevaFila);

        
    } cargarAlbumes();

    // ====================================
    // SECCIÓN PARA CRUD - DELETE para eliminar album
    // ====================================
    // ====================================



        async function eliminarAlbum(postId) {
            try {
                const response = await fetch(`https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Basic ${btoa('admin:VLbp JTDe do60 dxtU cF6R ByHE')}`,
                    },
                });
        
                if (!response.ok) {
                    throw new Error(`Error al eliminar el album: ${response.statusText}`);
                }
        
                alert('Álbum eliminado correctamente');
                cargarAlbumes();
            } catch (error) {
                console.error('Error al eliminar el album:', error);
                alert('Hubo un error al eliminar el álbum');
            }
        }        

        document.querySelectorAll('.eliminar-album').forEach(boton => {
            boton.addEventListener('click', function () {
                const postId = this.getAttribute('data-id');
                const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar el album?');
        
                if (confirmacion) {
                    eliminarAlbum(postId);
                }
            });
        });
        
    // ====================================
    // SECCIÓN PARA CRUD - Edicion de la tabla 
    // ====================================
    // ====================================

    function mostrarFormularioEdicion(fila, postId, titulo, canciones, index, artistaId, linkSpotify) {
        const acordeon = fila.querySelector(`#collapse-${index} .accordion-body`);
        acordeon.innerHTML = `
            <form id="form-editar-${postId}" class="form-edicion">
                <div class="mb-3">
                    <label for="nuevo-titulo-${postId}" class="form-label">Título</label>
                    <input type="text" id="nuevo-titulo-${postId}" class="form-control" value="${titulo}" style="color: white;>
                </div>
                <div class="mb-3">
                    <label for="nuevas-canciones-${postId}" class="form-label">Canciones (separadas por comas)</label>
                    <textarea id="nuevas-canciones-${postId}" style="color: white;" class="form-control">${canciones.join(', ')}</textarea>
                </div>
                <div class="mb-3">
                    <label for="artista-selecto-${postId}" class="form-label">Artista</label>
                    <select id="artista-selecto-${postId}" class="form-select">
                        <option value="">Ninguno</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="link-spotify-${postId}" class="form-label">Link de Spotify</label>
                    <input type="text" id="link-spotify-${postId}" class="form-control" value="${linkSpotify}" style="color: white;>
                </div>
                <div class="mb-3">
                    <label for="imagen-destacada-${postId}" class="form-label">Imagen destacada</label>
                    <input type="file" id="imagen-destacada-${postId}" class="form-control">
                </div>
                <button type="submit" class="btn btn-success btn-sm">Guardar</button>
                <button type="button" class="btn btn-secondary btn-sm cancelar-edicion">Cancelar</button>
            </form>
        `;

        
        fetch(miApiArtistas)
            .then(response => response.json())
            .then(artistas => {
                const selectArtista = acordeon.querySelector(`#artista-selecto-${postId}`);
                artistas.forEach(artista => {
                    const option = document.createElement('option');
                    option.value = artista.id;
                    option.textContent = artista.title.rendered;
                    if (artista.id == artistaId) {
                        option.selected = true;
                    }
                    selectArtista.appendChild(option);
                });
            })
            .catch(error => console.error('Error al obtener artistas:', error));

            acordeon.querySelector('.form-edicion').addEventListener('submit', function (e) {
            e.preventDefault();
            const nuevoTitulo = document.getElementById(`nuevo-titulo-${postId}`).value;
            const nuevasCanciones = document.getElementById(`nuevas-canciones-${postId}`).value.split(',').map(c => c.trim());
            const nuevoArtistaId = document.getElementById(`artista-selecto-${postId}`).value;
            const imagenInput = document.getElementById(`imagen-destacada-${postId}`);
            const nuevoLinkSpotify = document.getElementById(`link-spotify-${postId}`).value;

            

            if (imagenInput.files.length > 0) {
                subirImagen(imagenInput.files[0])
                    .then(mediaId => {
                        actualizarAlbum(postId, nuevoTitulo, nuevasCanciones, nuevoArtistaId, mediaId || null, nuevoLinkSpotify);

                    })
                    .catch(error => {
                        console.error('Error al subir imagen:', error);
                        alert('Hubo un error al subir la imagen.');
                    });
            } else {
                actualizarAlbum(postId, nuevoTitulo, nuevasCanciones, nuevoArtistaId, mediaId, nuevoLinkSpotify);
            }
        });

        acordeon.querySelector('.cancelar-edicion').addEventListener('click', function () {
            cargarAlbumes();
        });
    }

    // ====================================
    // SECCIÓN PARA CRUD - POST para subir la imagen
    // ====================================
    // ====================================

    async function subirImagen(imagen) {
        const formData = new FormData();
        formData.append('file', imagen);
        formData.append('title', imagen.name);
        formData.append('status', 'publish');

        const response = await fetch('https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/media', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${btoa('admin:VLbp JTDe do60 dxtU cF6R ByHE')}`,
            },
            body: formData,
        });

        if (!response.ok) throw new Error(`Error al subir la imagen: ${response.statusText}`);
        const data = await response.json();
        return data.id; 
    }

    // ====================================
    // SECCIÓN PARA CRUD PUT PARA ACTUALIZAR LA TABLA
    // ====================================
    // ====================================

    async function actualizarAlbum(postId, nuevoTitulo, nuevasCanciones, nuevoArtistaId, mediaId = null, nuevoLinkSpotify) {
        const postData = {
            title: nuevoTitulo,
            content: nuevasCanciones.join(', '), //posible borra
            acf: {
                cancion1: nuevasCanciones[0] || '',
                cancion2: nuevasCanciones[1] || '',
                cancion3: nuevasCanciones[2] || '',
                cancion4: nuevasCanciones[3] || '',
                cancion5: nuevasCanciones[4] || '',
                'artista-selecto': nuevoArtistaId || null,
                link_spotify: nuevoLinkSpotify || ''
            },
        };

        if (mediaId) {
            postData.featured_media = mediaId;
        }

        try {
            const response = await fetch(`https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${btoa('admin:VLbp JTDe do60 dxtU cF6R ByHE')}`,
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error(`Error al actualizar el álbum: ${response.statusText}`);
            }

            alert('Álbum actualizado correctamente');
            cargarAlbumes();
        } catch (error) {
            console.error('Error al actualizar el álbum:', error);
            alert('Hubo un error al actualizar el álbum.');
        }
    }

    // ====================================
    // SECCIÓN PARA CRUD PUT PARA ELIMINAR ALBUM
    // ====================================
    // ====================================
    async function eliminarAlbum(postId){
        try {
            const response = await fetch(`https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts/${postId}`,{
                method: 'DELETE',
                headers: {
                    Authorization: `Basic ${btoa('admin:VLbp JTDe do60 dxtU cF6R ByHE')}`,
                }
            });
            if (!response.ok){
                throw new Error(`Error al eliminar el album: ${response.statusText}`);
            }
            alert('Album eliminado correctamente');
            cargarAlbumes();
        } catch (error){
        console.error('Error al eliminar el album:',error);
        alert('Hubo un error al eliminar el album');
        }
    }

    cargarAlbumes();


// ====================================
    // SECCIÓN PARA CRUD FORMULARIO PARA CREACION DE ENTRADAS
    // ====================================
    // ====================================


    const form = document.getElementById('entry-form');
    const messageDiv = document.getElementById('message');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      
      const category = document.getElementById('category').value;
      const title = document.getElementById('title').value;
      const content = document.getElementById('content').value;

      const username = 'admin'; 
      const applicationPassword = 'VLbp JTDe do60 dxtU cF6R ByHE'; 
        
      const credentials = btoa(`${username}:${applicationPassword}`);
  
     
      let categoryId;
      if (category === 'artista') {
        categoryId = 2; 
      } else if (category === 'album') {
        categoryId = 3; 
      }
  
      // Crear el cuerpo del POST
      const postData = {
        title: title,
        content: content,
        categories: [categoryId],
        status: 'publish', 
      };
  
      try {
        // Enviar el POST
        const response = await fetch(
          'https://playlists.lifarias.laboratoriodiseno.cl/wordpress/wp-json/wp/v2/posts',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${credentials}`, 
            },
            body: JSON.stringify(postData),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Error al crear la entrada: ${response.status}`);
        }
  
        const result = await response.json();

        messageDiv.innerHTML = `<div class="alert alert-success">Entrada creada con éxito: <strong>${result.title.rendered}</strong></div>`;


        cargarAlbumes(); 
        form.reset();
      } catch (error) {
        console.error(error);
        messageDiv.innerHTML = `<div class="alert alert-danger">Error al crear la entrada: ${error.message}</div>`;
      }
    });
    
    
    
});
    
  
  
  

// ====================================
// SECCIÓN PARA EL PLUGIN
// ====================================
$num = $('.my-card').length;

$even = $num / 2;

$odd = ($num + 1) / 2;
if ($num % 2 == 0) {

  $('.my-card:nth-child(' + $even +')').addClass('active');

  $('.my-card:nth-child(' + $even +')').prev().addClass('prev');

  $('.my-card:nth-child(' + $even +')').next().addClass('next');

}else {

  $('.my-card:nth-child(' + $odd +')').addClass('active');

  $('.my-card:nth-child(' + $odd +')').prev().addClass('prev');

  $('.my-card:nth-child(' + $odd +')').next().addClass('next');

}

 

$('.my-card').click(function() {

  $slide = $('.active').width();

  console.log($('.active').position().left);

   

  if ($(this).hasClass('next')) {

    $('.card-carousel').stop(false,true).animate({left:'-=' + $slide});

  }else if ($(this).hasClass('prev')) {

    $('.card-carousel').stop(false,true).animate({left:'+=' + $slide});

  }

   

  $(this).removeClass('prev next');

  $(this).siblings().removeClass('prev active next');

   

  $(this).addClass('active');

  $(this).prev().addClass('prev');

  $(this).next().addClass('next');

});

 

 

// Keyboard nav

$('html body').keydown(function(e) {

  if (e.keyCode == 37) {// left

    $('.active').prev().trigger('click');

  }

  else if (e.keyCode == 39) {// right

    $('.active').next().trigger('click');

  }

});



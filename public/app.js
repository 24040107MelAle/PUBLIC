// ================= GEOLOCALIZACIÓN =================
function obtenerUbicacion() {
    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Mostrar coordenadas
        document.getElementById("ubicacion").innerHTML =
            `Lat: ${lat} <br> Lon: ${lon}`;

        // ================= MAPA =================
        const mapa = L.map('mapa').setView([lat, lon], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(mapa);

        L.marker([lat, lon]).addTo(mapa)
            .bindPopup("Estás aquí")
            .openPopup();

        // ================= DIRECCIÓN =================
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();

            document.getElementById("ubicacion").innerHTML += `
                <br><br> ${data.display_name}
            `;
        } catch {
            console.log("Error obteniendo dirección");
        }

    }, () => {
        document.getElementById("ubicacion").innerHTML =
            "No se pudo obtener la ubicación";
    });
}

// ================= REDES SOCIALES =================
function cargarPosts() {
    const loader = document.getElementById("loaderPosts");
    loader.classList.remove("hidden");

    fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=5')
        .then(res => res.json())
        .then(data => {
            loader.classList.add("hidden");

            let html = "";

            data.results.forEach(post => {
                html += `
                <div class="producto">
                    <img src="${post.image_url}" style="width:100%;">
                    <p><b>${post.title}</b></p>
                    <p>${post.summary.substring(0, 100)}...</p>
                    <a href="${post.url}" target="_blank">Ver más</a>
                </div>
                `;
            });

            document.getElementById("posts").innerHTML = html;
        })
        .catch(() => {
            loader.classList.add("hidden");
            document.getElementById("posts").innerHTML =
                "Error al cargar noticias";
        });

function darLike(id) {
    const span = document.getElementById(`like${id}`);
    let numero = parseInt(span.innerText);
    span.innerText = numero + 1;
}
}

// ================= E-COMMERCE =================
function buscarProducto() {
    const loader = document.getElementById("loaderProductos");
    loader.classList.remove("hidden");

    const texto = document.getElementById("producto").value;

    fetch(`https://dummyjson.com/products/search?q=${texto}`)
        .then(res => res.json())
        .then(data => {
            loader.classList.add("hidden");

            let html = "";

            if (!data.products || data.products.length === 0) {
                html = "No se encontraron productos";
            } else {
                data.products.forEach(p => {
                    html += `
                    <div class="producto">
                        <img src="${p.thumbnail}" style="width:100px;">
                        <p><b>${p.title}</b></p>
                        <p>💲 ${p.price}</p>
                        <p style="font-size:12px; color:gray;">${p.category}</p>
                    </div>
                    `;
                });
            }

            document.getElementById("productos").innerHTML = html;
        })
        .catch(() => {
            loader.classList.add("hidden");
            document.getElementById("productos").innerHTML =
                "Error al cargar productos";
        });
}
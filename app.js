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
// =======================
// 4. BASE DE DATOS (Firebase)
// =======================

// 🔥 CONFIGURACIÓN (REEMPLAZA CON LA TUYA REAL DE FIREBASE)
const firebaseConfig = {
    apiKey: "AQUI_TU_API_KEY",
    authDomain: "AQUI_TU_PROYECTO.firebaseapp.com",
    databaseURL: "https://AQUI_TU_PROYECTO-default-rtdb.firebaseio.com/",
    projectId: "AQUI_TU_PROYECTO",
    storageBucket: "AQUI_TU_PROYECTO.appspot.com",
    messagingSenderId: "AQUI_TU_ID",
    appId: "AQUI_TU_APP_ID"
};

// INICIALIZAR FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// =======================
// GUARDAR USUARIO
// =======================
function guardarUsuario() {
    let nombre = document.getElementById("nombreUsuario").value;
    let correo = document.getElementById("correoUsuario").value;
    let edad = document.getElementById("edadUsuario").value;

    if (nombre.trim() === "" || correo.trim() === "" || edad.trim() === "") {
        document.getElementById("estadoDB").innerText = "⚠️ Completa todos los campos";
        return;
    }

    db.ref("usuarios").push({
        nombre: nombre,
        correo: correo,
        edad: edad
    })
    .then(() => {
        document.getElementById("estadoDB").innerText = "✅ Usuario guardado";

        // limpiar campos
        document.getElementById("nombreUsuario").value = "";
        document.getElementById("correoUsuario").value = "";
        document.getElementById("edadUsuario").value = "";
    })
    .catch(() => {
        document.getElementById("estadoDB").innerText = "❌ Error al guardar";
    });
}

// =======================
// MOSTRAR USUARIOS
// =======================
function cargarUsuarios() {
    const contenedor = document.getElementById("estadoDB");

    contenedor.innerHTML = "⏳ Cargando...";

    db.ref("usuarios").once("value")
    .then((snapshot) => {
        contenedor.innerHTML = "";

        if (!snapshot.exists()) {
            contenedor.innerHTML = "📭 No hay usuarios";
            return;
        }

        snapshot.forEach((child) => {
            const data = child.val();

            contenedor.innerHTML += `
                <p>👤 ${data.nombre}</p>
            `;
        });
    })
    .catch(() => {
        contenedor.innerHTML = "❌ Error al cargar datos";
    });
}

// =======================
// 5. SMS (SIMULACIÓN)
// =======================

function enviarSMS() {
    let tel = document.getElementById("telefono").value;
    let msg = document.getElementById("mensaje").value;

    if (tel === "" || msg === "") {
        document.getElementById("estadoSMS").innerText = "Completa los campos ⚠️";
        return;
    }

    document.getElementById("estadoSMS").innerText =
        `Mensaje enviado a ${tel} 📩 (simulado)`;
}

// =======================
// 6. STREAMING
// =======================

function cambiarVideo() {
    const video = document.getElementById("video");

    // Cambia entre videos
    video.src = "https://www.youtube.com/embed/3JZ_D3ELwOQ";
}

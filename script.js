// ===================================
// Datos de productos para el catálogo
// ===================================
const productos = [
  { nombre: "1 mesero", precio: "Cada 20 Pers-Max", imagen: "imagenes/mesero1.jpg" },
  { nombre: "2 meseros", precio: "Cada 40 Pers-Max", imagen: "imagenes/mesero2.jpg" },
  { nombre: "3 meseros", precio: "Cada 60 Pers-Max", imagen: "imagenes/mesero3.jpg" },
  { nombre: "4 meseros", precio: "Cada 100 Pers-Max", imagen: "imagenes/mesero4.jpg" }
];

// ================================
// Mostrar productos en el catálogo
// ================================
const lista = document.getElementById("lista-productos");

productos.forEach(prod => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${prod.imagen}" alt="${prod.nombre}">
    <h3>${prod.nombre}</h3>
    <p>${prod.precio.toLocaleString()}</p>
    <a href="https://wa.me/573145007411?text=Hola,%20me%20interesa%20${encodeURIComponent(prod.nombre)}" target="_blank">
      <button>Pedir por WhatsApp</button>
    </a>
  `;
  lista.appendChild(card);
});

// ================================
// Sistema de navegación (cambia secciones)
// ================================
function mostrarSeccion(id) {
  // Ocultar todas las secciones
  document.querySelectorAll(".seccion").forEach(sec => {
    sec.classList.remove("activa");
  });
  // Mostrar la seleccionada
  document.getElementById(id).classList.add("activa");
}

// ================================
// Sistema de login básico
// ================================
const formLogin = document.getElementById("form-login");
const msgLogin = document.getElementById("msg-login");

formLogin.addEventListener("submit", e => {
  e.preventDefault();
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("password").value;

  // Usuario y contraseña "demo" (esto luego se conecta a base de datos)
  if (user === "admin" && pass === "1234") {
    msgLogin.textContent = "Acceso exitoso 🎉";
    mostrarSeccion("admin-panel");
  } else {
    msgLogin.textContent = "Credenciales incorrectas ❌";
  }
});

// ================================
// Cerrar sesión
// ================================
function cerrarSesion() {
  mostrarSeccion("inicio");
  msgLogin.textContent = "Sesión cerrada";
}
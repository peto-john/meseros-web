// ===================================
// Datos de productos para el catálogo
// ===================================
const productos = [
  { nombre: "1 mesero", precio: "Para 20 pers-max", imagen: "imagenes/mesero1.jpg" },
  { nombre: "2 meseros", precio: "Para 40 pers-max", imagen: "imagenes/mesero2.jpg" },
  { nombre: "3 meseros", precio: "Para 60 pers-max", imagen: "imagenes/mesero3.jpg" },
  { nombre: "4 meseros", precio: "Para 100 pers-max", imagen: "imagenes/mesero4.jpg" }
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
      
      <button>Solicitar por WhatsApp</button>

    </a>
  `;
  lista.appendChild(card);
});

// ================================
// Sistema de navegación (cambia secciones)
// ================================
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(sec => sec.classList.remove("activa"));
  document.getElementById(id).classList.add("activa");
  // Cerrar menú en móvil al hacer clic
  navMenu.classList.remove("activo");
}


// ===============================================
// Sistema de login básico (admin)
// ===============================================
let esAdmin = false;
const formLogin = document.getElementById("form-login");
const msgLogin = document.getElementById("msg-login");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = document.getElementById("usuario").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    msgLogin.textContent = "Acceso exitoso ✅";
    mostrarSeccion("admin-panel");
    esAdmin = true;
    renderReservas();
  } else {
    msgLogin.textContent = "Credenciales incorrectas ❌";
  }
});

function cerrarSesion() {
  mostrarSeccion("inicio");
  msgLogin.textContent = "Sesión cerrada 🚪";
  esAdmin = false;
  renderReservas();
}

// ===============================================
// 4. Menú hamburguesa (responsive)
// ===============================================
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("menu-principal");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("activo");
});

// ===============================================
// 5. Manejo de Reservas (Clientes)
// ===============================================
let reservas = [];
let reservaId = 1;

const formReserva = document.getElementById("form-reserva");
const listaReservas = document.getElementById("lista-reservas");

formReserva.addEventListener("submit", (e) => {
  e.preventDefault();

  const cliente = document.getElementById("cliente-nombre").value;
  const fecha = document.getElementById("fecha-evento").value;

  if (!cliente || !fecha) {
    alert("⚠️ Por favor completa todos los campos");
    return;
  }

  const confirmar = confirm(`¿Está seguro de reservar el día ${fecha}?`);
  if (confirmar) {
    const nuevaReserva = { id: reservaId++, cliente, fecha, meserosAsignados: [] };
    reservas.push(nuevaReserva);

    renderReservas();
    formReserva.reset();
    alert("✅ Reserva registrada con éxito.");
  }
});

function renderReservas() {
  listaReservas.innerHTML = "";

  reservas.forEach(reserva => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${reserva.fecha}</td>
      <td>${reserva.cliente}</td>
      <td>
        ${reserva.meserosAsignados.length > 0 
          ? reserva.meserosAsignados.map(m => `${m.nombre} (📞${m.telefono})`).join("<br>")
          : "Pendiente"}
      </td>
      <td>
        ${esAdmin 
          ? `<button class="btn-asignar" data-id="${reserva.id}">Asignar</button>` 
          : ""}
        <button class="btn-detalle" data-id="${reserva.id}">detalle</button>
      </td>
    `;
    listaReservas.appendChild(fila);
  });

  document.querySelectorAll(".btn-asignar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      abrirModalAsignar(id);
    });
  });

  document.querySelectorAll(".btn-detalle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      verDetalle(id);
    });
  });
}

// ===============================================
// 6. Manejo de Meseros (Admin)
// ===============================================
let meseros = [];
const formMesero = document.getElementById("form-mesero");
const listaMeseros = document.getElementById("lista-meseros");

formMesero.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("mesero-nombre").value;
  const telefono = document.getElementById("mesero-tel").value;

  if (!nombre || !telefono) {
    alert("⚠️ Completa los datos del mesero");
    return;
  }

  const nuevoMesero = { nombre, telefono, disponible: true };
  meseros.push(nuevoMesero);

  renderMeseros();
  formMesero.reset();
  alert("👨‍🍳 Mesero agregado.");
});

function renderMeseros() {
  listaMeseros.innerHTML = "";
  meseros.forEach(m => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${m.nombre}</td>
      <td>${m.telefono}</td>
      <td>${m.disponible ? "Disponible ✅" : "Ocupado ❌"}</td>
    `;
    listaMeseros.appendChild(fila);
  });
}

// ===============================================
// 7. Modal para asignar mesero
// ===============================================
const modal = document.getElementById("modal-asignar");
const selectMesero = document.getElementById("select-mesero");
const btnConfirmar = document.getElementById("btn-confirmar");
const btnCancelar = document.getElementById("btn-cancelar");

let reservaSeleccionada = null;

function abrirModalAsignar(reservaId) {
  reservaSeleccionada = reservas.find(r => r.id == reservaId);

  selectMesero.innerHTML = "";
  meseros.forEach((m, i) => {
    if (m.disponible) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${m.nombre} - 📞${m.telefono}`;
      selectMesero.appendChild(option);
    }
  });

  if (selectMesero.options.length === 0) {
    alert("⚠️ No hay meseros disponibles.");
    return;
  }

  modal.style.display = "flex";
}

btnConfirmar.addEventListener("click", () => {
  const index = selectMesero.value;
  const mesero = meseros[index];

  reservaSeleccionada.meserosAsignados.push(mesero);
  mesero.disponible = false;

  renderReservas();
  renderMeseros();
  modal.style.display = "none";
  alert(`✅ Mesero ${mesero.nombre} asignado a la reserva del ${reservaSeleccionada.fecha}.`);
});

btnCancelar.addEventListener("click", () => {
  modal.style.display = "none";
});

// ===============================================
// 8. Ver detalle de reserva (clientes)
// ===============================================
function verDetalle(reservaId) {
  const reserva = reservas.find(r => r.id == reservaId);

  if (reserva.meserosAsignados.length === 0) {
    alert("📌 Aún no se han asignado meseros a esta reserva.");
  } else {
    const detalle = reserva.meserosAsignados
      .map(m => `👨‍🍳 ${m.nombre} - 📞 ${m.telefono}`)
      .join("\n");
    alert(`Meseros asignados para el ${reserva.fecha}:\n\n${detalle}`);
  }
}

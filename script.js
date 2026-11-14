const formulario = document.querySelector("#formulario");
const tabla = document.querySelector("#tabla");
const mensaje = document.querySelector("#mensaje");
let estudiantes = JSON.parse(localStorage.getItem("estudiantes") || "[]");

function mostrar() {
  tabla.replaceChildren();

  estudiantes.forEach((estudiante, indice) => {
    const fila = tabla.insertRow();

    // textContent muestra los datos como texto, sin ejecutar HTML.
    estudiante.forEach(dato => {
      fila.insertCell().textContent = dato;
    });

    const boton = document.createElement("button");
    boton.textContent = "Eliminar";
    boton.onclick = () => {
      estudiantes.splice(indice, 1);
      guardar();
    };
    fila.insertCell().append(boton);
  });
}

function guardar() {
  localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
  mostrar();
}

formulario.onsubmit = evento => {
  evento.preventDefault();
  const datos = ["cuenta", "nombre", "carrera"].map(
    id => document.getElementById(id).value.trim()
  );

  if (datos.some(dato => !dato)) {
    mensaje.textContent = "Completa todos los campos.";
    return;
  }

  if (estudiantes.some(estudiante => estudiante[0] === datos[0])) {
    mensaje.textContent = "Ese número de cuenta ya está registrado.";
    return;
  }

  estudiantes.push(datos);
  guardar();
  formulario.reset();
  mensaje.textContent = "Estudiante registrado.";
};

document.querySelector("#exportar").onclick = () => {
  if (!estudiantes.length) {
    mensaje.textContent = "Primero registra un estudiante.";
    return;
  }

  // Protege texto que Excel podría interpretar como una fórmula.
  const celdaCSV = valor => {
    let texto = String(valor);
    if (/^\s*[=+\-@]/.test(texto)) texto = "'" + texto;
    return '"' + texto.replaceAll('"', '""') + '"';
  };

  const filas = [["Cuenta", "Nombre", "Carrera"], ...estudiantes];
  const csv = filas.map(fila => fila.map(celdaCSV).join(",")).join("\r\n");
  const archivo = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = "estudiantes.csv";
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
};

mostrar();
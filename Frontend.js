// Frontend.js - Código JavaScript compartido para el frontend
// Incluye funciones comunes para llamadas al servidor, manejo de UI con Materialize

// Inicializar Materialize al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit(); // Inicializa todos los componentes de Materialize
});

// Función genérica para llamadas al servidor con preloader y manejo de errores
function llamarServidor(funcion, datos, callbackExito, callbackError) {
  // Mostrar preloader
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'block';

  google.script.run
    .withSuccessHandler(function(result) {
      if (preloader) preloader.style.display = 'none';
      if (result.success) {
        if (callbackExito) callbackExito(result);
      } else {
        M.toast({html: result.message || 'Error desconocido', classes: 'red'});
        if (callbackError) callbackError(result);
      }
    })
    .withFailureHandler(function(error) {
      if (preloader) preloader.style.display = 'none';
      M.toast({html: 'Error del servidor: ' + error.message, classes: 'red'});
      console.error(error);
      if (callbackError) callbackError(error);
    })[funcion](...datos); // Llama a la función con parámetros
}

// Función auxiliar para obtener parámetros de URL
function getParameterByName(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Ejemplo específico: Login de Personal
function loginPersonal() {
  const dni = document.getElementById('dni').value.trim();
  const pass = document.getElementById('pass').value.trim();

  if (!dni || !pass) {
    M.toast({html: 'Completa todos los campos', classes: 'orange'});
    return;
  }

  llamarServidor('loginPersonal', [dni, pass], function(result) {
    // Éxito: Redirigir según perfil
    if (result.perfil === 'Admin') {
      window.location.href = '?p=super';
    } else {
      window.location.href = '?p=mesa';
    }
  });
}

// Ejemplo específico: Procesar Examen
function enviarExamen() {
  const respuestas = {};
  // Recopilar respuestas: Asumiendo inputs con name="respuesta_0", "respuesta_1", etc.
  const inputs = document.querySelectorAll('input[name^="respuesta_"]');
  inputs.forEach(input => {
    const index = input.name.split('_')[1];
    respuestas[index] = input.value.toLowerCase();
  });

  const dni = getParameterByName('dni');
  if (!dni) {
    M.toast({html: 'DNI no encontrado', classes: 'red'});
    return;
  }

  llamarServidor('procesarExamenDesdeCliente', [respuestas, dni], function(result) {
    // Mostrar resultado en modal
    document.getElementById('notaFinal').textContent = result.nota + '%';
    document.getElementById('estadoFinal').textContent = result.aprobado ? 'Aprobado' : 'Desaprobado';
    const modal = M.Modal.getInstance(document.getElementById('modalResultado'));
    modal.open();
  });
}

// Función para mostrar modal de confirmación
function confirmarAccion(mensaje, callback) {
  document.getElementById('mensajeConfirmacion').textContent = mensaje;
  const modal = M.Modal.getInstance(document.getElementById('modalConfirmacion'));
  modal.open();
  // Asignar callback al botón confirmar (asumiendo id="btnConfirmar")
  document.getElementById('btnConfirmar').onclick = callback;
}
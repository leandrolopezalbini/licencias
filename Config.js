//Config.gs

const EXAM_CONFIG = {
  totalTimeMinutes: 30,
  puntajeAprobacion: 75, // debe coincidir con function finalizar() { - const gano = nota >= 70;
  claveInstructor: "12345" 
};

const TOTAL_CLASES = 3;

/**
 * Función para pasar la configuración al HTML si fuera necesario
 * (Por ejemplo, para que el reloj del examen sepa cuántos minutos durar)
 */
function getPublicConfig() {
  return {
    tiempoExamen: EXAM_CONFIG.totalTimeMinutes,
    aprobacion: EXAM_CONFIG.puntajeAprobacion
  };
}
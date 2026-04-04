const express = require('express');
const router = express.Router();

// Importamos las funciones del controlador mediante destructuring
const { 
    getEquipos, 
    getPartidos, 
    getTablaPosiciones, 
    updateMatchResult 
} = require('../controllers/ligaManager.controllers');

// ==================== GET (Consultas) ====================

// Obtener lista de todos los equipos
// ligaManager/api/equipos
router.get('/equipos', getEquipos);

// Obtener lista de todos los partidos
router.get('/partidos', getPartidos);

// Obtener la tabla de posiciones (basada en el VIEW de SQL)
router.get('/tabla-posiciones', getTablaPosiciones);


// ==================== PUT (Actualizaciones) ====================

//Actualizar cualquier campo del partido(resultado se visualizan auto en tablaposi x el view)
router.put('/partidos/:matchId', updateMatchResult);

module.exports = router;
const express = require('express')
const router = express.Router()

const ligaManagerControlle = require('../controllers/ligaManager.controllers')

// ==================== GET ====================

// Equipos
router.get('/equipos', ligaManagerControlle.getEquipos);

// Partidos
router.get('/partidos', ligaManagerControlle.getPartidos);

// Tabla de posiciones
router.get('/tabla-posiciones', ligaManagerControlle.getTablaPosiciones);


// ==================== PUT ====================

// Actualizar goles
router.put('/partidos/:id/goles', ligaManagerControlle.updateGoles);

// Cambiar estado
router.put('/partidos/:id/estado', ligaManagerControlle.updateEstado);


module.exports = router;
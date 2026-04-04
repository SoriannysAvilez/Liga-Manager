const { poolPromise, sql } = require('../config/db');


//LOGICA PARA LISTAR EQUIPOS(read)
const getEquipos = async(req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query('SELECT * FROM Equipos ORDER BY id_equipo ASC') 
        res.json(result.recordset)
    } catch(error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message })
    }
}

//LOGICA PARA LISTAR PARTIDOS
const getPartidos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                p.id_partido AS id, 
                el.nombre AS local, 
                el.logo AS logo_local, 
                ev.nombre AS visitante, 
                ev.logo AS logo_visitante, 
                p.goles_local, 
                p.goles_visitante, 
                p.fecha,
                p.estado 
            FROM Partidos p
            LEFT JOIN Equipos el ON p.id_equipoLocal = el.id_equipo  
            LEFT JOIN Equipos ev ON p.id_equipoVisitante = ev.id_equipo 
        `);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener partidos", error: error.message });
    }
};


//LOGICA PARA LISTAR TABLA DE POSICIONES
const getTablaPosiciones = async (req, res) => {

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`
                SELECT nombre, logo, PJ, PG, PE, PP, PTS 
                FROM dbo.TablaPosiciones ORDER BY PTS DESC
            `);

        res.json(result.recordset);

    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error en el servidor', error: error.message });
    }
};


//LOGICA PARA ACTUALIZAR GOLES (edo diefrente a jugado) Y EDO

const updateMatchResult = async (req, res) => {
  
  const { matchId } = req.params; 
  const { goles_local, goles_visitante, estado } = req.body;

  // Validación: Si no hay goles o edo, la funcion se detiene
  if (goles_local === undefined && goles_visitante === undefined && !estado) {
    return res.status(400).json({ message: 'No se enviaron datos para actualizar' });
  }

  try {

    const pool = await poolPromise;

    // 1. Verificamos si el partido existe y su estado actual

    const checkMatch = await pool.request()
      .input('id', sql.Int, matchId)
      .query('SELECT estado FROM Partidos WHERE id_partido = @id');

    if (checkMatch.recordset.length === 0) {
      return res.status(404).json({ message: 'Partido no encontrado' });
    }

    // Si ya está 'jugado'
    if (checkMatch.recordset[0].estado === 'jugado' && estado === 'jugado') {
       return res.status(400).json({ message: 'El partido ya está finalizado' });
    }

    // 2. Construcción del Query Dinámico (nos permite actualizar solo un campo sin modificar los demas)
    let updates = [];
    const request = pool.request().input('id', sql.Int, matchId);

    if (goles_local !== undefined) {
      updates.push("goles_local = @gl");
      request.input('gl', sql.Int, goles_local);
    }
    if (goles_visitante !== undefined) {
      updates.push("goles_visitante = @gv");
      request.input('gv', sql.Int, goles_visitante);
    }
    if (estado !== undefined) {
      updates.push("estado = @est");
      request.input('est', sql.VarChar, estado);
    }

    // Unimos los campos para el UPDATE
    const query = `UPDATE Partidos SET ${updates.join(', ')} WHERE id_partido = @id`;

    await request.query(query);

    // 3. Respuesta exitosa
    // Al consultar la VIEW 'TablaPosiciones' desde Astro, los cambios ya serán visibles
    res.json({ 
      message: 'Partido actualizado. La tabla de posiciones se ha recalculado automáticamente.',
      updatedFields: { goles_local, goles_visitante, estado }
    });

  } catch (error) {
    console.error("Error en SQL:", error);
    res.status(500).json({ message: 'Error interno en el servidor', error: error.message });
  }
};


module.exports = {
  getEquipos,
  getPartidos,
  getTablaPosiciones,
  updateMatchResult
};
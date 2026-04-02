const { poolPromise, sql } = require('../config/db');


//LOGICA PARA LISTAR EQUIPOS(read)
const getEquipos = async(req, res) => {

    try{
        const pool= await poolPromise;
        const result = await pool
        .request()
        .query('SELECT * FROM Equipos ORDER BY nombre ASC')
        res.json(result.recordset)
    }catch(error){
        res
        .status(500)
        .json({ message: 'Error en el servidor', error: error.message })
    }
}

//LOGICA PARA LISTAR PARTIDOS
const getPartidos = async(req, res) => {

    try{
        const pool= await poolPromise;
        const result = await pool
        .request()
        .query('SELECT * FROM Partidos ORDER BY fecha ASC')
        res.json(result.recordset)
    }catch(error){
        res
        .status(500)
        .json({ message: 'Error en el servidor', error: error.message })
    }
}

const { getConnection } = require('../config/db');


//LOGICA PARA LISTAR TABLA DE POSICIONES
const getTablaPosiciones = async (req, res) => {

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .query(`
                SELECT * 
                FROM TablaPosiciones
                ORDER BY 
                    PTS DESC, 
                    DG DESC, 
                    GF DESC
            `);

        res.json(result.recordset);

    } catch (error) {
        res
            .status(500)
            .json({ message: 'Error en el servidor', error: error.message });
    }
};

//LOGICA PARA ACTUALIZAR GOLES (SOLO SI NO ESTA JUGADO)
const updateGoles = async (req, res) => {
    const { id } = req.params;
    const { goles_local, goles_visitante } = req.body;

    try {
        const pool = await poolPromise;

        // Verificar estado del partido
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT estado FROM Partidos WHERE id_partido = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Partido no encontrado' });
        }

        if (result.recordset[0].estado === 'jugado') {
            return res.status(400).json({
                message: 'No se puede modificar un partido finalizado'
            });
        }

        // Actualizar goles
        await pool.request()
            .input('id', sql.Int, id)
            .input('goles_local', sql.Int, goles_local)
            .input('goles_visitante', sql.Int, goles_visitante)
            .query(`
                UPDATE Partidos
                SET goles_local = @goles_local,
                    goles_visitante = @goles_visitante
                WHERE id_partido = @id
            `);

        res.json({ message: 'Goles actualizados correctamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

//LOGICA PARA CAMBIAR ESTADO DEL PARTIDO
const updateEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'en_juego', 'jugado'];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ message: 'Estado inválido' });
    }

    try {
        const pool = await poolPromise;

        // Verificar si ya está jugado
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT estado FROM Partidos WHERE id_partido = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Partido no encontrado' });
        }

        if (result.recordset[0].estado === 'jugado') {
            return res.status(400).json({
                message: 'No se puede cambiar el estado de un partido finalizado'
            });
        }

        // Actualizar estado
        await pool.request()
            .input('id', sql.Int, id)
            .input('estado', sql.VarChar, estado)
            .query(`
                UPDATE Partidos
                SET estado = @estado
                WHERE id_partido = @id
            `);

        res.json({ message: 'Estado actualizado correctamente' });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
  getEquipos,
  getPartidos,
  getTablaPosiciones,
  updateGoles,
  updateEstado
};
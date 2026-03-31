const { getConnection } = require('../config/db');

const getLeaderboard = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .query('SELECT * FROM tabla_posiciones');

    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getLeaderboard
};
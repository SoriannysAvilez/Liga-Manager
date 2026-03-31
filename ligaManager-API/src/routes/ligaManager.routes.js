const express = require('express');
const router = express.Router();

const { getLeaderboard } = require('../controllers/ligaManager.controllers');

router.get('/leaderboard', getLeaderboard);

module.exports = router;
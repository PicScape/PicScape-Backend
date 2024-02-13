const express = require('express');
const verifyToken = require('../utils/jwtAuthMiddleware');


const router = express.Router();

router.get('/api/username', verifyToken, (req, res) => {
    const username = req.user.username;

    res.json({ username });
});



module.exports = router;

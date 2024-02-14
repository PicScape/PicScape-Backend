const express = require('express');
const multer = require('multer');
const { loadUsers } = require('../utils');

const verifyToken = require('../utils/jwtAuthMiddleware');
const upload = multer();


const router = express.Router();

router.get('/api/authuser', verifyToken, (req, res) => {
    const username = req.user.username;
    const users = loadUsers();
    const user = users.find(user => user.username === username);
    
    if (user) {
        res.json({ username, uuid: user.uuid });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

router.get('/api/uuiduser/:uuid', (req, res) => {
    const { uuid } = req.params;
    
    const users = loadUsers();
    const user = users.find(user => user.uuid === uuid); 

    if (user) {
        res.json({ username: user.username });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});



module.exports = router;

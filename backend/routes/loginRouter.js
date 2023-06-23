const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/', loginController.login);

module.exports = router;

/*
POST
http://localhost:8080/login
{
    "email": "",
    "senha": ""
}
*/
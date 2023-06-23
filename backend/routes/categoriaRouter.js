const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.listar);
router.post('/', categoriaController.registrar);
router.get('/:codigo', categoriaController.localizar);
router.put('/:codigo', categoriaController.atualizar);

module.exports = router;

/*
POST
http://localhost:8080/categoria
{
    "nome": "",
    "descricao": ""
}

PUT
http://localhost:8080/categoria/CODIGO
{
    "nome": "",
    "descricao": ""
}
*/
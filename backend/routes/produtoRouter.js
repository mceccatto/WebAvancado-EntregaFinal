const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', produtoController.listar);
router.post('/', produtoController.registrar);
router.get('/:codigo', produtoController.localizar);
router.put('/:codigo', produtoController.atualizar);
router.put('/:codigo/comentario', produtoController.comentario);

module.exports = router;

/*
POST
http://localhost:8080/produto
{
    "nome": "",
    "imagem": "",
    "descricao": "",
    "preco": 0,
    "categoria": "",
    "animal": ""
}

PUT
http://localhost:8080/produto/CODIGO
{
    "nome": "",
    "imagem": "",
    "descricao": "",
    "preco": 0,
    "categoria": "",
    "animal": ""
}

PUT
http://localhost:8080/produto/CODIGO/comentario
{
    "comentarios": {
        "avatar": "",
        "nome": "",
        "descricao": "",
        "nota": 0
    }
}
*/
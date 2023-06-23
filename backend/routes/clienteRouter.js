const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.listar);
router.post('/', clienteController.registrar);
router.get('/:codigo', clienteController.localizar);
router.put('/:codigo/:acao', clienteController.atualizar);

module.exports = router;

/*
POST
http://localhost:8080/cliente
{
    "foto": "",
    "nome": "",
    "endereco": "",
    "telefone": "",
    "cpf": "",
    "cartao": {
        "nome": "",
        "numero": "",
        "cvc": ""
    },
    "email": "",
    "senha": ""
}

PUT
http://localhost:8080/cliente/CODIGO/cadastro
{
    "foto": "",
    "nome": "",
    "endereco": "",
    "telefone": ""
}

PUT
http://localhost:8080/cliente/CODIGO/cartao
{
    "cartao": {
        "nome": "",
        "numero": "",
        "cvc": ""
    }
}

PUT
http://localhost:8080/cliente/CODIGO/senha
{
    "senha": ""
}
*/
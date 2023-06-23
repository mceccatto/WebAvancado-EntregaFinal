const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const auth = require('../auth/auth');

router.use(auth.autorizar);

router.get('/', pedidoController.listar);
router.post('/', pedidoController.registrar);
router.get('/:codigo', pedidoController.localizar);
router.get('/:codigo/:cliente/:acao', pedidoController.localizarPedido);//unico | todos
router.put('/:codigo/:acao', pedidoController.atualizar);

module.exports = router;

/*
POST
http://localhost:8080/pedido
{
    "custo": 0,
    "produtos": [
        {
            "produtoId": "",
            "quantidade": 0
        }
    ],
    "cliente": ""
}

PUT
http://localhost:8080/pedido/CODIGO/produtos
{
    "custo": 0,
    "produtos": [
        {
            "produtoId": "",
            "quantidade": 0
        }
    ]
}

PUT
http://localhost:8080/pedido/CODIGO/status
{
    "status": ""
}
*/
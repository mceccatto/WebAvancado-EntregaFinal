const pedidoModel = require('../models/pedidoModel');
const clienteModel = require('../models/clienteModel');

class ProdutoController {
    async registrar(req, res) {
        let pedido = req.body;
        if (
            !pedido.custo ||
            pedido.produtos.length === 0 ||
            !pedido.cliente
        ) {
            res.status(400).json({ 'msg': 'Todos os campos são obrigatórios' });
            return;
        }
        for (let i = 0; i < pedido.produtos.length; i++) {
            if (pedido.produtos[i].quantidade <= 0 || /^[0-9]+$/.test(pedido.produtos[i].quantidade) === false) {
                res.status(400).json({ 'msg': 'Deve ser informada um quantidade válida para o produto!' });
                return;
            }
        }
        const date = new Date();
        date.setHours(date.getHours() - 3);
        pedido.data = date;
        pedido.status = 'Aguardando Pagamento';
        const max = await pedidoModel.findOne({}).sort({ codigo: -1 });
        pedido.codigo = max == null ? 1 : max.codigo + 1;
        try {
            await pedidoModel.create(pedido);
            res.status(201).json({ 'msg': 'Pedido cadastrado com sucesso!' });
        } catch (err) {
            if (err.name === "ValidationError") {
                res.status(409).json({ 'msg': 'Produto(s) ou cliente invalido!' });
                return;
            }
            res.status(409).json({ 'msg': 'Erro desconhecido!', 'error': err });
        }

    }

    async listar(req, res) {
        const resultado = await pedidoModel.find({});
        if (resultado.length === 0) {
            res.status(200).json({ 'msg': 'Nenhum pedido foi encontrado!' });
            return;
        }
        res.status(200).json(resultado);
    }

    async localizar(req, res) {
        const codigo = req.params.codigo;
        if (codigo && (codigo <= 0 || /^[0-9]+$/.test(codigo) === false)) {//verifica se o codigo informado é valido
            res.status(400).json({ 'msg': 'Código inválido' });
            return;
        }
        const resultado = await pedidoModel.findOne({ 'codigo': codigo });
        if (resultado) {
            res.status(200).json(resultado);
        } else {
            res.status(400).json({ 'msg': 'Pedido não encontrado!' });
        }
    }

    async localizarPedido(req, res) {
        const codigo = req.params.codigo;
        const codigoCliente = req.params.cliente;
        const acao = req.params.acao;
        if (acao === 'unico') {
            if (codigo && (codigo <= 0 || /^[0-9]+$/.test(codigo) === false)) {//verifica se o codigo do pedido informado é valido
                res.status(400).json({ 'msg': 'Código inválido' });
                console.log("a");
                return;
            }
            if (codigoCliente && (codigoCliente <= 0 || /^[0-9]+$/.test(codigoCliente) === false)) {//verifica se o codigo do cliente informado é valido
                res.status(400).json({ 'msg': 'Pedido inválido' });
                return;
            }
            const cliente = await clienteModel.findOne({ 'codigo': codigoCliente });
            const resultado = await pedidoModel.findOne({ 'cliente': cliente._id, 'codigo': codigo });
            if (resultado) {
                res.status(200).json(resultado);
                return;
            } else {
                res.status(400).json({ 'msg': 'Pedido não encontrado!' });
                return;
            }
        } else if (acao === 'todos') {
            if (codigoCliente && (codigoCliente <= 0 || /^[0-9]+$/.test(codigoCliente) === false)) {//verifica se o codigo do cliente informado é valido
                res.status(400).json({ 'msg': 'Pedido inválido' });
                return;
            }
            const cliente = await clienteModel.findOne({ 'codigo': codigoCliente });
            const resultado = await pedidoModel.find({ 'cliente': cliente._id });
            if (resultado) {
                res.status(200).json(resultado);
                return;
            } else {
                res.status(400).json({ 'msg': 'Pedido não encontrado!' });
                return;
            }
        } else {
            res.status(400).json({ 'msg': 'Ação inválida!' });
            return;
        }

    }

    async atualizar(req, res) {
        const codigo = req.params.codigo;
        const acao = req.params.acao;
        if (!codigo) {//verifica se o codigo foi informado
            res.status(400).json({ 'msg': 'É obrigatório informar um código de pedido!' });
            return;
        } else {
            if (codigo <= 0 || /^[0-9]+$/.test(codigo) === false) {//verifica se o codigo informado é valido
                res.status(400).json({ 'msg': 'Código inválido' });
                return;
            }
        }
        const pedido = req.body;
        if (acao === 'produtos') {
            if (pedido.produtos.length === 0) {
                res.status(400).json({ 'msg': 'Ao menos um produto deve ser informado!' });
                return;
            }
            if (pedido.custo <= 0 || /^([0-9]*\.)?[0-9]+$/.test(pedido.custo) === false) {
                res.status(400).json({ 'msg': 'O custo total do(s) produto(s) deve(m) ser informado(s)!' });
                return;
            }
            for (let i = 0; i < pedido.produtos.length; i++) {
                if (pedido.produtos[i].quantidade <= 0 || /^[0-9]+$/.test(pedido.produtos[i].quantidade) === false) {
                    res.status(400).json({ 'msg': 'Deve ser informada um quantidade válida para o produto!' });
                    return;
                }
            }
            const consulta = await pedidoModel.findOne({ 'codigo': codigo });
            if (consulta) {
                if (consulta.status !== 'Aguardando Pagamento') {
                    res.status(400).json({ 'msg': 'Este pedido não pode ser alterado!' });
                    return;
                }
            }
        } else if (acao === 'status') {
            if (!pedido.status) {
                res.status(400).json({ 'msg': 'É obrigatório informar um Status!' });
                return;
            } else {
                const statusPedido = ['Faturado', 'Enviado', 'Cancelado'];
                if (statusPedido.includes(pedido.status) === false) {
                    res.status(400).json({ 'msg': 'Status inválido!' });
                    return;
                }
            }
        } else {
            res.status(400).json({ 'msg': 'Ação inválida!' });
            return;
        }
        try {
            const _id = String((await pedidoModel.findOne({ 'codigo': codigo }))._id);
            await pedidoModel.findByIdAndUpdate(String(_id), pedido);
            res.status(200).json({ 'msg': 'Pedido atualizado com sucesso' });
        } catch (err) {
            res.status(400).json({ 'msg': 'Pedido não encontrado!' });
        }
    }
}

module.exports = new ProdutoController();
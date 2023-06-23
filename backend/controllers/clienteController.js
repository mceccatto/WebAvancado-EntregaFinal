const clienteModel = require('../models/clienteModel');
const auth = require('./../auth/auth');
const bcryptjs = require('bcryptjs');

class ClienteController {
    async registrar(req, res) {
        const cliente = req.body;
        if (
            !cliente.foto ||
            !cliente.nome ||
            !cliente.endereco ||
            !cliente.telefone ||
            !cliente.cpf ||
            !cliente.cartao.nome ||
            !cliente.cartao.numero ||
            !cliente.cartao.cvc ||
            !cliente.email ||
            !cliente.senha
        ) {
            res.status(400).json({ 'msg': 'Todos os campos são obrigatórios' });
            return;
        }
        const max = await clienteModel.findOne({}).sort({ codigo: -1 });
        cliente.codigo = max == null ? 1 : max.codigo + 1;
        try {
            const resultado = await clienteModel.create(cliente);
            auth.incluirToken(resultado);
            res.status(201).json({ 'msg': 'Cliente cadastrado com sucesso!' });
        } catch (err) {
            if (err.code === 11000) {//verifica se existe erro de duplicidade
                if (err.keyPattern.cpf && err.keyPattern.cpf === 1) {
                    res.status(409).json({ 'msg': 'O CPF informado já encontra-se registrado!' });
                    return;
                }
                if (err.keyPattern.email && err.keyPattern.email === 1) {
                    res.status(409).json({ 'msg': 'O e-mail informado já encontra-se registrado!' });
                    return;
                }
            }
            res.status(409).json({ 'msg': 'Erro desconhecido!', 'err': err });
        }
    }

    async listar(req, res) {
        const resultado = await clienteModel.find({});
        if (resultado.length === 0) {
            res.status(200).json({ 'msg': 'Nenhum cliente foi encontrado!' });
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
        const resultado = await clienteModel.findOne({ 'codigo': codigo });
        if (resultado) {
            res.status(200).json(resultado);
        } else {
            res.status(400).json({ 'msg': 'Cliente não encontrado!' });
        }
    }

    async atualizar(req, res) {
        const codigo = req.params.codigo;
        const acao = req.params.acao;
        if (!codigo) {//verifica se o codigo foi informado
            res.status(400).json({ 'msg': 'É obrigatório informar um código de cliente!' });
            return;
        } else {
            if (codigo <= 0 || /^[0-9]+$/.test(codigo) === false) {//verifica se o codigo informado é valido
                res.status(400).json({ 'msg': 'Código inválido' });
                return;
            }
        }
        let cliente = req.body;
        let msg = '';
        if (acao === 'cadastro') {
            if (
                !cliente.foto ||
                !cliente.nome ||
                !cliente.endereco ||
                !cliente.telefone
            ) {
                res.status(400).json({ 'msg': 'Todos os campos são obrigatórios' });
                return;
            }
            msg = 'Cliente atualizado com sucesso!';
        } else if (acao === 'cartao') {
            if (
                !cliente.cartao.nome ||
                !cliente.cartao.numero ||
                !cliente.cartao.cvc
            ) {
                res.status(400).json({ 'msg': 'Todos os campos são obrigatórios' });
                return;
            }
            msg = 'Cartão atualizado com sucesso!';
        } else if (acao === 'senha') {
            if (
                !cliente.senha
            ) {
                res.status(400).json({ 'msg': 'É obrigatório informar uma senha válida' });
                return;
            }
            const hash = await bcryptjs.hash(cliente.senha, 10);
            cliente.senha = hash;
            msg = 'Senha atualizada com sucesso!';
        } else {
            res.status(400).json({ 'msg': 'Ação inválida!' });
            return;
        }
        try {
            const _id = String((await clienteModel.findOne({ 'codigo': codigo }))._id);
            await clienteModel.findByIdAndUpdate(String(_id), cliente);
            res.status(200).json({ 'msg': msg });
        } catch (err) {
            res.status(400).json({ 'msg': 'Cliente não encontrado!' });
        }
    }
}

module.exports = new ClienteController();
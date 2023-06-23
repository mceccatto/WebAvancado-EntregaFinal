const categoriaModel = require('../models/categoriaModel');

class CategoriaController {
    async registrar(req, res) {
        const categoria = req.body;
        if (
            !categoria.nome ||
            !categoria.descricao
        ) {
            res.status(400).json({ 'msg': 'Todos os campos são obrigatórios' });
            return;
        }
        const max = await categoriaModel.findOne({}).sort({ codigo: -1 });
        categoria.codigo = max == null ? 1 : max.codigo + 1;
        await categoriaModel.create(categoria);
        res.status(201).json({ 'msg': 'Categoria cadastrada com sucesso!' });
    }

    async listar(req, res) {
        const resultado = await categoriaModel.find({});
        if (resultado.length === 0) {
            res.status(200).json({ 'msg': 'Nenhuma categoria foi encontrada!' });
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
        const resultado = await categoriaModel.findOne({ 'codigo': codigo });
        if (resultado) {
            res.status(200).json(resultado);
        } else {
            res.status(400).json({ 'msg': 'Categoria não encontrada!' });
        }
    }

    async atualizar(req, res) {
        const codigo = req.params.codigo;
        if (!codigo) {//verifica se o codigo foi informado
            res.status(400).json({ 'msg': 'É obrigatório informar um código de categoria!' });
            return;
        } else {
            if (codigo <= 0 || /^[0-9]+$/.test(codigo) === false) {//verifica se o codigo informado é valido
                res.status(400).json({ 'msg': 'Código inválido' });
                return;
            }
        }
        const categoria = req.body;
        if (
            !categoria.nome ||
            !categoria.descricao
        ) {
            res.status(400).json({ 'msg': 'Todos os campos são obrigatórios' });
            return;
        }
        try {
            const _id = String((await categoriaModel.findOne({ 'codigo': codigo }))._id);
            await categoriaModel.findByIdAndUpdate(String(_id), categoria);
            res.status(200).json({ 'msg': 'Categoria atualizado com sucesso' });
        } catch (err) {
            res.status(400).json({ 'msg': 'Categoria não encontrada!' });
        }
    }
}

module.exports = new CategoriaController();
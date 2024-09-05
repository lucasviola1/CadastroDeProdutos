const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')

const app = express()

const PORT = 3001

app.use(cors())
mongoose.connect('mongodb://127.0.0.1:27017/CadastroDeProdutos').then(console.log('MongoDB connected!'))

const Produtos = new mongoose.Schema({
    nome: String,
    preco: Number,
    quantidade: Number,
    descricao: String,
    tamanho: String
})

const ProdutosModel = mongoose.model("produtos", Produtos)

app.listen(PORT, () =>{
    console.log(`Conectado na porta ${PORT}!`)
})

app.get('/produtos', async (req, res) =>{
    const produtos = await ProdutosModel.find()
    res.json(produtos)
})

app.get('/produtos/:nome', async (req, res) => {
    const produto =  await ProdutosModel.findOne({nome: req.params.nome})
    if(produto){
        res.json(produto)
    }
    else{
        res.json('Não possui cadastro!')
    }
})

app.post('/cadastrar', async (req, res) => {
    const {nome, preco, quantidade, descricao, tamanho} = req.query
    const novoproduto = new ProdutosModel({nome, preco, quantidade, descricao, tamanho})
    const produtocadastrado = await novoproduto.save()
    res.json(produtocadastrado)
})

app.put('/alterar/:id', async (req, res) =>{
    try {
        const { id } = req.params;

        const { nome, preco, quantidade, descricao, tamanho } = req.query;

        const produto = await ProdutosModel.findByIdAndUpdate(id, {
            nome,
            preco,
            quantidade,
            descricao,
            tamanho
        }, { new: true }); 

        if (produto) {
            res.json(produto);
        } else {
            res.status(404).json({ message: 'Produto não encontrado!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao atualizar o produto!', error: err.message });
    }
})

app.delete('/delete/:id', async (req, res) =>{
    const { id } = req.params
    const produto = await ProdutosModel.findByIdAndDelete(id)
    if(produto){
        res.json('Produto deletado!')
    }
    else{
        res.json('Produto não encontrado!')
    }
})
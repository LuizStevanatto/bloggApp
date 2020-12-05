const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")


router.get('/', eAdmin, (req, res) =>{
    res.render('admin/index')

})

router.get('/posts', eAdmin, (req, res)=>{
    res.send("Pág de Posts")
})

router.get('/categorias', eAdmin, (req, res) =>{
    Categoria.find().sort({date: 'desc'}).then((categorias) =>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao listar as categorias");
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', eAdmin, (req, res) =>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', eAdmin, (req, res) =>{

    var erros = []
    
    if(!req.body.nome){
        erros.push({text: "Nome inválido"})
    }

    if(!req.body.slug){
        erros.push({ text: "Slug Inválido" })
    }

    if(req.body.nome.length < 2){
        erros.push({ text: "Nome da categoria muito pequeno" })
    }
     
    // console.log(erros)
    if(erros.length >  0){
        res.render("admin/addcategorias", { erros: erros })
    }


    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(()=>{
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        console.log("Erro ao salvar categoria" + err)
    })
})

router.get("/categorias/edit/:id", eAdmin, (req, res) =>{
    Categoria.findOne({_id:req.params.id}).then((categoria) =>{
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) =>{
        req.flash("error_msg", "Categoria não encontrada")
        res.redirect("/admin/categorias")
    })
    
})

router.post("/categorias/edit", eAdmin, (req,res) =>{

    Categoria.findOne({_id: req.body.id}).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() =>{
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) =>{
            req.flash("error_msg", "Erro ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })


    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar Categoria")
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/deletar", eAdmin, (req,res) => {
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg: Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", eAdmin, (req, res) =>{

    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) =>{
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) =>{
        req.flash("error_msg", "Erro ao listar as postagens")
        res.redirect("/admin")
    })

})

router.get("/postagens/add", eAdmin, (req, res) =>{
    Categoria.find().then((categorias) =>{
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao carregar o formulário")
        res.redirect("/admin")
    })
    
})

router.post("/postagens/nova", eAdmin, (req,res) =>{

    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }

    if (erros.length > 0 ){
        res.render("admin/addpostagem", { erros: erros })
    }else{
        const novapostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novapostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso!");
            res.redirect("/admin/postagens")
        }).catch((err) =>{
            req.flash("error_msg", "Erro ao salvar postagem")
            res.redirect("/admin/postagens")    
        })
    }

})

router.get("/postagens/edit/:id", eAdmin, (req, res) =>{

    Postagem.findOne({_id: req.params.id}).then((postagem) => {

        Categoria.find().then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/postagens")
    })

})

router.post("/postagens/edit", eAdmin, (req,res) => {

    Postagem.findOne({_id: req.body.id}).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria  = req.body.categoria

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso!")
            res.redirect("/admin/postagens")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a edição")
        res.redirect("/admin/postagens")
    })

})

router.get("/postagens/deletar/:id", eAdmin, (req,res) =>{
    Postagem.remove({_id: req.params.id}).then(() =>{
        req.flash("success_msg", "Postagem deletada com sucesso")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Erro Interno")
        res.redirect("/admin/postagens")
    })
})

module.exports = router     
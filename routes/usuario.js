const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require('passport')

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) =>{ 
    var erros = []

    if(!req.body.nome){
        erros.push({texto: "Nome Inválido"})
    }

    if(!req.body.email){
        erros.push({texto: "Email Inválido"})
    }

    if(!req.body.senha){
        erros.push({texto: "Senha Inválido"})
    }

    if(req.body.senha.lenght < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes"})
    }
    
    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{ 

        Usuario.findOne({email: req.body.email}).then((usuario) =>{
            if(usuario){
                erros.push({texto: "Já existe uma conta registrada com esse email"})
                res.redirect("/usuarios/registro")
            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                        if(erro){
                            req.flash("error_msg", "Erro ao salvar o usuario")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() =>{
                            req.flash("success_msg", "Usuário criado com sucesso")
                            res.redirect("/")
                        }).catch((err) =>{
                            req.flash("error_msg", "Erro ao salvar o usuario")
                            res.redirect("/usuarios/registro")


                        })
                    })
                })

                

            }
        }).catch((err) => {
            req.flash("error_msg", "Erro Interno")
        })

    }

})


router.get("/login", (req, res) =>{
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) =>{
    
    passport.authenticate("local", {
        successRedirect: "/", 
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)



})

router.get("/logout", (req, res) =>{
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso")
    res.redirect("/")
})


module.exports = router
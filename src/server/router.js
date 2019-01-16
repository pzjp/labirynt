var express = require('express');
var fs = require("fs");
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var DataBase = require('./dataread');

var router= express.Router();

router.get('/levels', function(req,res) {
    DataBase.getAllLevels({},function(err, levels){
        if(err)
        {
            console.log("Error! "+err);
            res.status(500).end("Database error");
        }
        else res.send(JSON.parse(levels));
    });
});

router.get('/stats.json', function(req,res) {
    DataBase.getLevelStats(function(err, stats){
        if(err)
        {
            console.log("Error! "+err);
            res.status(500).end("Database error");
        }
        else if(stats)
        {
            if(req.isAuthenticated())
            {
                DataBase.getPlayerStats(req.user._id,function(err,userlevels){
                    for(var i in stats)
                    {
                        for(var j in userlevels)
                        {
                            if(stats[i].id===userlevels[j].id)
                                stats[i].player=userlevels[j].player;
                        }
                    }
                    res.send(JSON.stringify(stats));
                });
            }
            else
            {
                //stats.loggedIn=false;
                res.send(JSON.stringify(stats));
            }
        }
    });
});

router.post('/solution', function( req, res) { // TODO
    verifyUser(req,res,function(req,res) {
    console.log("Rozwiązanie: "+JSON.stringify(req.body));
    //console.log("     Ruchów: "+req.body.moves);
    DataBase.validateSolution(req.body.level, req.user,
        {path:req.body.solution, moves:req.body.moves}, function(err, ans){
            if (err) console.log("Błąd podczas weryfikacji.");
            else console.log("Weryfikacja rozwiązania: "+ans);
            res.send(ans);
        });
    });
});

const signIn = passport.authenticate('local-signup', {
    successRedirect: '/#/gra',
    failureRedirect: '/#/login',
    failureFlash: true,
  });
const logIn = passport.authenticate('local-login', {
    successRedirect: '/#/gra',
    failureRedirect: '/#/login',
    failureFlash: true,
  });

router.post('/login', function(req, res, next)
{
    console.log("POST /login");
    if (req.body.register) signIn(req, res, next); // Rejestracja
    else logIn(req, res, next); // Logowanie
});

router.post('/logout', function(req,res){ // Wylogowywanie
    req.logout();
    res.redirect("/#/");
});

// Odrzuć niezalogowanego użytkownika.
function verifyUser(req, res, next) {
        console.log("Recieved: "+ req);
        if (req.isAuthenticated())
        {
            console.log("Access granted. "+next);
            return next(req,res);
        }
        else
            res.status(401).end("Not logged in.");
};

module.exports= router;
const express = require('express');
const router = express.Router();
const gamesAuth = require('./gameAuth');
const gamesLogicAuth = require('./gameLogicAuth');
const userAuth = require('./usersAuth');
const gameManagement = express.Router();

//POST ROUTES
gameManagement.post("/addGame", gamesAuth.addGameToAuthList, (req, res) => {
    res.sendStatus(200);
});

gameManagement.post("/removeGame", gamesAuth.removeGameFromAuthList, (req, res) => {
    res.sendStatus(200);
});

gameManagement.post("/joinGame", gamesAuth.addUserToGame, (req,res) => {
    res.sendStatus(200);
});

gameManagement.post("/watchGame", gamesAuth.addSpectatorToGame, (req,res) => {
    res.sendStatus(200);
});

gameManagement.post("/leaveGame", gamesAuth.leaveGame, (req,res) => {
    res.sendStatus(200);
});

gameManagement.post("/gameInfo", (req, res) => {
    const gamename = JSON.parse(req.body).gamename;
    res.json(gamesAuth.getGameInfo(gamename));
});


//GET ROUTES
gameManagement.get("/allGames", (req, res) => {
    let theGames = gamesAuth.getGamesList();
    for(gameName in theGames) {
        let game = theGames[gameName];
        if(game) {
            if(userAuth.isUserExist(game.creator) === false && game.players.length === 0 && game.spectators.length === 0) {
                gamesAuth.removeGameByName(gameName);
                theGames = gamesAuth.getGamesList();
            }
        }
    }
    res.json(theGames);
});

module.exports = gameManagement;

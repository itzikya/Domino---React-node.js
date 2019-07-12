const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const userAuth = require('./usersAuth');

const chatContent = [];

const chatManagement = express.Router();

chatManagement.use(bodyParser.text());

chatManagement.route('/')
	.get(userAuth.userAuthentication, (req, res) => {		
		res.json(chatContent);
	})
	.post(userAuth.userAuthentication, (req, res) => {		
        const body = req.body;
        const userInfo =  userAuth.getUserInfo(req.session.id);
        chatContent.push({user: userInfo, text: body});        
        res.sendStatus(200);
	});

module.exports = chatManagement;
const express = require('express');
const bodyParser = require('body-parser');
const functions = require('./controller/function');
const middlewares = require('./controller/middleware');

const server = express();

server.use(bodyParser.json());
server.use((fail, req, res, next)=>{
    if(!fail){
        next();
    }else{
        res.status(500).json({error: 'Something happen!'});
    };
});

//routes
server.get('/users', middlewares.autorizaLogin,functions.getAllUsers); 
server.post('/users', middlewares.validateData, functions.addUser);
server.put('/users', middlewares.validateData, middlewares.validateExistence, middlewares.onlyAdmin, functions.updateUser);
server.patch('/users', middlewares.validateExistence, functions.addProperty);
server.post('/login', middlewares.validateLogin, functions.login);
server.get('/userslist', middlewares.autorizaLogin, middlewares.onlyAdmin, functions.usersList);

server.listen(3000, ()=>{
    console.log('check and ready!');
});
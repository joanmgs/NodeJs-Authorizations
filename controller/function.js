const allUsers = require('../variable');
const jwt = require('jsonwebtoken');
const { secretSign } = require('../env');

// Functions
//Obtener todos los usuarios
function getAllUsers(req, res){
    res.json(allUsers.users);
};
//Agregar usuarios
function addUser(req, res){
    //encontramos si el usuario ya existe en la bd
    const userAlreadyExist = allUsers.users.find((el)=>{
        return el.email == req.body.email
    });
    //si está le hace push a la bd, si no arroja error
    if(!userAlreadyExist){
        allUsers.users.push(req.body);
        res.send(`Usuario con el correo ${req.body.email} agregado`);
    }else{
        res.status(400).send('El usuario ya existe');
    };
};
//Actualizar usuarios
function updateUser(req, res){
    const {id, nombre, apellido, email, contrasena} = req.body;
    //selecciono al usuario
    const updatedUser = allUsers.users.find((el)=>{
        return el.email == email;
    });
    //actualizo sus datos
    updatedUser.id = id;
    updatedUser.nombre = nombre;
    updatedUser.apellido = apellido;
    updatedUser.contrasena = contrasena;
    //presento el usuario actualizado
    res.json(updatedUser);
};
//Agregar la propiedad es_admin
function addProperty(req, res){
    const {email, es_admin} = req.body;
    //se asegura que es_admin sea un boolean
    if(typeof es_admin == 'boolean'){
        //selecciono al usuario
        const updatedUser = allUsers.users.find((el)=>{
            return el.email == email;
        });
        //adiciono la nueva propiedad
        updatedUser.es_admin = es_admin;
        //presento la nueva propiedad
        res.json(updatedUser);
    }else{
        res.status(400).send('valor incorrecto');
    };
};
//Login
function login(req, res){
    const {email} = req.body;
    
    const token = jwt.sign({
        email
    },secretSign);

    res.json({token});
};
const userEmails = [];
//Lista de usuarios solo para admin
function usersList(req, res){

    //entrega la lista de correos de usuarios
    allUsers.users.forEach(user => {
        userEmails.push({email: user.email});
    });
    res.json(userEmails)
};

module.exports = {
    getAllUsers,
    addUser,
    updateUser,
    addProperty,
    login,
    usersList
};
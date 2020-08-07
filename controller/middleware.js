const allUsers = require('../variable');
const { secretSign } = require('../env');
const jwt = require('jsonwebtoken');

// Middlewares
//función para validar que se enviara la data necesaria
function validateData(req, res, next){
    if(req.body.id && req.body.nombre && req.body.apellido && req.body.email && req.body.contrasena){
        next();
    }else{
        res.status(500).send('Incomplete data');
    };
};
//función para validar que el usuario exista en la base de datos
function validateExistence(req, res, next){
    const {email} = req.body;
    //se comprueba la existencia del usuario que se actualizara
    const userExist = allUsers.users.find((el)=>{
        return el.email == email
    });
    //si existe userExist será true sino false y por tanto arroja el status 404
    if(userExist){
        next();
    }else{
        res.status(404).send('El usuario no existe');
    };
};
//función para validar que email y contraseñas sean correctos
function validateLogin(req, res, next){
    const {email, contrasena} = req.body;
    //valida que email y contraseñas sean correctas
    const loginValidated = allUsers.users.find((el)=>{
        return el.email === email && el.contrasena === contrasena
    });
    //login validado
    if(loginValidated){
        next();
    }else{
        res.status(400).send('email o contraseña incorrectos');
    };
};
//función para verificar solo administradores
function onlyAdmin(req, res, next){
    const {es_admin} = req.body;
    if(es_admin){
        next();
    }else{
        res.status(400).send('No eres administrador');
    };
};
//Autoriza por medio del token el acceso a los endopoint
function autorizaLogin(req, res, next){
    try{
        //recibo de los headers la autorización con el token
        //el token viene con dos datos separados por un espacio
        //se toma solo el segundo que es el respectivo al token
        const token = req.headers.authorization.split(' ')[1];
        //verifyToken me indica si se consigue la verificación o no
        const verifyToken = jwt.verify(token, secretSign);
        if(verifyToken){
            next();
        };
    }catch(fail){
        res.send({error: 'falta login'});
    };
};

module.exports = {
    validateData,
    validateExistence,
    validateLogin,
    onlyAdmin,
    autorizaLogin
};
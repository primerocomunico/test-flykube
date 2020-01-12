"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTAR
// librería express
const express_1 = __importDefault(require("express"));
// Parcear el body de una llamada
const body_parser_1 = __importDefault(require("body-parser"));
// Connect Mongoose
const mongoose_1 = __importDefault(require("mongoose"));
// Importar clave
const secret_1 = require("./secret");
// Tema Cors browser
const cors_1 = __importDefault(require("cors"));
// Procesos de conexión
const process_1 = __importDefault(require("process"));
// Creación de la app
const app = express_1.default();
// CONFIGURACIÓN MIDDLEWARE
// Asegurar tema headers para evitar fallos de conexión
let allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);
// Cors
app.use(cors_1.default());
// Parsear el body de las llamadas
app.use(body_parser_1.default.json());
// Datos recibidos desde un formulario de html
app.use(express_1.default.urlencoded({ extended: false }));
// Settings port
app.set('port', process_1.default.env.PORT || 3000);
// CONEXIÓN MONGODB
mongoose_1.default
    .connect(secret_1.dbAccess.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((db) => console.log('Access granted to DB'));
// Estructura del object para place
const Place = require('../models/Places');
// Almacenar API data
let apiData;
// Llamada post para publicar los datos de place a la DB
app.post('/place', (req, res) => {
    // Función que ejecuta la petición a la api
    apiAccess(req.body.ID);
    // const place = new Place({
    // 	ID: Object.values(apiData)[0],
    // });
    // try {
    // 	const savedPlace = await place.save();
    // 	res.json(savedPlace);
    // } catch (err) {
    // 	res.json({message: err});
    // }
    res.send({ success: `new data with ID ${req.body.ID} was added` });
});
// Llamada para obtener el contenido de place en la DB
app.get('/placelist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const places = yield Place.find();
        res.json(places);
    }
    catch (err) {
        res.json({ message: err });
    }
}));
// LISTEN PORT
app.listen(app.get('port'), () => {
    console.log(`Running port ${app.get('port')}`);
});
// Función para obtener la activity específica
function apiAccess(place) {
    let request = require('request');
    let options = {
        url: `http://fakerestapi.azurewebsites.net/api/Activities/${place}`,
        method: 'GET',
    };
    request(options, (error, response, body) => {
        if (error) {
            throw new Error(error);
        }
        else {
            apiData = JSON.parse(response.body);
            console.log(Object.values(apiData)[0]);
            var db = mongoose_1.default.connection;
            db.on('error', console.error.bind(console, 'connection error'));
            db.once('open', function () {
                console.log('Connection granted');
            });
            let newEnter = new Place({
                ID: Object.values(apiData)[0],
                Title: Object.values(apiData)[1],
                DueDate: Object.values(apiData)[2],
                Completed: Object.values(apiData)[3],
                Id: Object.values(apiData)[4]
            });
            newEnter.save(function (err, newEnter) {
                if (err)
                    return console.error(err);
                console.log(newEnter + " saved");
            });
        }
    });
}

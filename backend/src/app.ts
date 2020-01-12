// IMPORTAR
// librería express
import express, {Application, Request, Response, NextFunction, response} from 'express';
// Parcear el body de una llamada
import parser from 'body-parser';
// Connect Mongoose
import mongoose from 'mongoose';
// Importar clave
import {dbAccess} from './secret';
// Tema Cors browser
import cors from 'cors';
// Procesos de conexión
import process from 'process';
import {request} from 'http';

// Creación de la app
const app: Application = express();

// CONFIGURACIÓN MIDDLEWARE
// Asegurar tema headers para evitar fallos de conexión
let allowCrossDomain = (req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	} else {
		next();
	}
};
app.use(allowCrossDomain);

// Cors
app.use(cors());

// Parsear el body de las llamadas
app.use(parser.json());

// Datos recibidos desde un formulario de html
app.use(express.urlencoded({extended: false}));

// Settings port
app.set('port', process.env.PORT || 3000);

// CONEXIÓN MONGODB
mongoose
	.connect(dbAccess.URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((db) => console.log('Access granted to DB'));

// Estructura del object para place
const Place = require('../models/Places');

// Almacenar API data
let apiData: object;

// Llamada post para publicar los datos de place a la DB
app.post('/place', (req: Request, res: Response) => {
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
	res.send({success: `new data with ID ${req.body.ID} was added`});
});

// Llamada para obtener el contenido de place en la DB
app.get('/placelist', async (req: Request, res: Response) => {
	try {
		const places = await Place.find();
		res.json(places);
	} catch (err) {
		res.json({message: err});
	}
});

// LISTEN PORT
app.listen(app.get('port'), () => {
	console.log(`Running port ${app.get('port')}`);
});

// Función para obtener la activity específica
function apiAccess(place: any): any {
	let request = require('request');
	let options = {
		url: `http://fakerestapi.azurewebsites.net/api/Activities/${place}`,
		method: 'GET',
	};
	request(options, (error: any, response: any, body: any) => {
		if (error) {
			throw new Error(error);
		} else {
			apiData = JSON.parse(response.body);
			console.log(Object.values(apiData)[0]);
			var db = mongoose.connection;
			db.on('error', console.error.bind(console, 'connection error'));
			db.once('open', function() {
				console.log('Connection granted');
			})
			let newEnter = new Place({
				ID: Object.values(apiData)[0],
				Title: Object.values(apiData)[1],
				DueDate: Object.values(apiData)[2],
				Completed: Object.values(apiData)[3],
				Id: Object.values(apiData)[4]
			});
			newEnter.save(function (err: any, newEnter: any) {
				if (err) return console.error(err);
				console.log(newEnter + " saved");
			})
		}
	});
}

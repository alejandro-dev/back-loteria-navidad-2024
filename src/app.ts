import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import indexRoutes from './routes/index';
import db from './config/db';

//Configuración variables globales
import dotenv from 'dotenv';

//Configuración fichero de variables de entorno
dotenv.config({path: '../.env'})


//Creamos la app
const app = express();

//Definir un dominio o dominios para recibir peticiones
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Permitir peticiones que no tengan "origin" (como las de Postman o solicitudes locales)
        if (!origin) {
            return callback(null, true); // Permitir si no hay 'origin' definido
        }

        //Revisar si la petición viene de un servidor que está en la whitelist
        const exist = whitelist.some(domain => domain === origin);

        if(exist){
            callback(null, true);
        }else{
            callback(new Error('No permitido por CORS'), false);
        }
    }
}

//Habilitar cors
app.use(cors(corsOptions));

//Habilitar body-parser para poder acceder a los datos que nos envían
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Conexión a la base de datos
// Función asíncrona para la conexión a la base de datos
const connectToDatabase = async () => {
    try {
        await db.authenticate();
        await db.sync();
        console.log('Conexión correcta a la bd');

    } catch (error) {
        console.log(error);
    }
};

// Llamar a la función
connectToDatabase();

//Routing
app.use('/', indexRoutes);

//app.listen(process.env.PORT);
export {
    app,
};

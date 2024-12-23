import {app} from './app'

//CRONJOBS
import cronJobs from './config/cronJobs';

// Iniciar el servidor
const port = process.env.PORT || 3000; // Si no se establece el puerto, usar el 3000 por defecto
const server = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

cronJobs;

export {
    app,
    server,
}
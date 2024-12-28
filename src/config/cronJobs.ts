import cron from 'node-cron';
import premios from "../controllers/premios";

// Definir un cron job que se ejecuta todos los días a medianoche
cron.schedule('* * * * *', () => {
    // Lógica de la tarea que quieres realizar
    premios.getPremios();
});

export default cron;
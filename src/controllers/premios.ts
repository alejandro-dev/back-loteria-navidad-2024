import axios from "axios";
import { Request, Response, NextFunction } from "express";
import Decimo from "../models/Decimo";
import { sendEmail } from "../email";
import User from "../models/User";

// Comprobar números
const getPremios = async () => {
    // Primero obtenemos los números de los arrays de la API (primeros y pedrea)
    const [response1, response2] = await Promise.all([
        axios.get(process.env.API_PRIMEROS!),
        axios.get(process.env.API_PEDREA!)
    ]);

    let primerosArray: number[] = [];
    let pedreaArray: number[] = [];

    if (typeof response1.data === 'string') {
        const apiResponse: string = response1.data;
        const regex = /var primeros = \[(.*?)\];/s;
        const match = apiResponse.match(regex);
        if (match && match[1]) {
            primerosArray = JSON.parse(`[${match[1]}]`);
        }
    }

    if (typeof response2.data === 'string') {
        const apiResponse: string = response2.data;
        const regex = /var pedrea = \[(.*?)\];/s;
        const match = apiResponse.match(regex);
        if (match && match[1]) {
            pedreaArray = JSON.parse(`[${match[1]}]`);
        }
    }

    // Ahora consultamos todos los decimos de la base de datos que no han sido premiados
    const decimos = await Decimo.findAll({
        where: {
          premiado: false
        },
        include: [
            {
                model: User,
                attributes: ['email'],
            },
        ],
    });

    // Consultamos los números 
    for (const decimo of decimos) {
        // Si el número está en primerosArray, marcarlo como premiado
        if (primerosArray.includes(decimo.numero)) decimo.premiado = true;

        if (pedreaArray.includes(decimo.numero)) {
            // Si el número está en pedreaArray, marcarlo como parte de la pedrea y premiado
            decimo.isPredrea = true;
            decimo.premiado = true;
        }

        // Guardamos los cambios en la base de datos
        await decimo.save();

        // Mandamos un correo para avisar de que el número ha sido premiado
        if(decimo.isPredrea || decimo.premiado) {
            try {
                // Generamos el mensaje
                let message = '';
                if(decimo.isPredrea) message = `¡Enhorabuena! Tu número ${decimo.numero} ha sido premiado en la pedrea.`;
                if(!decimo.isPredrea) message = `¡Enhorabuena! Tu número ${decimo.numero} ha sido premiado con un premio gordo`;

                // Enviamos el email
                sendEmail(decimo.user?.email || '', { message: message });

            } catch (error) {
                console.log('Error al enviar el email');
            }
        }
    }
}

// Añadir datos
const addData  = async (req: Request, res: Response) => {
    const { lotteryNumbers, email } = req.body;

    // Comprobamos que se han enviado los datos
    if(!email || lotteryNumbers.length === 0) {
        res.status(400).json({status: 'fail', message: 'Falta campos por rellenar'});
        return;
    }

    // Comprobamos si el email ya está registrado
    const existUser = await User.findOne({where: {email}});
    if(existUser) {
        res.status(400).json({status: 'fail', message: 'El email ya está registrado'});
        return;
    }

    // Añadimos el usuario
    const user = await User.create({email});

    // Añadimos los números
    lotteryNumbers.forEach(async (number: number) =>{
        await Decimo.create({
            numero: number,
            userId: user.id
        });
    });
    
    res.json({status: 'success', message: 'Decimos añadidos correctamente'});
}

export default {
    getPremios,
    addData
}
import { Sequelize, Op } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

const db = new Sequelize(
    process.env.DB_NAME ?? '', 
    process.env.DB_USER ?? '', 
    process.env.DB_PASSWORD ?? '', 
    {
        host: process.env.BD_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Convertir a número
        dialect: 'mysql',
        define: {
            timestamps: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000, 
            idle: 10000
        },
        operatorsAliases: {
            // Explicitly map Sequelize operators
            $eq: Op.eq,
            $ne: Op.ne,
            $gte: Op.gte,
            $gt: Op.gt,
            $lte: Op.lte,
            $lt: Op.lt,
            $not: Op.not,
            $in: Op.in,
            $notIn: Op.notIn,
            $is: Op.is,
            $like: Op.like,
            $notLike: Op.notLike,
            $iLike: Op.iLike,
            $notILike: Op.notILike,
            $between: Op.between,
            $notBetween: Op.notBetween,
            $overlap: Op.overlap,
            $contains: Op.contains,
            $contained: Op.contained,
            $adjacent: Op.adjacent,
            $strictLeft: Op.strictLeft,
            $strictRight: Op.strictRight,
            $noExtendRight: Op.noExtendRight,
            $noExtendLeft: Op.noExtendLeft,
            $and: Op.and,
            $or: Op.or,
            $any: Op.any,
            $all: Op.all,
            $values: Op.values,
            $col: Op.col,
        }
    }
);

export default db;
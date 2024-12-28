import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/db";
import User from "./User";

// Interfaz para las propiedades del modelo
export interface IDecimo {
    id?: number;
    numero: number;
    premiado?: boolean;
    isPredrea?: boolean;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Clase que extiende el modelo con los tipos
class Decimo extends Model<IDecimo> implements IDecimo {
    public id!: number;
    public numero!: number;
    public premiado!: boolean;
    public isPredrea!: boolean;
    public userId!: number;
    public user?: User;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Definir el modelo con tipado
Decimo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        premiado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isPredrea: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        userId: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    },
    {
        sequelize: db, // Conexión a la base de datos
        modelName: 'decimo',
    }
);

// Relaciones
Decimo.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Decimo, { foreignKey: 'userId' });

export default Decimo;

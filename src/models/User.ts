import { DataTypes, Model } from "sequelize";
import db from "../config/db";

// Interfaz para las propiedades del modelo
export interface IUser {
    id?: number;
    email: string;
}

// Clase que extiende el modelo con los tipos
class User extends Model<IUser> implements IUser {
    public id!: number;
    public email!: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Definir el modelo con tipado
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db, // Conexión a la base de datos
        modelName: 'user',
    }
);

export default User;
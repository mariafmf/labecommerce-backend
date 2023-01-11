import { Request, Response } from "express";
import { connection } from "../data/connection";
import { user } from "../types";

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const {name, email, password} = req.body
    let errorCode = 400

    try {

        if (!name) {
            errorCode = 422
            throw new Error("Nome do novo usuário não fornecido.");
        }

        if (!email) {
            errorCode = 422
            throw new Error("E-mail do novo usuário não fornecido.");
        }

        const searchEmail = await connection("labecommerce_users").where('email', email)
        
        if (searchEmail.length > 0) {
            errorCode = 409
            throw new Error("E-mail já cadastrado.");
        }

        if (!password) {
            errorCode = 422
            throw new Error("Senha do novo usuário não fornecida.");
        }

        const newUser: user = {
            id: Date.now().toString(),
            name,
            email,
            password
        }

        await connection("labecommerce_users")
        .insert(newUser)

        res.status(201).send("Novo usuário inserido.")
        
    } catch (error:any) {
        res.status(errorCode).send(error.message)        
    }
}
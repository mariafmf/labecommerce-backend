import { Request, Response } from "express";
import { connection } from "../data/connection";
import { purchases } from "../types";

export const getPurchasesByUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.user_id as string
    let errorCode = 422

    try {

        if (!userId || userId === "user_id") {
            errorCode = 422
            throw new Error("ID de usuário não informado.");
        }

        const getUser = await connection("labecommerce_users")
        .where('id', userId)

        if (getUser.length < 1) {
            errorCode = 422
            throw new Error("ID de usuário não encontrado.");
        }

        const user = await connection.select("name", "id")
        .from("labecommerce_users")
        .where('id', userId)

        const purchases: purchases[] = await connection.select("labecommerce_products.name as productName", "labecommerce_products.id as productId", "quantity", "total_price as totalPrice")
        .from("labecommerce_purchases")
        .join('labecommerce_products', 'product_id', '=', 'labecommerce_products.id')
        .where('user_id', userId)

        const result = {
            "user": user[0].name,
            "id": user[0].id,
            "purchases": purchases
        }
  
        res.status(200).send(result)

    } catch (error: any) {
        res.status(500).send(error.message)
    }
}
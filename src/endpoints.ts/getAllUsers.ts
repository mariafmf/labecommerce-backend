import { Request, Response } from "express";
import { connection } from "../data/connection";
import { user } from "../types";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {

        const users: user[] = await connection("labecommerce_users")

        for (let i = 0; i < users.length; i++) {
            const purchases = await connection.select("labecommerce_products.name as productName", "labecommerce_products.id as productId", "quantity", "total_price as totalPrice")
            .from("labecommerce_purchases")
            .join('labecommerce_products', 'product_id', '=', 'labecommerce_products.id')
            .where('user_id', users[i].id)

            users[i].purchases = purchases
        }
        
        res.status(200).send(users)

    } catch (error: any) {
        res.status(500).send(error.message)
    }
}
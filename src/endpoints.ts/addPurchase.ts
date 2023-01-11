import { Request, Response } from "express";
import { connection } from "../data/connection";
import { product } from "../types";

export const addPurchase = async (req: Request, res: Response): Promise<void> => {
    const {userId, productId, quantity} = req.body
    let errorCode = 400

    try {
        if (!userId) {
            errorCode = 422
            throw new Error("ID de usuário não informado.");
        }

        const getUser = await connection("labecommerce_users")
        .where('id', userId)

        if (getUser.length < 1) {
            errorCode = 422
            throw new Error("ID de usuário não encontrado.");
        }

        if (!productId) {
            errorCode = 422
            throw new Error("ID de produto não informado.");
        }

        const getProduct = await connection("labecommerce_products")
        .where('id', productId)

        if (getProduct.length < 1) {
            errorCode = 422
            throw new Error("ID de produto não encontrado.");
        }

        if (isNaN(quantity) || quantity <= 0) {
            errorCode = 422
            throw new Error("Quantidade precisa ser um número maior que 0.");
        }

        const getPrice = await connection("labecommerce_products")
        .select("price")
        .where('id', productId)
        
        const price = JSON.parse(JSON.stringify(getPrice))

        const totalPrice = price[0].price * quantity

        const newPurchase = {
            id: Date.now().toString(),
            user_id: userId,
            product_id: productId,
            quantity,
            total_price: totalPrice
        }

        await connection("labecommerce_purchases")
        .insert(newPurchase)

        res.status(201).send("Compra inserida.")

    } catch (error:any) {
        res.status(errorCode).send(error.message)
    }
}
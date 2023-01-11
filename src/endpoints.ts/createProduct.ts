import { Request, Response } from "express";
import { connection } from "../data/connection";
import { product } from "../types";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const {name, price, image_url} = req.body
    let errorCode = 400

    try {
        if (!name && !price && !image_url) {
            errorCode = 422
            throw new Error("Adicione o nome, preço e url da imagem do produto.");
        }
        
        if (!name) {
            errorCode = 422
            throw new Error("Adicione o nome do produto");
        }

        if (isNaN(price) || price <= 0) {
            errorCode = 422
            throw new Error("Adicione um preço válido para o produto.");
        }

        if (!image_url) {
            errorCode = 422
            throw new Error("Adicione a url da imagem do produto.");
        }

        const newProduct: product = {
            id: Date.now().toString(),
            name: name,
            price: price.toFixed(2),
            image_url
        }

        await connection("labecommerce_products")
        .insert(newProduct)

        res.status(201).send("Produto adicionado.")

    } catch (error:any) {
        res.status(errorCode).send(error.message)
    }
}
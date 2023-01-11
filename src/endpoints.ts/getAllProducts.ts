import { Request, Response } from "express";
import { connection } from "../data/connection";

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    let search = req.query.search as string
    let order = req.query.order as string

    try {

        if (!search) {
            search = "%"
        }

        if (order && order.toUpperCase() !== "ASC" && order.toUpperCase() !== "DESC") {
            order = "ASC"
        }

        const result = await connection("labecommerce_products")
        .where("name", "like", `%${search}%`)
        .orderBy("name", order)

        res.status(200).send(result)

    } catch (error: any) {
        res.status(500).send(error.message)
    }
}
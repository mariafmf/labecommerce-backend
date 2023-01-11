export type user = {
    id: string,
    name: string,
    email: string,
    password: string
    purchases?: purchases[]
}

export type product = {
    id: string,
    name: string,
    price: number,
    image_url: string
}

export type purchases = {
    productName: string,
    productId: string,
    quantity: number,
    totalPrice: number
}
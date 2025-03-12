import fs from "fs"
export class CartsManager_FS {

    #path="../data/carts.json"
    constructor(rutaArchivo){
        this.#path=rutaArchivo
    }

    async getCarts() {
            try {
                if (fs.existsSync(this.#path)) {
                    const data = await fs.promises.readFile(this.#path, { encoding: "utf-8" })
                    return JSON.parse(data)
                } else {
                    return []
                }
            } catch (error) {
                console.error("Error al leer el archivo de productos:", error)
                return []
            }
    }

    async addCartsProducts(productId, productManager) {
        try {
            
            const allProducts = await productManager.getProducts()
            
            const productExists = allProducts.find(product => product.id === productId)
            if (!productExists) {
                console.error(`El producto con id ${productId} no existe.`)
                return null
            }

            
            const carts = await this.getCarts()
            
            let newId = 1
            if (carts.length > 0) {
                newId = Math.max(...carts.map(cart => cart.id)) + 1
            }

            const newCart = {
                id: newId,
                products: [{ id: productId, quantity: 1 }]
            }

            carts.push(newCart);
            await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 5))
            return newCart;
        } catch (error) {
            console.error("Error al agregar el carrito:", error)
            return null
        }
    }

    async addProductToCart(cartId, productId, productManager) {
        try {
            const numericCartId = Number(cartId)
            const numericProductId = Number(productId)
    
            if (isNaN(numericCartId) || isNaN(numericProductId)) {
                console.error("El ID del carrito o del producto no es un número válido.")
                return null
            }
               
            const allProducts = await productManager.getProducts()
            const productExists = allProducts.find(product => product.id === numericProductId)
            if (!productExists) {
                console.error(`El producto con id ${numericProductId} no existe.`)
                return null
            }
    
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === numericCartId)
            if (!cart) {
                console.error(`El carrito con id ${numericCartId} no existe.`)
                return null;
            }
    
            const productInCart = cart.products.find(p => p.id === numericProductId)
            if (productInCart) {
                productInCart.quantity += 1
            } else {
                cart.products.push({ id: numericProductId, quantity: 1 })
            }
    
            await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 5))
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error)
            return null
        }
    }

    async eraseProductFromCart(cartId, productId) {
        try {
            const numericCartId = Number(cartId)
            const numericProductId = Number(productId)
    
            if (isNaN(numericCartId) || isNaN(numericProductId)) {
                console.error("El ID del carrito o del producto no es un número válido.")
                return null
            }
    
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === numericCartId)
            if (!cart) {
                console.error(`El carrito con id ${numericCartId} no existe.`)
                return null;
            }
    
            const productInCart = cart.products.find(p => p.id === numericProductId)
            if (!productInCart) {
                console.error(`El producto con id ${numericProductId} no está en el carrito.`)
                return null;
            }
    
            if (productInCart.quantity > 1) {
                productInCart.quantity -= 1
            } else {
                cart.products = cart.products.filter(p => p.id !== numericProductId)
            }
    
            await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 5))
            return cart;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error)
            return null
        }
    }

    async getCartsByID(id) {
        try {
            const numericId = Number(id)
            if (isNaN(numericId)) {
                console.log(`El ID ${id} no es un número válido`)
                return null
            }
    
            const carts = await this.getCarts()
            const cart = carts.find(cart => cart.id === numericId)
            if (!cart) {
                console.log(`No se encontró el carrito con ID ${numericId}`)
                return null
            }
            return cart
        } catch (error) {
            console.error("Error al obtener el carrito:", error)
            return null;
        }
    }

    async deleteCartById(cartId) {
        try {
            const numericCartId = Number(cartId)
    
            if (isNaN(numericCartId)) {
                console.error("El ID del carrito no es un número válido.")
                return null
            }
    
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === numericCartId)
            if (cartIndex === -1) {
                console.error(`El carrito con id ${numericCartId} no existe.`)
                return null;
            }
    
            carts.splice(cartIndex, 1)
    
            await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 5))
            return true;
        } catch (error) {
            console.error("Error al eliminar el carrito:", error)
            return null
        }
    }
}
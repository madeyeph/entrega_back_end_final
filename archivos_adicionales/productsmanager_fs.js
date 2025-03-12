import fs from "fs"
export class ProductsManager_FS {

    #path="../data/products.json"
    constructor(rutaArchivo){
        this.#path=rutaArchivo
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.#path)) {
                const data = await fs.promises.readFile(this.#path, { encoding: "utf-8" })
                return JSON.parse(data)
            } else {
                return []
            }
        } catch (error) {
            console.error("Error al leer el archivo de productos:", error)
            return [];
        }
    }

    async addProducts(title, description, price, code, stock) {
        
        if (!title || !description || price === undefined || !code || stock === undefined) {
            console.log('Se necesitan todos los elementos para crear un producto!')
            return
        }
        
        
        if (isNaN(price)) {
            console.log('El precio debe ser un valor numérico.')
            return
        }
        price = Number(price)
        
        if (isNaN(stock)) {
            console.log('El stock debe ser un valor numérico.')
            return
        }
        stock = Number(stock)
    
        
        let products = await this.getProducts()
    
        
        let id = 1
        if (products.length > 0) {
            id = Math.max(...products.map(product => product.id)) + 1
        }
    
        
        const existeCode = products.find(product => product.code === code)
        if (existeCode) {
            console.log(`El código ${code} ya existe para otro producto.`)
            return;
        }
    
        
        let newProduct = { id, title, description, price, code, stock, status:true }
    
        
        products.push(newProduct)
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 5))
        return newProduct
    }

    async getProductByID(id) {
        let products = await this.getProducts()
        return products.find((product) => product.id === id) || null
    }

    async updateProduct(id, updatedFields) {

        let products = await this.getProducts()
    
        const index = products.findIndex(product => product.id === id)
        if (index === -1) {
            console.log(`No se encontró el producto con ID ${id}`)
            return null
        }
    
        if ('id' in updatedFields) {
            delete updatedFields.id
        }
    
        products[index] = { ...products[index], ...updatedFields }
    
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 5))
        return products[index]
    }
    

    async eraseProduct(id) {
        let products = await this.getProducts()
        const newProducts = products.filter(product => product.id !== id);

    if (products.length === newProducts.length) {
        console.log(`No se encontró ningún producto con ID ${id}`)
        return null;
    }

    await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 5))
    console.log(`Producto con ID ${id} eliminado correctamente.`)
    return true
    }

}
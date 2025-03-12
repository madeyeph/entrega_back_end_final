import { productsModel } from "./models/productsmodels.js"
import { procesaErrores } from '../utils.js'

export class ProductsManager {
  static async getProducts(page, sort) {
    try {
      let options = {}

      if (page) {
        options = {
          page: page,
          limit: 4,
        };
      }

      let sortOptions = {}
      if (sort === 'asc') {
        sortOptions = { price: 1 }
      } else if (sort === 'desc') {
        sortOptions = { price: -1 }
      }

      if (page) {
        options.sort = sortOptions
        return await productsModel.paginate({}, options)
      } else {
        return await productsModel.find({}).sort(sortOptions)
      }
    } catch (error) {
      console.error("Error en getProducts:", error)
      throw error
    }
  }

  static async getProductById(id) {

    try {
        const product = await productsModel.findOne({ id: parseInt(id) })

        if (!product) {
            return { error: `Producto con ID ${id} no encontrado`, code: 404 }
        }

        return product
    } catch (error) {
        console.error(`ProductManager.getProductById: Error en la ejecución con ID ${id}:`, error)
        return { error: error.message, code: 500 }
    }
}

  static async getProductBy(filter = {}) {
    try {
      return await productsModel.findOne(filter)
    } catch (error) {
      console.error("Error en getProductBy:", error)
      procesaErrores(error, res)
    }
  }

  static async addProduct(product) {
    try {
        return await productsModel.create(product)
    } catch (error) {
        console.error("Error en addProduct:", error)
        return {error: error.message, code: 500}
    }
}

static async updateProduct(id, product) {

    try {
        const updatedProduct = await productsModel.findOneAndUpdate({ id: parseInt(id) }, product, { new: true })

        if (!updatedProduct) {
            return { error: `Producto con ID ${id} no encontrado`, code: 404 }
        }

        return { message: `Producto con ID ${id} actualizado correctamente`, product: updatedProduct }
    } catch (error) {
        console.error(`ProductManager.updateProduct: Error en la ejecución con ID ${id}:`, error)
        return {error: error.message, code: 500}
    }
}

static async deleteProduct(id) {
    try {
        const deletedProduct = await productsModel.findOneAndDelete({ id: parseInt(id) })

        if (!deletedProduct) {
            return { error: `Producto con ID ${id} no encontrado`, code: 404 }
        }

        return { message: `Producto con ID ${id} eliminado correctamente`, product: deletedProduct }
    } catch (error) {
        console.error(`ProductManager.deleteProduct: Error en la ejecución con ID ${id}:`, error)
        return {error: error.message, code: 500}
    }
}
}
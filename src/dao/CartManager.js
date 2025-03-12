import { cartsModel } from "./models/cartsmodels.js"
import { productsModel } from "./models/productsmodels.js"
import mongoose from "mongoose"

export class CartsManager {
  static async getCarts() {
    try {
      return await cartsModel.find().populate("products.product")
    } catch (error) {
      console.error("Error en getCarts:", error)
      return { error: error.message, code: 500 }
    }
  }

  static async getCartById(cartId) {
    try {
        const cart = await cartsModel.findOne({ id: parseInt(cartId) }).populate("products.product");
        if (!cart) {
            return { error: `Carrito con ID ${cartId} no encontrado`, code: 404 }
        }
        return cart
    } catch (error) {
        console.error(`Error en getCartByCustomId con ID ${cartId}:`, error)
        return { error: error.message, code: 500 }
    }
}

  static async addCart(cart) {
    try {
        const lastCart = await cartsModel.findOne().sort({ id: -1 }).limit(1)
        const lastId = lastCart ? lastCart.id : 0
        const newCartId = lastId + 1
        const newCart = { id: newCartId, ...cart }
        return await cartsModel.create(newCart)
    } catch (error) {
        console.error("Error en addCart:", error)
        return { error: error.message, code: 500 }
    }
}
static async addProductToCart(cartId, productId) {
  try {

      if (isNaN(cartId) || isNaN(productId)) {
          return { error: "ID de carrito o producto no válido (no es un número)", code: 400 }
      }

      const cart = await cartsModel.findOne({ id: parseInt(cartId) })
      if (!cart) {
          return { error: `Carrito con ID ${cartId} no encontrado`, code: 404 }
      }

      const product = await productsModel.findOne({ id: parseInt(productId) })
      if (!product) {
          return { error: `Producto con ID ${productId} no encontrado`, code: 404 }
      }

      const productMongooseId = product._id

      const productIndex = cart.products.findIndex(
          (p) => p.product.toString() === productMongooseId.toString()
      )

      if (productIndex !== -1) {
          cart.products[productIndex].quantity += 1
      } else {
          cart.products.push({ product: productMongooseId, quantity: 1 })
      }

      await cart.save()
      return cart
  } catch (error) {
      console.error(`Error en addProductToCart con carrito ID ${cartId} y producto ID ${productId}:`, error)
      return { error: error.message, code: 500 }
  }
}

static async removeProductFromCart(cartId, productId) {
  try {
      console.log("removeProductFromCart:", cartId, productId)

      if (isNaN(cartId) || isNaN(productId)) {
          return { error: "ID de carrito o producto no válido (no es un número)", code: 400 }
      }

      const cart = await cartsModel.findOne({ id: parseInt(cartId) })
      console.log("Carrito encontrado:", cart)
      if (!cart) {
          return { error: `Carrito con ID ${cartId} no encontrado`, code: 404 }
      }

      const product = await productsModel.findOne({ id: parseInt(productId) })
      if (!product) {
          return { error: `Producto con ID ${productId} no encontrado`, code: 404 }
      }

      const productMongooseId = product._id

      const productIndex = cart.products.findIndex(
          (p) => p.product.toString() === productMongooseId.toString()
      )

      if (productIndex !== -1) {
          cart.products.splice(productIndex, 1)
          await cart.save()
          return cart
      }

      return { error: `Producto con ID ${productId} no encontrado en el carrito`, code: 404 }
  } catch (error) {
      console.error(`Error en removeProductFromCart con carrito ID ${cartId} y producto ID ${productId}:`, error)
      return { error: error.message, code: 500 }
  }
}

static async updateQuantity(cartId, productId, quantity) {

  try {
      if (isNaN(cartId)) {
          return { error: "ID de carrito no válido (no es un número)", code: 400 }
      }

      if (isNaN(productId)) {
          return { error: "ID de producto no válido (no es un número)", code: 400 }
      }

      if (isNaN(quantity)) {
          return { error: "Cantidad no válida (no es un número)", code: 400 }
      }

      const cart = await cartsModel.findOne({ id: parseInt(cartId) })
      if (!cart) {
          return { error: `Carrito con ID ${cartId} no encontrado`, code: 404 }
      }

      const product = await productsModel.findOne({ id: parseInt(productId) })
      if (!product) {
          return { error: `Producto con ID ${productId} no encontrado`, code: 404 }
      }

      const productMongooseId = product._id

      const productIndex = cart.products.findIndex(
          (p) => p.product.toString() === productMongooseId.toString()
      )

      if (productIndex !== -1) {
          cart.products[productIndex].quantity = quantity
          await cart.save()
          return cart
      }

      return { error: `Producto con ID ${productId} no encontrado en el carrito`, code: 404 }
  } catch (error) {
      console.error(
          `CartManager.updateQuantity: Error en la ejecución con carrito ID ${cartId}, producto ID ${productId} y cantidad ${quantity}:`,
          error
      )
      return { error: error.message, code: 500 }
  }
}

  static async clearCart(cartId) {

    try {
        if (isNaN(cartId)) {
            return { error: "ID de carrito no válido (no es un número)", code: 400 }
        }

        const cart = await cartsModel.findOne({ id: parseInt(cartId) })

        if (!cart) {
            return { error: `Carrito con ID ${cartId} no encontrado`, code: 404 }
        }

        cart.products = []
        await cart.save()
        return { message: `Carrito con ID ${cartId} vaciado correctamente`, cart: cart }
    } catch (error) {
        console.error(`CartManager.clearCart: Error en la ejecución con ID ${cartId}:`, error)
        return { error: error.message, code: 500 }
    }
}

static async deleteCart(cartId) {

  try {
      if (isNaN(cartId)) {
          return { error: "ID de carrito no válido (no es un número)", code: 400 }
      }

      const deletedCart = await cartsModel.findOne({ id: parseInt(cartId) })

      if (!deletedCart) {
          return { error: `Carrito con ID ${cartId} no encontrado`, code: 404 }
      }

      await cartsModel.deleteOne({ id: parseInt(cartId) })

      return { message: `Carrito con ID ${cartId} eliminado correctamente`, deletedCart: deletedCart }
  } catch (error) {
      console.error(`CartManager.deleteCart: Error en la ejecución con ID ${cartId}:`, error)
      return { error: error.message, code: 500 }
  }
}

}
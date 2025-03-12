import { Router } from "express"
import { CartsManager } from "../dao/CartManager.js"
import { cartsModel } from "../dao/models/cartsmodels.js"
import { ProductsManager } from '../dao/ProductManager.js'
import { procesaErrores } from '../utils.js'

export const router2 = Router()

router2.get("/", async (req, res) => {
  try {
    const result = await CartsManager.getCarts()
    if (result && result.code === 500) {
      return procesaErrores({ message: result.error }, res)
    }
    res.setHeader("Content-Type", "application/json")
    return res.status(200).json({ payload: result })
  } catch (error) {
    procesaErrores(error, res)
  }
})

router2.get("/:cid", async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const cartId = req.params.cid
  try {
    const result = await CartsManager.getCartById(cartId)
    if (result && result.code === 500) {
      return procesaErrores({ message: result.error }, res)
    }
    if (result.code === 400 || result.code === 404) {
      return res.status(result.code).json({ error: result.error })
    }
    return res.status(200).json({ payload: result })
  } catch (error) {
    procesaErrores(error, res)
  }
})

router2.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  try {
      const result = await CartsManager.addCart({ products: [] })
      return res.status(201).json({ payload: result, message: "Carrito creado exitosamente" })
  } catch (error) {
      console.error("Error al crear carrito:", error)
      return res.status(500).json({ error: "Error interno del servidor" })
  }
})

router2.post("/add-product", async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const cartId = parseInt(req.body.cartId.trim())
  const productId = parseInt(req.body.productId.trim())

  if (isNaN(cartId) || isNaN(productId)) {
      return res.status(400).json({ error: "ID de carrito o producto no válido (no es un número)" })
  }

  try {
      const result = await CartsManager.addProductToCart(cartId, productId)
      if (result && result.code === 500) {
          return procesaErrores({ message: result.error }, res)
      }
      if (result.code === 400 || result.code === 404) {
          return res.status(result.code).json({ error: result.error })
      }
      return res.status(200).json({ payload: result })
  } catch (error) {
      procesaErrores(error, res)
  }
})

router2.post("/:cid/products/:pid", async (req, res) => {
    res.setHeader("Content-Type", "application/json")
    const cartId = parseInt(req.params.cid.trim(), 10)
    const productId = parseInt(req.params.pid.trim(), 10)


    if (isNaN(cartId) || isNaN(productId)) {
        return res.status(400).json({ error: "ID de carrito o producto no válido (no es un número)" })
    }

    try {
        const cart = await cartsModel.findOne({ id: cartId })
        if (!cart) {
            return res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado` })
        }

        const product = await ProductsManager.getProductById(productId)
        if (!product) {
            return res.status(404).json({ error: `Producto con ID ${productId} no encontrado` })
        }

        const result = await CartsManager.addProductToCart(cartId, productId)
        if (result && result.code === 500) {
            return procesaErrores({ message: result.error }, res)
        }
        if (result.code === 400 || result.code === 404) {
            return res.status(result.code).json({ error: result.error })
        }
        return res.status(200).json({ payload: result })
    } catch (error) {
        procesaErrores(error, res)
    }
})

router2.delete("/:cid/products/:pid", async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const cartId = req.params.cid
  const productId = req.params.pid
  try {
    const result = await CartsManager.removeProductFromCart(cartId, productId)
    if (result && result.code === 500) {
      return procesaErrores({ message: result.error }, res)
    }
    if (result.code === 400 || result.code === 404) {
      return res.status(result.code).json({ error: result.error })
    }
    return res.status(200).json({ payload: result })
  } catch (error) {
    procesaErrores(error, res)
  }
})

router2.delete("/:cid/products", async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const cid = req.params.cid

  console.log("Router clearCart: ID recibido en la solicitud:", cid)

  try {
      const result = await CartsManager.clearCart(cid)

      console.log("Router clearCart: Resultado de CartsManager.clearCart:", result)

      if (result && result.code === 500) {
          return procesaErrores({ message: result.error }, res)
      }
      if (result.code === 400 || result.code === 404) {
          return res.status(result.code).json({ error: result.error })
      }
      return res.status(200).json({
          message: "Carrito vaciado exitosamente",
          clearedCart: result.cart
      });
  } catch (error) {
      console.error("Router clearCart: Error en la ejecución:", error)
      procesaErrores(error, res)
  }
})

router2.delete("/:cid", async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const cid = req.params.cid

  try {
      const result = await CartsManager.deleteCart(cid)


      if (result && result.code === 500) {
          return procesaErrores({ message: result.error }, res)
      }
      if (result.code === 400 || result.code === 404) {
          return res.status(result.code).json({ error: result.error })
      }
      return res.status(200).json({
          message: "Carrito eliminado exitosamente",
          deletedCart: result.deletedCart
      });
  } catch (error) {
      procesaErrores(error, res);
  }
})

router2.put("/:cid/products/:pid", async (req, res) => {
  res.setHeader("Content-Type", "application/json")
  const cid = req.params.cid
  const pid = req.params.pid
  const quantity = req.body.quantity

  try {
      const result = await CartsManager.updateQuantity(cid, pid, quantity)

      if (result && result.code === 500) {
          return procesaErrores({ message: result.error }, res)
      }
      if (result.code === 400 || result.code === 404) {
          return res.status(result.code).json({ error: result.error })
      }
      return res.status(200).json({
          message: "Cantidad de producto actualizada exitosamente",
          updatedCart: result
      });
  } catch (error) {
      console.error("Router updateQuantity: Error en la ejecución:", error)
      procesaErrores(error, res)
  }
})
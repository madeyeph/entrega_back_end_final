import { Router } from "express"
import { ProductsManager } from "../dao/ProductManager.js"
import { CartsManager } from "../dao/CartManager.js"
import { procesaErrores } from '../utils.js'

export const router3 = Router()

router3.get("/", async (req, res) =>{
  
  res.render('inicio')

})


router3.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const sort = req.query.sort
    const result = await ProductsManager.getProducts(page, sort)

    if (!result) {
      return procesaErrores({ message: "Error al obtener productos paginados" }, res)
    }

    let realProducts = []
    if (result && result.docs) {
      realProducts = result.docs.map(product => product.toObject())
    }

    let paginationInfo = {};
    if (result && result.totalPages) {
      paginationInfo = {
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
      }
    }

    res.render("products", {
      products: realProducts,
      pagination: paginationInfo,
    })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    procesaErrores(error, res)
  }
})

router3.get("/products/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid)
    console.log("ID del producto:", pid)

    const product = await ProductsManager.getProductBy({ id: pid })
    console.log("Producto encontrado:", product)

    if (!product) {
      return res.status(404).send("Producto no encontrado")
    }

    const realProduct = product.toObject()

    res.render("productDetails", { product: realProduct })
  } catch (error) {
    console.error("Error al obtener el producto:", error)
    procesaErrores(error, res)
  }
})

router3.get("/carts", async (req, res) => {
  try {
      const carts = await CartsManager.getCarts()

      if (!carts) {
          return procesaErrores({ message: "Error al obtener los carritos" }, res)
      }

      let realCarts = []
      if (carts && carts.length > 0) {
          realCarts = await Promise.all(carts.map(async cart => {
              const cartObject = cart.toObject()
              cartObject.products = await Promise.all(cartObject.products.map(async product => {
                  let productId
                  if(typeof product.product === 'object' && product.product !== null && product.product.id !== undefined){
                      productId = product.product.id
                  } else {
                      productId = parseInt(product.product, 10)
                  }

                  if (isNaN(productId)) {
                      return {
                          product: `Producto no encontrado (ID original: ${product.product})`,
                          quantity: product.quantity
                      }
                  }

                  try {
                      const productData = await ProductsManager.getProductById(productId)

                      if (productData) {
                          return {
                              product: productData.id,
                              quantity: product.quantity
                          }
                      } else {
                          return {
                              product: `Producto no encontrado (ID original: ${product.product})`,
                              quantity: product.quantity
                          }
                      }
                  } catch (error) {
                      console.error("Error al procesar producto:", error)
                      return {
                          product: `Error al procesar producto (ID original: ${product.product})`,
                          quantity: product.quantity
                      }
                  }
              }))
              return cartObject;
          }))
      }

      res.render("carts", {
          carts: realCarts,
      })
  } catch (error) {
      console.error("Error al obtener los carritos:", error)
      procesaErrores(error, res)
  }
})

router3.get("/carts/:id", async (req, res) => {
  try {
      const cartId = req.params.id
      const cart = await CartsManager.getCartById(cartId)

      if (!cart) {
          return procesaErrores({ message: "Carrito no encontrado" }, res)
      }

      const cartObject = {
          id: cart.id,
          products: cart.products.map(product => {
              return {
                  product: product.product.id,
                  quantity: product.quantity
              }
          })
      }

      res.render("cartsDetails", {
          cart: cartObject,
      });
  } catch (error) {
      console.error("Error al obtener el carrito:", error)
      procesaErrores(error, res)
  }
})
import mongoose from "mongoose"

    const cartsCollection = "carts"

    const cartSchema = new mongoose.Schema(
      {
        id: { type: Number, unique: true },
        products: [
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "products",
              required: true,
            },
            quantity: { type: Number, required: true, min: 1 },
          },
        ],
      },
      {
        timestamps: true,
        strict: true,
      }
    )

    export const cartsModel = mongoose.model(cartsCollection, cartSchema)
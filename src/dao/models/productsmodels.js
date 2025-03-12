import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

const productsCollection = "products"

const productsSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    description: String,
    price: Number,
    code: {
      type: String,
      required: true,
      unique: true,
    },
    stock: Number,
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
)

productsSchema.plugin(paginate)


export const productsModel = mongoose.model(productsCollection, productsSchema)
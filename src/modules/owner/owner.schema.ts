
import * as mongoose from 'mongoose'

export const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchaseDate: { type: Date, required: true }
})

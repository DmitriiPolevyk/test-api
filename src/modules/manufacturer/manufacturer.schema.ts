
import * as mongoose from 'mongoose'

export const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: false },
  siret: { type: Number, required: false }
})

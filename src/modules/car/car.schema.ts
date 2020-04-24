import * as mongoose from 'mongoose'
import { manufacturerSchema } from '../manufacturer/manufacturer.schema'
import { ownerSchema } from '../owner/owner.schema'

export const carSchema = new mongoose.Schema({
  manufacturer: { type: manufacturerSchema },
  price: { type: Number, required: true },
  firstRegistrationDate: { type: Date, required: true },
  owners : { type: [ownerSchema] }
})

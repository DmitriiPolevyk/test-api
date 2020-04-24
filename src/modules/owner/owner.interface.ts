import { Document } from 'mongoose'

export interface Owner extends Document {
  id: string
  name: string
  purchaseDate: Date
}
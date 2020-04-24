import { Document } from 'mongoose'

export interface Manufacturer extends Document {
  id: string
  name: string
  phone: string
  siret: number
}
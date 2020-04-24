import { Document } from 'mongoose'
import { Manufacturer } from '../manufacturer/manufacturer.interface'
import { Owner } from '../owner/owner.interface'

export interface Car extends Document {
  id: string
  manufacturer: Manufacturer
  price: number
  firstRegistrationDate: Date
  owners: [Owner]
}
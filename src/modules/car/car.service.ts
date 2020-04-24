import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Car } from './car.interface'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { convertMonthToDate } from '../../common/date-utils'

@Injectable()
export class CarService {
  constructor(@InjectModel('Car') private readonly carModel: Model<Car>) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = new this.carModel(createCarDto)
    return await car.save()
  }

  async findAll(): Promise<any> {
    const result = await this.carModel.find({})
    const count = await this.carModel.countDocuments()

    return { count, result }
  }

  async findById(id: string): Promise<Car> {
    const car = await this.carModel.findById(id)
    if (!car) throw new HttpException(`Cannot find car with id ${id}`, HttpStatus.NOT_FOUND)

    return car
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.carModel.findById(id)
    if (!car) throw new HttpException(`Cannot update car with id ${id}, because it was not found`, HttpStatus.NOT_FOUND)

    await car.updateOne(updateCarDto)
    return this.carModel.findById(id)
  }

  async deleteById(id: string) {
    const car = await this.carModel.deleteOne({ _id: id })
    if (!car) throw new HttpException(`Cannot find car with id ${id}`, HttpStatus.NOT_FOUND)

    return { deletedCount: car.deletedCount}
  }

  async fetchManufacturerByCarId(id: string): Promise<Car> {
    const manufacturer = await this.carModel.findOne({ _id: id }, { manufacturer: 1 } )
    if (!manufacturer) throw new HttpException(`Cannot find manufacturer for car with id ${id}`, HttpStatus.NOT_FOUND)

    return manufacturer
  }

  async syncOldOwnersAndSetDiscount() {
    const oldOwners = await this.carModel.updateMany(
      {},
      {
        $pull: { owners: { purchaseDate: { $lte: convertMonthToDate(18) } } }
      }
    )

    const discountCars = await this.carModel.updateMany(
      {
        firstRegistrationDate: { $lte: convertMonthToDate(12), $gte: convertMonthToDate(18) }
      },
      { $mul: { price: 0.8 } },
    )

    return { removedOldOwnersCount: oldOwners.nModified, SetDiscountTocarsCount: discountCars.nModified }
  }
}
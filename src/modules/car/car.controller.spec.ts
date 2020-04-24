import { CarController } from './car.controller'
import { CarService } from './car.service'
import { carSchema } from './car.schema'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'
import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { Connection } from '../db/mongo'

describe('car', () => {
  let carController: CarController
  let app: TestingModule
  const carInput: CreateCarDto = {
    manufacturer: {
      name: 'manufacturer1',
      phone: '380991234567',
      siret: 111122223333,
    },
    price: 1000,
    firstRegistrationDate: new Date('2020-04-23'),
    owners: [ { name: 'owner1', purchaseDate: new Date('2020-04-23') } ],
  }

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [Connection, MongooseModule.forFeature([{ name: 'Car', schema: carSchema }])],
      controllers: [CarController],
      providers: [CarService]
    }).compile()

    carController = app.get<CarController>(CarController)
  })

  afterAll(async () => {
    await app.close()
  })

  describe('controller', () => {
    it('should create car', async () => {
      expect.assertions(9)
      const result = await carController.create(carInput)

      expect(result.id).toBeDefined()
      expect(result.manufacturer.name).toEqual(carInput.manufacturer.name)
      expect(result.manufacturer.phone).toEqual(carInput.manufacturer.phone)
      expect(result.manufacturer.siret).toEqual(carInput.manufacturer.siret)
      expect(result.price).toEqual(carInput.price)
      expect(result.firstRegistrationDate).toEqual(carInput.firstRegistrationDate)
      expect(result.owners[0].id).toBeDefined()
      expect(result.owners[0].name).toEqual(carInput.owners[0].name)
      expect(result.owners[0].purchaseDate).toEqual(carInput.owners[0].purchaseDate)
    })

    it('should find all cars', async () => {
      expect.assertions(2)
      await carController.create(carInput)
      const car = Object.assign(carInput, { price: 2000, firstRegistrationDate: new Date(Date.now()) })
      await carController.create(car)
      const cars = await carController.findAll()

      expect(cars.count).toBeDefined()
      expect(cars.result).toBeInstanceOf(Array)
    })

    it('should find car by id', async () => {
      expect.assertions(9)
      const car = await carController.create(carInput)
      const result = await carController.findById(car.id)

      expect(result.id).toEqual(car.id)
      expect(result.manufacturer.name).toEqual(carInput.manufacturer.name)
      expect(result.manufacturer.phone).toEqual(carInput.manufacturer.phone)
      expect(result.manufacturer.siret).toEqual(carInput.manufacturer.siret)
      expect(result.price).toEqual(carInput.price)
      expect(result.firstRegistrationDate).toEqual(carInput.firstRegistrationDate)
      expect(result.owners[0].id).toBeDefined()
      expect(result.owners[0].name).toEqual(carInput.owners[0].name)
      expect(result.owners[0].purchaseDate).toEqual(carInput.owners[0].purchaseDate)
    })

    it('should update car', async () => {
      expect.assertions(9)
      const car = await carController.create(carInput)
      const carUpdate: UpdateCarDto = Object.assign(carInput, { price: 2000, firstRegistrationDate: new Date(Date.now()) })
      const result = await carController.update(car.id, carUpdate)

      expect(result.id).toEqual(car.id)
      expect(result.manufacturer.name).toEqual(carInput.manufacturer.name)
      expect(result.manufacturer.phone).toEqual(carInput.manufacturer.phone)
      expect(result.manufacturer.siret).toEqual(carInput.manufacturer.siret)
      expect(result.price).toEqual(carUpdate.price)
      expect(result.firstRegistrationDate).toEqual(carUpdate.firstRegistrationDate)
      expect(result.owners[0].id).toBeDefined()
      expect(result.owners[0].name).toEqual(carInput.owners[0].name)
      expect(result.owners[0].purchaseDate).toEqual(carInput.owners[0].purchaseDate)
    })

    it('should delete car by id', async () => {
      const car = await carController.create(carInput)
      const result = await carController.deleteById(car.id)

      expect(result.deletedCount).not.toBeNull()
    })

    it('should fetch manufacturer by car id', async () => {
      const car = await carController.create(carInput)
      const result = await carController.fetchManufacturerByCarId(car.id)

      expect(result.manufacturer.name).toBe(carInput.manufacturer.name)
    })

    it('should update car', async () => {
      expect.assertions(5)
      const carCreate1 = Object.assign(carInput, {
        price: 1000,
        firstRegistrationDate: new Date('2019-04-23'),
        owners: [
          { name: 'owner1', purchaseDate: new Date('2018-04-23') },
          { name: 'owner2', purchaseDate: new Date('2020-04-23') },
        ]
      })
      const car1 = await carController.create(carCreate1)

      const carCreate2 = Object.assign(carInput, {
        price: 1000,
        firstRegistrationDate: new Date('2020-04-23'),
        owners: [
          { name: 'owner1', purchaseDate: new Date('2020-01-23') },
          { name: 'owner2', purchaseDate: new Date('2020-04-23') },
        ]
      })
      const car2 = await carController.create(carCreate2)

      await carController.syncOldOwnersAndSetDiscount()

      const car1Result = await carController.findById(car1.id)
      const car2Result = await carController.findById(car2.id)

      expect(car1Result.owners).toHaveLength(1)
      expect(car1Result.owners[0].name).toBe('owner2')
      expect(car1Result.price).toBe(800)
      expect(car2Result.owners).toHaveLength(2)
      expect(car2Result.price).toBe(1000)
    })

  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import * as request from 'supertest'
import * as mongoose from 'mongoose'
import { config } from '../src/common/config'
import { carSchema } from '../src/modules/car/car.schema'
import { CreateCarDto } from '../src/modules/car/dto/create-car.dto'
import { UpdateCarDto } from '../src/modules/car/dto/update-car.dto'
import { CreateManufacturerDto } from '../src/modules/manufacturer/dto/create-manufacturer.dto'
import { CreateOwnerDto } from '../src/modules/owner/dto/create-owner.dto'
import { HttpStatus } from '@nestjs/common'

describe('e2e test', () => {
  let app, carModel, req, car
  const manufacturer: CreateManufacturerDto = {
    name: 'manufacturer1',
    phone: '380991234567',
    siret: 111122223333,
  }
  const owner: CreateOwnerDto = {
    name: 'owner1',
    purchaseDate: new Date('2020-04-23')
  }
  const carInput: CreateCarDto = {
    manufacturer,
    price: 1000,
    firstRegistrationDate: new Date('2020-04-23'),
    owners: [owner]
  }

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()
    req = request(app.getHttpServer())

    await mongoose.connect(config.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    carModel = mongoose.model('Car', carSchema)
  })

  beforeEach(async () => {
    await carModel.deleteMany({})
  })

  afterAll(async done => {
    await carModel.deleteMany({})
    await mongoose.disconnect(done)
  })

  it('CREATE', () => {
    return req.post('/car')
      .send(carInput)
      .expect(HttpStatus.CREATED)
  })

  it('FIND all', async () => {
    car = await carModel.create(carInput)
    return req.get('/car')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveProperty('count')
        expect(body).toHaveProperty('result')
      })
  })

  it('FIND by id', async () => {
    car = await carModel.create(carInput)
    return req.get(`/car/find/${car._id}`)
      .expect(HttpStatus.OK)
      .expect(JSON.stringify(car))
  })

  it('UPDATE', async () => {
    car = await carModel.create(carInput)
    const update: UpdateCarDto = {
      manufacturer: {
        name: 'manufacturer2',
        phone: '380671234567',
        siret: 222233334444,
      },
      price: 5000,
      firstRegistrationDate: new Date('2020-04-24'),
      owners: [
        {
          name: 'owner2',
          purchaseDate: new Date('2020-04-24'),
        }
      ]
    }

    return req.put(`/car/${car._id}`)
      .send(update)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.manufacturer.name).toEqual(update.manufacturer.name)
        expect(body.manufacturer.phone).toEqual(update.manufacturer.phone)
        expect(body.manufacturer.siret).toEqual(update.manufacturer.siret)
        expect(body.price).toEqual(update.price)
        expect(body.firstRegistrationDate).toEqual(update.firstRegistrationDate.toISOString())
        expect(body.owners[0].name).toEqual(update.owners[0].name)
        expect(body.owners[0].purchaseDate).toEqual(update.owners[0].purchaseDate.toISOString())
      })
  })

  it('DELETE', async () => {
    car = await carModel.create(carInput)
    return req.delete(`/car/${car._id}`)
      .expect(HttpStatus.OK)
      .expect({ deletedCount: 1 })
  })

  it('FETCH manufacturer by car id', async () => {
    car = await carModel.create(carInput)
    return req.get(`/car/manufacturer/${car._id}`)
      .expect(HttpStatus.OK)
      .expect(
        JSON.stringify({
          _id: car._id,
          manufacturer: car.manufacturer
        })
      )
  })


  it('SYNC', async () => {
    const car1 = await carModel.create({
      manufacturer,
      price: 1000,
        firstRegistrationDate: new Date('2019-04-23'),
        owners: [
          { name: 'owner1', purchaseDate: new Date('2018-04-23') },
          { name: 'owner2', purchaseDate: new Date('2020-04-23') },
        ]
    })
    const car2 = await carModel.create({
      manufacturer,
      price: 1000,
        firstRegistrationDate: new Date('2020-04-23'),
        owners: [
          { name: 'owner1', purchaseDate: new Date('2020-01-23') },
          { name: 'owner2', purchaseDate: new Date('2020-04-23') },
        ]
    })

    return req.get('/car/sync')
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body).toHaveProperty('removedOldOwnersCount')
        expect(body).toHaveProperty('SetDiscountTocarsCount')
      })
      .then(() => {
        return req.get(`/car/find/${car1._id}`)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body.price).toEqual(800)
            expect(body.owners).toHaveLength(1)
            expect(body.owners[0].name).toBe('owner2')
          })
      })
      .then(() => {
        return req.get(`/car/find/${car2._id}`)
          .expect(HttpStatus.OK)
          .expect(({ body }) => {
            expect(body.price).toEqual(1000)
            expect(body.owners).toHaveLength(2)
          })
      })


  })
})

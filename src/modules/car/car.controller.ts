import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'
import { CarService } from './car.service'
import { Car } from './car.interface'
import { CreateCarDto } from './dto/create-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'

@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @ApiCreatedResponse({
    description: 'Create a new car',
  })
  @Post()
  async create(@Body() createCarDto: CreateCarDto): Promise<Car> {
      return await this.carService.create(createCarDto)
  }

  @ApiCreatedResponse({
      description: 'Get all cars',
  })
  @Get()
  findAll(): Promise<any> {
    return this.carService.findAll()
  }

  @ApiCreatedResponse({
    description: 'Get car by id',
  })
  @Get('/find/:id')
  findById(@Param('id') id: string): Promise<Car> {
    return this.carService.findById(id)
  }

  @ApiCreatedResponse({
    description: 'Update car by id',
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto): Promise<Car> {
    return this.carService.update(id, updateCarDto)
  }

  @ApiCreatedResponse({
    description: 'Delete car by id',
  })
  @Delete(':id')
  deleteById(@Param('id') id: string) {
    return this.carService.deleteById(id)
  }

  @ApiCreatedResponse({
    description: 'Fetch manufacturer by car id',
  })
  @Get('/manufacturer/:id')
  fetchManufacturerByCarId(@Param('id') id: string): Promise<any> {
    return this.carService.fetchManufacturerByCarId(id)
  }

  @ApiCreatedResponse({
    description: 'Remove the owners who bought their cars before the last 18 months \
     and apply a discount of 20% to all cars having a date of first registration between 12 and 18 months',
  })
  @Get('/sync')
  syncOldOwnersAndSetDiscount() {
    return this.carService.syncOldOwnersAndSetDiscount()
  }
}
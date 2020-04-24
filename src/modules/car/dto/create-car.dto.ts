
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateManufacturerDto } from '../../manufacturer/dto/create-manufacturer.dto'
import { CreateOwnerDto } from '../../owner/dto/create-owner.dto'

export class CreateCarDto {
  @ApiPropertyOptional({ type: () => CreateManufacturerDto })
  @Type(() => CreateManufacturerDto)
  public manufacturer: CreateManufacturerDto

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public price: number

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  public firstRegistrationDate: Date

  @ApiPropertyOptional({ type: () => CreateOwnerDto })
  @Type(() => CreateOwnerDto)
  public owners: [CreateOwnerDto]
}
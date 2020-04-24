
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator'
import { Type } from 'class-transformer'
import { UpdateManufacturerDto } from '../../manufacturer/dto/update-manufacturer.dto'
import { UpdateOwnerDto } from '../../owner/dto/update-owner.dto'

export class UpdateCarDto {
  @ApiPropertyOptional({ type: () => UpdateManufacturerDto })
  @Type(() => UpdateManufacturerDto)
  public manufacturer?: UpdateManufacturerDto

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public price?: number

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  public firstRegistrationDate?: Date

  @ApiPropertyOptional({ type: () => UpdateOwnerDto })
  @Type(() => UpdateOwnerDto)
  public owners?: [UpdateOwnerDto]
}
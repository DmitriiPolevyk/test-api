
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsPhoneNumber } from 'class-validator'

export class UpdateManufacturerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public name?: string

  @IsPhoneNumber('UA')
  @ApiPropertyOptional()
  public phone?: string

  @ApiPropertyOptional()
  public siret?: number
}
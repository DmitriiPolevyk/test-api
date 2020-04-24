
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsDate } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateOwnerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public name: string

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  public purchaseDate: Date
}
import { Module } from '@nestjs/common'
import imports from './modules'

@Module({
  imports,
})
export class AppModule {}
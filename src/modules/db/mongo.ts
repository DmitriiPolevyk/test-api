import { MongooseModule }  from '@nestjs/mongoose'
import { config } from '../../common/config'

export const Connection =  MongooseModule.forRoot(config.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
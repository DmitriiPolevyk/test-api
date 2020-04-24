import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { HttpExceptionFilter } from './common/http-exception.filter'
import { config } from './common/config'

async function bootstrap() {

  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true , disableErrorMessages: false }))
  app.useGlobalFilters(new HttpExceptionFilter())
  const options = new DocumentBuilder()
    .setTitle('Test API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('test')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(config.HTTP_PORT, config.HTTP_HOST, () => {
    Logger.log(`server started on port: ${config.HTTP_PORT} host: ${config.HTTP_HOST}`, 'main.ts')
  })
}
bootstrap()

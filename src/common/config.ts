if (process.env.DOTENV) require('dotenv').config({ path: process.env.DOTENV })

export const config = {
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://mongo:27017/mongo-development',
  HTTP_HOST: process.env.HOST || '0.0.0.0',
  HTTP_PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
}
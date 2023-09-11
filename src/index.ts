import Koa from 'koa'
import winston from 'winston'
import config from './startups/config'
import db from './startups/db'
import logging from './startups/logging'
import routes from './startups/routes'

export default async function main() {
  const app: Koa = new Koa()


  // const app = createApp({
  //   apiKey: "12345",
  // });

  logging(app)
  config(app)
  db(app)
  routes(app)

  app.listen(process.env.PORT, () => {
    winston.info(`server is running on port ${process.env.PORT} in ${process.env.NODE_ENV.toUpperCase()} mode`)
  })
}

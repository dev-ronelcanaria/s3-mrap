'use strict'

const Logger = use('Logger')

class RequestLogger {
  async handle ({ request, response }, next) {
    const start = Date.now()

    await next()

    const duration = Date.now() - start
    const method = request.method()
    const url = request.url()
    const status = response.response.statusCode

    Logger.info('%s %s %d - %dms', method, url, status, duration)
  }
}

module.exports = RequestLogger

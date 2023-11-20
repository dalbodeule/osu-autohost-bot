import { createServer } from 'http'

export const healthCheck = createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.write('OK')
  response.end()
})

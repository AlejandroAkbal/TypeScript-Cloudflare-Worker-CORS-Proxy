import { configuration } from './configuration'
import { handleRequest, handleOptions } from './handler'

addEventListener('fetch', (event) => {
  const { request } = event

  const isMethodAllowed = configuration.methods.includes(request.method)

  if (!isMethodAllowed)
    return event.respondWith(
      new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed',
      }),
    )

  switch (request.method) {
    case 'OPTIONS':
      return event.respondWith(handleOptions(request))

    default:
      return event.respondWith(handleRequest(request))
  }
})

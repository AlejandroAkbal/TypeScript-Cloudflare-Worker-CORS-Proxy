import { handleRequest, handleOptions } from './handler'

addEventListener('fetch', (event) => {
  const { request } = event

  switch (request.method) {
    // Handle requests
    case 'GET':
    case 'HEAD':
    case 'POST':
      return event.respondWith(handleRequest(request))

    case 'OPTIONS':
      return event.respondWith(handleOptions(request))

    // If no good option then return error
    default:
      return event.respondWith(
        new Response(null, {
          status: 405,

          statusText: 'Method Not Allowed',
        }),
      )
  }
})

import { configuration } from './configuration'

export async function handleRequest(request: Request): Promise<Response> {
  const URLQuery = new URL(request.url).searchParams.get('q')

  if (!URLQuery) {
    return new Response(null, {
      status: 422,
      statusText: 'You have to append a query: "?q=URL"',
    })
  }

  const requestedURL = new URL(URLQuery)

  const newRequestInit: RequestInit = {
    ...request,

    // Cloudflare settings
    cf: { cacheEverything: true },
  }

  const newRequest = new Request(requestedURL.toString(), newRequestInit)

  /*
   * Set headers to make the endpoint think it's itself
   */
  newRequest.headers.set('Host', requestedURL.origin)
  newRequest.headers.set('Referrer', requestedURL.toString())

  /*
   * Notice: DONT try to console.log headers
   * as for some reason they arent logged correctly,
   * use https://postman-echo.com/ to check headers
   */

  console.log('Fetching: ', newRequest.url)

  const fetchData = await fetch(newRequest)

  const newResponse = new Response(fetchData.body, fetchData)

  /*
   * Rewrite response to reflect our own headers
   */
  newResponse.headers.set('Access-Control-Allow-Origin', configuration.host)
  newResponse.headers.set('Vary', 'Origin')

  return newResponse
}

export async function handleOptions(request: Request): Promise<Response> {
  /*
   * Handle CORS pre-flight request.
   * If you want to check the requested method + headers you can do that here.
   */
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': configuration.host,
        'Access-Control-Allow-Methods': configuration.methods,
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

    /*
     * Handle standard OPTIONS request.
     * If you want to allow other HTTP Methods, you can do that here.
     */
  } else {
    return new Response(null, {
      headers: {
        Allow: configuration.methods,
      },
    })
  }
}

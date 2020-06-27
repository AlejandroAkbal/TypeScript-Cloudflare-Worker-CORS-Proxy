import { configuration } from './configuration'

export async function handleRequest(request: Request): Promise<Response> {
  const URLQuery = new URL(request.url).searchParams.get('q')

  const newRequestInit: RequestInit = { ...request, cf: undefined }
  if (!URLQuery) {
    return new Response(null, {
      status: 422,
      statusText: 'You have to append a query: "?q=URL"',
    })
  }

  /*
   * Rewrite request to point to API url. This also makes the request mutable
   * so we can add the correct Origin header to make the API server think
   * that this request isn't cross-site.
   */
  const newRequest = new Request(requestedURL.toString(), newRequestInit)

  /*
   * Set headers to make the endpoint think it's itself
   */
  newRequest.headers.set('Host', requestedURL.origin)
  newRequest.headers.set('Referer', requestedURL.toString())
  // request.headers.set('Origin', requestedURL.toString())

  console.log(`Fetching URL: ${newRequest.url}`)

  // Fetch it
  let response = await fetch(newRequest)

  /*
   * Rewrite response to reflect our own headers and make it mutable
   */
  response = new Response(response.body, response)

  response.headers.set('Access-Control-Allow-Origin', configuration.host)
  response.headers.set('Vary', 'Origin')

  // Return it
  return response
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

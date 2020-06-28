import { configuration } from './configuration'

const gumroadVerificationEndpoint = new URL(
  'https://api.gumroad.com/v2/licenses/verify',
)

export async function handleRequest(request: Request): Promise<Response> {
  const requestURL = new URL(request.url)

  const gumroadProduct = requestURL.searchParams.get('product')
  const gumroadLicense = requestURL.searchParams.get('license')

  if (!gumroadProduct || !gumroadLicense)
    throw new Error('No product or license query')

  const newRequestInit: RequestInit = {
    method: 'POST',

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },

    body: `product_permalink=${gumroadProduct}&license_key=${gumroadLicense}`,

    cf: undefined,
  }

  const newRequest = new Request(
    gumroadVerificationEndpoint.toString(),
    newRequestInit,
  )

  console.log('Fetching: ', newRequest.url)

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

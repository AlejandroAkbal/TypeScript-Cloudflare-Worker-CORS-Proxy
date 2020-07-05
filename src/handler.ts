import { configuration } from './configuration'

const gumroadVerificationEndpoint = new URL(
  'https://api.gumroad.com/v2/licenses/verify',
)

export async function handleRequest(request: Request): Promise<Response> {
  let requestBody

  try {
    requestBody = JSON.parse(await request.json())
  } catch {
    return new Response(null, {
      status: 400,
      statusText: 'Invalid body',
    })
  }

  const { product_permalink, license_key } = requestBody

  if (!product_permalink || !license_key)
    return new Response(null, {
      status: 400,
      statusText: 'No product or license',
    })

  const newRequestInit: RequestInit = {
    method: 'POST',

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },

    body: `product_permalink=${product_permalink}&license_key=${license_key}`,

    cf: undefined,
  }

  const newRequest = new Request(
    gumroadVerificationEndpoint.toString(),
    newRequestInit,
  )

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
        'Access-Control-Allow-Methods': configuration.methods.join(', '),
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
        Allow: configuration.methods.join(', '),
      },
    })
  }
}

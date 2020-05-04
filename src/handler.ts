export async function handleRequest(request: Request): Promise<Response> {
  return new Response(`request method: ${request.method}`)
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

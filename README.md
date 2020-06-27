# TypeScript Cloudflare Worker CORS Proxy

A TypeScript Cloudflare Worker to proxy CORS requests

## Setup

First, you will need to install and set up wrangler

```sh
npm install -g @cloudflare/wrangler

wrangler config
```

Then

- Copy [wrangler.toml.example](wrangler.toml.example) into `wrangler.toml` and modify it with your user credentials
- Modify [src/configuration.ts](src/configuration.ts)

## Developing

To start developing

- Run `npm run dev:webpack`
- and then `npm run dev:wrangler:preview`

And a preview will launch in your browser

## Publishing

To publish you only have to do the following

- run `npm run publish`

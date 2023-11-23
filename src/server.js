import http from 'node:http'
import { bodyToJson } from './middlewares/bodyToJson.js'
import { routes } from './router.js'
import { extractRoutePath } from './utils/extractRoutePath.js'

const server = http.createServer(async (req, res) => {
  const {method, url} = req

  await bodyToJson(req, res)

  const route = routes.find(route => (
    route.method === method && route.path.test(url)
  ))

  if (route) {
    const routeParams = req.url.match(route.path)
    const {query, ...params} = routeParams.groups // get query and params that regex found
    req.params = params // set the params inside req.params
    req.query = query ? extractRoutePath(query) : {} // set query params or nothing inside req.query
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const nextRoutes = require('next-routes')
const routes = (module.exports = nextRoutes())
routes.add('check', '/check/:id')
routes.add('results', '/results/:id')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  createServer(handler).listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

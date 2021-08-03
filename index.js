// require your server and launch it here
const server = require('./api/server')
const PORT = 3333

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
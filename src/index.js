import https from 'https';
import fs from 'fs'
import { logger } from './logger.js';
import { Server } from 'socket.io'
import Routes from './routes.js';

const PORT = process.env.PORT || 3000
const localHostSSl = {
    key: fs.readFileSync('./certificates/key.pem'),
    cert: fs.readFileSync('./certificates/cert.pem')
}

const routes = new Routes();
const server = https.createServer(
    localHostSSl,
    routes.handler.bind(routes)
)

const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: false
    }
})

io.on("connection", (socket) => { logger.info(`someone connected: ${socket.id}`) })

routes.setSocketInstance(io)
server.listen(PORT, () => {
    const { address, port } = server.address();
    logger.info(`app running att https://${address}:${port}`)
})
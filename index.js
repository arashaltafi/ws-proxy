import http from "http"
import WebSocket, { WebSocketServer } from "ws"

const TARGET_WS =
    "ws://chat.nahad.ir:8000/api/v1/chat/websocket"

const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end("OK")
})

const wss = new WebSocketServer({ server })

wss.on("connection", (clientSocket) => {
    console.log("Client connected")

    const targetSocket = new WebSocket(TARGET_WS)

    clientSocket.on("message", (data) => {
        if (targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.send(data)
        }
    })

    targetSocket.on("message", (data) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(data)
        }
    })

    const closeAll = () => {
        clientSocket.close()
        targetSocket.close()
    }

    clientSocket.on("close", closeAll)
    targetSocket.on("close", closeAll)
    clientSocket.on("error", closeAll)
    targetSocket.on("error", closeAll)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, "0.0.0.0", () => {
    console.log(`WS Proxy running on port ${PORT}`)
})
import http from "http"
import WebSocket, { WebSocketServer } from "ws"

const TARGET_WS = "ws://chat.nahad.ir:8000/api/v1/chat/websocket"

const server = http.createServer()

const wss = new WebSocketServer({ server })

wss.on("connection", (clientSocket, req) => {
    console.log("Client connected")

    const targetSocket = new WebSocket(TARGET_WS)

    // browser → backend
    clientSocket.on("message", (data) => {
        if (targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.send(data)
        }
    })

    // backend → browser
    targetSocket.on("message", (data) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(data)
        }
    })

    const closeAll = () => {
        if (clientSocket.readyState === WebSocket.OPEN)
            clientSocket.close()

        if (targetSocket.readyState === WebSocket.OPEN)
            targetSocket.close()
    }

    clientSocket.on("close", closeAll)
    targetSocket.on("close", closeAll)

    clientSocket.on("error", closeAll)
    targetSocket.on("error", closeAll)
})

const PORT = process.env.PORT || 10000

server.listen(PORT, () => {
    console.log(`WS Proxy running on port ${PORT}`)
})

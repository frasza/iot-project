import { WebSocketServer } from "ws";
import ip from "ip";

const wss = new WebSocketServer({ port: 8080 });

console.log(`WebSocket server listening on ${ip.address()}:8080`);

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    wss.clients.forEach((client) => client.send(data.toString()));
  });
});

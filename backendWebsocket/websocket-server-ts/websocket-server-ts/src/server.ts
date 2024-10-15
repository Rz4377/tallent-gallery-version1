require('dotenv').config(); 
import WebSocket, { WebSocketServer } from 'ws';
import { adminAuth } from './config/firebaseAdmin';
import prisma from "../../../../shared/db"

const wss = new WebSocketServer({ port: 8080 });
const activeConnections = new Map<string, WebSocket>();

wss.on('connection', async (ws: WebSocket, req) => {
    console.log("Client connected");

    // Extract the idToken from the query parameters
    const reqUrl = new URL(`http://localhost:8080${req.url}`);
    const idToken = reqUrl.searchParams.get('token');
    
    if (!idToken) {
        ws.close(4000, "No token provided");
        return;
    }

    try {
        // Verify Firebase token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        console.log("Decoded token UID: ", decodedToken.uid);

        // Add user to active connections
        activeConnections.set(decodedToken.uid, ws);

        // Handle incoming messages
        ws.on('message', (message: string) => {
            try {
                console.log('Received: %s', message);
                const { to, content } = JSON.parse(message);
                const recipientSocket = activeConnections.get(to);

                const savedMessage = await prisma.message.create({
                    data: {
                        content,
                        senderUid: uid,
                        receiverUid: to,
                        sentAt: new Date(),
                        conversation: {
                            connectOrCreate: {
                                where: {
                                    participants: {
                                        has: [uid, to],
                                    },
                                },
                                create: {
                                    participants: [uid, to],
                                },
                            },
                        },
                    },
                });

                if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
                    recipientSocket.send(JSON.stringify({ from: decodedToken.uid, content }));
                } else {
                    console.log(`User ${to} is not connected or WebSocket is not open`);
                }
            } catch (error) {
                console.error("Error processing message:", error);
                ws.send(JSON.stringify({ error: "Invalid message format" }));
            }
        });

        // Handle WebSocket close event
        ws.on("close", () => {
            console.log(`Client ${decodedToken.uid} disconnected`);
            activeConnections.delete(decodedToken.uid);  // Remove user from active connections
        });

        // Handle WebSocket error event
        ws.on('error', (error) => {
            console.error("WebSocket error:", error);
            ws.close(4001, "WebSocket error");
        });

    } catch (error) {
        console.error("Token verification failed:", error);
        ws.close(4000, "Token verification failed");
    }
});

console.log("WebSocket server running on port 8080");
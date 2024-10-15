"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const ws_1 = __importStar(require("ws"));
const firebaseAdmin_1 = require("./config/firebaseAdmin");
const db_1 = __importDefault(require("../../../../shared/db"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
const activeConnections = new Map();
wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decodedToken = yield firebaseAdmin_1.adminAuth.verifyIdToken(idToken);
        console.log("Decoded token UID: ", decodedToken.uid);
        // Add user to active connections
        activeConnections.set(decodedToken.uid, ws);
        // Handle incoming messages
        ws.on('message', (message) => {
            try {
                console.log('Received: %s', message);
                const { to, content } = JSON.parse(message);
                const recipientSocket = activeConnections.get(to);
                const savedMessage = yield db_1.default.message.create({
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
                if (recipientSocket && recipientSocket.readyState === ws_1.default.OPEN) {
                    recipientSocket.send(JSON.stringify({ from: decodedToken.uid, content }));
                }
                else {
                    console.log(`User ${to} is not connected or WebSocket is not open`);
                }
            }
            catch (error) {
                console.error("Error processing message:", error);
                ws.send(JSON.stringify({ error: "Invalid message format" }));
            }
        });
        // Handle WebSocket close event
        ws.on("close", () => {
            console.log(`Client ${decodedToken.uid} disconnected`);
            activeConnections.delete(decodedToken.uid); // Remove user from active connections
        });
        // Handle WebSocket error event
        ws.on('error', (error) => {
            console.error("WebSocket error:", error);
            ws.close(4001, "WebSocket error");
        });
    }
    catch (error) {
        console.error("Token verification failed:", error);
        ws.close(4000, "Token verification failed");
    }
}));
console.log("WebSocket server running on port 8080");

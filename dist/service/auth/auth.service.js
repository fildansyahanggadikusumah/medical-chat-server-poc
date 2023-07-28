"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const getstream_1 = require("getstream");
const bcrypt = require("bcrypt");
const stream_chat_1 = require("stream-chat");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
let AuthService = class AuthService {
    constructor() {
        this.serverClient = (0, getstream_1.connect)(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET, process.env.STREAM_APP_ID);
    }
    async signup(fullName, username, password) {
        try {
            const userId = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(password, 10);
            const token = this.serverClient.createUserToken(userId);
            return { token, fullName, username, userId, hashedPassword, };
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('Internal server error', 500);
        }
    }
    async signupDoctor(fullName, username, password) {
        try {
            const userId = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = {
                id: userId,
                fullName: fullName,
                username: username,
                hashedPassword: hashedPassword,
                role: 'doctor',
            };
            const client = stream_chat_1.StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
            await client.upsertUser(user);
            const token = this.serverClient.createUserToken(userId);
            return { token, fullName, username, userId, hashedPassword };
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('Internal server error', 500);
        }
    }
    async login(username, password) {
        try {
            const serverClient = (0, getstream_1.connect)(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET, process.env.STREAM_APP_ID);
            const client = stream_chat_1.StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
            const { users } = await client.queryUsers({ name: username });
            if (!users.length)
                throw new common_1.HttpException('User not found', 404);
            const success = await bcrypt.compare(password, users[0].hashedPassword);
            const token = serverClient.createUserToken(users[0].id);
            if (success) {
                return { token, fullName: users[0].fullName, username, userId: users[0].id };
            }
            else {
                throw new common_1.HttpException('Incorrect password', 400);
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('Internal server error', 500);
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
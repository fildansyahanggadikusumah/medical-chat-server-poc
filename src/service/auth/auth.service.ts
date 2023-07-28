import { Injectable, HttpException } from '@nestjs/common';
import { connect } from 'getstream';
import * as bcrypt from 'bcrypt';
import { StreamChat } from 'stream-chat';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import { Client } from 'faye';

dotenv.config()

@Injectable()
export class AuthService {
  private readonly serverClient = connect(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET, process.env.STREAM_APP_ID);

  async signup(fullName: string, username: string, password: string, ) {
    try {
      const userId = crypto.randomBytes(16).toString('hex');

      const hashedPassword = await bcrypt.hash(password, 10);

      const token = this.serverClient.createUserToken(userId);

      return { token, fullName, username, userId, hashedPassword,  };
    } catch (error) {
      console.log(error);

      throw new HttpException('Internal server error', 500);
    }
  }

  async signupDoctor(fullName: string, username: string, password: string ) {
    try {
      const userId = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a user with the "doctor" role
      const user = {
        id: userId,
        fullName: fullName,
        username: username,
        hashedPassword: hashedPassword,
        role: 'doctor',
      };

      // Save the user to Stream Chat
      const client = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
      await client.upsertUser(user);

      const token = this.serverClient.createUserToken(userId);

      return { token, fullName, username, userId, hashedPassword };
    } catch (error) {
      console.log(error);

      throw new HttpException('Internal server error', 500);
    }
  }

  async login(username: string, password: string) {
    try {
      const serverClient = connect(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET, process.env.STREAM_APP_ID);
      const client = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

      const { users }: {users: Array<any>}  = await client.queryUsers({ name: username });

      if (!users.length) throw new HttpException('User not found', 404);

      const success = await bcrypt.compare(password, users[0].hashedPassword);

      const token = serverClient.createUserToken(users[0].id);

      if (success) {
        return { token, fullName: users[0].fullName, username, userId: users[0].id };
      } else {
        throw new HttpException('Incorrect password', 400);
      }
    } catch (error) {
      console.log(error);

      throw new HttpException('Internal server error', 500);
    }
  }

  
  


}
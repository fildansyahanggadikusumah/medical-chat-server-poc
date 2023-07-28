import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';


@Injectable()
export class HistoryService {
    private pool: Pool;

    constructor() {
      this.pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'streamchat',
        password: 'pidansyah16',
        port: 5433,
      });
    }


    async insertMemberData(members) {
        const query =
          'INSERT INTO members (id, role, image, fullName) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING;';
        const memberPromises = members.map((member) =>
          this.pool.query(query, [
            member.id,
            member.role,
            member.image,
            member.fullName,
          ])
        );
    
        await Promise.all(memberPromises);
      }
    
      async insertChannelData(channelId) {
        const query =
          'INSERT INTO channels (cid) VALUES ($1) ON CONFLICT (cid) DO NOTHING;';
        const values = [channelId];
    
        await this.pool.query(query, values);
      }

    async insertMessageData(messages) {
        const query =
          'INSERT INTO messages (id, text, html, type, created_at, updated_at, status, cid, member_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING;';
        const messagePromises = messages.map(async (message) => {
          await this.pool.query(query, [
            message.id,
            message.text,
            message.html,
            message.type,
            message.created_at,
            message.updated_at,
            message.status,
            message.cid,
            message.user.id,
          ]);
      
          const attachments = message.attachments || [];
      
          const attachmentQuery =
            'INSERT INTO attachments (message_id, asset_url, type, title, mime_type, file_size) VALUES ($1, $2, $3, $4, $5, $6);';
          const imageQuery =
            'INSERT INTO images (message_id, type, fallback, image_url, original_width, original_height) VALUES ($1, $2, $3, $4, $5, $6);';
      
          const attachmentPromises = attachments.map((attachment) => {
            if (attachment.type === 'file') {
              return this.pool.query(attachmentQuery, [
                message.id,
                attachment.asset_url,
                attachment.type,
                attachment.title,
                attachment.mime_type,
                attachment.file_size,
              ]);
            } else {
              return this.pool.query(imageQuery, [
                message.id,
                attachment.type,
                attachment.fallback,
                attachment.image_url,
                attachment.original_width,
                attachment.original_height,
              ]);
            }
          });
      
          await Promise.all(attachmentPromises);
        });
      
        await Promise.all(messagePromises);
      }


      async getHistoryCid(cid: string) {
        const query =
    'SELECT * FROM messages JOIN members ON messages.member_id = members.id JOIN channels ON messages.cid = channels.cid LEFT JOIN attachments ON messages.id = attachments.message_id LEFT JOIN images ON messages.id = images.message_id WHERE messages.cid = $1 ORDER BY messages.created_at ASC;';
  const result = await this.pool.query(query, [cid]);
  return result.rows;
      }

      async getCIDsByMemberId(memberId: string) {
        const query = 'SELECT DISTINCT cid FROM messages WHERE member_id = $1;';
        const result = await this.pool.query(query, [memberId]);
        return result.rows.map((row) => row.cid);
      }
}

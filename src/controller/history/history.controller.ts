import { Controller, HttpException, HttpStatus, Post, Body, Get, Query } from '@nestjs/common';
import { HistoryService } from 'src/service/history/history.service';


@Controller('history')
export class HistoryController {
    constructor(private readonly history: HistoryService) {}


  @Post()
  async exportData(@Body() reqBody: any) {
    try {
      const { messages, channelId, members } = reqBody;

      await this.history.insertMemberData(members);
      await this.history.insertChannelData(channelId);
      await this.history.insertMessageData(messages);

      return { message: 'Data exported successfully' };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to export data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get()
  async getHistoryCid(@Query('cid') cid: string) {
    try {
      const historyList = await this.history.getHistoryCid(cid);
      return { historyList };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to retrieve history', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('channels')
  async getCIDsByMemberId(@Query('memberId') memberId: string) {
    try {
      const cids = await this.history.getCIDsByMemberId(memberId);
      return { cids };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to retrieve CIDs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}



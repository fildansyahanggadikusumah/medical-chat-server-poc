import { HistoryService } from 'src/service/history/history.service';
export declare class HistoryController {
    private readonly history;
    constructor(history: HistoryService);
    exportData(reqBody: any): Promise<{
        message: string;
    }>;
    getHistoryCid(cid: string): Promise<{
        historyList: any;
    }>;
    getCIDsByMemberId(memberId: string): Promise<{
        cids: any;
    }>;
}

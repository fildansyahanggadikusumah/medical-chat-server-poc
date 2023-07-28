export declare class HistoryService {
    private pool;
    constructor();
    insertMemberData(members: any): Promise<void>;
    insertChannelData(channelId: any): Promise<void>;
    insertMessageData(messages: any): Promise<void>;
    getHistoryCid(cid: string): Promise<any>;
    getCIDsByMemberId(memberId: string): Promise<any>;
}

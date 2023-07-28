"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const history_service_1 = require("../../service/history/history.service");
let HistoryController = class HistoryController {
    constructor(history) {
        this.history = history;
    }
    async exportData(reqBody) {
        try {
            const { messages, channelId, members } = reqBody;
            await this.history.insertMemberData(members);
            await this.history.insertChannelData(channelId);
            await this.history.insertMessageData(messages);
            return { message: 'Data exported successfully' };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Failed to export data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getHistoryCid(cid) {
        try {
            const historyList = await this.history.getHistoryCid(cid);
            return { historyList };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Failed to retrieve history', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCIDsByMemberId(memberId) {
        try {
            const cids = await this.history.getCIDsByMemberId(memberId);
            return { cids };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Failed to retrieve CIDs', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "exportData", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('cid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getHistoryCid", null);
__decorate([
    (0, common_1.Get)('channels'),
    __param(0, (0, common_1.Query)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HistoryController.prototype, "getCIDsByMemberId", null);
HistoryController = __decorate([
    (0, common_1.Controller)('history'),
    __metadata("design:paramtypes", [history_service_1.HistoryService])
], HistoryController);
exports.HistoryController = HistoryController;
//# sourceMappingURL=history.controller.js.map
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
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ReportController = class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async getOrderSummary(exportType, res) {
        if (exportType === 'excel' || exportType === 'pdf') {
            return this.reportService.getOrderSummary(res, exportType);
        }
        const data = await this.reportService.getOrderSummary();
        res.json({ success: true, data });
    }
    async getRevenueSummary(exportType, res) {
        if (exportType === 'excel' || exportType === 'pdf') {
            return this.reportService.getRevenueSummary(res, exportType);
        }
        const data = await this.reportService.getRevenueSummary();
        res.json({ success: true, data });
    }
    async getTotalCakeReport() {
        const data = await this.reportService.getTotalCakeReport();
        return { success: true, data };
    }
    async getDepartmentReport() {
        const data = await this.reportService.getDepartmentReport();
        return { success: true, data };
    }
    async getStudentOrderReport() {
        const data = await this.reportService.getStudentOrderReport();
        return { success: true, data };
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('order-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Order Summary Report' }),
    (0, swagger_1.ApiQuery)({ name: 'export', enum: ['json', 'excel', 'pdf'], required: false }),
    __param(0, (0, common_1.Query)('export')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getOrderSummary", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('revenue-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Revenue Summary Report' }),
    (0, swagger_1.ApiQuery)({ name: 'export', enum: ['json', 'excel', 'pdf'], required: false }),
    __param(0, (0, common_1.Query)('export')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getRevenueSummary", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('total-cake'),
    (0, swagger_1.ApiOperation)({ summary: 'Total Cake Report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getTotalCakeReport", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('department'),
    (0, swagger_1.ApiOperation)({ summary: 'Department Report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getDepartmentReport", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Get)('student-order'),
    (0, swagger_1.ApiOperation)({ summary: 'Student Order Report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getStudentOrderReport", null);
exports.ReportController = ReportController = __decorate([
    (0, swagger_1.ApiTags)('Report'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('report'),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
//# sourceMappingURL=report.controller.js.map
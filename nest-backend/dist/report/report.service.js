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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ExcelJS = __importStar(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
let ReportService = class ReportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrderSummary(res, exportType) {
        const orders = await this.prisma.order.findMany({
            include: {
                student: true,
                orderDetails: { include: { cake: true } },
            },
            where: { deletedAt: null },
        });
        if (exportType === 'excel' && res) {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Order Summary');
            sheet.addRow(['Order ID', 'Student', 'Total Price', 'Status', 'Date']);
            orders.forEach((o) => {
                sheet.addRow([
                    o.id,
                    o.student?.fullName || 'N/A',
                    o.totalPrice,
                    o.status,
                    o.createdAt,
                ]);
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Order_Summary.xlsx');
            await workbook.xlsx.write(res);
            res.end();
            return;
        }
        if (exportType === 'pdf' && res) {
            const doc = new pdfkit_1.default();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=Order_Summary.pdf');
            doc.pipe(res);
            doc.fontSize(20).text('Order Summary Report', { align: 'center' });
            doc.moveDown();
            orders.forEach((o) => {
                doc
                    .fontSize(12)
                    .text(`Order ID: ${o.id} | Student: ${o.student?.fullName || 'N/A'} | Total: ${o.totalPrice} | Status: ${o.status}`);
                doc.moveDown(0.5);
            });
            doc.end();
            return;
        }
        return orders;
    }
    async getRevenueSummary(res, exportType) {
        const revenue = await this.prisma.payment.findMany({
            include: { order: true },
            orderBy: { paymentDate: 'desc' },
        });
        if (exportType === 'excel' && res) {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet('Revenue Summary');
            sheet.addRow(['Payment ID', 'Order ID', 'Amount', 'Type', 'Date']);
            revenue.forEach((r) => {
                sheet.addRow([r.id, r.orderId, r.amount, r.type, r.paymentDate]);
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Revenue_Summary.xlsx');
            await workbook.xlsx.write(res);
            res.end();
            return;
        }
        if (exportType === 'pdf' && res) {
            const doc = new pdfkit_1.default();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=Revenue_Summary.pdf');
            doc.pipe(res);
            doc.fontSize(20).text('Revenue Summary Report', { align: 'center' });
            doc.moveDown();
            revenue.forEach((r) => {
                doc
                    .fontSize(12)
                    .text(`Payment ID: ${r.id} | Order ID: ${r.orderId} | Amount: ${r.amount} | Type: ${r.type}`);
                doc.moveDown(0.5);
            });
            doc.end();
            return;
        }
        return revenue;
    }
    async getTotalCakeReport() {
        return this.prisma.cake.findMany({ where: { deletedAt: null } });
    }
    async getDepartmentReport() {
        return this.prisma.department.findMany({
            include: { groups: { include: { students: true } } },
            where: { deletedAt: null },
        });
    }
    async getStudentOrderReport() {
        return this.prisma.student.findMany({
            include: { orders: { include: { orderDetails: true } } },
            where: { deletedAt: null },
        });
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportService);
//# sourceMappingURL=report.service.js.map
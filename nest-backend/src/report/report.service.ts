import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getOrderSummary(res?: Response, exportType?: string) {
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
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=Order_Summary.xlsx',
      );
      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    if (exportType === 'pdf' && res) {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=Order_Summary.pdf',
      );
      doc.pipe(res);

      doc.fontSize(20).text('Order Summary Report', { align: 'center' });
      doc.moveDown();

      orders.forEach((o) => {
        doc
          .fontSize(12)
          .text(
            `Order ID: ${o.id} | Student: ${o.student?.fullName || 'N/A'} | Total: ${o.totalPrice} | Status: ${o.status}`,
          );
        doc.moveDown(0.5);
      });

      doc.end();
      return;
    }

    return orders;
  }

  async getRevenueSummary(res?: Response, exportType?: string) {
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
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=Revenue_Summary.xlsx',
      );
      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    if (exportType === 'pdf' && res) {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=Revenue_Summary.pdf',
      );
      doc.pipe(res);

      doc.fontSize(20).text('Revenue Summary Report', { align: 'center' });
      doc.moveDown();

      revenue.forEach((r) => {
        doc
          .fontSize(12)
          .text(
            `Payment ID: ${r.id} | Order ID: ${r.orderId} | Amount: ${r.amount} | Type: ${r.type}`,
          );
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
}

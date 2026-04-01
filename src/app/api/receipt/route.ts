import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, service, date, timeSlot, id } = await request.json();

    if (!name || !phone || !service || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields for receipt' }, { status: 400 });
    }

    const bookingId = id || `JC${Date.now().toString(36).toUpperCase()}`;

    let dateFormatted = date;
    try {
      const d = new Date(date + 'T00:00:00');
      dateFormatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {}

    const chunks: Uint8Array[] = [];
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 15, bottom: 15, left: 25, right: 25 },
      info: {
        Title: 'JassuCafe_Booking_Receipt',
        Author: 'JassuCafe',
        Subject: 'Appointment booking confirmation receipt',
      },
      bufferPages: false,
    });

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = 595.28 - 50;

      const TEAL = '#0d9488';
      const TEAL_DARK = '#0f766e';
      const EMERALD = '#059669';
      const DARK_BG = '#0f172a';
      const WHITE = '#ffffff';
      const NEAR_WHITE = '#f8fafc';
      const TEAL_BG = '#f0fdfa';
      const LIGHT_GRAY = '#f1f5f9';
      const MED_GRAY = '#e2e8f0';
      const SLATE = '#94a3b8';
      const TEXT_DARK = '#0f172a';
      const TEXT_MED = '#475569';

      doc.rect(25, 15, W, 65).fill(DARK_BG);
      doc.fill(WHITE).font('Helvetica-Bold').fontSize(24);
      doc.text('JASSU CAFE', 25, 35, { width: W, align: 'center' });
      doc.font('Helvetica').fontSize(11).fill('#99f6e4');
      doc.text('Your Trusted Digital Services Partner', 25, 58, { width: W, align: 'center' });

      doc.rect(25, 80, W, 3).fill(TEAL);

      const badgeY = 90;
      doc.rect(25, badgeY, W, 28).fill(EMERALD);
      doc.fill(WHITE).font('Helvetica-Bold').fontSize(11);
      doc.text('BOOKING CONFIRMED', 25, badgeY + 8, { width: W, align: 'center' });

      const infoY = 128;
      const rows: [string, string][] = [
        ['Date', dateFormatted],
        ['Time Slot', timeSlot],
        ['Service', service],
      ];

      rows.forEach(([label, value], i) => {
        const y = infoY + i * 28;
        const bg = i % 2 === 0 ? TEAL_BG : WHITE;
        doc.rect(25, y, W, 28).fill(bg);

        doc.fill(TEAL_DARK).font('Helvetica-Bold').fontSize(10);
        doc.text(label, 39, y + 8, { width: W * 0.22, align: 'left' });

        doc.fill(TEXT_DARK).font('Helvetica').fontSize(10);
        doc.text(value, 39 + W * 0.22, y + 8, { width: W * 0.72, align: 'left' });
      });

      const custTitleY = 218;
      doc.fill(TEXT_DARK).font('Helvetica-Bold').fontSize(12);
      doc.text('Customer Details', 29, custTitleY);
      doc.moveTo(29, custTitleY + 16).lineTo(25 + W, custTitleY + 16).strokeColor(TEAL).lineWidth(2).stroke();

      const custY = 244;
      const custRows: [string, string][] = [
        ['Full Name', name],
        ['Phone Number', phone],
        ['Email Address', email || 'Not provided'],
        ['Booking ID', bookingId.length > 20 ? bookingId.slice(0, 20) : bookingId],
      ];

      custRows.forEach(([label, value], i) => {
        const y = custY + i * 26;
        const bg = i % 2 === 0 ? NEAR_WHITE : WHITE;
        doc.rect(25, y, W, 26).fill(bg);

        doc.fill(SLATE).font('Helvetica').fontSize(8.5);
        doc.text(label, 39, y + 7, { width: W * 0.32, align: 'left' });

        doc.fill(TEXT_DARK).font('Helvetica').fontSize(11);
        doc.text(value, 39 + W * 0.32, y + 6, { width: W * 0.64, align: 'left' });
      });

      const contactHeaderY = 354;
      doc.rect(25, contactHeaderY, W, 28).fill(TEAL);
      doc.fill(WHITE).font('Helvetica-Bold').fontSize(11);
      doc.text('Contact Information', 25, contactHeaderY + 8, { width: W, align: 'center' });

      const contactY = 390;
      const contactRows: [string, string][] = [
        ['Phone', '+91 89328 41664'],
        ['Email', 'jassucafe@gmail.com'],
        ['Address', 'KDT Plaza, UGF 44, Aliganj, Lucknow, U.P. 226021'],
      ];

      contactRows.forEach(([label, value], i) => {
        const y = contactY + i * 28;
        const bg = i % 2 === 0 ? TEAL_BG : WHITE;
        doc.rect(25, y, W, 28).fill(bg);

        doc.fill(TEAL_DARK).font('Helvetica-Bold').fontSize(10);
        doc.text(label, 39, y + 8, { width: W * 0.22, align: 'left' });

        doc.fill(TEXT_DARK).font('Helvetica').fontSize(10);
        doc.text(value, 39 + W * 0.22, y + 8, { width: W * 0.72, align: 'left' });
      });

      const whHeaderY = 480;
      doc.rect(25, whHeaderY, W, 26).fill(LIGHT_GRAY);
      doc.fill(TEAL_DARK).font('Helvetica-Bold').fontSize(10);
      doc.text('Working Hours', 25, whHeaderY + 7, { width: W, align: 'center' });

      const whY = 512;
      const whRows: [string, string][] = [
        ['Monday - Saturday', '9:00 AM - 8:00 PM'],
        ['Sunday', '10:00 AM - 4:00 PM'],
      ];

      doc.rect(25, whY, W, 48).strokeColor(MED_GRAY).lineWidth(0.5).stroke();

      whRows.forEach(([day, hours], i) => {
        const y = whY + i * 24;
        if (i % 2 === 0) doc.rect(25, y, W, 24).fill(NEAR_WHITE);

        doc.fill(TEAL_DARK).font('Helvetica-Bold').fontSize(9);
        doc.text(day, 25, y + 7, { width: W * 0.5, align: 'center' });

        doc.fill(TEXT_MED).font('Helvetica').fontSize(8.5);
        doc.text(hours, 25 + W * 0.5, y + 7, { width: W * 0.5, align: 'center' });

        if (i === 0) {
          doc.moveTo(25, y + 24).lineTo(25 + W, y + 24).strokeColor(MED_GRAY).lineWidth(0.5).stroke();
        }
      });

      const footY = 575;
      doc.rect(25, footY, W, 3).fill(TEAL);

      doc.fill(SLATE).font('Helvetica').fontSize(8);
      doc.text('Thank you for choosing JassuCafe!', 25, footY + 13, { width: W, align: 'center' });
      doc.text('We look forward to serving you. For any queries, contact us at:', 25, footY + 26, { width: W, align: 'center' });

      doc.fill(TEAL).font('Helvetica-Bold').fontSize(9);
      doc.text('+91 89328 41664  |  jassucafe@gmail.com', 25, footY + 42, { width: W, align: 'center' });

      const bottomY = footY + 60;
      doc.rect(25, bottomY, W, 20).fill(DARK_BG);
      doc.fill(SLATE).font('Helvetica').fontSize(7);
      doc.text('JassuCafe  |  KDT Plaza, UGF 44, Aliganj, Lucknow, U.P. 226021', 25, bottomY + 6, { width: W, align: 'center' });

      doc.end();
    });

    if (pdfBuffer.length === 0) {
      return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="JassuCafe_Receipt_${date}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate receipt. Please try again.' },
      { status: 500 },
    );
  }
}

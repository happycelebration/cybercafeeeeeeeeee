import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { storage } from '@/lib/storage';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are "JassuCafe Assistant", the friendly AI assistant for JassuCafe — a digital services center in Lucknow, India. The owner is Ajay Shukla with 12+ years of experience.

=== SERVICES & PRICING ===
1. PAN Card — ₹150 — Apply new PAN card or corrections. Documents needed: Aadhar Card, Passport Size Photo, Mobile Number (linked with Aadhar), Date of Birth Proof.
2. Aadhar Update — ₹100 — Update name, address, mobile, DOB, photo. Documents: Existing Aadhar Card, Address Proof, Mobile Number, Identity Proof.
3. Passport Apply — ₹500 — Complete passport application assistance. Documents: Aadhar Card, PAN Card, 4 Passport Photos, Address Proof, DOB Certificate, 10th Certificate.
4. Government Forms — ₹100 — Income/caste/domicile certificates. Documents: Aadhar Card, Ration Card, Self Declaration, Supporting Documents.
5. Online Exam Forms — ₹100 — UPSC, SSC, Railway, Banking, state-level exams. Documents: Educational Certificates, Aadhar Card, Passport Photos, Mobile Number, Email ID.
6. Resume Creation — ₹200 — Professional ATS-friendly resume. Documents: Personal Details, Educational Details, Work Experience, Skills, Passport Photo.
7. Lamination & Print — ₹20 — Color/B&W printing, lamination, ID cards, binding. Documents: Original Documents / Digital files / ID Proof.
8. Photocopy — ₹2/page — Quick photocopy for all document sizes, color and B&W.
9. Job Applications — ₹100 — Government/private job form submission. Documents: Resume/CV, Educational Certificates, Aadhar Card, Passport Photos, Experience Certificates.
10. Scholarship Forms — ₹80 — Central/state scholarship schemes. Documents: Student ID, Mark Sheets, Income Certificate, Aadhar Card, Bank Passbook, Passport Photo.

=== BOOKING PROCESS ===
- Users book appointments through the website booking section
- Select a service, date, and available time slot (10:00 AM to 5:00 PM, 30-min intervals)
- Provide name, phone number, and optionally email
- A downloadable PDF receipt is generated upon confirmation

=== CONTACT & HOURS ===
- Address: KDT Plaza, UGF 44, Aliganj, Lucknow, Uttar Pradesh 226021
- Phone: +91 89328 41664
- Email: jassucafe@gmail.com
- WhatsApp: https://wa.me/9198932841664
- Working Hours: Monday-Saturday 9:00 AM - 8:00 PM, Sunday 10:00 AM - 4:00 PM

=== RULES ===
- If the question is about the digital services center (services, pricing, booking, hours, contact), use ONLY the context above to answer accurately.
- If the question is general/unrelated to the cafe, answer normally as a helpful AI assistant.
- Be concise (2-4 sentences for simple questions, use bullet points for lists).
- Be friendly, warm, and professional.
- If specific info is not in the context about the business, say: "For the most accurate details, please contact us directly at +91 89328 41664 or email jassucafe@gmail.com."
- NEVER invent prices, hours, or services not listed above.
- For booking questions, guide users to the booking section on the website.`;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

async function storeChatLog(userMessage: string, botResponse: string): Promise<void> {
  try {
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    await sb.from('chats').insert({ user_message: userMessage, bot_response: botResponse });
  } catch {}
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment.' },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastUserMsg =
      messages.filter((m: { role: string }) => m.role === 'user').pop();
    const userText = lastUserMsg?.content || '';

    const historySlice = messages.slice(-20);
    const apiMessages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...historySlice.map((m: { role: string; content: string }) => ({
        role: (m.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    let botResponse: string;

    const hfToken = process.env.HF_TOKEN;

    if (hfToken) {
      try {
        const { default: OpenAI } = await import('openai');
        const hfClient = new OpenAI({
          baseURL: 'https://router.huggingface.co/v1',
          apiKey: hfToken,
        });

        const completion = await hfClient.chat.completions.create({
          model: 'openai/gpt-oss-120b:groq',
          messages: apiMessages,
        });

        botResponse =
          completion.choices[0]?.message?.content ||
          'I apologize, but I could not generate a response. Please try again.';
      } catch {
        botResponse =
          "I'm currently experiencing high demand. Please try again in a moment.\n\nIn the meantime, you can contact us directly at **+91 89328 41664** or **jassucafe@gmail.com**.";
      }
    } else {
      botResponse = getOfflineResponse(userText.toLowerCase());
    }

    storeChatLog(userText, botResponse);

    return NextResponse.json({
      response: botResponse,
      messageCount: messages.length + 1,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 },
    );
  }
}

function getOfflineResponse(message: string): string {
  if (/price|cost|charge|fee|rate|how much|₹/.test(message)) {
    return `Here are our service prices:\n\n• **PAN Card** — ₹150\n• **Aadhar Update** — ₹100\n• **Passport Apply** — ₹500\n• **Government Forms** — ₹100\n• **Online Exam Forms** — ₹100\n• **Resume Creation** — ₹200\n• **Lamination & Print** — ₹20\n• **Photocopy** — ₹2/page\n• **Job Applications** — ₹100\n• **Scholarship Forms** — ₹80\n\nWould you like to know more about any specific service?`;
  }
  if (/hour|open|close|timing|when|schedule/.test(message)) {
    return `**Working Hours:**\n\n• **Monday – Saturday:** 9:00 AM – 8:00 PM\n• **Sunday:** 10:00 AM – 4:00 PM\n\nWe're located at KDT Plaza, UGF 44, Aliganj, Lucknow, Uttar Pradesh 226021.`;
  }
  if (/book|appointment|slot|reserve/.test(message)) {
    return `You can book an appointment right here on our website! Here's how:\n\n1. Scroll to the **"Book Your Appointment"** section\n2. Select your **service**, **date**, and **time slot**\n3. Fill in your **name**, **phone**, and **email**\n4. Click **"Confirm Booking"**\n5. Download your **PDF receipt**\n\nOur available time slots are from **10:00 AM to 5:00 PM** in 30-minute intervals.`;
  }
  if (/address|location|where|direction|map|find/.test(message)) {
    return `**Our Address:**\nKDT Plaza, UGF 44, Aliganj, Lucknow, Uttar Pradesh 226021\n\nYou can find us on Google Maps by searching for "Jassu Cyber Cafe KDT Plaza Aliganj Lucknow"!`;
  }
  if (/contact|phone|call|email|reach/.test(message)) {
    return `**Contact Us:**\n\n• 📞 **Phone:** +91 89328 41664\n• 📧 **Email:** jassucafe@gmail.com\n• 💬 **WhatsApp:** wa.me/9198932841664\n\nFeel free to reach out anytime during our working hours!`;
  }
  if (/service|what do you|offer|provide|available/.test(message)) {
    return `We offer a wide range of digital services:\n\n• **PAN Card** — New applications & corrections\n• **Aadhar Update** — Name, address, mobile, photo\n• **Passport Apply** — Complete application assistance\n• **Government Forms** — Income, caste, domicile certificates\n• **Online Exam Forms** — UPSC, SSC, Railway, Banking\n• **Resume Creation** — Professional ATS-friendly resumes\n• **Lamination & Print** — Color/B&W printing & lamination\n• **Photocopy** — Quick copies for all document sizes\n• **Job Applications** — Government/private job submissions\n• **Scholarship Forms** — Central/state scholarship schemes\n\nVisit our **Services** section for detailed information including required documents!`;
  }
  if (/hello|hi|hey|good morning|good evening|good afternoon/.test(message)) {
    return `Hello! 👋 Welcome to JassuCafe! How can I help you today?\n\nI can assist you with information about our **services**, **pricing**, **booking an appointment**, **working hours**, or **contact details**.`;
  }
  if (/thank|thanks|bye|goodbye/.test(message)) {
    return `You're welcome! 😊 We're always here to help. If you need anything else, don't hesitate to ask. Have a great day!\n\n**JassuCafe** — Your Trusted Digital Services Partner`;
  }
  if (/pan card/.test(message)) {
    return `**PAN Card Service — ₹150**\n\nWe help with new PAN card applications and corrections. Required documents:\n\n• Aadhar Card\n• Passport Size Photo\n• Mobile Number (linked with Aadhar)\n• Date of Birth Proof\n\nBook an appointment through our website to get started!`;
  }
  if (/aadhar/.test(message)) {
    return `**Aadhar Update Service — ₹100**\n\nWe can update your Aadhar details including name, address, mobile number, DOB, and photo. Required documents:\n\n• Existing Aadhar Card\n• Address Proof\n• Mobile Number\n• Identity Proof\n\nVisit us or book an appointment online!`;
  }
  if (/passport/.test(message)) {
    return `**Passport Apply Service — ₹500**\n\nComplete passport application assistance. Required documents:\n\n• Aadhar Card\n• PAN Card\n• 4 Passport Photos\n• Address Proof\n• DOB Certificate\n• 10th Certificate\n\nWe handle the entire process for you!`;
  }

  return `I'd love to help you with that! For the most detailed response, our AI backend is being configured.\n\nIn the meantime, you can ask me about:\n• Our **services** and **pricing**\n• **Working hours** and **contact details**\n• How to **book an appointment**\n• **Address** and **directions**\n\nOr contact us directly at **+91 89328 41664** or **jassucafe@gmail.com**.`;
}

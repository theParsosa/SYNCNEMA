// ===== FILE: server.ts =====
import type * as Party from "partykit/server";

// تعریف اینترفیس برای دیتای ورودی
type MessageData = {
  type: string;
  id?: string;
  to?: string;
  from?: string;
  data?: any;
};

export default class DelPlayerServer implements Party.Server {
  // ذخیره لیست کاربران متصل: { شناسه_کاربر: اتصال_سوکت }
  clients: Record<string, Party.Connection> = {};

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // وقتی کاربری وصل می‌شود، هنوز شناسه‌ای (id) ندارد
    // شناسه بعداً با پیام 'register' ست می‌شود.
    console.log(`Connected: ${conn.id}`);
  }

  onMessage(message: string, sender: Party.Connection) {
    let data: MessageData;
    
    try {
      // محدودیت طول پیام برای امنیت
      if (message.length > 2048) return;
      data = JSON.parse(message);
    } catch (e) {
      return; // JSON نامعتبر
    }

    // 1. ثبت نام کاربر (Register)
    if (data.type === 'register' && data.id) {
      // ذخیره اتصال با شناسه کاربر
      this.clients[data.id] = sender;
      // می‌توانیم id را در آبجکت اتصال هم ذخیره کنیم برای دسترسی راحت‌تر
      (sender as any).userId = data.id; 
      // console.log(`Registered user: ${data.id}`);
    }

    // 2. قطع ثبت نام (Unregister)
    else if (data.type === 'unregister' && data.id) {
      if (this.clients[data.id]) {
        delete this.clients[data.id];
      }
    }

    // 3. ارسال سیگنال به کاربر دیگر (Signaling)
    else if (data.type === 'signal' && data.to) {
      const targetConn = this.clients[data.to];
      const senderId = (sender as any).userId;

      // اگر گیرنده وجود دارد و متصل است
      if (targetConn && targetConn.readyState === WebSocket.OPEN) {
        
        // ایمن‌سازی متن چت (Sanitization)
        if (data.data && data.data.type === 'chat' && data.data.message) {
           data.data.message = data.data.message
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;");
        }

        // افزودن شناسه فرستنده به پیام و ارسال به گیرنده
        const payload = JSON.stringify({ ...data, from: senderId });
        targetConn.send(payload);
      }
    }

    // 4. پینگ/پونگ (برای زنده نگه داشتن اتصال)
    else if (data.type === 'ping') {
      sender.send(JSON.stringify({ type: 'pong' }));
    }
  }

  onClose(conn: Party.Connection) {
    // یافتن و حذف کاربری که قطع شده
    const userId = (conn as any).userId;
    if (userId && this.clients[userId]) {
      delete this.clients[userId];
      // console.log(`Disconnected user: ${userId}`);
    }
  }
}
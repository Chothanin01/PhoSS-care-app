export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  type: "medical" | "normal";
};

export const notificationsData: NotificationItem[] = [
  { id: 1, title: "ใบรับรองแพทย์", description: "ระบบได้ยื่นคำขอใบรับรองแพทย์ไปแล้ว", time: "5 นาทีที่ผ่านมา", isRead: false, type: "medical" },
  { id: 2, title: "เอกสารรับรอง", description: "ระบบได้ยื่นคำขอเอกสารไปแล้ว", time: "10 ชั่วโมงก่อน", isRead: true, type: "normal" },
  { id: 3, title: "การเลื่อนนัด", description: "ระบบได้ยืนยันการเลื่อนนัดของคุณแล้ว", time: "18 ชั่วโมงก่อน", isRead: true, type: "normal" },
  { id: 4, title: "คุณมีนัดในอีก 2 วันข้างหน้า", description: "มะรืนคุณมีนัดกับนพ. สมชาย เวลา 13:00 น.", time: "2 วันที่แล้ว", isRead: true, type: "normal" },
  { id: 5, title: "การเลื่อนนัด", description: "ระบบได้ปฏิเสธการเลื่อนนัดของคุณ กรุณาเลื่อนนัดใหม่อีกครั้ง", time: "5 วันที่แล้ว", isRead: false, type: "normal" },
  { id: 6, title: "เอกสารรับรอง", description: "โรงพยาบาลได้เตรียมเอกสารของคุณเเล้ว", time: "6 วันที่แล้ว", isRead: true, type: "normal" },
];

export const hasUnread = () => notificationsData.some(n => !n.isRead);
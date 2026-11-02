export interface Booking {
  id: number;
  userId: number;
  customerName: string;
  fieldId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED';
}

export interface Booking {
  id: number;
  userId: number;
  fieldId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled';
}

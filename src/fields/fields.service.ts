
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FieldsService {
  private readonly fields = [
    {
      id: 1,
      name: 'Lapangan Futsal A',
      location: 'Gedung A',
      pricePerHour: 150000,
    },
    {
      id: 2,
      name: 'Lapangan Futsal B',
      location: 'Gedung B',
      pricePerHour: 175000,
    },
    {
      id: 3,
      name: 'Lapangan Badminton A',
      location: 'Gedung C',
      pricePerHour: 75000,
    },
  ];

  findAll() {
    return this.fields;
  }

  findOne(id: number) {
    const field = this.fields.find((item) => item.id === id);

    if (!field) {
      throw new NotFoundException(`Lapangan dengan ID ${id} tidak ditemukan`);
    }

    return field;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FieldsService {

private readonly fields = [
  {
    id: 1,
    name: 'Lapangan Futsal A',
    sportType: 'Futsal',
    location: 'Gedung A',
    pricePerHour: 150000,
    status: 'AVAILABLE',
  },
  {
    id: 2,
    name: 'Lapangan Futsal B',
    sportType: 'Futsal',
    location: 'Gedung B',
    pricePerHour: 175000,
    status: 'AVAILABLE',
  },
  {
    id: 3,
    name: 'Lapangan Badminton A',
    sportType: 'Badminton',
    location: 'Gedung C',
    pricePerHour: 75000,
    status: 'AVAILABLE',
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

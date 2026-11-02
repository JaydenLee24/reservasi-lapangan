# Sistem Reservasi Lapangan Olahraga

Proyek ini merupakan REST API untuk mengelola data lapangan olahraga dan reservasi jadwal menggunakan NestJS dan TypeScript. Melalui API ini, pengguna dapat melihat daftar lapangan, memeriksa ketersediaan jadwal, membuat reservasi, melihat detail pemesanan, dan membatalkan reservasi.

Data disimpan dalam array di memori, sehingga aplikasi belum menggunakan database.

## Teknologi yang Digunakan

- Node.js
- NestJS
- TypeScript
- Jest untuk pengujian

## Persiapan dan Instalasi

Pastikan Node.js dan npm sudah terpasang di komputer. Buka terminal pada folder proyek, lalu jalankan perintah berikut untuk memasang dependensi:

```bash
npm install
```

Setelah proses instalasi selesai, jalankan aplikasi dengan perintah:

```bash
npm run start:dev
```

Jika server berhasil dijalankan, API dapat diakses melalui alamat berikut:

`http://localhost:3000`

## Daftar Endpoint

Berikut endpoint yang tersedia dalam aplikasi beserta fungsinya.

GET `/fields` = Menampilkan daftar semua lapangan olahraga.

GET `/fields/:id` = Menampilkan detail lapangan berdasarkan ID.

GET `/fields/:id/availability?date=YYYY-MM-DD` = Melihat jadwal yang sudah dipesan pada lapangan dan tanggal tertentu.

POST `/bookings` = Membuat reservasi lapangan baru.

GET `/bookings/:id` = Melihat detail reservasi berdasarkan ID.

GET `/users/:userId/bookings` = Menampilkan daftar reservasi berdasarkan ID pengguna.

PATCH `/bookings/:id/cancel` = Membatalkan reservasi berdasarkan ID.

## Contoh Penggunaan API

### 1. Membuat Reservasi

Untuk membuat reservasi baru, gunakan method `POST` pada endpoint berikut:

`/bookings`

Data yang dikirim dalam request body:

```json
{
  "userId": 1,
  "customerName": "Budi",
  "fieldId": 1,
  "date": "2026-11-05",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

Keterangan:

- `userId` = ID pengguna yang membuat reservasi.
- `customerName` = Nama pelanggan.
- `fieldId` = ID lapangan yang ingin dipesan.
- `date` = Tanggal reservasi dengan format `YYYY-MM-DD`.
- `startTime` = Waktu mulai reservasi dengan format `HH:mm`.
- `endTime` = Waktu selesai reservasi dengan format `HH:mm`.

Jika reservasi berhasil dibuat, API akan mengembalikan data reservasi seperti berikut:

```json
{
  "id": 1,
  "userId": 1,
  "customerName": "Budi",
  "fieldId": 1,
  "date": "2026-11-05",
  "startTime": "09:00",
  "endTime": "10:00",
  "status": "BOOKED"
}
```

ID reservasi dibuat secara otomatis oleh aplikasi.

### 2. Memeriksa Ketersediaan Lapangan

Untuk melihat jadwal yang sudah dipesan pada tanggal tertentu, gunakan endpoint berikut:

`GET /fields/1/availability?date=2026-11-05`

API akan mengembalikan daftar jadwal reservasi aktif pada tanggal tersebut.

Jika belum ada reservasi aktif, respons yang diberikan berupa array kosong:

```json
[]
```

Reservasi yang sudah dibatalkan tidak lagi dianggap sebagai jadwal terisi. Dengan demikian, waktu tersebut dapat dipesan kembali selama tidak ada reservasi aktif lain yang bentrok.

### 3. Melihat Detail Reservasi

Gunakan endpoint berikut untuk melihat informasi reservasi berdasarkan ID:

`GET /bookings/1`

Jika reservasi ditemukan, API akan mengembalikan data reservasi beserta statusnya.

### 4. Melihat Reservasi Pengguna

Untuk melihat seluruh reservasi milik pengguna tertentu, gunakan endpoint berikut:

`GET /users/1/bookings`

Angka `1` pada URL merupakan ID pengguna yang ingin diperiksa.

### 5. Membatalkan Reservasi

Untuk membatalkan reservasi, gunakan method `PATCH` pada endpoint berikut:

`/bookings/1/cancel`

Jika pembatalan berhasil, status reservasi berubah menjadi `CANCELLED`. Reservasi yang sudah dibatalkan tidak dapat dibatalkan kembali dan akan menghasilkan respons kesalahan jika permintaan pembatalan diulangi.

## Status Reservasi

Aplikasi menggunakan tiga status reservasi berikut:

BOOKED = Reservasi sudah dibuat dan masih aktif.

CANCELLED = Reservasi sudah dibatalkan dan tidak lagi menghalangi pemesanan pada jadwal tersebut.

COMPLETED = Status yang tersedia dalam tipe data untuk menandai reservasi yang telah selesai.

## Penanganan Kesalahan

API menggunakan status HTTP untuk menunjukkan hasil permintaan.

200 OK = Permintaan berhasil diproses.

201 Created = Reservasi berhasil dibuat.

400 Bad Request = Permintaan tidak dapat diproses karena data tidak valid, jadwal bentrok, atau reservasi sudah dibatalkan.

404 Not Found = Lapangan atau reservasi yang dicari tidak ditemukan.

Contoh respons ketika jadwal sudah dipesan:

```json
{
  "message": "Jadwal lapangan sudah dipesan pada waktu tersebut",
  "error": "Bad Request",
  "statusCode": 400
}
```

Contoh respons ketika reservasi tidak ditemukan:

```json
{
  "message": "Booking dengan ID 999 tidak ditemukan",
  "error": "Not Found",
  "statusCode": 404
}
```

## Pengujian

Pengujian unit dapat dijalankan menggunakan perintah berikut:

```bash
npm run test
```

Untuk memastikan aplikasi dapat dikompilasi tanpa kesalahan, jalankan:

```bash
npm run build
```

Pengujian manual juga dilakukan melalui HTTP request untuk memeriksa beberapa kondisi, antara lain:

- Menampilkan daftar dan detail lapangan.
- Menangani permintaan untuk lapangan yang tidak ditemukan.
- Membuat reservasi baru.
- Menolak reservasi dengan jadwal yang bentrok.
- Melihat detail reservasi dan daftar reservasi pengguna.
- Membatalkan reservasi.
- Memastikan jadwal yang sudah dibatalkan dapat dipesan kembali.
- Menolak pembatalan ulang pada reservasi yang sudah dibatalkan.

## Catatan

Aplikasi ini menggunakan penyimpanan sementara di memori. Data reservasi akan kembali kosong ketika server dimulai ulang.

Proyek ini dikembangkan sebagai implementasi REST API Sistem Reservasi Lapangan Olahraga menggunakan NestJS, dengan pengelolaan data melalui Controller dan Service.


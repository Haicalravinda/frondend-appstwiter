# Frontend React.js + Vite.js + TailwindCSS

Frontend ini dibuat menggunakan **React.js**, **Vite.js**, dan **TailwindCSS**, dengan tampilan modern menyerupai **Twitter**.  
Frontend ini terhubung ke backend Node.js Express + Prisma + SQLite melalui API untuk autentikasi, posting, feed, dan fitur sosial media lainnya.

---

## Fitur

- Register dan login user dengan autentikasi JWT  
- Feed sosial media menampilkan posting dari user yang diikuti  
- Membuat postingan baru  
- Follow/unfollow user  
- Tampilan responsif dan modern dengan TailwindCSS  

---

## Persiapan

Pastikan sudah menginstall:  

- [Node.js](https://nodejs.org/) v18+  
- npm (biasanya sudah termasuk dengan Node.js)  
- Git (opsional, jika ingin clone repository)  
- Backend Node.js Express + Prisma + SQLite sudah berjalan di `http://localhost:3000/api`  

---

## Instalasi dan Menjalankan Frontend

1. Clone repository frontend:  
git clone <URL_REPOSITORY_FRONTEND>
cd <NAMA_FOLDER>

2. Install dependencies:
   npm install
   
3. Jalankan development server:  
npm run dev

4. Buka browser dan akses frontend di alamat yang diberikan Vite, biasanya `http://localhost:5173`  

> Pastikan backend sudah berjalan agar frontend dapat berkomunikasi dengan API untuk autentikasi dan feed.

---

## Cara Menggunakan

### Register
Buat akun baru melalui halaman register.  

![Register Page](assets/register.png)

### Login
Masuk menggunakan akun yang telah dibuat.  

![Login Page](assets/login.png)

### Feed Sosial Media
Setelah login, Anda akan diarahkan ke feed yang menampilkan posting dari user yang diikuti.  
Dapat membuat postingan baru, follow atau unfollow user.  

![Feed Page](assets/feed.png)

Semua aksi frontend akan otomatis terhubung ke backend melalui API.

---

## TailwindCSS

Frontend menggunakan **TailwindCSS** untuk styling. Semua tampilan modern dan responsif dapat dikustomisasi melalui konfigurasi Tailwind.  

---

## Catatan

- Pastikan backend berjalan sebelum menggunakan frontend.  
- Token JWT disimpan di `localStorage` untuk autentikasi otomatis di setiap request.  
- Frontend dirancang agar responsif dan dapat digunakan di desktop maupun perangkat mobile.  

---



# โปรแกรมประเมินสุขภาพและมวลกล้ามเนื้อ

เว็บแอปพลิเคชันสำหรับประเมินสุขภาพและคำนวณ BMI พร้อมแบบประเมินมวลกล้ามเนื้อ

## คุณสมบัติ

- ✅ กรอกข้อมูลส่วนบุคคล (ชื่อ, นามสกุล, อายุ, เพศ, ส่วนสูง, น้ำหนัก)
- ✅ คำนวณ BMI อัตโนมัติ
- ✅ แบบประเมินมวลกล้ามเนื้อ 5 ข้อ (ทีละหน้า)
  1. ความแข็งแรงของกล้ามเนื้อ
  2. การเดิน
  3. การลุกจากเก้าอี้
  4. การขึ้นบันได
  5. การล้ม
- ✅ แสดงผลลัพธ์ใน Modal
  - คะแนน 0-4: มวลกล้ามเนื้อปกติ (สีเขียว)
  - คะแนน >4: มีภาวะมวลกล้ามเนื้อน้อย (สีแดง)
- ✅ บันทึกผลลัพธ์ลง Google Sheets โดยตรง
- ✅ เก็บข้อมูลใน localStorage และ Google Sheets

## การติดตั้งและใช้งาน

### วิธีที่ 1: ใช้งานในเครื่อง (Local)

1. เปิดไฟล์ `index.html` ด้วยเว็บเบราว์เซอร์
2. กรอกข้อมูลและทำแบบประเมิน

### วิธีที่ 2: ตั้งค่า Google Sheets (สำคัญ!)

**ดูคู่มือฉบับเต็มที่:** [SETUP_GOOGLE_SHEETS.md](SETUP_GOOGLE_SHEETS.md)

สรุปขั้นตอน:
1. สร้าง Google Sheet ใหม่
2. เปิด Extensions > Apps Script
3. คัดลอกโค้ดจาก `google-apps-script.gs` ไปวาง
4. Deploy as Web App (Anyone)
5. คัดลอก UR4 ที่ได้
6. แก้ไข `GOOGLE_SCRIPT_URL` ในไฟล์ `app.js`

### วิธีที่ 3: Deploy บน GitHub Pages

1. สร้าง Repository ใหม่บน GitHub
2. Upload ไฟล์ทั้งหมดขึ้น Repository (ยกเว้น google-apps-script.gs)
3. ไปที่ Settings > Pages
4. เลือก Source: `main` branch, folder: `/ (root)`
5. คลิก Save และรอสักครู่
6. เว็บจะพร้อมใช้งานที่ URL: `https://[username].github.io/[repository-name]/`

### วิธีที่ 3: ใช้ Git Command Line

```bash
# สร้าง repository และ push
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[username]/[repository-name].git
git push -u origin main

# Enable GitHub Pages ผ่าน web interface
```

## ไฟล์ในโปรเจค

- `index.html` - หน้าแรก (กรอกข้อมูลส่วนตัว)
- `question.html` - หน้าแบบประเมิน
- `style.css` - สไตล์และการออกแบบ
- `app.js` - Logic และการทำงานของเว็บ
- `google-apps-script.gs` - โค้ด Google Apps Script (ไม่ต้อง upload ขึ้น GitHub)
- `SETUP_GOOGLE_SHEETS.md` - คู่มือตั้งค่า Google Sheets
- `README.md` - คู่มือการใช้งาน

## เทคโนโลยีที่ใช้

- HTML5
- Google Apps Script - Backend API
- Google Sheets - Database
- LocalStorage - Cache ข้อมูลชั่วคราว
- SheetJS (xlsx) - สำหรับ export Excel
- LocalStorage - สำหรับเก็บข้อมูล
บันทึกลง Google Sheets โดยตรง
- ต้องมีการเชื่อมต่ออินเทอร์เน็ตเพื่อบันทึกข้อมูล
- ข้อมูลชั่วคราวเก็บใน localStorage
- **จำเป็นต้องตั้งค่า Google Apps Script ก่อนใช้งาน** (ดู SETUP_GOOGLE_SHEETS.md
- ไฟล์ Excel จะถูกดาวน์โหลดไปยังเครื่องผู้ใช้
- ไม่มีการเก็บข้อมูลบน server (Static hosting)
- สามารถใช้งานได้โดยไม่ต้องเชื่อมต่ออินเทอร์เน็ต (หลังจาก load หน้าเว็บแล้ว)

## การเพิ่มโลโก้

วางไฟล์รูปโลโก้ชื่อ `logo.png` ในโฟลเดอร์เดียวกับ `index.html`

## License

MIT License - ใช้งานได้อย่างอิสระ

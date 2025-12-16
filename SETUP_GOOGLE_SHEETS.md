# คู่มือการตั้งค่า Google Sheets

## ขั้นตอนการตั้งค่า (ทำครั้งเดียว)

### 1. สร้าง Google Sheet

1. ไปที่ [Google Sheets](https://sheets.google.com/)
2. คลิก **+ ว่างเปล่า** เพื่อสร้าง Spreadsheet ใหม่
3. ตั้งชื่อว่า **"ข้อมูลประเมินสุขภาพ"** หรือชื่ือที่ต้องการ

### 2. สร้าง Apps Script

1. ใน Google Sheet ที่สร้างไว้ คลิกที่ **ส่วนขยาย** (Extensions) > **Apps Script**
2. ลบโค้ดเก่าออกทั้งหมด
3. **คัดลอกโค้ด**จากไฟล์ `google-apps-script.gs` ทั้งหมด
4. **วาง** ลงในหน้า Apps Script
5. คลิก **บันทึก** (💾) และตั้งชื่อโปรเจคว่า **"HealthAssessmentAPI"**

### 3. Deploy เป็น Web App

1. คลิกปุ่ม **Deploy** (หรือ ทำให้ใช้งานได้) > **การทำให้ใช้งานได้ใหม่** (New deployment)
2. คลิกไอคอน **⚙️ เกียร์** ข้างๆ "เลือกประเภท" > เลือก **Web app**
3. ตั้งค่าดังนี้:
   - **คำอธิบาย**: "Health Assessment API v1"
   - **ดำเนินการในฐานะ**: เลือก **ฉัน** (Me)
   - **ผู้ที่มีสิทธิ์เข้าถึง**: เลือก **ทุกคน** (Anyone)
4. คลิก **Deploy**
5. คลิก **อนุญาตการเข้าถึง** (Authorize access)
   - เลือกบัญชี Google ของคุณ
   - คลิก **Advanced** > **Go to [ชื่อโปรเจค] (unsafe)**
   - คลิก **Allow**
6. **คัดลอก Web App URL** ที่ได้ (จะขึ้นต้นด้วย `https://script.google.com/macros/s/...`)

### 4. อัพเดท URL ในไฟล์ app.js

1. เปิดไฟล์ `app.js`
2. หาบรรทัดนี้ (ประมาณบรรทัดที่ 10):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE';
   ```
3. เปลี่ยนเป็น:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'URL_ที่คัดลอกมาจากขั้นตอนที่_3';
   ```
4. บันทึกไฟล์

## ทดสอบการทำงาน

1. เปิดเว็บ (index.html)
2. กรอกข้อมูลและทำแบบประเมินจนจบ
3. คลิกปุ่ม **"บันทึกลง Google Sheets"**
4. ไปเช็คที่ Google Sheet ควรเห็นข้อมูลเพิ่มเข้ามา

## โครงสร้างข้อมูลใน Google Sheet

Sheet จะมี Column ดังนี้:

| วันที่/เวลา | ชื่อ | นามสกุล | อายุ | เพศ | ส่วนสูง | น้ำหนัก | BMI | Q1 | Q2 | Q3 | Q4 | Q5 | คะแนนรวม | ผลการประเมิน | สถานะ |
|------------|------|---------|------|-----|---------|---------|-----|----|----|----|----|----|-----------|--------------| -------|

- **Header**: พื้นหลังสีเขียว
- **แถวปกติ**: พื้นหลังสีเขียวอ่อน
- **แถวผิดปกติ**: พื้นหลังสีแดงอ่อน

## การแก้ไข/อัพเดท

หากต้องการแก้ไข Apps Script:
1. ไปที่ Apps Script Editor
2. แก้ไขโค้ด
3. คลิก **Deploy** > **จัดการการทำให้ใช้งานได้** (Manage deployments)
4. คลิก **✏️ Edit** ที่ deployment ปัจจุบัน
5. เปลี่ยน Version เป็น **New version**
6. คลิก **Deploy**

**หมายเหตุ**: URL จะเหมือนเดิม ไม่ต้องเปลี่ยนในไฟล์ app.js

## Troubleshooting

### ❌ ข้อมูลไม่เข้า Sheet
- ตรวจสอบ URL ใน app.js ว่าถูกต้องหรือไม่
- ตรวจสอบว่า Deploy แบบ "Anyone" แล้วหรือยัง
- เปิด Console ใน Browser (F12) เพื่อดู Error

### ❌ Permission Denied
- กลับไปทำขั้นตอนที่ 3 ใหม่
- ตรวจสอบว่าเลือก "Execute as: Me" และ "Who has access: Anyone"

### ❌ CORS Error
- ใช้ mode: 'no-cors' ในโค้ด (มีอยู่แล้ว)
- Google Apps Script รองรับ CORS อยู่แล้ว ไม่ต้องกังวล

## ข้อดีของการใช้ Google Sheets

✅ ไม่ต้องมี Backend Server  
✅ ฟรี ไม่มีค่าใช้จ่าย  
✅ เห็นข้อมูล Real-time  
✅ Export เป็น Excel/CSV ได้จาก Google Sheets โดยตรง  
✅ แชร์ Sheet ให้คนอื่นดูได้  
✅ ทำ Dashboard หรือ Data Analysis ได้เลย  

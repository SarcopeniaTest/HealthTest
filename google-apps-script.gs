// Google Apps Script สำหรับรับข้อมูลจากเว็บและบันทึกลง Google Sheets
// คัดลอกโค้ดนี้ไปวางใน Google Apps Script

// ชื่อ Sheet ที่ต้องการบันทึก
const SHEET_NAME = 'ข้อมูลประเมิน';

function doPost(e) {
  try {
    // รับข้อมูลจาก request
    const data = JSON.parse(e.postData.contents);
    
    // เปิด Spreadsheet (ใช้ Spreadsheet ปัจจุบัน)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // ถ้ายังไม่มี Sheet ให้สร้างใหม่และเพิ่ม Header
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      
      // สร้าง Header
      const headers = [
        'วันที่/เวลา',
        'ชื่อ',
        'นามสกุล',
        'อายุ',
        'เพศ',
        'ส่วนสูง (ซม.)',
        'น้ำหนัก (กก.)',
        'BMI',
        'ผล BMI',
        'คำแนะนำ BMI',
        'Q1: กล้ามเนื้อ',
        'Q2: การเดิน',
        'Q3: ลุกจากเก้าอี้',
        'Q4: ขึ้นบันได',
        'Q5: การล้ม',
        'คะแนนรวม',
        'ผลการประเมินกล้ามเนื้อ',
        'สถานะ'
      ];
      
      sheet.appendRow(headers);
      
      // จัดรูปแบบ Header
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#abc385');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      headerRange.setVerticalAlignment('middle');
    }
    
    // เตรียมข้อมูลสำหรับแถวใหม่
    const row = [
      data.timestamp,
      data.firstname,
      data.lastname,
      data.age,
      data.gender,
      data.height,
      data.weight,
      data.bmi,
      data.bmiCategory || '',
      data.bmiAdvice || '',
      data.answers[0].answer,
      data.answers[1].answer,
      data.answers[2].answer,
      data.answers[3].answer,
      data.answers[4].answer,
      data.totalScore,
      data.result,
      data.resultStatus
    ];
    
    // เพิ่มข้อมูลลง Sheet
    sheet.appendRow(row);
    
    // จัดรูปแบบแถวที่เพิ่มเข้าไป
    const lastRow = sheet.getLastRow();
    const dataRange = sheet.getRange(lastRow, 1, 1, row.length);
    
    // ตั้งค่าสีพื้นหลังของแถวตามผลการประเมินกล้ามเนื้อ
    if (data.resultStatus === 'ผิดปกติ') {
      // ผลผิดปกติ - สีแดงอ่อน
      dataRange.setBackground('#ffebee');
      sheet.getRange(lastRow, 17).setFontColor('#c62828').setFontWeight('bold');
    } else {
      // ผลปกติ - สีเขียวอ่อน
      dataRange.setBackground('#e8f5e9');
      sheet.getRange(lastRow, 17).setFontColor('#2e7d32').setFontWeight('bold');
    }
    
    // ไฮไลท์ BMI เฉพาะเซลล์นั้น ตามเกณฑ์
    const bmiCategory = data.bmiCategory || '';
    if (bmiCategory.includes('อ้วน')) {
      sheet.getRange(lastRow, 9).setBackground('#f8d7da').setFontColor('#721c24').setFontWeight('bold');
    } else if (bmiCategory.includes('เกิน')) {
      sheet.getRange(lastRow, 9).setBackground('#fff3cd').setFontColor('#856404').setFontWeight('bold');
    } else if (bmiCategory.includes('ปกติ') || bmiCategory.includes('สมส่วน')) {
      sheet.getRange(lastRow, 9).setBackground('#d4edda').setFontColor('#155724').setFontWeight('bold');
    } else if (bmiCategory.includes('ผอม') || bmiCategory.includes('น้อย')) {
      sheet.getRange(lastRow, 9).setBackground('#fff3cd').setFontColor('#856404').setFontWeight('bold');
    }
    
    // จัดตำแหน่งข้อความให้เป็นศูนย์กลาง
    dataRange.setHorizontalAlignment('center');
    dataRange.setVerticalAlignment('middle');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, row.length);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'บันทึกข้อมูลสำเร็จ'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ฟังก์ชันทดสอบ
function doGet() {
  return ContentService
    .createTextOutput('Google Apps Script is running! Use POST method to submit data.')
    .setMimeType(ContentService.MimeType.TEXT);
}

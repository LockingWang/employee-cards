# API 監控 LOG 系統設定

## 📊 LOG 系統架構

當戰情室偵測到 API 錯誤時，會自動將錯誤記錄寫入 Google Sheets 的 `API_LOG` 工作表。

---

## 🔧 設定步驟

### 步驟 1：建立 API_LOG 工作表

1. 開啟您的 Google Sheets
2. 在底部新增工作表，命名為 `API_LOG`
3. 在第一行設定標題欄位：

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| 時間戳記 | API名稱 | 請求方法 | URL | 狀態 | HTTP狀態碼 | 回應時間(ms) | 錯誤訊息 |

---

### 步驟 2：建立 Google Apps Script

1. 在 Google Sheets 中點擊「擴充功能」→「Apps Script」
2. 刪除預設程式碼
3. 貼上以下完整程式碼：

```javascript
/**
 * API 監控 LOG 系統
 * 接收來自戰情室的 API 錯誤記錄
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 判斷是否為寫入 LOG 的請求
    if (data.action === 'writeLog') {
      return writeApiLog(data);
    }
    
    // 其他類型的請求
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: '未知的操作類型'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 寫入 API LOG
 */
function writeApiLog(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('API_LOG');
    
    // 如果工作表不存在，自動建立
    if (!sheet) {
      sheet = ss.insertSheet('API_LOG');
      // 設定標題行
      sheet.appendRow([
        '時間戳記', 'API名稱', '請求方法', 'URL', 
        '狀態', 'HTTP狀態碼', '回應時間(ms)', '錯誤訊息'
      ]);
      
      // 格式化標題行
      const headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground('#4a5568');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    // 檢查並清理超過 1000 筆的舊記錄
    cleanOldLogsIfNeeded(sheet);
    
    // 新增 LOG 資料
    sheet.appendRow([
      data.timestamp || '',
      data.apiName || '',
      data.method || '',
      data.url || '',
      data.status || '',
      data.httpStatus || '',
      data.responseTime || '',
      data.errorMessage || ''
    ]);
    
    // 取得最後一行
    const lastRow = sheet.getLastRow();
    
    // 根據狀態設定行的背景色
    if (data.status === 'error') {
      sheet.getRange(lastRow, 1, 1, 8).setBackground('#fee2e2'); // 紅色背景
    }
    
    // 自動調整欄寬（僅在資料較少時執行，避免效能問題）
    if (lastRow < 100) {
      sheet.autoResizeColumns(1, 8);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'LOG 已記錄',
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in writeApiLog: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 清理超過 1000 筆的舊記錄
 */
function cleanOldLogsIfNeeded(sheet) {
  try {
    const MAX_ROWS = 1000; // 最多保留 1000 筆記錄（不含標題行）
    const lastRow = sheet.getLastRow();
    
    // 如果記錄數（扣除標題行）超過 1000 筆
    if (lastRow > MAX_ROWS + 1) {
      const rowsToDelete = lastRow - MAX_ROWS - 1; // 需要刪除的行數
      
      // 刪除最舊的記錄（從第 2 行開始，保留標題行）
      sheet.deleteRows(2, rowsToDelete);
      
      Logger.log('已刪除 ' + rowsToDelete + ' 筆舊記錄');
    }
  } catch (error) {
    Logger.log('清理舊記錄時發生錯誤: ' + error.toString());
    // 不拋出錯誤，避免影響 LOG 寫入
  }
}

/**
 * GET 請求處理（測試用）
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'API LOG Service is running',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 手動測試函數
 */
function testWriteLog() {
  const testData = {
    action: 'writeLog',
    timestamp: new Date().toLocaleString('zh-TW'),
    apiName: '測試 API',
    method: 'POST',
    url: 'https://api.example.com/test',
    status: 'error',
    httpStatus: 504,
    responseTime: 5000,
    errorMessage: 'HTTP 504: 閘道超時'
  };
  
  const result = writeApiLog(testData);
  Logger.log(result.getContent());
}
```

---

### 步驟 3：部署 Web App

1. 點擊右上角「部署」→「新增部署」
2. 點擊「類型」旁的齒輪圖示，選擇「Web 應用程式」
3. 設定：
   - **說明**：API 監控 LOG 系統
   - **執行身分**：「我」
   - **存取權限**：「所有人」
4. 點擊「部署」
5. **複製 Web App URL**
部署作業 ID: AKfycbzcsshTDUA60kEjZfK7CFrjSiX3uKuF7W5683vC3l_vcnYSNxqRMX0qTDSrqze8h-wEEA
網址: https://script.google.com/macros/s/AKfycbzcsshTDUA60kEjZfK7CFrjSiX3uKuF7W5683vC3l_vcnYSNxqRMX0qTDSrqze8h-wEEA/exec

6. 點擊「完成」

**重要提示：** 每次修改 Apps Script 程式碼後，需要點擊「部署」→「管理部署」→ 點擊鉛筆圖示 → 更新「版本」→「部署」

---

### 步驟 4：在專案中設定 Web App URL

在 `src/services/googleSheets.ts` 中更新配置：

```typescript
export const defaultGoogleSheetsConfig: GoogleSheetsConfig = {
  spreadsheetId: '您的GoogleSheetsID',
  range: 'Sheet1!A:H',
  apiKey: '您的APIKey',
  webAppUrl: 'https://script.google.com/macros/s/您的SCRIPT_ID/exec' // 👈 貼上剛才複製的 URL
}
```

---

### 步驟 5：測試

#### 方法 1：在 Apps Script 中測試

1. 在 Apps Script 編輯器中
2. 選擇函數 `testWriteLog`
3. 點擊「執行」
4. 檢查 `API_LOG` 工作表是否有新增測試資料

#### 方法 2：在戰情室中測試

1. 啟動您的應用程式
2. 進入戰情室頁面
3. 等待 API 檢查執行
4. 如果有 API 錯誤，檢查 Google Sheets 的 `API_LOG` 工作表

---

## 📊 LOG 欄位說明

| 欄位 | 說明 | 範例 |
|------|------|------|
| 時間戳記 | 錯誤發生的時間 | 2024/10/30 下午2:30:45 |
| API名稱 | API 的顯示名稱 | CC API 伺服器 |
| 請求方法 | HTTP 請求方法 | POST / GET |
| URL | 完整的 API 網址 | https://api.example.com/endpoint |
| 狀態 | 請求狀態 | error |
| HTTP狀態碼 | HTTP 回應狀態碼 | 504, 500, 等 |
| 回應時間(ms) | API 回應時間（毫秒） | 5000 |
| 錯誤訊息 | 詳細錯誤訊息 | HTTP 504: 閘道超時 |

---

## 🎨 自動格式化說明

Apps Script 會自動：
- ✅ 建立 `API_LOG` 工作表（如果不存在）
- ✅ 設定標題行（深灰色背景，白色文字）
- ✅ 錯誤記錄使用紅色背景（`#fee2e2`）
- ✅ 自動調整欄寬（前 100 筆記錄）

---

## 🔍 LOG 查詢技巧

### 篩選特定 API 的錯誤
1. 選擇「資料」→「建立篩選器」
2. 點擊「API名稱」欄的篩選圖示
3. 選擇要查看的 API

### 查看特定時間範圍的錯誤
1. 選擇「資料」→「建立篩選器」
2. 點擊「時間戳記」欄的篩選圖示
3. 使用「依條件篩選」設定時間範圍

### 統計錯誤次數
使用 Google Sheets 的樞紐分析表功能：
1. 選擇資料範圍
2. 點擊「插入」→「樞紐分析表」
3. 列：API名稱
4. 值：計數（時間戳記）

---

## ⚠️ 注意事項

### 效能考量
- ✅ **自動清理**：系統會自動保留最新 1000 筆記錄
- ✅ 當記錄超過 1000 筆時，會自動刪除最舊的記錄
- ✅ 不需要手動清理，系統會自動維護

### 儲存空間
- 系統設定為最多保留 **1000 筆記錄**
- 超過 1000 筆時會自動刪除最舊的記錄
- 如需保留更多記錄，請修改 Apps Script 中的 `MAX_ROWS` 常數

### 隱私與安全
- Web App 設定為「所有人」可存取，建議加入認證機制
- 敏感資訊（如 API Key）不應記錄在 LOG 中
- 定期檢查並清理不必要的 LOG

---

## 🔒 安全性增強（選用）

如果需要限制只有特定來源可以寫入 LOG，可以在 Apps Script 中加入驗證：

```javascript
const VALID_TOKEN = 'your-secret-token-here'; // 設定您的密鑰

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 驗證 Token
    if (data.token !== VALID_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: '無效的認證 Token'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // ... 其他程式碼
  } catch (error) {
    // ... 錯誤處理
  }
}
```

然後在 `src/services/googleSheets.ts` 的 `writeApiLog` 方法中加入 token：

```typescript
body: JSON.stringify({
  token: 'your-secret-token-here',
  action: 'writeLog',
  // ... 其他資料
})
```

---

## 📈 進階功能（可選）

### 1. 調整保留記錄數量

如果您需要保留更多或更少的記錄，可以修改 Apps Script 中的 `MAX_ROWS` 常數：

```javascript
function cleanOldLogsIfNeeded(sheet) {
  const MAX_ROWS = 2000; // 改為保留 2000 筆（或任意數量）
  // ... 其他程式碼
}
```

### 2. 匯出舊記錄到另一個工作表

如果想保留所有歷史記錄，可以在刪除前先備份：

```javascript
function archiveOldLogs(sheet) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let archiveSheet = ss.getSheetByName('API_LOG_歷史');
  
  // 建立歷史工作表（如果不存在）
  if (!archiveSheet) {
    archiveSheet = ss.insertSheet('API_LOG_歷史');
  }
  
  const MAX_ROWS = 1000;
  const lastRow = sheet.getLastRow();
  
  if (lastRow > MAX_ROWS + 1) {
    const rowsToArchive = lastRow - MAX_ROWS - 1;
    
    // 複製舊記錄到歷史工作表
    const oldData = sheet.getRange(2, 1, rowsToArchive, 8).getValues();
    if (archiveSheet.getLastRow() === 0) {
      // 如果是空工作表，先加入標題
      const headers = sheet.getRange(1, 1, 1, 8).getValues();
      archiveSheet.appendRow(headers[0]);
    }
    oldData.forEach(row => archiveSheet.appendRow(row));
    
    // 刪除原工作表的舊記錄
    sheet.deleteRows(2, rowsToArchive);
  }
}
```

### 3. 錯誤通知

當發生錯誤時發送 Email 通知：

```javascript
function writeApiLog(data) {
  // ... 寫入 LOG 的程式碼
  
  // 如果是嚴重錯誤，發送通知
  if (data.httpStatus === 500 || data.httpStatus === 504) {
    sendErrorNotification(data);
  }
  
  // ... 返回結果
}

function sendErrorNotification(data) {
  const recipient = 'your-email@example.com';
  const subject = `⚠️ API 監控警報：${data.apiName}`;
  const body = `
    時間：${data.timestamp}
    API：${data.apiName}
    URL：${data.url}
    狀態碼：${data.httpStatus}
    錯誤訊息：${data.errorMessage}
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}
```

---

## 🎯 完成！

現在您的 API 監控系統已經設定完成，所有錯誤都會自動記錄到 Google Sheets 的 `API_LOG` 工作表中！

如有問題，請檢查：
1. ✅ Web App URL 是否正確設定
2. ✅ Apps Script 是否正確部署
3. ✅ Google Sheets 權限是否正確
4. ✅ 瀏覽器 Console 是否有錯誤訊息


# Google Sheets 串接設定說明

## 1. 建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com)
2. 建立新的試算表
3. 在第一行設定標題欄位（建議使用以下欄位）：

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| 姓名 | 職稱 | 頭像 | 描述 | 興趣愛好 | 喜歡的東西 | 害怕的東西 | 不吃的東西 |

## 2. 設定 Google Sheets 為公開

1. 點擊右上角的「共用」按鈕
2. 將權限設定為「知道連結的任何人都可以檢視」
3. 複製試算表的 ID（從 URL 中取得）

## 3. 取得 Google Sheets ID

從 Google Sheets URL 中複製 ID：
```
https://docs.google.com/spreadsheets/d/[這裡是您的ID]/edit
```

## 4. 設定專案

在 `src/pages/Home.vue` 中修改 `sheetsConfig`：

```typescript
const sheetsConfig = {
  // 替換為您的 Google Sheets ID
  spreadsheetId: '您的GoogleSheetsID',
  // 替換為您的資料範圍
  range: 'Sheet1!A:H',
  // 可選：如果您有 Google API Key（建議使用）
  apiKey: '您的APIKey'
}
```

## 5. 取得 Google API Key（可選但建議）

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google Sheets API
4. 建立 API Key
5. 限制 API Key 只能存取 Google Sheets API

## 6. 資料格式範例

在 Google Sheets 中填入資料，例如：

| 姓名 | 職稱 | 頭像 | 描述 | 興趣愛好 | 喜歡的東西 | 害怕的東西 | 不吃的東西 |
|------|------|------|------|----------|------------|------------|------------|
| 蘇小 | 設計師 | https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face | 熱愛插畫與貓咪，總是帶來溫暖的色彩靈感。 | 畫畫,貓奴,下午茶 | 貓咪,插畫,下午茶,粉色 | 蛇,德腸 | 苦瓜,茄子,榴槤 |

## 7. 注意事項

- 陣列欄位（如興趣愛好、喜歡的東西等）請用逗號分隔
- 頭像欄位請使用完整的圖片 URL
- 如果 Google Sheets 無法存取，系統會自動使用預設資料
- 建議使用 API Key 以避免存取限制

## 8. 測試

設定完成後，重新載入頁面即可看到從 Google Sheets 載入的資料。

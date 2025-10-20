import type { Employee } from '../data/employees'

export interface GoogleSheetsConfig {
  spreadsheetId: string
  range: string
  apiKey?: string
}

export class GoogleSheetsService {
  private config: GoogleSheetsConfig

  constructor(config: GoogleSheetsConfig) {
    this.config = config
  }

  /**
   * 從 Google Sheets 獲取員工資料
   */
  async fetchEmployees(): Promise<Employee[]> {
    try {
      const url = this.buildApiUrl()
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return this.parseSheetData(data)
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error)
      throw error
    }
  }

  /**
   * 從 Google Sheets 獲取彈幕資料
   */
  async fetchDanmaku(): Promise<string[]> {
    try {
      const danmakuConfig = {
        ...this.config,
        range: '彈幕!A:A'
      }
      
      const url = this.buildApiUrlForRange(danmakuConfig)
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return this.parseDanmakuData(data)
    } catch (error) {
      console.error('Error fetching danmaku from Google Sheets:', error)
      throw error
    }
  }

  /**
   * 構建 Google Sheets API URL
   */
  private buildApiUrl(): string {
    const { spreadsheetId, range, apiKey } = this.config
    const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets'
    
    let url = `${baseUrl}/${spreadsheetId}/values/${range}`
    
    if (apiKey) {
      url += `?key=${apiKey}`
    }
    
    return url
  }

  /**
   * 構建指定範圍的 Google Sheets API URL
   */
  private buildApiUrlForRange(config: GoogleSheetsConfig): string {
    const { spreadsheetId, range, apiKey } = config
    const baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets'
    
    let url = `${baseUrl}/${spreadsheetId}/values/${range}`
    
    if (apiKey) {
      url += `?key=${apiKey}`
    }
    
    return url
  }

  /**
   * 解析彈幕資料
   */
  private parseDanmakuData(data: any): string[] {
    if (!data.values || !Array.isArray(data.values)) {
      return []
    }
    
    return data.values
      .map((row: any[]) => row[0]) // 取 A 欄位的值
      .filter((text: string) => text && text.trim() !== '') // 過濾空值
  }

  /**
   * 解析 Google Sheets 資料為 Employee 格式
   */
  private parseSheetData(data: any): Employee[] {
    const rows = data.values || []
    
    if (rows.length < 2) {
      return []
    }

    // 第一行是標題
    const headers = rows[0]
    const dataRows = rows.slice(1)

    return dataRows.map((row: any[], index: number) => {
      const employee: any = { id: `e${index + 1}` }

      // 根據標題映射資料
      headers.forEach((header: string, colIndex: number) => {
        const value = row[colIndex] || ''
        
        switch (header.toLowerCase()) {
          case 'name':
          case '姓名':
            employee.name = value
            break
          case 'title':
          case '職稱':
            employee.title = value
            break
          case 'avatar':
          case '頭像':
            employee.avatar = value || this.getDefaultAvatar()
            break
          case 'description':
          case '描述':
          case '簡介':
            employee.description = value
            break
          case 'hobbies':
          case '興趣':
          case '興趣愛好':
            employee.hobbies = this.parseArrayValue(value)
            break
          case 'likes':
          case '喜歡':
          case '喜歡的東西':
            employee.likes = this.parseArrayValue(value)
            break
          case 'fears':
          case '害怕':
          case '害怕的東西':
            employee.fears = this.parseArrayValue(value)
            break
          case 'dislikes':
          case '不喜歡':
          case '不吃的東西':
            employee.dislikes = this.parseArrayValue(value)
            break
          case 'email':
          case '信箱':
          case '聯絡方式':
            employee.email = value
            break
        }
      })

      return employee as Employee
    }).filter(emp => emp.name) // 過濾掉沒有姓名的資料
  }

  /**
   * 解析陣列格式的字串值（用逗號分隔）
   */
  private parseArrayValue(value: string): string[] {
    if (!value) return []
    return value.split(',').map(item => item.trim()).filter(item => item)
  }

  /**
   * 獲取預設頭像
   */
  private getDefaultAvatar(): string {
    // 使用不同的隨機頭像，確保 1:1 比例
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face&auto=format&q=80'
    ]
    const randomIndex = Math.floor(Math.random() * avatars.length)
    return avatars[randomIndex]
  }
}

/**
 * 創建 Google Sheets 服務實例
 */
export function createGoogleSheetsService(config: GoogleSheetsConfig): GoogleSheetsService {
  return new GoogleSheetsService(config)
}

/**
 * 預設配置（需要替換為您的實際 Google Sheets 資訊）
 */
export const defaultGoogleSheetsConfig: GoogleSheetsConfig = {
  // 替換為您的 Google Sheets ID
  spreadsheetId: '1yfnfScBaWhpXhWdpNEcOSPA77SDwJjHqxFfpsmx-4aY',
  // 替換為您的資料範圍
  range: 'Sheet1!A:H',
  // 可選：如果您有 Google API Key
  apiKey: 'AIzaSyDdqkHgjCWaYDVDnj5_hKyiBKFjaCvj1FA'
}

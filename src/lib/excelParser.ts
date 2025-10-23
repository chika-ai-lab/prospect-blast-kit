import * as XLSX from 'xlsx';

export interface ExcelData {
  columns: string[];
  rows: any[];
}

export const parseExcelFile = async (file: File): Promise<ExcelData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          reject(new Error('Le fichier Excel est vide'));
          return;
        }

        const columns = Object.keys(jsonData[0] as object);
        
        resolve({
          columns,
          rows: jsonData as any[],
        });
      } catch (error) {
        reject(new Error('Erreur lors de la lecture du fichier Excel'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsBinaryString(file);
  });
};

export const replaceVariables = (
  template: string,
  data: Record<string, any>
): string => {
  let result = template;
  
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(data[key] || ''));
  });

  return result;
};

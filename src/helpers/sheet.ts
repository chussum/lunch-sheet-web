import GoogleSpreadsheet from 'google-spreadsheet';
import { promisify } from 'util';
import { env } from 'env';

const credentials = require('config/google.json');

async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet(env.google.sheetId);
  await promisify(doc.useServiceAccountAuth)(credentials);
  const info = await promisify(doc.getInfo)();
  return info.worksheets[0];
}

interface RowsSearchParams {
  offset?: number;
  limit?: number;
  orderby?: string;
  query?: string;
  reverse?: boolean;
}

interface CellsSearchParams {
  'min-row': number;
  'max-row': number;
  'min-col': number;
  'max-col': number;
  'return-empty': boolean;
}

export const getRows = async (params: RowsSearchParams = {}) => {
  const sheet = await accessSpreadsheet();
  return await promisify(sheet.getRows)(params);
};

export const getCells = async (params: CellsSearchParams) => {
  const sheet = await accessSpreadsheet();
  return await promisify(sheet.getCells)(params);
};

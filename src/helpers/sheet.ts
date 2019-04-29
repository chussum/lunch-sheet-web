import GoogleSpreadsheet from 'google-spreadsheet';
import { promisify } from 'util';
import { env } from 'env';

const SHEET_PRIMARY_KEY = 'no';
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

const CACHE_LIMIT_MS = 20 * 60 * 1000;
const singleCoreCache = {};

const getRowsWithCache = async params => {
  const sheet = await accessSpreadsheet();
  const rows = await promisify(sheet.getRows)(params);
  const key = JSON.stringify(params);
  singleCoreCache[key] = {
    rows,
    accessTime: Date.now()
  };
  rows.forEach(row => {
    const params = {
      offset: 0,
      limit: 1,
      query: `${SHEET_PRIMARY_KEY}=${row[SHEET_PRIMARY_KEY]}`
    };
    singleCoreCache[JSON.stringify(params)] = {
      rows: [row],
      accessTime: Date.now()
    };
  });
  return rows;
};

export const getRows = (params: RowsSearchParams = {}, isForce = false) => {
  const key = JSON.stringify(params);
  if (isForce || singleCoreCache[key] === undefined) {
    return getRowsWithCache(params);
  }
  if (singleCoreCache[key].accessTime < Date.now() - CACHE_LIMIT_MS) {
    return getRowsWithCache(params);
  }
  return singleCoreCache[key].rows;
};

export const getCells = async (params: CellsSearchParams) => {
  const sheet = await accessSpreadsheet();
  return await promisify(sheet.getCells)(params);
};

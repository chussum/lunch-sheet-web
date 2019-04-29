import { Connection } from 'mysql';
import { dbReaderPool, dbWriterPool } from 'helpers/db/mysql';

export const mql = (sql: string, params: Object, isWritePoolOrConnection: boolean | Connection = false) => {
  let pool;
  if (typeof isWritePoolOrConnection === 'boolean') {
    pool = isWritePoolOrConnection ? dbWriterPool : dbReaderPool;
  } else {
    pool = isWritePoolOrConnection;
  }
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
};

export const getConnection = (write: boolean = true): Promise<Connection> => {
  const pool = write ? dbWriterPool : dbReaderPool;
  return new Promise((resolve, reject) => {
    pool.getConnection(async (err, connection) => {
      if (err) {
        return reject(err);
      }
      return resolve(connection);
    });
  });
};

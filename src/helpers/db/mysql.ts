import mysql from 'mysql';
import { env } from 'env';

function createPool(config) {
  return mysql.createPool({
    ...config,
    queryFormat(query, values) {
      if (!values) return query;
      return query.replace(
        /\:(\w+)/g,
        (txt: string, key: string): string => {
          if (values.hasOwnProperty(key)) {
            return (<any>this).escape(values[key]);
          }
          return txt;
        }
      );
    }
  });
}

export const dbReaderPool = createPool(env.db.mysql.reader);
export const dbWriterPool = createPool(env.db.mysql.writer);

export default { dbReaderPool, dbWriterPool };

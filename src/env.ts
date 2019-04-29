export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    port: process.env.PORT || 8888,
    secret: process.env.APP_SECRET as string
  },
  log: {
    level: process.env.LOG_LEVEL || 'debug',
    output: process.env.LOG_OUTPUT || 'dev'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    auth: {
      callback: process.env.GOOGLE_AUTH_CALLBACK_URL
    },
    sheetId: process.env.GOOGLE_SPREADSHEET_ID
  },
  db: {
    mysql: {
      reader: {
        host: process.env.MYSQL_READER_HOST as string,
        port: +((process.env.MYSQL_READER_PORT as string) || 3306),
        user: process.env.MYSQL_READER_USER as string,
        password: process.env.MYSQL_READER_PASSWORD as string,
        database: process.env.MYSQL_READER_DATABASE as string,
        connectionLimit: +(process.env.MYSQL_READER_CONNECTION_LIMIT as string)
      },
      writer: {
        host: process.env.MYSQL_WRITER_HOST as string,
        port: +((process.env.MYSQL_WRITER_PORT as string) || 3306),
        user: process.env.MYSQL_WRITER_USER as string,
        password: process.env.MYSQL_WRITER_PASSWORD as string,
        database: process.env.MYSQL_WRITER_DATABASE as string,
        connectionLimit: +(process.env.MYSQL_WRITER_CONNECTION_LIMIT as string)
      }
    }
  }
};

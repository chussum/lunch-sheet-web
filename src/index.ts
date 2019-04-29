import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import passport from 'config/passport';
import { Container } from 'typedi';
import { configure, format, transports } from 'winston';
import { useContainer } from 'routing-controllers';
import { env } from 'env';
import { app } from 'app';

// ioc
useContainer(Container);

// passport configuration
passport.config();

// winston configuration
configure({
  transports: [
    new transports.Console({
      level: env.log.level,
      handleExceptions: true,
      format: env.isProduction ? format.combine(format.json()) : format.combine(format.colorize(), format.simple())
    })
  ]
});

const http = app.listen(env.app.port, async () => {
  // pm2 graceful reload handling
  (process as any).send = process.send || function() {};
  (process as any).send('ready');
  console.log(`Server is Running: Port is ${env.app.port}`);
});

if (env.isProduction) {
  // pm2 graceful reload handling
  ['SIGINT', 'SIGTERM'].forEach((sig: any) => {
    process.on(sig, () => {
      http.close((err: any) => {
        process.exit(err ? 1 : 0);
      });
    });
  });
}

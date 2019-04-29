import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import expressMysqlSession from 'express-mysql-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import { useExpressServer } from 'routing-controllers';
import { authorizationChecker } from 'auth/authorizationChecker';
import { currentUserChecker } from 'auth/currentUserChecker';
import { env } from 'env';

const server = express();

// ejs template
server.set('views', `${__dirname}/views`);
server.set('view engine', 'ejs');
server.engine('html', require('ejs').renderFile);

// Cookie Parser
server.use(cookieParser());

// Body Parser
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Session Configuration
const MySQLStore = expressMysqlSession(expressSession);
const sessionStore = new MySQLStore(env.db.mysql.writer);
server.use(
  expressSession({
    name: 'SSID',
    secret: env.app.secret,
    store: sessionStore,
    resave: true,
    saveUninitialized: true
  })
);
server.use(passport.initialize());
server.use(passport.session());
server.use(express.static(`${__dirname}/static`));

server.get('/logout', (req: express.Request, res: express.Response) => {
  if (req.session) {
    return req.session.destroy(err => res.redirect('/'));
  }
  return res.redirect('/');
});

server.get(
  '/login',
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if ((req as any).user) {
      return res.redirect('/');
    }
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);
server.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: express.Request, res: express.Response) => {
    res.redirect('/');
  }
);

useExpressServer(server, {
  cors: true,
  classTransformer: true,
  defaultErrorHandler: false,
  controllers: [`${__dirname}/controllers/**/*{.js,.ts}`],
  middlewares: [`${__dirname}/middlewares/**/*{.js,.ts}`],
  interceptors: [`${__dirname}/interceptors/**/*{.js,.ts}`],
  authorizationChecker: authorizationChecker(),
  currentUserChecker: currentUserChecker()
});

export const app = server;

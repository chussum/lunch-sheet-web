import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'helpers/logger';

@Middleware({ type: 'after' })
export class NotFoundHandlerMiddleware implements ExpressMiddlewareInterface {
  private log = new Logger(__dirname);

  public use(req: Request, res: Response, next?: NextFunction): void {
    this.log.info('NotFoundHandlerMiddleware reached, ending response.');
    if (!res.headersSent) {
      res.status(404);
      res.json({
        name: 'Not Found',
        message: 'Page Not Found',
        errors: []
      });
    }
    res.end();
  }
}

import { Container } from 'typedi';
import { Logger as WinstonLogger } from 'helpers/logger';

export const Logger = (scope: string): ParameterDecorator => {
  return (object, propertyKey, index): any => {
    const logger = new WinstonLogger(scope);
    const propertyName = propertyKey ? propertyKey.toString() : '';
    Container.registerHandler({ object, propertyName, index, value: () => logger });
  };
};

export { LoggerInterface } from 'helpers/logger';

import { Action } from 'routing-controllers';
import { Logger } from 'helpers/logger';

export function authorizationChecker(): (action: Action, roles: any[]) => Promise<boolean> | boolean {
  const log = new Logger(__filename);

  return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
    const currentUser = action.request.user;
    if (currentUser === undefined) {
      log.warn('Invalid credentials given');
      return false;
    }
    if (!roles.length || roles.indexOf(currentUser.role) !== -1) {
      log.info('Successfully checked credentials');
      return true;
    }
    return false;
  };
}

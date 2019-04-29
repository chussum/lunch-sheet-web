import { Action } from 'routing-controllers';
import { User } from 'types/User';

export function currentUserChecker(): (action: Action) => Promise<User | undefined> {
  return async function innerCurrentUserChecker(action: Action): Promise<User | undefined> {
    return action.request.user;
  };
}

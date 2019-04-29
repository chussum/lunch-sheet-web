import * as _ from 'lodash';
import { Service } from 'typedi';
import { mql } from 'helpers/query';
import { User } from 'models/User';
import { Logger, LoggerInterface } from 'decorators/Logger';
import { MySQLRepository } from 'types/MySQLRepository';
import { UserInput } from 'types/User';

@Service()
export class UserRepository implements MySQLRepository {
  constructor(@Logger(__filename) private log: LoggerInterface) {}

  async findById(id: number) {
    try {
      const rows: any = await mql('SELECT * FROM `user` WHERE `id` = :id', { id });
      const res = _.first(rows);
      if (!res) {
        return null;
      }
      const user = new User(id);
      _.forEach(res, (value: any, column: string) => {
        user[column] = value;
      });
      return user;
    } catch (e) {
      this.log.error(e);
    }
    return null;
  }

  async findByGoogleId(googleId: string) {
    try {
      const rows: any = await mql('SELECT * FROM `user` WHERE `googleId` = :googleId', { googleId });
      const res = _.first(rows);
      if (!res) {
        return null;
      }
      const user = new User();
      _.forEach(res, (value: any, column: string) => {
        user[column] = value;
      });
      return user;
    } catch (e) {
      this.log.error(e);
    }
    return null;
  }

  async findAll(params) {
    const result: User[] = [];
    try {
      const rows: any = await mql('SELECT * FROM `user` WHERE `name` like :name', params);
      _.forEach(rows, (data: User) => {
        const user = new User();
        _.forEach(data, (value: any, column: string) => {
          user[column] = value;
        });
        if (user.id) {
          result.push(user);
        }
      });
    } catch (e) {
      this.log.error(e);
    }
    return result;
  }

  async create(user: UserInput) {
    const newUser = new User();
    Object.keys(user).forEach(field => {
      newUser[field] = user[field];
    });
    try {
      await newUser.commit();
      return newUser;
    } catch (e) {
      this.log.error(e);
      return null;
    }
  }

  async update(user: UserInput) {
    if (!user.googleId) {
      return null;
    }
    const selectedUser = await this.findByGoogleId(user.googleId);
    if (selectedUser) {
      Object.keys(user).forEach(field => {
        selectedUser[field] = user[field];
      });
      try {
        await selectedUser.commit();
        return selectedUser;
      } catch (e) {
        this.log.error(e);
      }
    }
    return null;
  }

  async remove(id: number) {
    if (!id) {
      return false;
    }
    const selectedUser = await this.findById(id);
    if (selectedUser) {
      try {
        await selectedUser.remove();
        return true;
      } catch (e) {
        this.log.error(e);
      }
    }
    return false;
  }
}

import * as _ from 'lodash';
import { Service } from 'typedi';
import { Logger, LoggerInterface } from 'decorators/Logger';
import { UserRepository } from 'repositories/UserRepository';
import { UserInput } from 'types/User';

@Service()
export class UserService {
  constructor(@Logger(__filename) private log: LoggerInterface, private userRepository: UserRepository) {}

  findAll(params) {
    return this.userRepository.findAll(params);
  }

  async findById(id: number, isRemovedPrivacy: boolean = false) {
    const user = await this.userRepository.findById(id);
    if (user && isRemovedPrivacy) {
      delete user.googleId;
      delete user.role;
      delete user.createdAt;
      delete user.updatedAt;
    }
    return user;
  }

  findByGoogleId(googleId: string) {
    return this.userRepository.findByGoogleId(googleId);
  }

  async findOrCreate(userInput: UserInput) {
    if (userInput.googleId) {
      const user = await this.userRepository.findByGoogleId(userInput.googleId);
      if (user) {
        return user;
      }
      return await this.userRepository.create(userInput);
    }
  }

  create(userInput: UserInput) {
    return this.userRepository.create(userInput);
  }

  update(userInput: UserInput) {
    return this.userRepository.update(userInput);
  }

  remove(id: number) {
    return this.userRepository.remove(id);
  }
}

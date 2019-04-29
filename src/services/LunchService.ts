import * as _ from 'lodash';
import { Service } from 'typedi';
import { Logger, LoggerInterface } from 'decorators/Logger';
import { LunchRepository } from 'repositories/LunchRepository';
import { LunchInput } from 'types/Lunch';

@Service()
export class LunchService {
  constructor(@Logger(__filename) private log: LoggerInterface, private lunchRepository: LunchRepository) {}

  findById(id: number) {
    return this.lunchRepository.findById(id);
  }

  findAll(params) {
    return this.lunchRepository.findAll(params);
  }

  update(data: LunchInput) {
    return this.lunchRepository.update(data);
  }

  like(id: number) {
    return this.lunchRepository.like(id);
  }

  dislike(id: number) {
    return this.lunchRepository.dislike(id);
  }
}

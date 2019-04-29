import * as _ from 'lodash';
import { Service } from 'typedi';
import { Logger, LoggerInterface } from 'decorators/Logger';
import { CommentRepository } from 'repositories/CommentRepository';
import { CommentInput } from 'types/Comment';

@Service()
export class CommentService {
  constructor(@Logger(__filename) private log: LoggerInterface, private commentRepository: CommentRepository) {}

  findById(id: number) {
    return this.commentRepository.findById(id);
  }

  findAll(params) {
    return this.commentRepository.findAll(params);
  }

  create(commentInput: CommentInput) {
    return this.commentRepository.create(commentInput);
  }

  update(commentInput: CommentInput) {
    return this.commentRepository.update(commentInput);
  }

  remove(id: number) {
    return this.commentRepository.remove(id);
  }
}

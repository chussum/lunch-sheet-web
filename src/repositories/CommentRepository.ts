import * as _ from 'lodash';
import { Service } from 'typedi';
import { mql } from 'helpers/query';
import { Comment } from 'models/Comment';
import { Logger, LoggerInterface } from 'decorators/Logger';
import { MySQLRepository } from 'types/MySQLRepository';
import { CommentInput } from 'types/Comment';
import { UserService } from 'services/UserService';

interface CommentSearchParams {
  lunchId?: number;
}

@Service()
export class CommentRepository implements MySQLRepository {
  constructor(@Logger(__filename) private log: LoggerInterface, private userService: UserService) {}

  async findById(id: number) {
    try {
      const rows: any = await mql('SELECT * FROM `comment` WHERE `id` = :id', { id });
      const res = _.first(rows);
      if (!res) {
        return null;
      }
      const comment = new Comment(id);
      _.forEach(res, (value: any, column: string) => {
        comment[column] = value;
      });
      comment.author = await this.userService.findById(comment.authorId, true);
      return comment;
    } catch (e) {
      this.log.error(e);
    }
    return null;
  }

  async findAll(params: CommentSearchParams) {
    const result: Comment[] = [];
    try {
      const rows: any = await mql('SELECT * FROM `comment` WHERE `lunchId` like :lunchId ORDER BY id DESC', params);
      for (const data of rows) {
        const comment = new Comment();
        _.forEach(data, (value: any, column: string) => {
          comment[column] = value;
        });
        comment.author = await this.userService.findById(comment.authorId, true);
        if (comment.id) {
          result.push(comment);
        }
      }
    } catch (e) {
      this.log.error(e);
    }
    return result;
  }

  async create(comment: CommentInput) {
    const newComment = new Comment();
    Object.keys(comment).forEach(field => {
      newComment[field] = comment[field];
    });
    try {
      await newComment.commit();
      return newComment;
    } catch (e) {
      this.log.error(e);
      return null;
    }
  }

  async update(comment: CommentInput) {
    if (!comment.id) {
      return null;
    }
    const selectedComment = await this.findById(comment.id);
    if (selectedComment) {
      Object.keys(comment).forEach(field => {
        selectedComment[field] = selectedComment[field];
      });
      try {
        await selectedComment.commit();
        return selectedComment;
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
    const selectedComment = await this.findById(id);
    if (selectedComment) {
      try {
        await selectedComment.remove();
        return true;
      } catch (e) {
        this.log.error(e);
      }
    }
    return false;
  }
}

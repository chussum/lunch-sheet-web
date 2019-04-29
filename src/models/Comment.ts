import { mql } from 'helpers/query';
import { Comment as CommentType } from 'types/Comment';
import { MySQLModel } from 'types/MySQLModel';

export class Comment implements CommentType, MySQLModel {
  id: number = 0;
  content: string = '';
  lunchId: string = '';
  authorId: number = 0;
  author: any;
  createdAt: Date | string | undefined;
  updatedAt: Date | string | undefined;

  constructor(id: number = 0) {
    this.id = id;
  }

  async commit() {
    // UPDATE
    if (this.id) {
      const res: any = await mql(
        `
      UPDATE comment 
      SET 
        content = :content,
        updatedAt = NOW()
      WHERE id = :id
      `,
        this,
        true
      );
      return res;
    }
    // CREATE
    const res: any = await mql(
      `
      INSERT INTO comment
      SET 
        content = :content,
        lunchId = :lunchId,
        authorId = :authorId,
        createdAt = NOW(),
        updatedAt = NOW()
    `,
      this,
      true
    );
    if (res.insertId) {
      this.id = res.insertId;
    }
    return res;
  }

  async remove() {
    // REMOVE
    const res: any = await mql('DELETE FROM comment WHERE id = :id', this, true);
    return res;
  }
}

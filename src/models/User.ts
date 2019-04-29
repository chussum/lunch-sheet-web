import { IsEmail, IsDate } from 'class-validator';
import { mql } from 'helpers/query';
import { User as UserType } from 'types/User';
import { MySQLModel } from 'types/MySQLModel';
import { Role } from 'types/Role';

export class User implements UserType, MySQLModel {
  id: number = 0;
  role: string = Role.USER;
  googleId: string = '';
  @IsEmail()
  email: string = '';
  name: string = '';
  profileImage: string = '';
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
      UPDATE user 
      SET 
        role = :role,
        email = :email,
        name = :name,
        profileImage = :profileImage,
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
      INSERT INTO user
      SET 
        role = :role,
        googleId = :googleId,
        email = :email,
        name = :name,
        profileImage = :profileImage,
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
    const res: any = await mql('DELETE FROM user WHERE id = :id', this, true);
    return res;
  }
}

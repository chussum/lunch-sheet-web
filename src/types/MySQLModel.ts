import { Connection } from 'mysql';

export type Pool = Connection | boolean;

export interface MySQLModel {
  commit: (isWritePoolOrConnection: Pool) => Promise<any>;
  remove: (isWritePoolOrConnection: Pool) => Promise<any>;
}

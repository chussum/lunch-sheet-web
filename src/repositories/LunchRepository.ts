import * as _ from 'lodash';
import { Service } from 'typedi';
import { Lunch } from 'models/Lunch';
import { Lunch as LunchType, LunchInput } from 'types/Lunch';
import { Logger, LoggerInterface } from 'decorators/Logger';
import { getRows } from 'helpers/sheet';

interface LunchSearchParams {
  id?: number | string;
  query?: string;
  offset?: number;
  limit?: number;
  orderBy?: string;
  reverse?: boolean;
}

const SHEET_PRIMARY_KEY = 'no';
const singleCoreCache = {};

@Service()
export class LunchRepository {
  constructor(@Logger(__filename) private log: LoggerInterface) {}

  async findById(id: number | string) {
    try {
      const rows: any = await getRows({
        offset: 0,
        limit: 1,
        query: `${SHEET_PRIMARY_KEY}=${id}`
      });
      const res: any = _.first(rows);
      if (!res) {
        return null;
      }
      const lunch = new Lunch(res);
      return {
        ...lunch,
        comments: await lunch.getComments()
      };
    } catch (e) {
      this.log.error(e);
    }
    return null;
  }

  async findAll(params: LunchSearchParams) {
    const result: LunchType[] = [];
    try {
      const rows: any = await getRows({
        offset: params.offset || 0,
        limit: params.limit,
        orderby: params.orderBy || SHEET_PRIMARY_KEY,
        reverse: params.reverse,
        query: params.query
      });
      for (const data of rows) {
        const lunch = new Lunch(data);
        if (lunch.id) {
          const comments = await lunch.getComments();
          result.push({
            ...lunch,
            comments
          });
        }
      }
    } catch (e) {
      this.log.error(e);
    }
    return result;
  }

  async update(data: LunchInput) {
    if (!data.id) {
      return null;
    }
    try {
      const rows: any = await getRows({
        offset: 0,
        limit: 1,
        query: `${SHEET_PRIMARY_KEY}=${data.id}`
      });
      const res: any = _.first(rows);
      if (!res) {
        return null;
      }
      res.title = data.placeName || res.title;
      res.menu = data.recommend || res.menu;
      res.description = data.content || res.description;
      res.url = data.url || res.url;
      res.save();
      return new Lunch(res);
    } catch (e) {
      this.log.error(e);
    }
    return null;
  }

  async like(id: number | string) {
    if (!id) {
      return false;
    }
    try {
      const rows: any = await getRows({
        offset: 0,
        limit: 1,
        query: `${SHEET_PRIMARY_KEY}=${id}`
      });
      const res: any = _.first(rows);
      if (!res) {
        return null;
      }
      if (typeof singleCoreCache[id] === 'undefined') {
        singleCoreCache[id] = {
          like: isNaN(res.like) ? 0 : +res.like,
          dislike: isNaN(res.dislike) ? 0 : +res.dislike
        };
      }
      singleCoreCache[id].like += 1;
      res.like = singleCoreCache[id].like;
      res.dislike = singleCoreCache[id].dislike;
      res.save();
      return true;
    } catch (e) {
      this.log.error(e);
    }
    return false;
  }

  async dislike(id: number | string) {
    if (!id) {
      return false;
    }
    try {
      const rows: any = await getRows({
        offset: 0,
        limit: 1,
        query: `${SHEET_PRIMARY_KEY}=${id}`
      });
      const res: any = _.first(rows);
      if (!res) {
        return null;
      }
      if (typeof singleCoreCache[id] === 'undefined') {
        singleCoreCache[id] = {
          like: isNaN(res.like) ? 0 : +res.like,
          dislike: isNaN(res.dislike) ? 0 : +res.dislike
        };
      }
      singleCoreCache[id].dislike -= 1;
      res.like = singleCoreCache[id].like;
      res.dislike = singleCoreCache[id].dislike;
      res.save();
      return true;
    } catch (e) {
      this.log.error(e);
    }
    return false;
  }
}

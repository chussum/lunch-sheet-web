import * as _ from 'lodash';
import axios from 'axios';
import cheerio from 'cheerio';
import { Service } from 'typedi';
import { Logger, LoggerInterface } from 'decorators/Logger';
import { LunchRepository } from 'repositories/LunchRepository';
import { LunchInput } from 'types/Lunch';

interface NaverBlogPost {
  title: string;
  url: string;
  thumbnail: string;
}

@Service()
export class LunchService {
  constructor(@Logger(__filename) private log: LoggerInterface, private lunchRepository: LunchRepository) {}

  public findById(id: number) {
    return this.lunchRepository.findById(id);
  }

  public findAll(params) {
    return this.lunchRepository.findAll(params);
  }

  public update(data: LunchInput) {
    return this.lunchRepository.update(data);
  }

  public like(id: number) {
    return this.lunchRepository.like(id);
  }

  public dislike(id: number) {
    return this.lunchRepository.dislike(id);
  }

  private async searchRestaurantAtNaver(keyword, start) {
    const result: NaverBlogPost[] = [];
    try {
      const { data: html } = await axios.get('https://search.naver.com/search.naver', {
        headers: {
          authority: 'search.naver.com'
        },
        params: {
          start,
          where: 'post',
          sm: 'tab_nmr',
          query: keyword
        }
      });
      if (!html) {
        throw Error('no data.');
      }
      const $ = cheerio.load(html);
      $('#elThumbnailResultArea li.sh_blog_top a.sh_blog_title').each((idx, el) => {
        const $el = $(el);
        const $root = $el
          .parent()
          .parent()
          .parent();
        const $thumbnail = $root.find('.sh_blog_thumbnail');
        const thumbnail = $thumbnail.attr('src').replace(/&type.+/, '');
        result.push({ title: ($el.text() || '').trim(), url: $el.attr('href'), thumbnail });
      });
    } catch (e) {
      this.log.error(e);
    }
    return result;
  }

  public getRestaurantPostsAtNaver(keyword, limit = 5) {
    return new Promise((resolve, reject) => {
      const requests = [this.searchRestaurantAtNaver(keyword, 1), this.searchRestaurantAtNaver(keyword, 11)];
      Promise.all(requests)
        .then((results: any[]) => results[0].concat(results[1]))
        .then(result => {
          if (!result || result.length === 0) {
            this.log.info('naver search data error.');
            return resolve([]);
          }
          const filtered = _.slice(_.shuffle(result), 0, limit);
          const posts: NaverBlogPost[] = [];
          for (const i in filtered) {
            const post = filtered[i];
            posts.push(post);
          }
          resolve(posts);
        })
        .catch(e => {
          this.log.error(e);
          resolve([]);
        });
    });
  }
}

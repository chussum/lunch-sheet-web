import { Lunch as LunchType } from 'types/Lunch';
import { Comment } from 'models/Comment';
import { CommentService } from 'services/CommentService';
import { Container } from 'typedi';

interface GoogleSheetRowItem {
  no: string;
  title: string;
  menu: string;
  description: string;
  url: string;
  like: number;
  dislike: number;
}

const commentService: CommentService = Container.get(CommentService);

export class Lunch implements LunchType {
  id: string = '';
  placeName: string = '';
  recommend: string = '';
  content: string = '';
  url: string = '';
  urlType: string = 'url';
  like: number = 0;
  dislike: number = 0;
  comments: Comment[] = [];

  constructor(data: GoogleSheetRowItem | number | string = '') {
    if (typeof data === 'object') {
      this.id = data.no;
      this.placeName = data.title;
      this.recommend = data.menu;
      this.content = data.description;
      this.like = isNaN(data.like) ? 0 : +data.like;
      this.dislike = isNaN(data.dislike) ? 0 : +data.dislike;
      this.url = data.url;
      if (/https?:\/\/.+/.test(this.url)) {
        this.urlType = 'link';
        if (/.jpg|.jpeg|.gif|.png/.test(this.url)) {
          this.urlType = 'image';
        }
      } else {
        this.urlType = 'text';
      }
    } else if (typeof data === 'number' || typeof data === 'string') {
      this.id = data ? `${data}` : '';
    }
  }

  async getComments() {
    if (!this.id) {
      return [];
    }
    return await commentService.findAll({
      lunchId: this.id
    });
  }
}

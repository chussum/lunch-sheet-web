import { Comment } from 'types/Comment';

export interface Lunch {
  id: string;
  placeName: string;
  recommend: string;
  content: string;
  url: string;
  like: number;
  dislike: number;
  comments: Comment[];
}

export interface LunchInput {
  id?: string | number;
  placeName?: string;
  recommend?: string;
  content?: string;
  url?: string;
  like?: number;
  dislike?: number;
}

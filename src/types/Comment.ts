export interface Comment {
  id: number;
  content: string;
  lunchId: string;
  authorId: number;
  createdAt: Date | string | undefined;
  updatedAt: Date | string | undefined;
}

export interface CommentInput {
  id?: number;
  content?: string;
  lunchId?: string;
  authorId?: number;
}

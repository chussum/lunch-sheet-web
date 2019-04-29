import {
  JsonController,
  CurrentUser,
  QueryParam,
  Param,
  Body,
  Get,
  Post,
  Put,
  Patch,
  Delete
} from 'routing-controllers';
import { CommentInput } from 'types/Comment';
import { LunchService } from 'services/LunchService';
import { CommentService } from 'services/CommentService';
import { User } from 'models/User';

enum SortField {
  ID = 'id',
  PLACE_NAME = 'placename',
  RECOMMEND = 'recommend',
  CONTENT = 'content',
  URL = 'url'
}

enum OrderByField {
  ID = 'no',
  PLACE_NAME = 'title',
  RECOMMEND = 'menu',
  CONTENT = 'description',
  URL = 'url'
}

@JsonController('/api')
export class LunchController {
  constructor(private lunchService: LunchService, private commentService: CommentService) {}

  @Get('/lunches')
  async getAllLunches(
    @QueryParam('offset') offset: number,
    @QueryParam('limit') limit: number = 20,
    @QueryParam('reverse') reverse: boolean,
    @QueryParam('keyword') keyword: string,
    @QueryParam('sort') sort: string = ''
  ) {
    let orderBy;
    switch (sort.toLowerCase()) {
      case SortField.PLACE_NAME:
        orderBy = OrderByField.PLACE_NAME;
        break;
      case SortField.RECOMMEND:
        orderBy = OrderByField.RECOMMEND;
        break;
      case SortField.CONTENT:
        orderBy = OrderByField.CONTENT;
        break;
      case SortField.URL:
        orderBy = OrderByField.URL;
        break;
      default:
        orderBy = OrderByField.ID;
        break;
    }
    const query = keyword ? `title=${keyword} OR menu=${keyword} OR description=${keyword}` : undefined;
    const rows = await this.lunchService.findAll({
      offset,
      limit,
      orderBy,
      reverse,
      query
    });
    return rows;
  }

  @Get('/lunches/:id')
  async getLunch(@Param('id') id: number) {
    const lunch = await this.lunchService.findById(id);
    return {
      success: !!lunch,
      lunch
    };
  }

  @Get('/lunches/:id/posts')
  async getLunchPosts(@Param('id') id: number) {
    const lunch = await this.lunchService.findById(id);
    if (lunch) {
      const posts = await this.lunchService.getRestaurantPostsAtNaver(`역삼 ${lunch.placeName}`, 20);
      return {
        success: true,
        posts
      };
    }
    return {
      success: false,
      posts: []
    };
  }

  @Patch('/lunches/:id/like')
  async like(@Param('id') id: number) {
    const res = await this.lunchService.like(id);
    return {
      success: !!res
    };
  }

  @Patch('/lunches/:id/dislike')
  async dislike(@Param('id') id: number) {
    const res = await this.lunchService.dislike(id);
    return {
      success: !!res
    };
  }

  @Get('/lunches/:id/comments')
  async getAllComments(@Param('id') id: number) {
    const comments = await this.commentService.findAll({
      lunchId: id
    });
    return {
      success: true,
      comments
    };
  }

  @Post('/lunches/:id/comments')
  async addComment(@Param('id') id: string, @Body() comment: CommentInput, @CurrentUser() user?: User) {
    if (user) {
      const newComment = await this.commentService.create({
        content: comment.content,
        lunchId: id,
        authorId: user.id
      });
      return {
        success: true,
        comment: newComment
      };
    }
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  @Put('/lunches/:lunchId/comments/:commentId')
  async updateComment(
    @Param('id') id: number,
    @Param('commentId') commentId: number,
    @Body() { content }: CommentInput,
    @CurrentUser() user?: User
  ) {
    if (user) {
      const comment = await this.commentService.findById(commentId);
      if (!comment) {
        return {
          success: false,
          message: '댓글을 찾을 수 없습니다.'
        };
      }
      if (+user.id !== +comment.authorId) {
        return {
          success: false,
          message: '잘못된 시도.'
        };
      }
      const updatedComment = await this.commentService.update({
        content
      });
      return {
        success: true,
        comment: updatedComment
      };
    }
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }

  @Delete('/lunches/:lunchId/comments/:commentId')
  async removeComment(@Param('lunchId') id: number, @Param('commentId') commentId: number, @CurrentUser() user?: User) {
    if (user) {
      const comment = await this.commentService.findById(commentId);
      if (!comment) {
        return {
          success: false,
          message: '댓글을 찾을 수 없습니다.'
        };
      }
      if (+user.id !== +comment.authorId) {
        return {
          success: false,
          message: '잘못된 시도.'
        };
      }
      const isRemoved = await this.commentService.remove(commentId);
      return {
        success: isRemoved
      };
    }
    return {
      success: false,
      message: '로그인이 필요합니다.'
    };
  }
}

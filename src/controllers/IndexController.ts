import { JsonController, CurrentUser, Render, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { User } from 'models/User';
import { LunchService } from 'services/LunchService';
import { env } from 'env';
import { Lunch } from 'types/Lunch';

const SHEET_URL = `https://docs.google.com/spreadsheets/d/${env.google.sheetId}`;

@JsonController()
export class IndexController {
  constructor(private lunchService: LunchService) {}

  @Get('/')
  @Render('index.ejs')
  async getIndex(@CurrentUser() user?: User) {
    const lunches = await this.lunchService.findAll({
      offset: 0
    });
    lunches.sort((a: Lunch, b: Lunch) => {
      const aVal = a.like + a.dislike;
      const bVal = b.like + b.dislike;
      return bVal - aVal;
    });
    return {
      user,
      sheetUrl: SHEET_URL,
      lunches
    };
  }

  @Get('/lunch/:id')
  @Render('lunch.ejs')
  async getLunch(@Param('id') id: number, @CurrentUser() user?: User) {
    const lunch = await this.lunchService.findById(id);
    if (lunch) {
      const posts = await this.lunchService.getRestaurantPostsAtNaver(`역삼 ${lunch.placeName}`, 15);
      return {
        user,
        lunch,
        sheetUrl: SHEET_URL,
        posts
      };
    }
    return {
      user,
      lunch: null,
      sheetUrl: SHEET_URL,
      posts: []
    };
  }
}

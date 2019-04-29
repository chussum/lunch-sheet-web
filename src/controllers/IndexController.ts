import { JsonController, CurrentUser, Render, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { User } from 'models/User';
import { LunchService } from 'services/LunchService';
import { env } from 'env';
import { Lunch } from 'types/Lunch';

@JsonController()
export class IndexController {
  constructor(private lunchService: LunchService) {}

  @Get('/')
  @Render('index.ejs')
  async getIndex(@CurrentUser() user?: User) {
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${env.google.sheetId}`;
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
      sheetUrl,
      lunches
    };
  }
}

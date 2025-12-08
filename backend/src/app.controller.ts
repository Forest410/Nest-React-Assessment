import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionsService } from './transactions/transactions.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Post('init')
  async init() {
    return this.appService.seedData();
  }
}

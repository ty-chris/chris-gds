import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUrlPairDto } from './dto/create-url-pair.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('all')
  findAll() {
    return this.appService.getAll();
  }

  @Get(':shortUrlKey')
  getUrlPair(@Param('shortUrlKey') short_url: string) {
    return this.appService.getUrl(short_url);
  }

  @Post()
  async createUrlPair(@Body() createUrlPairDto: CreateUrlPairDto) {
    const urlPair = await this.appService.create(createUrlPairDto);
    return urlPair;
  }
}

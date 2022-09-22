import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Constants } from './config/Constants';
import { UrlPairEntity } from './entities/UrlPairEntity';
import { join } from 'path';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      clientUrl: process.env.DB_CLIENT_URL || Constants.DB_CLIENT_URL,
      type: 'postgresql',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'gui'),
      exclude: ['/api*'],
    }),
    MikroOrmModule.forFeature({ entities: [UrlPairEntity] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

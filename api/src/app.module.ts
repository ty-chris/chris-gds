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
      dbName: process.env.DB_NAME || Constants.DB_NAME,
      host: process.env.DB_HOST || Constants.DB_HOST,
      port: (process.env.DB_PORT as unknown as number) || Constants.DB_PORT,
      password: process.env.DB_PASSWORD || Constants.DB_PASSWORD,
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

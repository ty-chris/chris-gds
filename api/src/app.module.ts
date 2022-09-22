import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Constants } from './config/Constants';
import { UrlPairEntity } from './entities/UrlPairEntity';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      dbName: Constants.DB_NAME,
      host: Constants.DB_HOST,
      port: Constants.DB_PORT,
      password: Constants.DB_PASSWORD,
      type: 'postgresql',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forFeature({ entities: [UrlPairEntity] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

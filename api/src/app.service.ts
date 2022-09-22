import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUrlPairDto } from './dto/create-url-pair.dto';
import { UrlPairEntity } from './entities/UrlPairEntity';
import generateHash from 'random-hash';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(UrlPairEntity)
    private readonly urlRepository: EntityRepository<UrlPairEntity>,
  ) {}

  async create(createUrlPairDto: CreateUrlPairDto): Promise<UrlPairEntity> {
    const shortUrlKey = createUrlPairDto.short_url
      ? createUrlPairDto.short_url
      : await this.getRandomHash();

    const alreadyCreated = await this.urlRepository.findOne({
      short_url: shortUrlKey,
    });

    if (!alreadyCreated) {
      const newPair = new UrlPairEntity(createUrlPairDto.full_url, shortUrlKey);

      await this.urlRepository.persistAndFlush(newPair);

      return newPair;
    } else {
      throw new BadRequestException('Short URL Key has already been taken!');
    }
  }

  async getRandomHash(): Promise<string> {
    let exists = true;
    let randomHash;
    while (exists) {
      randomHash = generateHash({ length: 6 });
      exists = !!(await this.urlRepository.findOne({
        short_url: randomHash,
      }));
    }

    return randomHash;
  }

  async getAll(): Promise<UrlPairEntity[]> {
    return await this.urlRepository.findAll();
  }

  async getUrl(short_url: string): Promise<UrlPairEntity> {
    const url = await this.urlRepository.findOne({ short_url });

    if (!url) {
      throw new NotFoundException('Url Not Found');
    }

    return url;
  }
}

import { Entity, PrimaryKey, Property, TextType } from '@mikro-orm/core';

@Entity()
export class UrlPairEntity {
  @PrimaryKey({ type: TextType })
  short_url!: string;

  @Property({ type: TextType })
  full_url!: string;

  constructor(full_url: string, short_url: string) {
    this.full_url = full_url;
    this.short_url = short_url;
  }
}

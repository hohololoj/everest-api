import { Module } from '@nestjs/common';
import { CDNController } from './cdn.controller';

@Module({
    controllers: [CDNController]
})
export class CDNModule {}
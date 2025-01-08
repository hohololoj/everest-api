import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(process.env.PORT || 3003);
  
  console.log(`server running on localhost:${process.env.PORT || 3003}`);
}
bootstrap();

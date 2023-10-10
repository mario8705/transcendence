import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api'); /* Starts every route with /api and then api version (eg. /api/v1/users/@me) */
	app.enableVersioning({
		type: VersioningType.URI,
	});

	await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api'); /* Starts every route with /api and then api version (eg. /api/v1/users/@me) */
	app.enableVersioning({
		type: VersioningType.URI,
	});

	const config = new DocumentBuilder()
		.setTitle("Pong RestAPI")
		.setDescription("Documentation about API routes")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("documentation", app, document);

	await app.listen(3000);
}
bootstrap();

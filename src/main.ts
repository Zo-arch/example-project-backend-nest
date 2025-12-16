import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	// Segurança - Helmet (desabilitado CSP para rota /reference)
	app.use((req, res, next) => {
		// Desabilitar CSP apenas para a rota do Scalar
		if (req.path.startsWith('/reference')) {
			helmet({
				contentSecurityPolicy: false,
			})(req, res, next);
		} else {
			helmet({
				contentSecurityPolicy: {
					directives: {
						defaultSrc: ["'self'"],
						styleSrc: ["'self'", "'unsafe-inline'"],
						imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
						scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
					},
				},
			})(req, res, next);
		}
	});

	// Configuração de CORS
	app.enableCors({
		origin: configService.get<string>('CORS_ORIGIN', '*'),
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});

	// Global Pipes
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	// Global Filters
	app.useGlobalFilters(new HttpExceptionFilter());

	// Global Interceptors
	app.useGlobalInterceptors(
		new LoggingInterceptor(),
		new TransformInterceptor(),
	);

	// Swagger Configuration
	const appName = configService.get<string>('APP_NAME', 'example-project');
	const config = new DocumentBuilder()
		.setTitle(`${appName} API`)
		.setDescription(`Backend API for ${appName}`)
		.setVersion('1.0')
		.addTag(appName)
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	// Scalar API Reference
	const scalarConfig = {
		theme: 'purple' as const,
		darkMode: true,
		content: document,
	};

	// Configurar Scalar como middleware do Express
	const httpAdapter = app.getHttpAdapter();
	httpAdapter.use('/reference', apiReference(scalarConfig));

	// Handler para favicon.ico (evita erro 404)
	httpAdapter.get('/favicon.ico', (req: any, res: any) => {
		res.status(204).end();
	});

	const port = configService.get<number>('SERVER_PORT', 3000);
	await app.listen(port);

	console.log(`✅ Aplicativo UP na porta ${port}`);
	console.log(`📚 Swagger disponível em http://localhost:${port}/api`);
	console.log(`📚 Scalar ouvindo na rota http://localhost:${port}/reference`);
}
bootstrap();
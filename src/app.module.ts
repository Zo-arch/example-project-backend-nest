import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExemploModule } from './modules/exemplo/exemplo.module';
import { HealthModule } from './modules/health/health.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getDatabaseConfig,
			inject: [ConfigService],
		}),

		HealthModule,
		ExemploModule,
	],
})
export class AppModule { }
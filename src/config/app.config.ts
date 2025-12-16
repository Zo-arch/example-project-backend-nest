import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
	name: process.env.APP_NAME || 'example-project',
	port: parseInt(process.env.SERVER_PORT || '3000', 10),
	env: process.env.NODE_ENV || 'development',
	corsOrigin: process.env.CORS_ORIGIN || '*',
}));


import {
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptor implements NestInterceptor {
	private readonly logger = new Logger(LoggingInterceptor.name);

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const { method, url, body, query, params } = request;
		const now = Date.now();

		return next.handle().pipe(
			tap({
				next: (data) => {
					const response = context.switchToHttp().getResponse();
					const { statusCode } = response;
					const delay = Date.now() - now;

					this.logger.log(
						`${method} ${url} ${statusCode} - ${delay}ms`,
					);

					if (process.env.NODE_ENV === 'development') {
						this.logger.debug('Request:', { body, query, params });
						this.logger.debug('Response:', data);
					}
				},
				error: (error) => {
					const delay = Date.now() - now;
					this.logger.error(
						`${method} ${url} - ${delay}ms - Error: ${error.message}`,
					);
				},
			}),
		);
	}
}


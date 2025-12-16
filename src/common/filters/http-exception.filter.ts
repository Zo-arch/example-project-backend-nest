import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Erro interno do servidor';
		let errors: any = null;

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === 'string') {
				message = exceptionResponse;
			} else if (typeof exceptionResponse === 'object') {
				message = (exceptionResponse as any).message || message;
				errors = (exceptionResponse as any).errors || null;
			}
		} else if (exception instanceof Error) {
			message = exception.message;
		}

		const errorResponse = {
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			method: request.method,
			message,
			...(errors && { errors }),
		};

		// Log do erro
		if (status >= 500) {
			this.logger.error(
				`${request.method} ${request.url}`,
				exception instanceof Error ? exception.stack : JSON.stringify(exception),
			);
		} else {
			this.logger.warn(`${request.method} ${request.url} - ${message}`);
		}

		response.status(status).json(errorResponse);
	}
}


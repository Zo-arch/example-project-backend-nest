import {
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
	data: T;
	statusCode: number;
	message?: string;
}

export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<Response<T>> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		return next.handle().pipe(
			map((data) => {
				// Se já for uma resposta paginada, retornar como está
				if (data && typeof data === 'object' && 'data' in data && 'total' in data) {
					return data;
				}

				// Para outras respostas, padronizar o formato
				return {
					data,
					statusCode: response.statusCode,
					message: 'Operação realizada com sucesso',
				};
			}),
		);
	}
}


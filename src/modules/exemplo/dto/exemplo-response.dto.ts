import { ApiProperty } from '@nestjs/swagger';
import { ExemploEnum } from '../enum/exemplo.enum';

export class ExemploResponseDto {
	@ApiProperty({ example: 1 })
	id: number;

	@ApiProperty({ example: ExemploEnum.TIPO_A })
	enumType: ExemploEnum;

	@ApiProperty({ example: 'Descrição do exemplo' })
	descricao: string;

	@ApiProperty({ example: 199.9 })
	valor: number;

	@ApiProperty({ example: '2025-01-31' })
	dataExemplo: Date;

	@ApiProperty({ example: true })
	ativo: boolean;

	@ApiProperty({ example: 1 })
	version: number;

	@ApiProperty({ example: '2025-01-31T10:00:00.000Z' })
	createdDate: Date;

	@ApiProperty({ example: '2025-01-31T10:00:00.000Z' })
	lastModifiedDate: Date;
}


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exemplo } from './entities/exemplo.entity';
import { CreateExemploDto } from './dto/create-exemplo.dto';
import { UpdateExemploDto } from './dto/update-exemplo.dto';
import { ExemploResponseDto } from './dto/exemplo-response.dto';
import { applyFiltersAndPaginate } from 'src/common/utils/filter-query.util';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';

@Injectable()
export class ExemploService {
	constructor(
		@InjectRepository(Exemplo)
		private readonly exemploRepository: Repository<Exemplo>,
	) { }

	async criar(dto: CreateExemploDto): Promise<ExemploResponseDto> {
		const novoExemplo = this.exemploRepository.create(dto);
		return await this.exemploRepository.save(novoExemplo);
	}

	async buscarTodos(query: BaseQueryDto) {
		const qb = this.exemploRepository.createQueryBuilder('exemplo');

		const filters = {
			descricao: { column: 'exemplo.descricao', type: 'string' as const },
			enumType: { column: 'exemplo.enumType', type: 'enum' as const },
			ativo: { column: 'exemplo.ativo', type: 'boolean' as const },
			valor: { column: 'exemplo.valor', type: 'number' as const },
			dataExemplo: { column: 'exemplo.dataExemplo', type: 'date' as const },
		};

		return applyFiltersAndPaginate(qb, query, filters);
	}

	async buscarPorId(id: number): Promise<ExemploResponseDto> {
		const exemplo = await this.exemploRepository.findOne({ where: { id } });
		if (!exemplo) {
			throw new NotFoundException(`Exemplo com id ${id} não encontrado.`);
		}
		return exemplo;
	}

	async atualizar(id: number, dto: UpdateExemploDto): Promise<ExemploResponseDto> {
		const exemplo = await this.buscarPorId(id);

		this.exemploRepository.merge(exemplo, dto);

		return await this.exemploRepository.save(exemplo);
	}

	async deletar(id: number): Promise<void> {
		const resultado = await this.exemploRepository.delete(id);
		if (resultado.affected === 0) {
			throw new NotFoundException(`Exemplo com id ${id} não encontrado para exclusão.`);
		}
	}
}
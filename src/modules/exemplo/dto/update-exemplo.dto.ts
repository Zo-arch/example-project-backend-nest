import { PartialType } from '@nestjs/swagger';
import { CreateExemploDto } from './create-exemplo.dto';

export class UpdateExemploDto extends PartialType(CreateExemploDto) {}


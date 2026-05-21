import { PartialType } from '@nestjs/swagger';
import { CreateCakeDto } from './create-cake.dto';

export class UpdateCakeDto extends PartialType(CreateCakeDto) {}

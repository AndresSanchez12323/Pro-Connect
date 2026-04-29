import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateFileDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(120)
	name!: string;

	@IsUrl()
	url!: string;

	@IsOptional()
	@IsString()
	@MaxLength(80)
	mimetype?: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	size?: number;
}

import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsUrl, IsObject } from 'class-validator';

export class CreateBarDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  reviews?: number;

  @IsString()
  location: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsString()
  priceRange: string;

  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsObject()
  operatingHours?: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

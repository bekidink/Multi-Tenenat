import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { SectionType, StatusType, ReviewerType } from '../../../prisma/generated/client/enums';

export class CreateOutlineDto {
  @IsString()
  header: string;

  @IsEnum(SectionType)
  sectionType: SectionType;

  @IsEnum(StatusType)
  @IsOptional()
  status?: StatusType;

  @IsInt()
  @IsOptional()
  target?: number;

  @IsInt()
  @IsOptional()
  limit?: number;

  @IsEnum(ReviewerType)
  @IsOptional()
  reviewer?: ReviewerType;

  @IsString()
  organizationId: string;
}

import { IsNotEmpty, IsString, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateAppraisalDto {
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @IsUUID()
  @IsNotEmpty()
  managerId: string;

  @IsString()
  @IsNotEmpty()
  currentPosition: string;

  @IsString()
  @IsNotEmpty()
  proposedPosition: string;

  @IsString()
  @IsNotEmpty()
  justification: string;

  @IsNumber()
  @IsOptional()
  currentSalary?: number;

  @IsNumber()
  @IsOptional()
  proposedSalary?: number;
}

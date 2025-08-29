import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength } from "class-validator"
import { TaskStatus } from "../entities/task.entity"

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.PENDING
}

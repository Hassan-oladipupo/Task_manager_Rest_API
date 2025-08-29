import { Controller, Get, Post, Put, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from "@nestjs/common"
import type { TasksService } from "./tasks.service"
import type { CreateTaskDto } from "./dto/create-task.dto"
import type { UpdateTaskDto } from "./dto/update-task.dto"
import type { Task } from "./entities/task.entity"

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(createTaskDto: CreateTaskDto): Promise<{
    message: string
    data: Task
  }> {
    const task = await this.tasksService.create(createTaskDto)
    return {
      message: "Task created successfully",
      data: task,
    }
  }

  @Get()
  async findAll(): Promise<{
    message: string
    data: Task[]
    stats: any
  }> {
    const [tasks, stats] = await Promise.all([this.tasksService.findAll(), this.tasksService.getTaskStats()])

    return {
      message: "Tasks retrieved successfully",
      data: tasks,
      stats,
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{
    message: string;
    data: Task;
  }> {
    const task = await this.tasksService.findOne(id);
    return {
      message: 'Task retrieved successfully',
      data: task,
    };
  }

  @Put(":id")
  async update(
    @Param('id', ParseIntPipe) id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<{
    message: string
    data: Task
  }> {
    const task = await this.tasksService.update(id, updateTaskDto)
    return {
      message: "Task updated successfully",
      data: task,
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tasksService.remove(id);
  }
}

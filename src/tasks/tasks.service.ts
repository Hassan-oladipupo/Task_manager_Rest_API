import { Injectable, NotFoundException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Task } from "./entities/task.entity"
import type { CreateTaskDto } from "./dto/create-task.dto"
import type { UpdateTaskDto } from "./dto/update-task.dto"
import { TaskStatus } from "./entities/task.entity"

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: Repository<Task>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto)
    return await this.taskRepository.save(task)
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      order: { createdAt: "DESC" },
    })
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } })

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }

    return task
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id)

    Object.assign(task, updateTaskDto)

    return await this.taskRepository.save(task)
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id)
    await this.taskRepository.remove(task)
  }

  async getTaskStats(): Promise<{ total: number; pending: number; inProgress: number; completed: number }> {
    const [total, pending, inProgress, completed] = await Promise.all([
      this.taskRepository.count({ where: { status: TaskStatus.PENDING } }),
      this.taskRepository.count({ where: { status: TaskStatus.IN_PROGRESS } }),
      this.taskRepository.count({ where: { status: TaskStatus.COMPLETED } }),
      this.taskRepository.count({ where: { status: TaskStatus.COMPLETED } }),
    ])

    return { total, pending, inProgress, completed }
  }
}

import { Test, type TestingModule } from "@nestjs/testing"
import { TasksController } from "./tasks.controller"
import { TasksService } from "./tasks.service"
import type { CreateTaskDto } from "./dto/create-task.dto"
import type { UpdateTaskDto } from "./dto/update-task.dto"
import { TaskStatus } from "./entities/task.entity"
import { jest } from "@jest/globals"

describe("TasksController", () => {
  let controller: TasksController
  let service: TasksService

  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getTaskStats: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile()

    controller = module.get<TasksController>(TasksController)
    service = module.get<TasksService>(TasksService)
  })

  it("should be defined", () => {
    expect(controller).toBeDefined()
  })

  describe("create", () => {
    it("should create a task", async () => {
      const createTaskDto: CreateTaskDto = {
        title: "Test Task",
        description: "Test Description",
      }

      mockTasksService.create.mockResolvedValue(mockTask)

      const result = await controller.create(createTaskDto)

      expect(result).toEqual({
        message: "Task created successfully",
        data: mockTask,
      })
      expect(service.create).toHaveBeenCalledWith(createTaskDto)
    })
  })

  describe("findAll", () => {
    it("should return all tasks with stats", async () => {
      const mockStats = { total: 1, pending: 1, inProgress: 0, completed: 0 }

      mockTasksService.findAll.mockResolvedValue([mockTask])
      mockTasksService.getTaskStats.mockResolvedValue(mockStats)

      const result = await controller.findAll()

      expect(result).toEqual({
        message: "Tasks retrieved successfully",
        data: [mockTask],
        stats: mockStats,
      })
    })
  })

  describe("update", () => {
    it("should update a task", async () => {
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.COMPLETED,
      }

      const updatedTask = { ...mockTask, status: TaskStatus.COMPLETED }
      mockTasksService.update.mockResolvedValue(updatedTask)

      const result = await controller.update(1, updateTaskDto)

      expect(result).toEqual({
        message: "Task updated successfully",
        data: updatedTask,
      })
      expect(service.update).toHaveBeenCalledWith(1, updateTaskDto)
    })
  })
})

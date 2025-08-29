import { Test, type TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { NotFoundException } from "@nestjs/common"
import { TasksService } from "./tasks.service"
import { Task, TaskStatus } from "./entities/task.entity"
import type { CreateTaskDto } from "./dto/create-task.dto"
import { jest } from "@jest/globals"

describe("TasksService", () => {
  let service: TasksService
  let repository: Repository<Task>

  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<TasksService>(TasksService)
    repository = module.get<Repository<Task>>(getRepositoryToken(Task))
  })

  it("should be defined", () => {
    expect(service).toBeDefined()
  })

  describe("create", () => {
    it("should create a task", async () => {
      const createTaskDto: CreateTaskDto = {
        title: "Test Task",
        description: "Test Description",
      }

      mockRepository.create.mockReturnValue(mockTask)
      mockRepository.save.mockResolvedValue(mockTask)

      const result = await service.create(createTaskDto)

      expect(result).toEqual(mockTask)
      expect(repository.create).toHaveBeenCalledWith(createTaskDto)
      expect(repository.save).toHaveBeenCalledWith(mockTask)
    })
  })

  describe("findOne", () => {
    it("should return a task if found", async () => {
      mockRepository.findOne.mockResolvedValue(mockTask)

      const result = await service.findOne(1)

      expect(result).toEqual(mockTask)
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
    })

    it("should throw NotFoundException if task not found", async () => {
      mockRepository.findOne.mockResolvedValue(null)

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException)
    })
  })
})

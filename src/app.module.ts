import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TasksModule } from "./tasks/tasks.module"
import { Task } from "./tasks/entities/task.entity"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "tasks.db",
      entities: [Task],
      synchronize: true, // Auto-create tables (only for development)
      logging: true,
    }),
    TasksModule,
  ],
})
export class AppModule {}

import { Body, Controller, Delete, Get, Param, Post, Patch, UsePipes, ValidationPipe, ParseIntPipe, Query, UseGuards, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/schemas/user.schema";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { GetTaskFilterDto } from "./dtos/get-tasks-filter.dto";
import { TaskStatusValidationPipe } from "./pipes/task-status-validation.pipe";
import { Task } from "./schemas/task.schema";
import { TaskStatus } from "./task-status.enum";
import { TaskService } from "./task.service";

@Controller('task')
export class TaskController {
    private logger = new Logger('TaskController');
    constructor(private tasksService: TaskService) { }

    // @Get()
    // async getAllTasks(): Promise<Task[]> {
    //     return await this.tasksService.getAllTasks();
    // }

    @Get()
    getAllTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto){
        this.logger.verbose('Request For getting all Tasks...')
        return  this.tasksService.getAllTasks(filterDto);
    }

    @Get(':id')
    getTaskById(@Param('id') id: string): Promise<Task> {
        return this.tasksService.getTaskById(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    @UsePipes(ValidationPipe)
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
        ): Promise<Task> {
            console.log('user1:',user);
            
        return await this.tasksService.createTask(createTaskDto,user);
    }
    // // @Post()
    // // createTask(@Body('title') title: string, @Body('description') description: string): Task {
    // //     return this.tasksService.createTask(title, description);
    // // }

    @Delete(':id')
    @UseGuards(AuthGuard())
    deleteTask(
        @Param('id') id: string,
        @GetUser() user:User
        ): void {
            
        this.tasksService.deleteTask(id,user);
    }

    @Patch(':id/status')
    @UseGuards(AuthGuard())
    async updateTaskStatus(
        @Param('id') id: string,
         @Body('status', TaskStatusValidationPipe) status: TaskStatus,
         @GetUser() user:User
         ): Promise<Task> {
        return await this.tasksService.updateTaskStatus(id, status,user);
    }
}
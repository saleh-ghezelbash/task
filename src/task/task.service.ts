import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { CreateTaskDto } from "./dtos/create-task.dto";
import { GetTaskFilterDto } from "./dtos/get-tasks-filter.dto";
import { Task, TaskDocument } from "./schemas/task.schema";
import { TaskStatus } from "./task-status.enum";

@Injectable()
export class TaskService {
    private logger = new Logger('TaskService');
    constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

    /**
 * This function create one Task
 * @param CreateTaskDto
 * @param User
 * @returns JSON
 * creator: s.ghezelbash
 */
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {

        const newTask = await new this.taskModel({
            ...createTaskDto,
            status: TaskStatus.OPEN,
            user
        }).populate({ path: 'user', select: 'username' })

        return newTask.save();
    }

    /**
    * This function get all available Tasks
    * @param search : optional
    * @param status : optional
    * @returns JSON
    * creator: s.ghezelbash
    */
    async getAllTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { search, status } = filterDto;
        // let query =  this.taskModel.find({ $or: [ { "title": { $regex: '.*' + search + '.*' }}, { "description": { $regex: '.*' + search + '.*' } } ] } );
        let query = this.taskModel.find().populate({ path: 'user', select: 'username' })
        if (search) {
            query = query.where({ $or: [{ "title": { $regex: '.*' + search + '.*' } }, { "description": { $regex: '.*' + search + '.*' } }] })
        }
        if (status) {
            query = query.where({ 'status': status })
        }
        return await query;
    }
    // async getAllTasks(): Promise<Task[]> {
    //     return await this.taskModel.find().exec();
    // }

    /**
     * This function get one Task
     * @param id
     * @returns JSON
     * creator: s.ghezelbash
     */
    async getTaskById(id: string): Promise<Task> {
        try {
            const task = await this.taskModel.findOne({ _id: id }).exec();
            if (!task) {
                throw new NotFoundException('This task not exist!')
            }
            return task;
        } catch (error) {
            this.logger.error(`Failed to get Task with Id: ${id}`, error.stack)
            throw new InternalServerErrorException();
        }

    }

     /**
    * This function delete one Task
    * @param id
    * @returns JSON     
    * creator: s.ghezelbash
    */
    async deleteTask(id: string, user): Promise<void> {
        // try {
        // await this.taskModel.findByIdAndRemove(id);
        const task = await this.taskModel.findOne({ _id: id }).exec();
        if (!task) {
            throw new NotFoundException('This task not exist!')
        }

        if (task.user.toString() !== user._id.toString()) {
            throw new HttpException('You do not own this Task!', HttpStatus.UNAUTHORIZED)
        }
        task.remove();
        // } catch (error) {
        //     this.logger.error(`Failed to get Task with Id: ${id}`, error.stack)
        //     throw new InternalServerErrorException();
        // }

    }

     /**
     * This function update one Task
     * @param id
     * @param status
     * @returns JSON
     * creator: s.ghezelbash
     */
    async updateTaskStatus(id: string, status: TaskStatus, user): Promise<Task> {
        // const task = this.getTaskById(id);
        // task.status = status;
        // return task;

        // return await this.taskModel.findByIdAndUpdate(
        //     { _id: id },
        //     {status},
        //     {new:true}
        //   );

        const task = await this.taskModel.findOne({ _id: id });
        if (!task) {
            throw new NotFoundException('This task not exist!')
        }

        if (task.user.toString() !== user._id.toString()) {
            throw new HttpException('You do not own this Task!', HttpStatus.UNAUTHORIZED)
        }
        // return  task.update({status});
        return await this.taskModel.findByIdAndUpdate(
            { _id: id },
            { status },
            { new: true }
        );

    }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Schema as mongooseSchema } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { TaskStatus } from '../task-status.enum';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  status: TaskStatus;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
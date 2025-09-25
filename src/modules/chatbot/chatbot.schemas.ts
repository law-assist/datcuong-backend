import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, BaseSchemaFactory } from 'src/common/base/base.schema';
import { Field, Role, UserStatus } from 'src/common/enum';
import { generateVerificationCode } from 'src/helpers';

export type ChatBotDocument = HydratedDocument<ChatBot>;

@Schema({ versionKey: false })
export class ChatBot extends BaseSchema {
    @AutoMap()
    @Prop({
        required: true,
        name: 'user_id',
        type: String,
    })
    user_id: string;

    @AutoMap()
    @Prop({
      required: true,
      name: 'chat_id',
      type: Number,
    })
    chat_id: number;
}
const ChatBotSchema = SchemaFactory.createForClass(ChatBot);

export { ChatBotSchema};

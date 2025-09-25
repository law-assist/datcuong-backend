import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ChatBot, ChatBotSchema } from './chatbot.schemas';
import { ChatBotController } from './chatbot.controller';
import { ChatBotService } from './chatbot.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatBot.name, schema: ChatBotSchema }]),
  ],
  controllers: [ChatBotController],
  providers: [ChatBotService],
})
export class ChatbotModules {}

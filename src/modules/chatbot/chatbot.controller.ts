import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseInterceptors } from "@nestjs/common";
import { questionAnsweringDto } from "./question-answering.dto";
import { ChatBotService } from "./chatbot.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { API_BEARER_AUTH } from 'src/constants/constants';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('chatbot')
@ApiTags('chatbot')
@ApiBearerAuth(API_BEARER_AUTH)
@UseInterceptors(ResponseInterceptor)
export class ChatBotController {
    constructor(private readonly service: ChatBotService) {}
    @Post('question-answering')
    async questionAnswering(    @Body() questionAnsweringDto: questionAnsweringDto) {
        console.log('Received question:', questionAnsweringDto); // Debugging line
        const answer = await this.service.questionAnswering(questionAnsweringDto);
        return {
            message: 'question answered',
            data: {answer: answer}
        };
    }

    @Get('chat-history')
  async getChatHistory(
    @Query('user_id') user_id: string,
    @Query('chat_id') chat_id: string,
  ) {
    console.log('Received user_id:', user_id, 'chat_id:', chat_id); // Debugging line
    if (!user_id || !chat_id) {
      throw new BadRequestException('user_id and chat_id are required');
    }
    const chatHistory = await this.service.getChatHistory(user_id, chat_id);
    return {
      message: 'success',
      data: { chatHistory },
    };
  }
}

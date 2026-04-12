import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) { }

  @Post('ask')
  async ask(@Body() createChatbotDto: CreateChatbotDto) {
    const { message, history } = createChatbotDto;
    return this.chatbotService.generateResponse(history || [], message);
  }


}

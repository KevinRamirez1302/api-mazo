import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotDto } from './dto/create-chatbot.dto';

@Controller('chatbot')
export class ChatbotController {
  private readonly logger = new Logger(ChatbotController.name);

  constructor(private readonly chatbotService: ChatbotService) { }

  @Post('ask')
  @HttpCode(HttpStatus.OK)
  async ask(@Body() createChatbotDto: CreateChatbotDto) {
    try {
      const message = createChatbotDto?.message;
      const history = createChatbotDto?.history || [];

      // Validación básica del payload
      if (!message || typeof message !== 'string' || !message.trim()) {
        return { reply: 'Por favor, escribe un mensaje para que pueda ayudarte.' };
      }

      const response = await this.chatbotService.generateResponse(history, message);

      // Devolver siempre un objeto estructurado para que el frontend sepa qué esperar
      return { reply: response };
    } catch (error: any) {
      this.logger.error(`Error inesperado en el controlador del chatbot: ${error.message}`, error.stack);

      // NUNCA devolver el error crudo al frontend
      return {
        reply: 'Lo siento, ha ocurrido un error inesperado. Por favor, consulta en secretaría o inténtalo más tarde.',
      };
    }
  }
}

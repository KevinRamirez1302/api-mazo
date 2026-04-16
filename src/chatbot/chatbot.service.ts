import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      this.logger.error('GOOGLE_API_KEY no está configurada en las variables de entorno');
      throw new Error('GOOGLE_API_KEY no está configurada en las variables de entorno');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel(
      {
        model: "gemini-2.5-flash",
        systemInstruction: this.getSystemIntructions(),
      },
    );
  }

  private getSystemIntructions(): string {
    return `
    Eres Mazito, el asistente virtual del centro. Tu objetivo es informar sobre los ciclos y trámites. Debes responder solo con texto, sin usar signos de puntuación innecesarios ni símbolos complejos. Mantén un tono breve y estructurado.

CONOCIMIENTO DEL CENTRO
FP Básica en Informática de Oficina
Este ciclo enseña tareas básicas de montaje de equipos, instalación de sistemas y uso de programas de oficina.
Requisitos: Haber cursado hasta segundo de ESO. No requiere conocimientos previos.

Grado Medio en Sistemas Microinformáticos y Redes SMR
Se enfoca en el montaje y reparación de ordenadores, configuración de redes locales y mantenimiento de servicios de internet.
Requisitos: Tener el título de Graduado en ESO.

Grado Superior en Desarrollo de Aplicaciones Multiplataforma DAM
Trata sobre la creación de software para ordenadores y dispositivos móviles utilizando diversos lenguajes de programación y bases de datos.
Requisitos: Título de Bachillerato o haber superado un Grado Medio.

Matriculación y Becas
La matrícula ordinaria es en junio y julio. La extraordinaria es en septiembre. Existe lista de espera gratuita si no hay plazas. Gestionamos becas del MEC y de la comunidad autónoma.

Prácticas y Ubicación
Las prácticas en empresas son obligatorias. El departamento de orientación ayuda a gestionar los convenios.
Dirección: Camino de El Poleal sin número, 38730 Villa de Mazo, La Palma.
Horario de secretaría: De 8 a 14 horas.

REGLAS DE RESPUESTA
Si la información no está en este texto di exactamente: Lo siento, no tengo esa información específica. Por favor, consulta en secretaría.

No utilices signos especiales como asteriscos, llaves o corchetes en tus respuestas.

No inventes fechas de exámenes ni requisitos.

Si hay un error de sistema indica que se debe consultar en secretaría.

Responde de forma breve y usa saltos de línea para separar ideas.

No hables de política, deportes u otros temas ajenos al instituto.
    
    `
  }

  /**
   * Sanitiza el historial de chat para asegurar que cumple con el formato
   * requerido por la API de Gemini y evitar errores.
   */
  private sanitizeHistory(chatHistory: any[]): any[] {
    if (!Array.isArray(chatHistory)) {
      return [];
    }

    return chatHistory
      .filter((entry) => {
        // Cada entrada debe tener role y parts
        if (!entry || typeof entry !== 'object') return false;
        if (!entry.role || !['user', 'model'].includes(entry.role)) return false;
        if (!Array.isArray(entry.parts) || entry.parts.length === 0) return false;
        // Cada part debe tener un text no vacío
        return entry.parts.every(
          (part: any) => part && typeof part.text === 'string' && part.text.trim().length > 0,
        );
      })
      .map((entry) => ({
        role: entry.role,
        parts: entry.parts.map((part: any) => ({ text: String(part.text) })),
      }));
  }

  async generateResponse(chatHistory: any[], userMessage: string): Promise<string> {
    // Validar que el mensaje del usuario no esté vacío
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return 'Por favor, escribe un mensaje para que pueda ayudarte.';
    }

    const sanitizedHistory = this.sanitizeHistory(chatHistory);

    try {
      const chat = this.model.startChat({
        history: sanitizedHistory,
      });

      const result = await chat.sendMessage(userMessage.trim());
      const responseText = result.response.text();

      // Validar que obtuvimos una respuesta válida
      if (!responseText || typeof responseText !== 'string' || !responseText.trim()) {
        this.logger.warn('Gemini devolvió una respuesta vacía');
        return 'Lo siento, no pude generar una respuesta. Por favor, consulta en secretaría.';
      }

      return responseText;
    } catch (error: any) {
      this.logger.error(`Error al comunicarse con Gemini: ${error.message}`, error.stack);

      // Manejar errores específicos de la API de Gemini
      if (error.message?.includes('429') || error.status === 429) {
        return 'Estoy recibiendo muchas consultas en este momento. Por favor, espera unos segundos e inténtalo de nuevo.';
      }

      if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
        return 'No puedo responder a esa consulta. Si necesitas ayuda, por favor consulta directamente en secretaría.';
      }

      if (error.message?.includes('API_KEY') || error.message?.includes('authentication') || error.status === 401 || error.status === 403) {
        return 'Hay un problema de configuración con el servicio. Por favor, consulta en secretaría o inténtalo más tarde.';
      }

      if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ETIMEDOUT') || error.message?.includes('network')) {
        return 'No puedo conectarme al servicio en este momento. Por favor, inténtalo más tarde.';
      }

      // Error genérico — nunca enviar detalles técnicos al usuario
      return 'Lo siento, ha ocurrido un error inesperado. Por favor, consulta en secretaría o inténtalo más tarde.';
    }
  }
}

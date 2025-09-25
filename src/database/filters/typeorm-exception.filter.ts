import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class TypeOrmExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // 🔍 Verificar si estamos en desarrollo
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.';
    let details = null;

    // 🚨 EN DESARROLLO: Mostrar error completo
    if (isDevelopment) {
      console.error('🔥 ERROR COMPLETO EN DESARROLLO:');
      console.error('Exception:', exception);
      console.error('Stack:', (exception as any)?.stack);
      
      if (exception instanceof QueryFailedError) {
        console.error('🗄️ QueryFailedError details:');
        console.error('- Code:', (exception as any).code);
        console.error('- Message:', exception.message);
        console.error('- SQL:', (exception as any).sql);
        console.error('- Parameters:', (exception as any).parameters);
      }
    }

    // TypeORM QueryFailedError
    if (exception instanceof QueryFailedError) {
      // PostgreSQL & MySQL error codes
      switch ((exception as any).code) {
        case '23505': // unique_violation (PostgreSQL)
        case 'ER_DUP_ENTRY': // 1062 (MySQL)
          message = 'Ya existe un registro con estos datos.';
          status = HttpStatus.CONFLICT;
          break;
        case '23503': // foreign_key_violation (PostgreSQL)
        case 'ER_NO_REFERENCED_ROW_2': // 1452 (MySQL)
          message = 'Referencia inválida: el dato relacionado no existe.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case '23502': // not_null_violation (PostgreSQL)
        case 'ER_BAD_NULL_ERROR': // 1048 (MySQL)
          message = 'Hay campos obligatorios que no fueron completados.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case '22001': // string_data_right_truncation (PostgreSQL)
        case 'ER_DATA_TOO_LONG': // 1406 (MySQL)
          message = 'Algún campo supera el largo permitido.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case '42703': // undefined_column (PostgreSQL)
        case 'ER_BAD_FIELD_ERROR': // 1054 (MySQL)
          message = 'Campo desconocido en la base de datos.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case '23514': // check_violation (PostgreSQL)
        case 'ER_ROW_IS_REFERENCED_2': // 1451 (MySQL, intento de borrar con FK)
          message = 'No se puede realizar la operación debido a restricciones de la base de datos.';
          status = HttpStatus.BAD_REQUEST;
          break;
        case 'ER_NO_SUCH_TABLE': // 1146 (MySQL)
          message = isDevelopment 
            ? `Tabla no existe: ${(exception as any).sql}` 
            : 'Error de configuración de base de datos.';
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          break;
        default:
          message = isDevelopment 
            ? `Error BD: ${exception.message}` 
            : 'Error en la base de datos. Por favor, verifica los datos ingresados.';
          status = HttpStatus.BAD_REQUEST;
      }

      // 🔍 EN DESARROLLO: Agregar detalles del error
      if (isDevelopment) {
        details = {
          code: (exception as any).code,
          sqlMessage: exception.message,
          sql: (exception as any).sql,
          parameters: (exception as any).parameters,
        };
      }

    } else if (exception instanceof HttpException) {
      // Otros errores HTTP de NestJS
      status = exception.getStatus();
      message = this.normalizeMessage(exception.getResponse());
      
      // 🔍 EN DESARROLLO: Agregar stack trace
      if (isDevelopment && status >= 500) {
        details = {
          stack: (exception as any).stack,
          cause: (exception as any).cause,
        };
      }

    } else {
      // 🚨 Errores no controlados
      if (isDevelopment) {
        message = `Error no controlado: ${(exception as any)?.message || exception}`;
        details = {
          type: (exception as any)?.constructor?.name,
          stack: (exception as any)?.stack,
          fullError: exception,
        };
      }
    }

    // 📋 Respuesta final
    const errorResponse: any = {
      statusCode: status,
      message: this.normalizeMessage(message),
    };

    // ✅ Solo agregar detalles en desarrollo
    if (isDevelopment && details) {
      errorResponse.details = details;
      errorResponse.timestamp = new Date().toISOString();
      errorResponse.environment = 'development';
    }

    response.status(status).json(errorResponse);
  }

  // Normaliza el mensaje si viene como objeto NestJS
  private normalizeMessage(msg: any): string {
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg?.message)) return msg.message.join(' ');
    if (typeof msg?.message === 'string') return msg.message;
    return 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.';
  }
}
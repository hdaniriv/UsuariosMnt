import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';

  // Define the ResponseWithStatus interface
  interface ResponseWithStatus {
    status: (code: number) => void;
  }
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class GlobalPostInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request: { method: string } = context.switchToHttp().getRequest<{ method: string }>();
  
      // Verifica si el método HTTP es POST
      if (request.method === 'POST') {
        const response: ResponseWithStatus = context.switchToHttp().getResponse<ResponseWithStatus>();
        response.status(HttpStatus.CREATED); // Establece el código de estado 201
      }
  
      return next.handle();
    }
  }
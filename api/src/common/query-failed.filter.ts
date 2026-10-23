import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/** Traduce errores de Postgres a respuestas HTTP útiles sin filtrar detalles internos. */
@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryFailedFilter.name);

  catch(exception: QueryFailedError & { code?: string }, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const map: Record<string, [HttpStatus, string]> = {
      '23505': [HttpStatus.CONFLICT, 'El recurso ya existe'],
      '23503': [HttpStatus.BAD_REQUEST, 'Referencia inválida a otro recurso'],
      '23514': [HttpStatus.BAD_REQUEST, 'El valor no cumple las restricciones'],
    };
    const [statusCode, message] = map[exception.code ?? ''] ?? [HttpStatus.INTERNAL_SERVER_ERROR, 'Error interno'];
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) this.logger.error(exception.message, exception.stack);
    res.status(statusCode).json({ statusCode, message });
  }
}

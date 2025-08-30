// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { DomainException } from './domain.exception';
// import { formatDate } from 'date-fns';
// import { config } from 'dotenv';
// import { logLevel } from '@delivery/db/db/enums/base.enum';
// import { LogCreateDto } from '../../modules/log/log.dto';
// import { LogQueue } from '../../jobs/log/log.queue';
// import { requestToCurl } from '../utils/util';

// config();

// @Catch()
// export class HttpExceptionFilter implements ExceptionFilter {
//   constructor(private readonly logQueue: LogQueue) {}

//   catch(exception: HttpException | DomainException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     if (exception instanceof DomainException) {
//       const data = {
//         success: false,
//         status: 400,
//         error: exception.message,
//       };

//       void this.send(exception, host, data);
//       return response.status(400).json(data);
//     }

//     const status = exception.getStatus();
//     const errorResponse = exception.getResponse();

//     // Validation error (422)
//     if (status === 422) {
//       void this.send(exception, host, errorResponse);
//       return response.status(status).json(errorResponse);
//     }

//     // Boshqa xatoliklar
//     const data = {
//       success: false,
//       status,
//       error: exception.message,
//     };

//     void this.send(exception, host, data);
//     response.status(status).json(data);
//   }

//   send(
//     exception: HttpException | DomainException,
//     host: ArgumentsHost,
//     response?: object | string,
//   ) {
//     if (
//       !process.env.LOGGER_BOT_TOKEN ||
//       !process.env.LOGGER_CHAT_ID ||
//       !process.env.LOGGER_BOT_ADMIN_THREAD_ID
//     ) {
//       return;
//     }

//     const status =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : exception.code;

//     const ctx = host.switchToHttp();
//     const request = ctx.getRequest<Request>();

//     const message = [
//       '',
//       `*${status}*`,
//       '',
//       `❗*Error:* ${exception.message}`,
//       `⚙️ *Status Code:* ${status}`,
//       `🕛 Time: ${formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
//       `🔗 *URL:* ${request.url}`,
//       `🔠 *Method:* ${request.method}`,
//     ];

//     if (request.headers) {
//       this._appendJsonBlock('Headers', request.headers, message);
//     }
//     if (request.body) {
//       this._appendJsonBlock('Request Body', request.body, message);
//     }
//     if (response) {
//       this._appendJsonBlock('Response Body', response, message);
//     }

//     const rawIp =
//       (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
//       request.socket.remoteAddress;

//     const log: LogCreateDto = {
//       level: Number(status) >= 500 ? logLevel.CRITICAL : logLevel.ERROR,
//       source: 'HttpExceptionFilter',
//       message: exception.message,
//       ipAddress: rawIp?.replace(/^::ffff:/, ''),
//       userAgent: request.headers['user-agent'],
//       status: Number(status),
//       context: exception,
//       curl: requestToCurl(request),
//     };


//     if (Number(status) >= 400) {
//       void this.logQueue.add({
//         log,
//         message: message,
//       });

//       return;
//     }
//   }

//   private _appendJsonBlock(title: string, data: any, message: string[]) {
//     message.push(
//       '',
//       `📃 ${title}: `,
//       '```json',
//       JSON.stringify(data, null, 2),
//       '```',
//     );
//   }
// }

import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import {Observable, tap} from 'rxjs';
import {Response, Request} from "express";

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {

    private readonly logger = new Logger(InvokeRecordInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const userAgent = request.headers['user-agent'];

        const {ip, method, path} = request;

        const now = Date.now();


        return next.handle().pipe(tap(res => {
            // TODO: 日志记录
            console.log(`IP: 【${ip}】 - 【${method}】 - 【${path}】 : ${Date.now() - now}ms`);
        }));
    }
}

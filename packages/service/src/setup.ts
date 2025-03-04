import {INestApplication, ValidationPipe} from "@nestjs/common";
import {FormatResponseInterceptor} from "@/common/interceptor/format-response.interceptor";
import {InvokeRecordInterceptor} from "@/common/interceptor/invoke-record.interceptor";
import {UnLoginFilter} from "@/common/filter/un-login.filter";
import {CustomExceptionFilter} from "@/common/filter/custom-exception.filter";

const setupAll = async (app: INestApplication) => {
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new FormatResponseInterceptor());
    app.useGlobalInterceptors(new InvokeRecordInterceptor());
    app.useGlobalFilters(new UnLoginFilter());
    app.useGlobalFilters(new CustomExceptionFilter());
}

export {setupAll};
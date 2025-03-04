import {INestApplication, ValidationPipe} from "@nestjs/common";
import {FormatResponseInterceptor} from "@/common/interceptor/format-response.interceptor";
import {InvokeRecordInterceptor} from "@/common/interceptor/invoke-record.interceptor";

const setupAll = async (app: INestApplication) => {
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new FormatResponseInterceptor());
    app.useGlobalInterceptors(new InvokeRecordInterceptor());
}

export { setupAll };
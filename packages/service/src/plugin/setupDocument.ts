import {INestApplication} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

export const setupDocument = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('会议室预约系统')
        .setDescription('API 接口文档')
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
}
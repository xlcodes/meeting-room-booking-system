import {INestApplication, ValidationPipe} from "@nestjs/common";

const setupAll = async (app: INestApplication) => {
    app.useGlobalPipes(new ValidationPipe());
}

export { setupAll };
import {NestFactory} from '@nestjs/core';
import {AppModule} from '@/app.module';
import {setupAll} from '@/setup'
import {ConfigService} from "@nestjs/config";
import {ApplicationConfigKey, JwtConfigKey} from "@/common/enum.common";
import {timeTextToSecond} from "@/utils/time";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    await setupAll(app);

    await app.listen(config.get(ApplicationConfigKey.port) ?? 3000);
}

bootstrap().then(res => {
    console.log('app start success');
});

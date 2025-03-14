import {BadRequestException, ParseIntPipe} from "@nestjs/common";

export function generateParseIntPipe(name: string) {
    return new ParseIntPipe({
        exceptionFactory: () => {
            throw new BadRequestException(`${name}必须为整数！`)
        }
    })
}
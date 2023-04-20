import { Controller, Get, HttpCode } from '@nestjs/common';
import { Permissions, Claims } from '@visionarea-admin/auth';

@Controller('healthcheck')
export class HealthCheckController {

    @HttpCode(200)
    @Permissions(Claims.stores)
    @Get()
    async healthcheck() {
        return 'OK';
    }
}

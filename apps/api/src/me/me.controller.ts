import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { MeService } from '@visionarea-admin/services';
import { ApiTags, ApiBearerAuth , ApiResponse} from '@nestjs/swagger';
import { UserResponse } from '@visionarea-admin/common';

@ApiTags('me')
@ApiBearerAuth()
@Controller('me/v1')
export class MeController {
    constructor(private readonly meService: MeService) {}

    @ApiResponse({status: 200, type: UserResponse, description:'Return user values'})
    @Get()
    async find(@Req() req: Request) {
        return await this.meService.find(req.user);
    }
}

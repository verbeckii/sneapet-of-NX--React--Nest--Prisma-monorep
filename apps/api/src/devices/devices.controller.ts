import {
  Controller,
  Post,
  HttpCode,
  Req,
  Res,
  Body,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DevicesService } from '@visionarea-admin/services';
import { Permissions, Claims } from '@visionarea-admin/auth';
import { ApiTags, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('devices')
@ApiBearerAuth()
@Controller('/devices')
export class DevicesController {
  constructor(private readonly DevicesService: DevicesService) {}

  @ApiResponse({status: 200, description:'get all devices'})
  @Get()
  @HttpCode(200)
  @Permissions(Claims.stores)
  GetDevices(@Req() req: Request, @Res() res: Response) {
    return this.DevicesService.allDevices(req, res)
  }

  @ApiResponse({status: 200, description:'create new device'})
  @Post('/create')
  @HttpCode(200)
  @Permissions(Claims.stores)
  CreateDevice(@Req() req: Request, @Res() res: Response,) {
    return this.DevicesService.createDevice(req, res);
  }

  @ApiResponse({status: 200, description:'get one device'})
  @Get('device/:id')
  @HttpCode(200)
  @Permissions(Claims.stores)
  GetDevice(@Req() req: Request, @Res() res: Response, @Param('id') id: number) {
    return this.DevicesService.getDevice(req, res);
  }

  @ApiResponse({status: 200, description:'patch one device'})
  @Patch('update')
  @HttpCode(200)
  @Permissions(Claims.stores)
  UpdateDevice(@Req() req: Request, @Res() res: Response) {
    return this.DevicesService.updateDevice(req, res);
  }
}
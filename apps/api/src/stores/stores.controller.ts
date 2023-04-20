import {
    Controller,
    Post,
    HttpCode,
    Req,
    Res,
    Body,
    Get,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { StoresService } from '@visionarea-admin/services';
  import { Permissions, Claims } from '@visionarea-admin/auth';
  import { ApiTags, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('stores')
  @ApiBearerAuth()
  @Controller('/stores')
  export class StoresController {
    constructor(private readonly StoresService: StoresService) {}
  
    @ApiResponse({status: 200, description:'get list of stores'})
    @Get('/options')
    @HttpCode(200)
    @Permissions(Claims.stores)
    StoreStatus(@Req() req: Request, @Res() res: Response,) {
      return this.StoresService.getOptions(req, res);
    }
  }
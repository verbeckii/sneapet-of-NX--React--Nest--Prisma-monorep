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
  import { CustomersService } from '@visionarea-admin/services';
  import { Permissions, Claims } from '@visionarea-admin/auth';
  import { ApiTags, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('customers')
  @ApiBearerAuth()
  @Controller('/customers')
  export class CustomersController {
    constructor(private readonly CustomersService: CustomersService) {}
  

    @ApiResponse({status: 200, description:'get list of customers'})
    @Get('/options')
    @HttpCode(200)
    @Permissions(Claims.stores)
    StoreStatus(@Req() req: Request, @Res() res: Response,) {
      return this.CustomersService.getOptions(req, res);
    }
  }
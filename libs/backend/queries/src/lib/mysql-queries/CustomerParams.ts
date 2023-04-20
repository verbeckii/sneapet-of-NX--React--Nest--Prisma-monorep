import { Injectable } from '@nestjs/common';
import { prisma } from '@visionarea-admin/prisma-client';
import { constants } from '@visionarea-admin/common';

@Injectable()
export class CustomerParams {

  async qDescription(customer_id: number): Promise<customerParams[]> {
    const custParams = await prisma.getClient().customerParams.findMany({
      select: {
        id:true,
        Customer_id:true,
        Index:true,
        LightColor:true,
        DarkColor:true,
        isHighlight:true,
        viewType:true,
        sortingPriority:true,
        parentId:true,
        alwaysShow: true
      },
      where: {
        Customer_id: customer_id
      }
    });
    // this is default value
      const defParams = await prisma.getClient().customerParams.findMany({
        select: {
          id:true,
          Customer_id:true,
          Index:true,
          LightColor:true,
          DarkColor:true,
          isHighlight:true,
          viewType:true,
          sortingPriority:true,
          parentId:true,
          alwaysShow: true
        },
        where: {
          Customer_id: constants.defaultCustomerId
        }
      });
      // add to customer params all default params that are not already present
    return [...custParams, ...defParams.filter(p => !custParams.find(c => c.Index === p.Index))];
  }
}


interface customerParams{
  id: number,
  Customer_id:number,
  Index:string,
  LightColor:string,
  DarkColor:string,
  isHighlight:number,
  viewType:string,
  sortingPriority: number,
  parentId:number
}
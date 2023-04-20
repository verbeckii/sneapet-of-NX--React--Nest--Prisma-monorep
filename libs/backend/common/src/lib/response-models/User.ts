import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: 127 })
  id: number;
  @ApiProperty({ example: 'nxyOo6231Xh' })
  Code: string;
  @ApiProperty({ example: 'Scout 1' })
  Nome: string;
  @ApiProperty({ example: 'email@scout.it' })
  Mail: string;
  @ApiProperty({ example: false })
  isAdmin: boolean;
  @ApiProperty({ example: true })
  isStoreAdmin: boolean;
  @ApiProperty({ example: 9 })
  StartHour: number;
  @ApiProperty({ example: 24 })
  EndHour: number;
  @ApiProperty({ example: 'In' })
  Show: string;
  @ApiProperty({ example: false })
  isMall: boolean;
  @ApiProperty({ example: false })
  showGroup: boolean;
  @ApiProperty({ example: 46 })
  Customer_id: number;
  @ApiProperty({ example: 'auth0|610aafa15ea8ba00697ea849' })
  AuthCode: string;
  @ApiProperty({ example: [282] })
  Stores: number[];
  @ApiProperty({
    example: {
      indexes: {
        default: {
          index: 'default',
          LightColor: '#709CFD',
          DarkColor: '#0054FF',
          isHighlight: 0,
        },
        Visits: {
          index: 'Visits',
          LightColor: '#709CFD',
          DarkColor: '#0054FF',
          isHighlight: 1,
        },
        Passerbby: {
          index: 'Passerbby',
          LightColor: '#9AEDAC',
          DarkColor: '#50E26F',
          isHighlight: 0,
        },
      },
    },
  })
  Params: {
    indexes: {
      default: {
        index: string;
        LightColor: string;
        DarkColor: string;
        isHighlight: number;
      };
      Visits: {
        index: string;
        LightColor: string;
        DarkColor: string;
        isHighlight: number;
      };
      Passerbby: {
        index: string;
        LightColor: string;
        DarkColor: string;
        isHighlight: number;
      };
    };
  };
}

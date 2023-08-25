import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetMatchingOrdersRequestQueryDto {
  @ApiProperty()
  tokenA: string;
  @ApiProperty()
  tokenB: string;
  @ApiProperty()
  amountA: string;
  @ApiProperty()
  amountB: string;
  @ApiPropertyOptional()
  isMarket?: boolean;
}

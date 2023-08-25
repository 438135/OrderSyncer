import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetOrdersRequestQueryDto {
  @ApiPropertyOptional()
  tokenA?: string;
  @ApiPropertyOptional()
  tokenB?: string;
  @ApiPropertyOptional()
  user?: string;
  @ApiPropertyOptional()
  active?: boolean;
}

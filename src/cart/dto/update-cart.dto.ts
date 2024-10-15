import { IsUUID, IsOptional } from 'class-validator';

export class UpdateCartDto {
    @IsUUID()
    @IsOptional()
    user_id?: string;
}

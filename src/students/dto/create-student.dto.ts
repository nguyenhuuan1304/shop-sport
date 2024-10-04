import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    fullname: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    address: string;

    @IsUUID()
    userId: string;
}
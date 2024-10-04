import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { Student } from './students/student.entity';  
import { User } from './users/user.entity';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'testnestjs',
      entities: [Student, User],  
      synchronize: true,
    }),
    UserModule,
    StudentsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

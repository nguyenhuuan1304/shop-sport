import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './student.entity';
import { BadRequestException } from '@nestjs/common';
import { User } from 'src/users/user.entity';


@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const existingStudent = await this.studentRepository.findOneBy({ email: createStudentDto.email });
  
    if (existingStudent) {
      throw new BadRequestException('Student with this email already exists');
    }
  
    const student = this.studentRepository.create(createStudentDto);
    
    if (createStudentDto.userId) {
      student.user = { id: createStudentDto.userId.toString() } as User;
    }
  
    return await this.studentRepository.save(student);
  }

  async findAll() {
    return await this.studentRepository.find();
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) {
      throw new NotFoundException('Student Not Found');
    }
    return student;
  }  

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) {
      throw new NotFoundException('Student Not Found');
    }
  
    const updatedStudent = this.studentRepository.merge(student, updateStudentDto);
    return await this.studentRepository.save(updatedStudent);
  }  

  async remove(id: string) {
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) {
      throw new NotFoundException('Student Not Found');
    }
    return await this.studentRepository.remove(student);
  }  
}

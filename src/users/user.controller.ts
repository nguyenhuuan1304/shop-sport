import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { JwtAuthGuard } from './JwtAuthGuard'; 
import { RolesGuard } from './rolesGuard';
import { Roles } from './rolesDecorator';
import { UserRole } from './user.entity';
import { Response } from 'express';
import { ApiBody, ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  @Post('login')
  async login(@Body() body: { username: string; password: string }, @Res() res: Response) {
    return await this.userService.login(body.username, body.password, res);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
      required: ['refreshToken'],
    },
  })
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }, @Res() res: Response) {
    return await this.userService.refreshToken(body.refreshToken, res);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    const userId = req.user.id;
    return await this.userService.logout(userId, res);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
      required: ['oldPassword', 'newPassword'],
    },
  })
  @Post('change-password')
  async changePassword(
    @Body() { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.userService.changePassword(userId, oldPassword, newPassword);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}

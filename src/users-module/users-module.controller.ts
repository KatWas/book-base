import { UsersModuleService } from './users-module.service';
import { Controller, Get } from '@nestjs/common';
import { Param, UseGuards, Delete } from '@nestjs/common/decorators';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { AdminAuthGuard } from 'src/auth-module/admin-auth.guard';
import { JwtAuthGuard } from 'src/auth-module/jwt-auth.guard';

@Controller('users-module')
export class UsersModuleController {
  constructor(private userService: UsersModuleService) {}

  @Get('/')
  getAll() {
    return this.userService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.userService.getById(id);
    if (!user) throw new Error('User not found');
    return user;
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.userService.getById(id)))
      throw new Error('User not found');
    await this.userService.deleteById(id);
    return { success: true };
  }
}
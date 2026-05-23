const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'Students', plural: 'students', singular: 'student', fields: ['studentCode', 'fullName', 'citizenId', 'groupId'], hasSoftDelete: true },
  { name: 'Groups', plural: 'groups', singular: 'group', fields: ['name', 'advisor', 'degreeId', 'departmentId'], hasSoftDelete: true },
  { name: 'Departments', plural: 'departments', singular: 'department', fields: ['departmentName'], hasSoftDelete: true },
  { name: 'Degrees', plural: 'degrees', singular: 'degree', fields: ['degreeName'], hasSoftDelete: true },
  { name: 'Cakes', plural: 'cakes', singular: 'cake', fields: ['cakeName', 'price', 'pound', 'stock'], hasSoftDelete: true },
];

modules.forEach(mod => {
  const dir = path.join(__dirname, 'src', mod.plural);
  const dtoDir = path.join(dir, 'dto');
  if (!fs.existsSync(dtoDir)) fs.mkdirSync(dtoDir, { recursive: true });

  const isNumeric = (field) => field.endsWith('Id') || field === 'price' || field === 'pound' || field === 'stock';

  // Create DTO
  let createDtoContent = `import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';\nimport { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';\n\nexport class Create${mod.name.slice(0,-1)}Dto {\n`;
  mod.fields.forEach(field => {
    const type = isNumeric(field) ? 'number' : 'string';
    const isOpt = field.endsWith('Id') || field === 'advisor' || field === 'citizenId';
    createDtoContent += `  @ApiProperty${isOpt ? 'Optional' : ''}()\n`;
    if (isOpt) createDtoContent += `  @IsOptional()\n`;
    else createDtoContent += `  @IsNotEmpty()\n`;
    createDtoContent += `  @Is${type === 'number' ? 'Number' : 'String'}()\n`;
    createDtoContent += `  ${field}${isOpt ? '?' : ''}: ${type};\n\n`;
  });
  createDtoContent += `}\n`;
  fs.writeFileSync(path.join(dtoDir, `create-${mod.singular}.dto.ts`), createDtoContent);

  let updateDtoContent = `import { PartialType } from '@nestjs/swagger';\nimport { Create${mod.name.slice(0,-1)}Dto } from './create-${mod.singular}.dto';\n\nexport class Update${mod.name.slice(0,-1)}Dto extends PartialType(Create${mod.name.slice(0,-1)}Dto) {}\n`;
  fs.writeFileSync(path.join(dtoDir, `update-${mod.singular}.dto.ts`), updateDtoContent);

  // Service
  const searchFields = mod.fields.filter(f => !isNumeric(f));
  let serviceContent = `import { Injectable, NotFoundException } from '@nestjs/common';\nimport { PrismaService } from '../prisma/prisma.service';\nimport { Create${mod.name.slice(0,-1)}Dto } from './dto/create-${mod.singular}.dto';\nimport { Update${mod.name.slice(0,-1)}Dto } from './dto/update-${mod.singular}.dto';\nimport { Prisma } from '@prisma/client';\n\n@Injectable()\nexport class ${mod.name}Service {\n  constructor(private prisma: PrismaService) {}\n\n  async create(createDto: Create${mod.name.slice(0,-1)}Dto) {\n    return this.prisma.${mod.singular}.create({ data: createDto as any });\n  }\n\n  async findAll(page: number = 1, limit: number = 10, search?: string) {\n    const skip = (page - 1) * limit;\n    const where: Prisma.${mod.name.slice(0,-1)}WhereInput = {\n      deletedAt: null,\n`;
  if (searchFields.length > 0) {
    serviceContent += `      ...(search && {\n        OR: [\n`;
    searchFields.forEach(f => {
      serviceContent += `          { ${f}: { contains: search, mode: 'insensitive' } },\n`;
    });
    serviceContent += `        ],\n      }),\n`;
  }
  serviceContent += `    };\n\n    const [data, total] = await Promise.all([\n      this.prisma.${mod.singular}.findMany({ where, skip, take: limit }),\n      this.prisma.${mod.singular}.count({ where }),\n    ]);\n\n    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };\n  }\n\n  async findOne(id: number) {\n    const record = await this.prisma.${mod.singular}.findFirst({ where: { id, deletedAt: null } });\n    if (!record) throw new NotFoundException('${mod.name.slice(0,-1)} not found');\n    return record;\n  }\n\n  async update(id: number, updateDto: Update${mod.name.slice(0,-1)}Dto) {\n    await this.findOne(id);\n    return this.prisma.${mod.singular}.update({ where: { id }, data: updateDto as any });\n  }\n\n  async remove(id: number) {\n    await this.findOne(id);\n    return this.prisma.${mod.singular}.update({ where: { id }, data: { deletedAt: new Date() } });\n  }\n}\n`;
  fs.writeFileSync(path.join(dir, `${mod.plural}.service.ts`), serviceContent);

  // Controller
  let controllerContent = `import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';\nimport { ${mod.name}Service } from './${mod.plural}.service';\nimport { Create${mod.name.slice(0,-1)}Dto } from './dto/create-${mod.singular}.dto';\nimport { Update${mod.name.slice(0,-1)}Dto } from './dto/update-${mod.singular}.dto';\nimport { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';\nimport { JwtAuthGuard } from '../common/guards/jwt-auth.guard';\nimport { RolesGuard } from '../common/guards/roles.guard';\nimport { Roles } from '../common/decorators/roles.decorator';\nimport { Role } from '@prisma/client';\n\n@ApiTags('${mod.name}')\n@ApiBearerAuth()\n@UseGuards(JwtAuthGuard, RolesGuard)\n@Controller('${mod.plural}')\nexport class ${mod.name}Controller {\n  constructor(private readonly service: ${mod.name}Service) {}\n\n  @Roles(Role.ADMIN, Role.ADVISOR)\n  @Post()\n  @ApiOperation({ summary: 'Create ${mod.singular}' })\n  create(@Body() createDto: Create${mod.name.slice(0,-1)}Dto) {\n    return this.service.create(createDto);\n  }\n\n  @Get()\n  @ApiOperation({ summary: 'Get all ${mod.plural}' })\n  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {\n    const result = await this.service.findAll(+(page || 1), +(limit || 10), search);\n    return { success: true, ...result };\n  }\n\n  @Get(':id')\n  @ApiOperation({ summary: 'Get ${mod.singular} by id' })\n  async findOne(@Param('id', ParseIntPipe) id: number) {\n    const data = await this.service.findOne(id);\n    return { success: true, data };\n  }\n\n  @Roles(Role.ADMIN, Role.ADVISOR)\n  @Patch(':id')\n  @ApiOperation({ summary: 'Update ${mod.singular}' })\n  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: Update${mod.name.slice(0,-1)}Dto) {\n    const data = await this.service.update(id, updateDto);\n    return { success: true, data };\n  }\n\n  @Roles(Role.ADMIN)\n  @Delete(':id')\n  @ApiOperation({ summary: 'Delete ${mod.singular}' })\n  async remove(@Param('id', ParseIntPipe) id: number) {\n    await this.service.remove(id);\n    return { success: true, message: '${mod.name.slice(0,-1)} deleted' };\n  }\n}\n`;
  fs.writeFileSync(path.join(dir, `${mod.plural}.controller.ts`), controllerContent);
});

console.log('CRUD generation complete.');

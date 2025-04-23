"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("./entities/usuario.entity");
let UsuariosService = class UsuariosService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async create(createUsuarioDto) {
        try {
            const usuario = this.usuarioRepository.create(createUsuarioDto);
            return await this.usuarioRepository.save(usuario);
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                // Código de error específico de MySQL para entradas duplicadas
                throw new common_1.ConflictException('El correo electrónico ya está en uso');
            }
            throw error; // Lanza otros errores no manejados
        }
    }
    async findAll() {
        return this.usuarioRepository.find();
    }
    async findOne(id) {
        const usuario = await this.usuarioRepository.findOneBy({ id });
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
        }
        return usuario;
    }
    async update(id, updateUsuarioDto) {
        await this.usuarioRepository.update(id, updateUsuarioDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.usuarioRepository.delete(id);
    }
};
UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.UsuarioEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuariosService);
exports.UsuariosService = UsuariosService;

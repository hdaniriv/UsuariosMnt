"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalPostInterceptor = void 0;
const common_1 = require("@nestjs/common");
let GlobalPostInterceptor = class GlobalPostInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        // Verifica si el método HTTP es POST
        if (request.method === 'POST') {
            const response = context.switchToHttp().getResponse();
            response.status(common_1.HttpStatus.CREATED); // Establece el código de estado 201
        }
        return next.handle();
    }
};
GlobalPostInterceptor = __decorate([
    (0, common_1.Injectable)()
], GlobalPostInterceptor);
exports.GlobalPostInterceptor = GlobalPostInterceptor;

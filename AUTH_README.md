# 🔐 Sistema de Autenticación - UserMnt

## 📋 Configuración Inicial

### 🚀 Crear el Primer Usuario Administrador

Como medida de seguridad, el registro público solo permite crear usuarios con rol `invitado`. Para crear el primer administrador debes hacerlo manualmente en la base de datos.

### 🛠️ Pasos para crear el primer admin:

#### 1. Generar credenciales y SQL
```bash
# Con datos por defecto
npm run generate-admin

# Con datos personalizados
npm run generate-admin -- --email admin@miapp.com --password MiClave123! --name "Mi Admin"
```

#### 2. Conectar a la base de datos
Usa tu cliente MySQL favorito (Workbench, phpMyAdmin, CLI, etc.)

#### 3. Ejecutar el SQL generado
El script te dará exactamente las consultas SQL que necesitas ejecutar.

#### 4. Verificar la creación
```sql
SELECT u.id, u.name, u.email, r.nombre as rol
FROM usuarios u
JOIN usuario_roles ur ON u.id = ur.usuario_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'tu-email@admin.com';
```

#### 5. Probar el login
1. Inicia la app: `npm run start:dev`
2. Ve a Swagger: http://localhost:3000/api
3. Usa `POST /auth/login` con las credenciales generadas
4. Copia el token y úsalo en "Authorize"

## 🎯 Sistema de Roles

### Roles disponibles:
- **admin**: Control total del sistema
- **moderador**: Permisos de gestión limitados  
- **usuario**: Usuario estándar
- **invitado**: Permisos mínimos (solo lectura)

### Restricciones:
- ✅ **Registro público**: Solo permite rol `invitado`
- 🔒 **Crear admins/moderadores**: Solo via `/usuarios` con token de admin
- 🛡️ **Todas las rutas protegidas**: Requieren autenticación JWT

## 🔧 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registro público (solo invitados)
- `POST /auth/login` - Iniciar sesión
- `GET /auth/profile` - Ver perfil del usuario actual
- `PUT /auth/change-password` - Cambiar contraseña

### Gestión de Usuarios (Solo Admins)
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Crear usuario con cualquier rol
- `PUT /usuarios/:id` - Actualizar usuario  
- `DELETE /usuarios/:id` - Eliminar usuario

## 🔐 Seguridad Implementada

- ✅ **JWT Tokens**: Autenticación stateless
- ✅ **Contraseñas encriptadas**: bcrypt con salt 12
- ✅ **Emails únicos**: No duplicados en BD
- ✅ **Roles y permisos**: Control granular de acceso
- ✅ **Soft delete**: Los usuarios se marcan como inactivos
- ✅ **Validación de DTOs**: Entrada sanitizada
- ✅ **Guards personalizados**: Protección por roles

## ⚠️ Notas Importantes

1. **Solo un admin puede crear otros admins**
2. **El primer admin DEBE crearse manualmente en BD**
3. **Guarda las credenciales del primer admin de forma segura**
4. **Cambia la contraseña por defecto después del primer login**
5. **El registro público está limitado a invitados por seguridad**

## 🎛️ Variables de Entorno

Asegúrate de tener estas variables en tu `.env.development`:

```env
JWT_SECRET=tu-jwt-secret-super-seguro-de-al-menos-32-caracteres
JWT_EXPIRES_IN=1d
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-password
DB_DATABASE=usermnt
```
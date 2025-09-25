const bcrypt = require('bcrypt');

async function generateAdmin(email = 'admin@usermnt.com', password = 'Admin123!', name = 'Super Administrador') {
  try {
    console.log('🔐 Generando hash de contraseña...');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 USUARIO ADMINISTRADOR GENERADO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Nombre: ${name}`);
    console.log(`🔑 Contraseña: ${password}`);
    console.log(`🔐 Hash: ${hashedPassword}`);
    console.log('\n📋 PASOS A SEGUIR:');
    console.log('1. Conéctate a tu base de datos MySQL');
    console.log('2. Ejecuta las siguientes consultas SQL:');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SQL PARA EJECUTAR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n-- 1. Insertar usuario administrador');
    console.log(`INSERT INTO usuarios (name, email, password, activo, createdAt, updatedAt)`);
    console.log(`VALUES ('${name}', '${email}', '${hashedPassword}', 1, NOW(), NOW());`);
    console.log('\n-- 2. Asignar rol de administrador');
    console.log(`INSERT INTO usuario_roles (usuario_id, role_id)`);
    console.log(`SELECT u.id, r.id`);
    console.log(`FROM usuarios u, roles r`);
    console.log(`WHERE u.email = '${email}' AND r.nombre = 'admin';`);
    console.log('\n-- 3. Verificar que se creó correctamente');
    console.log(`SELECT u.id, u.name, u.email, r.nombre as rol`);
    console.log(`FROM usuarios u`);
    console.log(`JOIN usuario_roles ur ON u.id = ur.usuario_id`);
    console.log(`JOIN roles r ON ur.role_id = r.id`);
    console.log(`WHERE u.email = '${email}';`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 DESPUÉS DE INSERTAR EN LA BD:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Inicia la aplicación: npm run start:dev');
    console.log('2. Ve a Swagger: http://localhost:3000/api');
    console.log('3. Usa POST /auth/login con estas credenciales');
    console.log('4. Copia el token y usa "Authorize" en Swagger');
    console.log('5. Ya puedes crear otros usuarios via POST /usuarios');
    console.log('\n⚠️  IMPORTANTE:');
    console.log('• Cambia la contraseña después del primer login');
    console.log('• Guarda estas credenciales de forma segura');
    console.log('• El registro público solo permite usuarios invitados');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error generando administrador:', error.message);
  }
}

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);
let email, password, name;

// Parsear argumentos simples
for (let i = 0; i < args.length; i += 2) {
  const key = args[i];
  const value = args[i + 1];
  
  if (key === '--email') email = value;
  if (key === '--password') password = value;
  if (key === '--name') name = value;
}

// Ejecutar
generateAdmin(email, password, name);
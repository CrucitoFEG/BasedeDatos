# Sistema de Autenticación - Confecciones Global

## Características Implementadas

✅ **Pantalla de Login** con diseño profesional
✅ **Autenticación con base de datos** Oracle
✅ **Protección de rutas** - requiere inicio de sesión
✅ **Menú visible solo** cuando hay sesión activa
✅ **Dropdown de usuario** con opción de cerrar sesión
✅ **Persistencia de sesión** usando localStorage
✅ **Validación contra** tabla `usuario_portal`

## Usuarios de Prueba

Según los datos en tu base de datos:

### Empleados:
- **Usuario:** `cperez` | **Contraseña:** `1234`
  - Nombre: Carlos Pérez - Gerente Producción

- **Usuario:** `mgarcia` | **Contraseña:** `pass123`
  - Nombre: María García - Supervisora

- **Usuario:** `pmartinez` | **Contraseña:** `secure456`
  - Nombre: Pedro Martínez - Gerente General

- **Usuario:** `lflores` | **Contraseña:** `clave789`
  - Nombre: Laura Flores - Jefa Logística

### Clientes:
- **Usuario:** `tienda_estilo` | **Contraseña:** `abcd`
  - Cliente: Tiendas Estilo

- **Usuario:** `boutique_elegancia` | **Contraseña:** `pass001`
  - Cliente: Boutique Elegancia

- **Usuario:** `fashion_usa` | **Contraseña:** `pass002`
  - Cliente: Fashion World USA

- **Usuario:** `distribuidora_central` | **Contraseña:** `pass003`
  - Cliente: Distribuidora Central

- **Usuario:** `moda_express` | **Contraseña:** `pass004`
  - Cliente: Moda Express

## Flujo de Autenticación

1. **Usuario accede a la aplicación** → Redirigido a `/login`
2. **Ingresa credenciales** → Se valida contra la base de datos
3. **Si es válido:**
   - Se guarda la información en `localStorage`
   - Se muestra el menú de navegación
   - Se muestra el nombre de usuario en el navbar
   - Puede acceder a todas las rutas protegidas
4. **Cerrar sesión:**
   - Click en el dropdown del usuario
   - Seleccionar "Cerrar Sesión"
   - Se limpia `localStorage` y vuelve al login

## Estructura de Archivos Nuevos/Modificados

```
frontend/src/
├── components/
│   └── Login.js                    # ✨ NUEVO - Componente de login
└── App.js                          # ✏️ MODIFICADO - Gestión de autenticación

backend/
├── controllers/
│   └── authController.js           # ✨ NUEVO - Lógica de autenticación
├── routes/
│   └── authRoutes.js               # ✨ NUEVO - Rutas de auth
└── server.js                       # ✏️ MODIFICADO - Incluye rutas auth
```

## Endpoints de API

### POST `/api/auth/login`
Autenticación de usuario

**Request:**
```json
{
  "usuario": "cperez",
  "clave": "1234"
}
```

**Response (Éxito):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "usuario": "cperez",
    "tipo": "Empleado",
    "nombre": "Carlos Pérez",
    "puesto": "Gerente Producción",
    "isEmpleado": true,
    "isCliente": false
  }
}
```

**Response (Error):**
```json
{
  "error": "Usuario o contraseña incorrectos"
}
```

### POST `/api/auth/logout`
Cerrar sesión (limpia información del servidor si se usa JWT)

### POST `/api/auth/verify`
Verificar validez de una sesión

## Cómo Probar

1. **Asegúrate de que el backend esté corriendo:**
   ```bash
   cd backend
   node server.js
   ```

2. **Asegúrate de que el frontend esté corriendo:**
   ```bash
   cd frontend
   npm start
   ```

3. **Abre el navegador:** `http://localhost:3000`

4. **Deberías ver la pantalla de login**

5. **Intenta iniciar sesión con cualquiera de los usuarios de prueba**

6. **Una vez dentro, verás:**
   - El menú de navegación completo
   - Tu nombre de usuario en la esquina superior derecha
   - Un dropdown con la opción de cerrar sesión

## Mejoras Futuras Sugeridas

- 🔐 Implementar JWT (JSON Web Tokens) en lugar de localStorage
- 🔒 Encriptar contraseñas con bcrypt
- ⏱️ Expiración automática de sesión después de inactividad
- 👤 Roles y permisos por usuario (admin, operador, cliente)
- 📱 Recuperación de contraseña
- 🔔 Notificaciones de inicio de sesión
- 📊 Registro de actividad de usuarios (audit log)

## Seguridad

⚠️ **IMPORTANTE:** Este sistema usa contraseñas en texto plano en la base de datos. Para producción, se debe:

1. Hashear contraseñas con bcrypt o similar
2. Implementar JWT para manejo de tokens
3. Usar HTTPS en producción
4. Implementar rate limiting para prevenir ataques de fuerza bruta
5. Validar y sanitizar todas las entradas

## Soporte

Para cualquier duda o problema, revisa:
- Los logs del backend en la consola
- Los logs del navegador (F12 → Console)
- Verifica que la base de datos esté corriendo
- Verifica las credenciales en la tabla `usuario_portal`

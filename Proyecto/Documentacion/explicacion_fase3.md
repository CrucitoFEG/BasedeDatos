# Documentación - Fase 3

Fecha: 23-Oct-2025

Resumen
------
Este documento describe el alcance, la arquitectura, la estructura del repositorio, las tecnologías utilizadas, las APIs disponibles, instrucciones para ejecutar el proyecto localmente y pasos recomendados para continuidad y mejoras (Fase 4).

1. Alcance de la Fase 3
----------------------
Esta fase entrega una aplicación web full-stack que permite la gestión de pedidos, su detalle, catálogos asociados y vistas de información empresarial. Las principales funcionalidades implementadas son:

- Gestión de Pedidos (encabezado):
  - Crear un pedido con campos requeridos como fecha, cliente, localidad, ciudad, tipo de pedido/estado.
  - Visualizar lista de pedidos (incluye vistas como pedidos pendientes).
  - Mapear IDs (cliente, estado) a nombres legibles en las listas.

- Gestión de Detalles de Pedido (líneas):
  - Añadir líneas de detalle a un pedido existente (codigo_articulo + cantidad_solicitada).
  - Interfaz de entrada de detalle como un modal que lista las líneas y permite agregar nuevas.
  - Selección de artículo mediante dropdown cargado desde catálogo de artículos.
  - Eliminación de campo `cantidad_despachada` de la interfaz de creación (solo se captura `cantidad_solicitada`).

- Catálogos y referencia:
  - Endpoints para catálogos (terceros/clientes, localidades/ciudades, tipos/estados, artículos).
  - Soporte para filtrar tipos por campo (por ejemplo `campo=ESTADO_DESPACHO`).

- Autenticación y permisos básicos:
  - Endpoints y componentes para login/autenticación (controller y rutas ya existentes en el backend y consumidos por el frontend).

- UX y Estética:
  - Componentes front-end actualizados para usar una estética y layout coherentes (basado en la plantilla `Inicio.js`): tarjetas, contenedores, botones primarios, espaciado consistente.
  - Botones "Ver detalle" como botones primarios (no enlaces), y modal para gestión de detalles.

- Robustez y correcciones:
  - Manejo de conversiones necesarias para evitar errores de base de datos (cast de números, formateo de fechas antes de enviar al backend).
  - Ajustes backend en `detallePedidoController.getAll` para permitir filtrar por `codigo_pedido`.
  - Nuevo endpoint `GET /api/catalog/articulos` (controller y ruta) para poblar dropdowns.

2. Estructura del repositorio
-----------------------------
Raíz del repositorio (carpetas clave):

- `Laboratorios/` - Materiales del curso y ejercicios.
- `Proyecto/` - Carpeta del proyecto principal.
  - `Documentacion/` - Documentos (credenciales.txt, explicacion.md, Fase 1.drawio, `explicacion_fase3.md` - este archivo).
  - `SQL/` - Scripts y modelo DB (`modelo.dbml`, `sql.sql`).
  - `WebApp/` - Aplicación web (frontend + backend).
    - `backend/` - Servidor Node/Express.
      - `server.js` - Punto de entrada Express.
      - `db.js` - Módulo de conexión a OracleDB.
      - `package.json` - Dependencias y scripts del backend.
      - `controllers/` - Controladores para recursos (pedidoController.js, detallePedidoController.js, authController.js, catalogController.js, articuloController.js, etc.).
      - `routes/` - Rutas que exponen cada recurso (pedidoRoutes.js, detallePedidoRoutes.js, catalogRoutes.js, authRoutes.js, etc.).
      - `test_get_articulos.js` - Script de prueba rápido (consulta artículos).
    - `frontend/` - Aplicación React (create-react-app).
      - `package.json` - Dependencias y scripts del frontend.
      - `src/` - Código fuente React.
        - `components/` - Componentes React (Inicio.js, Login.js, PedidoForm.js, PedidoList.js, DetallePedidoForm.js, PedidoDetalleModal.js, VistaPedidosPendientes.js, etc.).
        - `assets/`, `public/`, `build/` - Archivos estáticos y compilados.

3. Tecnologías y dependencias
----------------------------
Frontend
- React (create-react-app / react-scripts)
- react-bootstrap (componentes visuales)
- axios (consumo HTTP)
- Node/npm para build y ejecución local

Backend
- Node.js + Express
- oracledb (driver para Oracle Database)
- dotenv (posible uso para variables de entorno)

Base de datos
- Oracle Database (esquema y scripts SQL en `SQL/sql.sql`)

Archivos de configuración
- `frontend/package.json` y `backend/package.json` contienen las dependencias y scripts relevantes.

4. API - Endpoints principales
------------------------------
A continuación se listan los endpoints más importantes que forman parte de Fase 3. Los paths usan el prefijo `/api`.

Catálogos
- GET /api/catalog/terceros
  - Descripción: devuelve clientes/terceros.
- GET /api/catalog/localidades
  - Descripción: devuelve localidades/ciudades.
- GET /api/catalog/tipos?campo=ESTADO_DESPACHO
  - Descripción: devuelve filas de tipo filtradas por el campo (por ejemplo, estados de despacho).
- GET /api/catalog/articulos
  - Descripción: (nuevo) devuelve lista de artículos con campos `CODIGO_ARTICULO`, `NOMBRE`.

Pedidos
- GET /api/pedidos
  - Parámetros: opcionales para filtros/paginación
  - Respuesta: lista de pedidos (encabezados) con campos principales.
- POST /api/pedidos
  - Payload: objeto con campos necesarios (fecha, codigo_cliente, codigo_localidad, tipo, etc.).
  - Respuesta: id del pedido creado u objeto creado.

Detalles de pedido
- GET /api/detalles[?codigo_pedido=ID]
  - Descripción: devuelve líneas de detalle; si se recibe `codigo_pedido` en query, devuelve solo las líneas de ese pedido.
- POST /api/detalles
  - Payload: { codigo_pedido, codigo_articulo, cantidad_solicitada }
  - Respuesta: detalle creado.

Autenticación
- POST /api/auth/login
  - Payload: { username, password }
  - Respuesta: token/session (según implementación del proyecto).

5. Formatos de datos y shapes
-----------------------------
- Pedido (encabezado) - request/response ejemplo:
  {
    "fecha": "2025-10-23T00:00:00.000Z",
    "codigo_cliente": 12,
    "codigo_localidad": 5,
    "tipo": 3
  }

- Detalle de pedido - request ejemplo:
  {
    "codigo_pedido": 42,
    "codigo_articulo": 2,
    "cantidad_solicitada": 10
  }

- Respuestas de catálogo (artículos) - ejemplo:
  [
    { "CODIGO_ARTICULO": 2, "NOMBRE": "Camisa Hombre" },
    { "CODIGO_ARTICULO": 1, "NOMBRE": "Tela algodón" }
  ]

6. Cómo ejecutar el proyecto (desarrollo local)
------------------------------------------------
Precondiciones
- Tener Node.js instalado (versión LTS recomendada).
- Acceso a la base de datos Oracle (credenciales disponibles en `Proyecto/Documentacion/credenciales.txt`).

Levantar backend

1. Ir a la carpeta `Proyecto/WebApp/backend`.
2. Instalar dependencias (si aún no están instaladas):

```bash
cd Proyecto/WebApp/backend
npm install
```

3. Establecer variables de entorno si aplica (por ejemplo, conexión a Oracle en `.env` o variables de entorno del sistema).

4. Iniciar el servidor:

```bash
node server.js
# o si package.json tiene script start
npm start
```

5. Verificar que el endpoint de artículos responde:

```bash
curl -i http://localhost:3001/api/catalog/articulos
```

Levantar frontend

1. Ir a `Proyecto/WebApp/frontend`.
2. Instalar dependencias (si hace falta):

```bash
cd Proyecto/WebApp/frontend
npm install
```

3. Iniciar el servidor de desarrollo:

```bash
npm start
```

4. Compilar para producción:

```bash
npm run build
```

7. Verificación rápida (smoke tests)
-----------------------------------
- Verificar catálogo de artículos:
  - `curl http://localhost:3001/api/catalog/articulos` debería devolver array JSON.
- Crear pedido (POST /api/pedidos) con payload válido y confirmar que devuelve id.
- Abrir aplicación frontend en el navegador (http://localhost:3000 por defecto) y probar flujo: crear pedido → modal agregar detalle → ver detalle listado.

8. Errores comunes y soluciones
-------------------------------
- ORA-01400 (cannot insert NULL):
  - Causa: campos requeridos (p. ej. codigo_cliente) enviados como null/undefined desde frontend. Solución: validar en frontend y convertir a Number antes de POST.

- ORA-01861 (literal incompatible con formato esperado):
  - Causa: formato de fecha enviado en un string inesperado. Solución: enviar ISO date o convertir en backend antes de ejecutar la consulta.

- Rutas 404 después de deploy/tunnel:
  - Causa: servidor backend no reiniciado o el túnel público apunta a una instancia antigua. Solución: reiniciar servidor y asegurar que el túnel está conectado al proceso correcto.

9. Calidad de código y recomendaciones
-------------------------------------
- Lint y warnings actuales:
  - La build frontend compila pero muestra advertencias de React Hook dependencies y variables no utilizadas. Recomendación: corregirlos para evitar bugs sutiles.

- Tests:
  - Añadir tests unitarios y de integración para controllers backend y componentes React críticos (PedidoForm, DetallePedidoForm).

- Mejoras funcionales sugeridas:
  - Mover la resolución del nombre de artículo al backend (JOIN) en `GET /api/detalles?codigo_pedido=...` para simplificar el frontend.
  - Añadir endpoints para editar/borrar líneas de detalle.
  - Añadir paginación y filtros en `GET /api/pedidos`.

10. Checklist para la Fase 4
---------------------------
- Corregir warnings ESLint y React Hook dependencies.
- Añadir tests (backend y frontend).
- Mejorar experiencia de usuario (edición y borrado en modal, confirmaciones, validaciones en forms).
- Implementar JOIN en backend para incluir `nombre_articulo` en las respuestas de `GET /api/detalles`.
- Preparar scripts de despliegue y Dockerfile si se requiere contenedorización.

11. Contacto y notas finales
----------------------------
Si quieres, puedo:
- Limpiar las advertencias de ESLint y arreglar los useEffect faltantes.
- Implementar el JOIN en backend para que el frontend reciba `nombre_articulo` directamente.
- Añadir pruebas unitarias / integración para la API de detalles.

---

Documento generado automáticamente por el asistente para ayudarte a consolidar la Fase 3 del proyecto.

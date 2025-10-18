-- PAÍS
CREATE TABLE pais (
  codigo_pais NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL,
  moneda VARCHAR2(20)
);

-- TIPO (Catálogo universal)
CREATE TABLE tipo (
  codigo_tipo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  descripcion1 VARCHAR2(100) NOT NULL,
  descripcion2 VARCHAR2(100),
  campo VARCHAR2(50) NOT NULL
);

-- EMPRESA
CREATE TABLE empresa (
  codigo_empresa NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_pais NUMBER NOT NULL REFERENCES pais(codigo_pais),
  nombre VARCHAR2(150) NOT NULL,
  identificador_fiscal VARCHAR2(50),
  tipo_empresa NUMBER NOT NULL REFERENCES tipo(codigo_tipo)
);

-- LOCALIDAD
CREATE TABLE localidad (
  codigo_localidad NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_empresa NUMBER NOT NULL REFERENCES empresa(codigo_empresa),
  nombre VARCHAR2(150),
  tipo_localidad NUMBER NOT NULL REFERENCES tipo(codigo_tipo),
  direccion VARCHAR2(200)
);

-- TERCEROS
CREATE TABLE terceros (
  codigo_tercero NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_pais NUMBER NOT NULL REFERENCES pais(codigo_pais),
  nombre VARCHAR2(150),
  tipo_tercero NUMBER NOT NULL REFERENCES tipo(codigo_tipo),
  telefono VARCHAR2(30),
  direccion VARCHAR2(200),
  cuenta_bancaria VARCHAR2(50),
  codigo_cliente_aprobador NUMBER REFERENCES terceros(codigo_tercero)
);

-- EMPLEADO
CREATE TABLE empleado (
  codigo_empleado NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_empresa NUMBER NOT NULL REFERENCES empresa(codigo_empresa),
  codigo_localidad NUMBER REFERENCES localidad(codigo_localidad),
  nombre VARCHAR2(100),
  puesto VARCHAR2(50),
  salario_base NUMBER(12,2),
  fecha_ingreso DATE,
  es_aprobador CHAR(1) DEFAULT 'N'
);

-- USUARIO_PORTAL
CREATE TABLE usuario_portal (
  codigo_usuario_portal NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_empleado NUMBER REFERENCES empleado(codigo_empleado),
  codigo_tercero NUMBER REFERENCES terceros(codigo_tercero),
  usuario VARCHAR2(50) UNIQUE NOT NULL,
  clave VARCHAR2(100) NOT NULL,
  tipo_usuario NUMBER NOT NULL REFERENCES tipo(codigo_tipo),
  estado NUMBER NOT NULL REFERENCES tipo(codigo_tipo)
);

-- ARTICULO
CREATE TABLE articulo (
  codigo_articulo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre VARCHAR2(100),
  tipo_articulo NUMBER NOT NULL REFERENCES tipo(codigo_tipo),
  unidad_medida VARCHAR2(20),
  precio_referencia NUMBER(12,2)
);

-- INVENTARIO
CREATE TABLE inventario (
  codigo_inventario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_localidad NUMBER NOT NULL REFERENCES localidad(codigo_localidad),
  codigo_articulo NUMBER NOT NULL REFERENCES articulo(codigo_articulo),
  cantidad_actual NUMBER(12,2),
  cantidad_reservada NUMBER(12,2)
);

-- ACTIVO_FIJO
CREATE TABLE activo_fijo (
  codigo_activo_fijo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_empresa NUMBER NOT NULL REFERENCES empresa(codigo_empresa),
  codigo_localidad NUMBER NOT NULL REFERENCES localidad(codigo_localidad),
  descripcion VARCHAR2(200),
  valor_compra NUMBER(12,2),
  fecha_compra DATE,
  depreciacion NUMBER(12,2)
);

-- PEDIDO
CREATE TABLE pedido (
  codigo_pedido NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_cliente NUMBER NOT NULL REFERENCES terceros(codigo_tercero),
  fecha_pedido DATE,
  fecha_requerida DATE,
  estado NUMBER NOT NULL REFERENCES tipo(codigo_tipo),
  origen VARCHAR2(30)
);

-- DETALLE_PEDIDO
CREATE TABLE detalle_pedido (
  codigo_detalle_pedido NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_pedido NUMBER NOT NULL REFERENCES pedido(codigo_pedido),
  codigo_articulo NUMBER NOT NULL REFERENCES articulo(codigo_articulo),
  cantidad_solicitada NUMBER(12,2),
  cantidad_despachada NUMBER(12,2)
);

-- APROBACION
CREATE TABLE aprobacion (
  codigo_aprobacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_pedido NUMBER NOT NULL REFERENCES pedido(codigo_pedido),
  codigo_empleado NUMBER NOT NULL REFERENCES empleado(codigo_empleado),
  fecha DATE,
  resultado NUMBER NOT NULL REFERENCES tipo(codigo_tipo),
  comentarios VARCHAR2(200)
);

-- PLANILLA
CREATE TABLE planilla (
  codigo_planilla NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_empresa NUMBER NOT NULL REFERENCES empresa(codigo_empresa),
  codigo_empleado NUMBER NOT NULL REFERENCES empleado(codigo_empleado),
  salario_bruto NUMBER(12,2),
  descuentos NUMBER(12,2),
  salario_neto NUMBER(12,2),
  fecha_pago DATE,
  periodo_semanal_quincenal_mensual VARCHAR2(20)
);

-- ORDEN_PRODUCCION
CREATE TABLE orden_produccion (
  codigo_orden_produccion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_producto_terminado NUMBER NOT NULL REFERENCES articulo(codigo_articulo),
  codigo_materia_prima NUMBER NOT NULL REFERENCES articulo(codigo_articulo),
  codigo_localidad NUMBER NOT NULL REFERENCES localidad(codigo_localidad),
  codigo_pedido NUMBER NOT NULL REFERENCES pedido(codigo_pedido),
  fecha_inicio DATE,
  fecha_estimada DATE,
  fecha_real DATE,
  estado NUMBER NOT NULL REFERENCES tipo(codigo_tipo)
);

-- DESPACHO
CREATE TABLE despacho (
  codigo_despacho NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_pedido NUMBER NOT NULL REFERENCES pedido(codigo_pedido),
  codigo_localidad_origen NUMBER NOT NULL REFERENCES localidad(codigo_localidad),
  codigo_localidad_destino NUMBER NOT NULL REFERENCES localidad(codigo_localidad),
  fecha_envio DATE,
  fecha_estimada DATE,
  fecha_real DATE,
  estado NUMBER NOT NULL REFERENCES tipo(codigo_tipo)
);

-- RUTA
CREATE TABLE ruta (
  codigo_ruta NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  codigo_localidad_origen NUMBER NOT NULL REFERENCES localidad(codigo_localidad),
  codigo_localidad_destino NUMBER NOT NULL REFERENCES localidad(codigo_localidad),
  tiempo_horas NUMBER,
  costo_transporte NUMBER(12,2),
  tipo_transporte NUMBER NOT NULL REFERENCES tipo(codigo_tipo)
);

-- MOVIMIENTO
CREATE TABLE movimiento (
  codigo_movimiento NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tipo_movimiento NUMBER NOT NULL REFERENCES tipo(codigo_tipo),
  codigo_articulo NUMBER NOT NULL REFERENCES articulo(codigo_articulo),
  codigo_localidad_origen NUMBER REFERENCES localidad(codigo_localidad),
  codigo_localidad_destino NUMBER REFERENCES localidad(codigo_localidad),
  codigo_pedido NUMBER REFERENCES pedido(codigo_pedido),
  codigo_planilla NUMBER REFERENCES planilla(codigo_planilla),
  fecha DATE,
  monto NUMBER(12,2),
  cantidad NUMBER(12,2)
);

-- Insert

-- 1. PAISES 
 
INSERT INTO pais (nombre, moneda) VALUES ('Guatemala', 'GTQ'); 
INSERT INTO pais (nombre, moneda) VALUES ('México', 'MXN'); 
INSERT INTO pais (nombre, moneda) VALUES ('USA', 'USD'); 
 
 
-- 2. TIPOS (catálogo universal) 
 
-- Tipos de empresa 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_EMPRESA','Matriz'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_EMPRESA','Filial'); 
 
-- Tipos de localidad 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_LOCALIDAD','Fábrica'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_LOCALIDAD','Bodega'); 
 
-- Tipos de transporte 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_TRANSPORTE','Terrestre'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_TRANSPORTE','Marítimo'); 
 
-- Estados de despacho 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_DESPACHO','Pendiente'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_DESPACHO','En tránsito'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_DESPACHO','Entregado'); 
 
-- Resultado de aprobación 
INSERT INTO tipo (campo, descripcion1) VALUES 
('RESULTADO_APROBACION','Aprobado'); 
INSERT INTO tipo (campo, descripcion1) VALUES 
('RESULTADO_APROBACION','Rechazado'); 
 
-- Tipos de artículo 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_ARTICULO','Materia Prima'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_ARTICULO','Producto 
Terminado'); 
 
-- Unidades de medida 
INSERT INTO tipo (campo, descripcion1) VALUES ('UNIDAD_MEDIDA','Metro'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('UNIDAD_MEDIDA','Kilogramo'); 
 
-- Estados de usuario 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_USUARIO','Activo'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_USUARIO','Inactivo'); 
 
-- Tipos de usuario 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_USUARIO','Empleado'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_USUARIO','Cliente'); 

-- Tipos de movimiento 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_MOVIMIENTO','Compra 
MP'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_MOVIMIENTO','Venta 
Producto'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_MOVIMIENTO','Pago 
Nómina'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('TIPO_MOVIMIENTO','Efectivo 
Ingreso'); 
 
 
-- 3. EMPRESAS 
 
INSERT INTO empresa (codigo_pais, nombre, identificador_fiscal, tipo_empresa) 
VALUES (1, 'Confecciones Global S.A.', 'CGT-12345', 1); 
 
INSERT INTO empresa (codigo_pais, nombre, identificador_fiscal, tipo_empresa) 
VALUES (2, 'Confecciones México', 'CMX-98765', 2); 
 
 
-- 4. LOCALIDADES 
 
INSERT INTO localidad (codigo_empresa, nombre, tipo_localidad, direccion) 
VALUES (1, 'Fábrica Central', 3, 'Zona 4, Ciudad de Guatemala'); 
 
INSERT INTO localidad (codigo_empresa, nombre, tipo_localidad, direccion) 
VALUES (1, 'Bodega Central', 4, 'Zona 12, Ciudad de Guatemala'); 
 
INSERT INTO localidad (codigo_empresa, nombre, tipo_localidad, direccion) 
VALUES (2, 'Fábrica CDMX', 3, 'Parque Industrial, CDMX'); 
 
 
-- 5. TERCEROS 
 
INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, 
cuenta_bancaria) 
VALUES (1, 'Textiles Maya', 1, '502-5555-1111', 'Mixco, Guatemala', 'GT12345'); 
 
INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, 
cuenta_bancaria) 
VALUES (1, 'Tiendas Estilo', 1, '502-5555-2222', 'Zona 1, Guatemala', 'GT67890'); 
 
INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, 
cuenta_bancaria) 
VALUES (2, 'Algodones Premium', 1, '55-5555-3333', 'CDMX, México', 'MX54321'); 
 
 
-- 6. EMPLEADOS 
 INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, 
fecha_ingreso, es_aprobador) 
VALUES (1, 1, 'Carlos Pérez', 'Gerente Producción', 8000, DATE '2022-01-10', 'Y'); 
 
INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, 
fecha_ingreso) 
VALUES (1, 2, 'Ana López', 'Operaria', 3500, DATE '2023-06-15'); 
 
 
-- 7. USUARIOS DEL PORTAL 
 
INSERT INTO usuario_portal (codigo_empleado, usuario, clave, tipo_usuario, estado) 
VALUES (1, 'cperez', '1234', 23, 21);  -- tipo_usuario=Empleado, estado=Activo 
 
INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (2, 'tienda_estilo', 'abcd', 24, 21); -- cliente activo

-- Más usuarios del portal
INSERT INTO usuario_portal (codigo_empleado, usuario, clave, tipo_usuario, estado) 
VALUES (3, 'mgarcia', 'pass123', 23, 21);

INSERT INTO usuario_portal (codigo_empleado, usuario, clave, tipo_usuario, estado) 
VALUES (6, 'pmartinez', 'secure456', 23, 21);

INSERT INTO usuario_portal (codigo_empleado, usuario, clave, tipo_usuario, estado) 
VALUES (9, 'lflores', 'clave789', 23, 21);

INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (4, 'boutique_elegancia', 'pass001', 24, 21);

INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (5, 'fashion_usa', 'pass002', 24, 21);

INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (7, 'distribuidora_central', 'pass003', 24, 21);

INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (8, 'moda_express', 'pass004', 24, 21); 
 
 
-- 8. ARTÍCULOS 
 
INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Tela algodón', 13, 15, 50.00); 
 
INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Camisa Hombre', 14, 15, 120.00); 
 
 
-- 9. INVENTARIO 
 
INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual) 
VALUES (1, 1, 500);  -- Fábrica Central tiene 500 metros de Tela 
 
INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual) 
VALUES (2, 2, 300);  -- Bodega Central tiene 300 camisas 
 
 
-- 10. PEDIDO Y DETALLE 
 
INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen) 
VALUES (2, SYSDATE, SYSDATE + 10, 7, 'WEB'); 
 
--  Select codigo_pedido from pedido where codigo_cliente=2;
--  select codigo_articulo from articulo where nombre='Camisa Hombre';
--  SELECT descripcion1, campo FROM tipo;

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada) 
VALUES (2, 2, 50); -- Cliente pide 50 camisas 


 
-- 11. APROBACIÓN 
 
INSERT INTO aprobacion (codigo_pedido, codigo_empleado, resultado, comentarios) 
VALUES (2, 1, 19, 'Aprobado por disponibilidad'); 
 
 
-- 12. DESPACHO 
 
INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, 
codigo_localidad_destino, fecha_envio, estado) 
VALUES (2, 2, 2, SYSDATE, 8); -- pendiente de envío 
 
 
-- 13. MOVIMIENTOS 
 
INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, monto, cantidad) 
VALUES (20, 2, 2, 2, 2, 6000.00, 50); -- venta producto 
 
--  SELECT * FROM tipo; 
-- SELECT * FROM articulo;
-- SELECT * FROM localidad;
-- SELECT * FROM pedido;
-- SELECT * FROM movimiento;

 
-- 14. PLANILLA 
 
INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago) 
VALUES (1, 1, 8000, 800, 7200, SYSDATE); 
 
--  SELECT * FROM EMPLEADO;
-- SELECT * FROM EMPRESA;
 
 
-- 15. ACTIVOS FIJOS 
 
INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Máquina de coser industrial', 25000, DATE '2022-05-01', 5000); 
 
 
-- 16. RUTAS 
 
INSERT INTO ruta (codigo_localidad_origen, codigo_localidad_destino, tiempo_horas, 
costo_transporte, tipo_transporte) 
VALUES (1, 2, 5, 1500, 5);  -- terrestre entre fábrica y bodega 


-- ========================================================================
-- DATOS ADICIONALES GENERADOS - EXPANSIÓN DE LA BASE DE DATOS
-- ========================================================================

-- MÁS TIPOS ADICIONALES (Estados de pedido y órdenes de producción)

INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_PEDIDO','Pendiente'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_PEDIDO','Aprobado'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_PEDIDO','En Proceso'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_PEDIDO','Enviado'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_PEDIDO','Entregado'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_PEDIDO','Cancelado');

INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_OP','Planificada'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_OP','En Proceso'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_OP','Completada'); 
INSERT INTO tipo (campo, descripcion1) VALUES ('ESTADO_OP','Cancelada'); 


-- MÁS TERCEROS (Clientes y Proveedores Adicionales)

INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, cuenta_bancaria) 
VALUES (1, 'Boutique Elegancia', 1, '502-5555-4444', 'Zona 10, Guatemala', 'GT11111');

INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, cuenta_bancaria) 
VALUES (3, 'Fashion World USA', 1, '1-555-5555', 'Miami, FL', 'US99999');

INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, cuenta_bancaria) 
VALUES (2, 'Hilos y Telas MX', 1, '55-5555-7777', 'Guadalajara, México', 'MX77777');

INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, cuenta_bancaria) 
VALUES (1, 'Distribuidora Central', 1, '502-5555-8888', 'Zona 12, Guatemala', 'GT88888');

INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, cuenta_bancaria) 
VALUES (1, 'Moda Express', 1, '502-5555-9999', 'Antigua Guatemala', 'GT99999');

INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, cuenta_bancaria) 
VALUES (2, 'Textiles Azteca', 1, '55-5555-6666', 'Monterrey, México', 'MX66666');

INSERT INTO terceros (codigo_pais, nombre, tipo_tercero, telefono, direccion, cuenta_bancaria) 
VALUES (1, 'Botones y Cierres SA', 1, '502-5555-3333', 'Villa Nueva, Guatemala', 'GT33333');


-- MÁS EMPLEADOS

INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, fecha_ingreso, es_aprobador) 
VALUES (1, 1, 'María García', 'Supervisora', 6000, DATE '2021-03-20', 'Y');

INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, fecha_ingreso) 
VALUES (1, 1, 'Juan Ramírez', 'Operario', 3500, DATE '2023-02-10');

INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, fecha_ingreso) 
VALUES (1, 2, 'Luis Mendoza', 'Bodeguero', 4000, DATE '2022-08-15');

INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, fecha_ingreso, es_aprobador) 
VALUES (2, 3, 'Pedro Martínez', 'Gerente General', 10000, DATE '2020-01-05', 'Y');

INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, fecha_ingreso) 
VALUES (2, 3, 'Sofia Hernández', 'Operaria', 4000, DATE '2023-05-01');

INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, fecha_ingreso) 
VALUES (1, 1, 'Roberto Castillo', 'Técnico Mantenimiento', 4500, DATE '2022-11-20');

INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, fecha_ingreso, es_aprobador) 
VALUES (1, 2, 'Laura Flores', 'Jefa Logística', 7000, DATE '2021-07-10', 'Y');

INSERT INTO empleado (codigo_empresa, codigo_localidad, nombre, puesto, salario_base, fecha_ingreso) 
VALUES (1, 2, 'Diego Torres', 'Auxiliar Bodega', 3200, DATE '2024-01-15');


-- MÁS USUARIOS DEL PORTAL

INSERT INTO usuario_portal (codigo_empleado, usuario, clave, tipo_usuario, estado) 
VALUES (3, 'mgarcia', 'pass123', 23, 21);

INSERT INTO usuario_portal (codigo_empleado, usuario, clave, tipo_usuario, estado) 
VALUES (6, 'pmartinez', 'secure456', 23, 21);

INSERT INTO usuario_portal (codigo_empleado, usuario, clave, tipo_usuario, estado) 
VALUES (9, 'lflores', 'clave789', 23, 21);

INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (4, 'boutique_elegancia', 'pass001', 24, 21);

INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (5, 'fashion_usa', 'pass002', 24, 21);

INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (7, 'distribuidora_central', 'pass003', 24, 21);

INSERT INTO usuario_portal (codigo_tercero, usuario, clave, tipo_usuario, estado) 
VALUES (8, 'moda_express', 'pass004', 24, 21);


-- MÁS ARTÍCULOS

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Tela poliéster', 13, 15, 35.00);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Hilo blanco', 13, 15, 8.00);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Botones', 13, 15, 2.50);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Cierres', 13, 15, 3.00);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Camisa Mujer', 14, 15, 115.00);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Pantalón Hombre', 14, 15, 180.00);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Pantalón Mujer', 14, 15, 170.00);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Blusa Casual', 14, 15, 95.00);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Tela denim', 13, 15, 75.00);

INSERT INTO articulo (nombre, tipo_articulo, unidad_medida, precio_referencia) 
VALUES ('Etiquetas', 13, 15, 1.50);


-- MÁS INVENTARIO -- hasta aqui deje de insertar por errores

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual, cantidad_reservada) 
VALUES (1, 3, 750, 50);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual, cantidad_reservada) 
VALUES (1, 4, 1000, 100);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual, cantidad_reservada) 
VALUES (1, 5, 5000, 200);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual, cantidad_reservada) 
VALUES (1, 6, 3000, 150);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual, cantidad_reservada) 
VALUES (2, 7, 250, 50);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual, cantidad_reservada) 
VALUES (2, 8, 180, 30);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual, cantidad_reservada) 
VALUES (2, 9, 200, 40);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual) 
VALUES (2, 10, 150);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual, cantidad_reservada) 
VALUES (1, 11, 600, 80);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual) 
VALUES (1, 12, 8000);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual) 
VALUES (3, 7, 180);

INSERT INTO inventario (codigo_localidad, codigo_articulo, cantidad_actual) 
VALUES (3, 8, 120);


-- MÁS PEDIDOS Y DETALLES

INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen) 
VALUES (4, SYSDATE - 5, SYSDATE + 5, 7, 'WEB');

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (3, 7, 100, 100);

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (3, 2, 75, 75);

INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen) 
VALUES (5, SYSDATE - 3, SYSDATE + 7, 8, 'WEB');

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (4, 8, 50, 30);

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (4, 9, 60, 40);

INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen) 
VALUES (7, SYSDATE - 10, SYSDATE - 2, 9, 'PHONE');

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (5, 2, 200, 200);

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (5, 7, 150, 150);

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (5, 10, 100, 100);

INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen) 
VALUES (8, SYSDATE - 2, SYSDATE + 8, 7, 'WEB');

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada) 
VALUES (6, 8, 80);

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada) 
VALUES (6, 9, 90);

INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen) 
VALUES (2, SYSDATE - 7, SYSDATE + 3, 8, 'WEB');

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (7, 7, 120, 80);

INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen) 
VALUES (4, SYSDATE - 15, SYSDATE - 5, 9, 'EMAIL');

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (8, 2, 300, 300);

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada, cantidad_despachada) 
VALUES (8, 8, 150, 150);

INSERT INTO pedido (codigo_cliente, fecha_pedido, fecha_requerida, estado, origen) 
VALUES (5, SYSDATE, SYSDATE + 12, 7, 'WEB');

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada) 
VALUES (9, 10, 200);

INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada) 
VALUES (9, 7, 180);


-- MÁS APROBACIONES

INSERT INTO aprobacion (codigo_pedido, codigo_empleado, fecha, resultado, comentarios) 
VALUES (3, 1, SYSDATE - 5, 19, 'Aprobado - Stock disponible');

INSERT INTO aprobacion (codigo_pedido, codigo_empleado, fecha, resultado, comentarios) 
VALUES (4, 3, SYSDATE - 3, 19, 'Aprobado - Cliente prioritario');

INSERT INTO aprobacion (codigo_pedido, codigo_empleado, fecha, resultado, comentarios) 
VALUES (5, 1, SYSDATE - 10, 19, 'Aprobado - Pedido grande');

INSERT INTO aprobacion (codigo_pedido, codigo_empleado, fecha, resultado, comentarios) 
VALUES (6, 9, SYSDATE - 2, 19, 'Aprobado - Normal');

INSERT INTO aprobacion (codigo_pedido, codigo_empleado, fecha, resultado, comentarios) 
VALUES (7, 3, SYSDATE - 7, 19, 'Aprobado parcialmente');

INSERT INTO aprobacion (codigo_pedido, codigo_empleado, fecha, resultado, comentarios) 
VALUES (8, 6, SYSDATE - 15, 19, 'Aprobado - Urgente');

INSERT INTO aprobacion (codigo_pedido, codigo_empleado, fecha, resultado, comentarios) 
VALUES (9, 9, SYSDATE, 19, 'Aprobado - En proceso');


-- MÁS DESPACHOS

INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, codigo_localidad_destino, 
fecha_envio, fecha_estimada, fecha_real, estado) 
VALUES (3, 2, 2, SYSDATE - 5, SYSDATE - 3, SYSDATE - 3, 9);

INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, codigo_localidad_destino, 
fecha_envio, fecha_estimada, estado) 
VALUES (4, 2, 2, SYSDATE - 3, SYSDATE + 2, 8);

INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, codigo_localidad_destino, 
fecha_envio, fecha_estimada, fecha_real, estado) 
VALUES (5, 2, 2, SYSDATE - 10, SYSDATE - 5, SYSDATE - 4, 9);

INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, codigo_localidad_destino, 
fecha_envio, estado) 
VALUES (6, 2, 2, SYSDATE - 2, 7);

INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, codigo_localidad_destino, 
fecha_envio, fecha_estimada, estado) 
VALUES (7, 2, 2, SYSDATE - 7, SYSDATE, 8);

INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, codigo_localidad_destino, 
fecha_envio, fecha_estimada, fecha_real, estado) 
VALUES (8, 2, 2, SYSDATE - 15, SYSDATE - 10, SYSDATE - 9, 9);

INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, codigo_localidad_destino, 
fecha_envio, fecha_estimada, estado) 
VALUES (9, 2, 2, SYSDATE, SYSDATE + 5, 7);


-- MÁS MOVIMIENTOS

-- Compras de materia prima
INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_destino, fecha, monto, cantidad) 
VALUES (19, 1, 1, SYSDATE - 30, 25000.00, 500);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_destino, fecha, monto, cantidad) 
VALUES (19, 3, 1, SYSDATE - 28, 26250.00, 750);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_destino, fecha, monto, cantidad) 
VALUES (19, 4, 1, SYSDATE - 25, 8000.00, 1000);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_destino, fecha, monto, cantidad) 
VALUES (19, 11, 1, SYSDATE - 20, 45000.00, 600);

-- Ventas de productos terminados
INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 7, 2, 2, 3, SYSDATE - 5, 11500.00, 100);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 2, 2, 2, 3, SYSDATE - 5, 9000.00, 75);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 8, 2, 2, 4, SYSDATE - 3, 5400.00, 30);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 9, 2, 2, 4, SYSDATE - 3, 6800.00, 40);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 2, 2, 2, 5, SYSDATE - 10, 24000.00, 200);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 7, 2, 2, 5, SYSDATE - 10, 17250.00, 150);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 10, 2, 2, 5, SYSDATE - 10, 9500.00, 100);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 7, 2, 2, 7, SYSDATE - 7, 9200.00, 80);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 2, 2, 2, 8, SYSDATE - 15, 36000.00, 300);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, fecha, monto, cantidad) 
VALUES (20, 8, 2, 2, 8, SYSDATE - 15, 27000.00, 150);

-- Transferencias entre localidades
INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, fecha, monto, cantidad) 
VALUES (22, 2, 1, 2, SYSDATE - 12, 0, 300);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, fecha, monto, cantidad) 
VALUES (22, 7, 1, 2, SYSDATE - 12, 0, 250);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, fecha, monto, cantidad) 
VALUES (22, 8, 1, 2, SYSDATE - 10, 0, 180);


-- MÁS PLANILLAS

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (2, 1, 3500, 350, 3150, SYSDATE - 15, 'QUINCENAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (3, 1, 6000, 600, 5400, SYSDATE - 15, 'QUINCENAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (4, 1, 3500, 350, 3150, SYSDATE - 15, 'QUINCENAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (5, 1, 4000, 400, 3600, SYSDATE - 15, 'QUINCENAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (6, 2, 10000, 1000, 9000, SYSDATE - 30, 'MENSUAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (7, 2, 4000, 400, 3600, SYSDATE - 30, 'MENSUAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (8, 1, 4500, 450, 4050, SYSDATE - 15, 'QUINCENAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (9, 1, 7000, 700, 6300, SYSDATE - 30, 'MENSUAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (10, 1, 3200, 320, 2880, SYSDATE - 15, 'QUINCENAL');

-- Pagos de meses anteriores
INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (1, 1, 8000, 800, 7200, SYSDATE - 30, 'MENSUAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (3, 1, 6000, 600, 5400, SYSDATE - 30, 'MENSUAL');

INSERT INTO planilla (codigo_empleado, codigo_empresa, salario_bruto, descuentos, salario_neto, 
fecha_pago, periodo_semanal_quincenal_mensual) 
VALUES (9, 1, 7000, 700, 6300, SYSDATE - 60, 'MENSUAL');

-- Movimientos de pago de nómina
INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_planilla, fecha, monto) 
VALUES (21, 1, 1, SYSDATE, -7200.00);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_planilla, fecha, monto) 
VALUES (21, 1, 2, SYSDATE - 15, -3150.00);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_planilla, fecha, monto) 
VALUES (21, 1, 3, SYSDATE - 15, -5400.00);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_planilla, fecha, monto) 
VALUES (21, 1, 6, SYSDATE - 30, -9000.00);

INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_planilla, fecha, monto) 
VALUES (21, 1, 9, SYSDATE - 30, -6300.00);


-- MÁS ACTIVOS FIJOS

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Cortadora de tela automática', 35000, DATE '2021-08-15', 8750);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Máquina overlock', 18000, DATE '2022-11-20', 3600);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Mesa de corte industrial', 8000, DATE '2023-02-10', 1600);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Plancha industrial', 12000, DATE '2022-09-05', 2400);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 2, 'Montacargas', 45000, DATE '2021-06-15', 11250);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 2, 'Estantería metálica industrial', 15000, DATE '2020-11-20', 4500);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 2, 'Sistema de inventario automatizado', 28000, DATE '2023-01-15', 5600);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (2, 3, 'Máquina de coser industrial', 26000, DATE '2021-03-10', 6500);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (2, 3, 'Cortadora láser', 55000, DATE '2020-07-22', 16500);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Generador eléctrico', 32000, DATE '2021-04-18', 8000);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Sistema de aire acondicionado', 22000, DATE '2022-03-25', 4400);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 2, 'Camión de reparto', 85000, DATE '2020-09-10', 25500);

INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Computadoras de oficina (10 unidades)', 15000, DATE '2023-05-12', 3000);


-- MÁS RUTAS

INSERT INTO ruta (codigo_localidad_origen, codigo_localidad_destino, tiempo_horas, 
costo_transporte, tipo_transporte) 
VALUES (2, 1, 5, 1500, 5);

INSERT INTO ruta (codigo_localidad_origen, codigo_localidad_destino, tiempo_horas, 
costo_transporte, tipo_transporte) 
VALUES (1, 3, 48, 8500, 5);

INSERT INTO ruta (codigo_localidad_origen, codigo_localidad_destino, tiempo_horas, 
costo_transporte, tipo_transporte) 
VALUES (3, 1, 48, 8500, 5);

INSERT INTO ruta (codigo_localidad_origen, codigo_localidad_destino, tiempo_horas, 
costo_transporte, tipo_transporte) 
VALUES (2, 3, 50, 9000, 5);

INSERT INTO ruta (codigo_localidad_origen, codigo_localidad_destino, tiempo_horas, 
costo_transporte, tipo_transporte) 
VALUES (1, 3, 120, 15000, 6);


-- ORDENES DE PRODUCCIÓN

INSERT INTO orden_produccion (codigo_producto_terminado, codigo_materia_prima, 
codigo_localidad, codigo_pedido, fecha_inicio, fecha_estimada, fecha_real, estado)
VALUES (2, 1, 1, 2, SYSDATE - 5, SYSDATE + 2, NULL, 26);

INSERT INTO orden_produccion (codigo_producto_terminado, codigo_materia_prima, 
codigo_localidad, codigo_pedido, fecha_inicio, fecha_estimada, fecha_real, estado)
VALUES (7, 1, 1, 3, SYSDATE - 10, SYSDATE - 5, SYSDATE - 5, 27);

INSERT INTO orden_produccion (codigo_producto_terminado, codigo_materia_prima, 
codigo_localidad, codigo_pedido, fecha_inicio, fecha_estimada, fecha_real, estado)
VALUES (8, 11, 1, 4, SYSDATE - 8, SYSDATE - 3, SYSDATE - 3, 27);

INSERT INTO orden_produccion (codigo_producto_terminado, codigo_materia_prima, 
codigo_localidad, codigo_pedido, fecha_inicio, fecha_estimada, estado)
VALUES (2, 1, 1, 6, SYSDATE - 2, SYSDATE + 3, 25);

INSERT INTO orden_produccion (codigo_producto_terminado, codigo_materia_prima, 
codigo_localidad, codigo_pedido, fecha_inicio, fecha_estimada, fecha_real, estado)
VALUES (7, 1, 1, 5, SYSDATE - 15, SYSDATE - 10, SYSDATE - 10, 27);

INSERT INTO orden_produccion (codigo_producto_terminado, codigo_materia_prima, 
codigo_localidad, codigo_pedido, fecha_inicio, fecha_estimada, fecha_real, estado)
VALUES (8, 11, 1, 8, SYSDATE - 20, SYSDATE - 15, SYSDATE - 15, 27);

INSERT INTO orden_produccion (codigo_producto_terminado, codigo_materia_prima, 
codigo_localidad, codigo_pedido, fecha_inicio, fecha_estimada, estado)
VALUES (10, 3, 1, 9, SYSDATE - 1, SYSDATE + 5, 26);

INSERT INTO orden_produccion (codigo_producto_terminado, codigo_materia_prima, 
codigo_localidad, codigo_pedido, fecha_inicio, fecha_estimada, estado)
VALUES (9, 11, 1, 6, SYSDATE, SYSDATE + 6, 25);

-- ========================================================================
-- FIN DE DATOS ADICIONALES
-- ========================================================================

--Vistas
-- Vista de inventario valorizado
CREATE OR REPLACE VIEW v_inventario_valorizado AS
SELECT
  i.codigo_inventario,
  l.nombre AS nombre_localidad,
  a.nombre AS nombre_articulo,
  i.cantidad_actual,
  a.precio_referencia,
  (i.cantidad_actual * a.precio_referencia) AS valor_total
FROM inventario i
JOIN localidad l ON i.codigo_localidad = l.codigo_localidad
JOIN articulo a ON i.codigo_articulo = a.codigo_articulo;

-- Vista de flujo de efectivo por movimiento
CREATE OR REPLACE VIEW v_flujo_efectivo AS
SELECT
  m.codigo_movimiento,
  t.descripcion1 AS tipo_movimiento,
  a.nombre AS articulo,
  m.fecha,
  m.monto,
  m.cantidad,
  l1.nombre AS origen,
  l2.nombre AS destino
FROM movimiento m
JOIN tipo t ON m.tipo_movimiento = t.codigo_tipo
JOIN articulo a ON m.codigo_articulo = a.codigo_articulo
LEFT JOIN localidad l1 ON m.codigo_localidad_origen = l1.codigo_localidad
LEFT JOIN localidad l2 ON m.codigo_localidad_destino = l2.codigo_localidad;

-- Vista de pedidos pendientes
CREATE OR REPLACE VIEW v_pedidos_pendientes AS
SELECT
  p.codigo_pedido,
  t.nombre AS cliente,
  p.fecha_pedido,
  p.fecha_requerida,
  tp.descripcion1 AS estado
FROM pedido p
JOIN terceros t ON p.codigo_cliente = t.codigo_tercero
JOIN tipo tp ON p.estado = tp.codigo_tipo
WHERE tp.descripcion1 = 'Pendiente';


--Select
SELECT
  codigo_inventario,
  nombre_localidad,
  nombre_articulo,
  cantidad_actual,
  precio_referencia,
  valor_total
FROM v_inventario_valorizado;

SELECT
  codigo_movimiento,
  tipo_movimiento,
  articulo,
  fecha,
  monto,
  cantidad,
  origen,
  destino
FROM v_flujo_efectivo;

SELECT
  codigo_pedido,
  cliente,
  fecha_pedido,
  fecha_requerida,
  estado
FROM v_pedidos_pendientes;



-- Si se requiere eliminar
DROP TABLE Activo_Fijo CASCADE CONSTRAINTS;
DROP TABLE alumno CASCADE CONSTRAINTS;
DROP TABLE aprobacion CASCADE CONSTRAINTS;
DROP TABLE articulo CASCADE CONSTRAINTS;
DROP TABLE despacho CASCADE CONSTRAINTS;
DROP TABLE empleado CASCADE CONSTRAINTS;
DROP TABLE empresa CASCADE CONSTRAINTS;
DROP TABLE inventario CASCADE CONSTRAINTS;
DROP TABLE localidad CASCADE CONSTRAINTS;
DROP TABLE movimiento CASCADE CONSTRAINTS;
DROP TABLE nota CASCADE CONSTRAINTS;
DROP TABLE pais CASCADE CONSTRAINTS;
DROP TABLE parte CASCADE CONSTRAINTS;
DROP TABLE parte_abastecida CASCADE CONSTRAINTS;
DROP TABLE pedido CASCADE CONSTRAINTS;
DROP TABLE pieza CASCADE CONSTRAINTS;
DROP TABLE planilla CASCADE CONSTRAINTS;
DROP TABLE proveedor CASCADE CONSTRAINTS;
DROP TABLE tercero CASCADE CONSTRAINTS;
DROP TABLE tipo CASCADE CONSTRAINTS;

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
VALUES (2, SYSDATE, SYSDATE + 10, 'PENDIENTE', 'WEB'); 
 
INSERT INTO detalle_pedido (codigo_pedido, codigo_articulo, cantidad_solicitada) 
VALUES (1, 2, 50); -- Cliente pide 50 camisas 
 
 
-- 11. APROBACIÓN 
 
INSERT INTO aprobacion (codigo_pedido, codigo_empleado, resultado, comentarios) 
VALUES (1, 1, 19, 'Aprobado por disponibilidad'); 
 
 
-- 12. DESPACHO 
 
INSERT INTO despacho (codigo_pedido, codigo_localidad_origen, 
codigo_localidad_destino, fecha_envio, estado_despacho) 
VALUES (1, 2, 2, SYSDATE, 17); -- pendiente de envío 
 
 
-- 13. MOVIMIENTOS 
 
INSERT INTO movimiento (tipo_movimiento, codigo_articulo, codigo_localidad_origen, 
codigo_localidad_destino, codigo_pedido, monto, cantidad) 
VALUES (25, 2, 2, NULL, 1, 6000.00, 50); -- venta producto 
 
 
-- 14. PLANILLA 
 
INSERT INTO planilla (codigo_empleado, salario_bruto, descuentos, salario_neto, 
fecha_pago) 
VALUES (1, 8000, 800, 7200, SYSDATE); 
 
 
-- 15. ACTIVOS FIJOS 
 
INSERT INTO activo_fijo (codigo_empresa, codigo_localidad, descripcion, valor_compra, 
fecha_compra, depreciacion) 
VALUES (1, 1, 'Máquina de coser industrial', 25000, DATE '2022-05-01', 5000); 
 
 
-- 16. RUTAS 
 
INSERT INTO ruta (codigo_localidad_origen, codigo_localidad_destino, tiempo_horas, 
costo_transporte, tipo_transporte) 
VALUES (1, 2, 5, 1500, 5);  -- terrestre entre fábrica y bodega 

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
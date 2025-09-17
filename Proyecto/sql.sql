-- ========================
-- ENTIDADES PRINCIPALES
-- ========================

CREATE TABLE Pais (
  id_pais NUMBER PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL
);

CREATE TABLE Localidad (
  id_localidad NUMBER PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL,
  id_pais NUMBER NOT NULL,
  FOREIGN KEY (id_pais) REFERENCES Pais(id_pais)
);

CREATE TABLE Empresa (
  id_empresa NUMBER PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL,
  id_localidad NUMBER NOT NULL,
  FOREIGN KEY (id_localidad) REFERENCES Localidad(id_localidad)
);

CREATE TABLE Empleado (
  id_empleado NUMBER PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL,
  id_empresa NUMBER NOT NULL,
  FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa)
);

CREATE TABLE Tercero (
  id_tercero NUMBER PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL
);

CREATE TABLE Tipo (
  id_tipo NUMBER PRIMARY KEY,
  descripcion VARCHAR2(100) NOT NULL
);

-- ========================
-- OPERACIONES Y RELACIONES
-- ========================

CREATE TABLE Pedido (
  id_pedido NUMBER PRIMARY KEY,
  fecha DATE NOT NULL,
  id_tercero NUMBER NOT NULL,
  FOREIGN KEY (id_tercero) REFERENCES Tercero(id_tercero)
);

CREATE TABLE Aprobacion (
  id_aprobacion NUMBER PRIMARY KEY,
  estado VARCHAR2(50) NOT NULL,
  id_empleado NUMBER NOT NULL,
  FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);

CREATE TABLE Planilla (
  id_planilla NUMBER PRIMARY KEY,
  fecha DATE NOT NULL,
  id_empleado NUMBER NOT NULL,
  FOREIGN KEY (id_empleado) REFERENCES Empleado(id_empleado)
);

-- ========================
-- INVENTARIO Y ACTIVOS
-- ========================

CREATE TABLE Articulo (
  id_articulo NUMBER PRIMARY KEY,
  nombre VARCHAR2(100) NOT NULL,
  id_tipo NUMBER NOT NULL,
  FOREIGN KEY (id_tipo) REFERENCES Tipo(id_tipo)
);

CREATE TABLE Inventario (
  id_inventario NUMBER PRIMARY KEY,
  cantidad NUMBER NOT NULL,
  id_articulo NUMBER NOT NULL,
  FOREIGN KEY (id_articulo) REFERENCES Articulo(id_articulo)
);

CREATE TABLE Movimiento (
  id_movimiento NUMBER PRIMARY KEY,
  fecha DATE NOT NULL,
  tipo_movimiento VARCHAR2(50) NOT NULL,
  id_inventario NUMBER NOT NULL,
  FOREIGN KEY (id_inventario) REFERENCES Inventario(id_inventario)
);

CREATE TABLE Despacho (
  id_despacho NUMBER PRIMARY KEY,
  fecha DATE NOT NULL,
  id_pedido NUMBER NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido)
);

CREATE TABLE Activo_Fijo (
  id_activo NUMBER PRIMARY KEY,
  descripcion VARCHAR2(100) NOT NULL,
  id_empresa NUMBER NOT NULL,
  FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa)
);

// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
// import PedidoForm from './components/PedidoForm';
// import PedidoList from './components/PedidoList';
// import DetallePedidoForm from './components/DetallePedidoForm';
// import DetallePedidoList from './components/DetallePedidoList';
import PaisCrud from './components/PaisCrud';
import VistaPedidosPendientes from './components/VistaPedidosPendientes';
import VistaFlujoEfectivo from './components/VistaFlujoEfectivo';
import VistaInventarioValorizado from './components/VistaInventarioValorizado';
import PedidoForm from './components/PedidoForm';
import PedidoList from './components/PedidoList';
import Inicio from './components/Inicio';
import Login from './components/Login';
import logo from './assets/logo.png';


function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay una sesión guardada al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Función para manejar el login
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Componente para proteger rutas
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Si no está autenticado, mostrar solo el login
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // Si está autenticado, mostrar la aplicación completa
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo Confecciones" style={{ height: '32px' }} /> Sistema de Pedidos
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/paises">Países</Nav.Link>
              {user?.isCliente && (
                <>
                  <Nav.Link as={Link} to="/nuevo-pedido">Nuevo Pedido</Nav.Link>
                  <Nav.Link as={Link} to="/pedidos">Mis Pedidos</Nav.Link>
                </>
              )}
              {user?.isEmpleado && (
                <>
                  <Nav.Link as={Link} to="/vista/pedidos">Pedidos Pendientes</Nav.Link>
                  <Nav.Link as={Link} to="/vista/flujo">Flujo Efectivo</Nav.Link>
                  <Nav.Link as={Link} to="/vista/inventario">Inventario Valorizado</Nav.Link>
                </>
              )}

              {/* <Nav.Link as={Link} to="/pedidos">Pedidos</Nav.Link>
              <Nav.Link as={Link} to="/nuevo-pedido">Nuevo Pedido</Nav.Link>
              <Nav.Link as={Link} to="/detalles">Detalles</Nav.Link>
              <Nav.Link as={Link} to="/nuevo-detalle">Nuevo Detalle</Nav.Link> */}
            </Nav>
            
            {/* Usuario y botón de logout */}
            <Nav>
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-user">
                  <i className="bi bi-person-circle me-2"></i>
                  {user?.usuario || 'Usuario'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item disabled>
                    <small className="text-muted">
                      <i className="bi bi-person me-2"></i>
                      {user?.usuario}
                    </small>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/paises" element={
            <ProtectedRoute>
              <PaisCrud />
            </ProtectedRoute>
          } />
          <Route path="/nuevo-pedido" element={
            <ProtectedRoute>
              <PedidoForm />
            </ProtectedRoute>
          } />
          <Route path="/pedidos" element={
            <ProtectedRoute>
              <PedidoList />
            </ProtectedRoute>
          } />
          <Route path="/vista/pedidos" element={
            <ProtectedRoute>
              <VistaPedidosPendientes />
            </ProtectedRoute>
          } />      
          <Route path="/vista/flujo" element={
            <ProtectedRoute>
              <VistaFlujoEfectivo />
            </ProtectedRoute>
          } />      
          <Route path="/vista/inventario" element={
            <ProtectedRoute>
              <VistaInventarioValorizado />
            </ProtectedRoute>
          } />
          
          {/* Redirigir cualquier ruta no encontrada al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

// frontend/src/App.js
import React from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
// import PedidoForm from './components/PedidoForm';
// import PedidoList from './components/PedidoList';
// import DetallePedidoForm from './components/DetallePedidoForm';
// import DetallePedidoList from './components/DetallePedidoList';
import PaisCrud from './components/PaisCrud';
import VistaPedidosPendientes from './components/VistaPedidosPendientes';
import VistaFlujoEfectivo from './components/VistaFlujoEfectivo';
import VistaInventarioValorizado from './components/VistaInventarioValorizado';
import Inicio from './components/Inicio';
import logo from './assets/logo.png';


function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/"><img src={logo} alt="Logo Confecciones" style={{ height: '32px' }} /> Sistema de Pedidos </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/paises">Países</Nav.Link>
              <Nav.Link as={Link} to="/vista/pedidos">Pedidos Pendientes</Nav.Link>
              <Nav.Link as={Link} to="/vista/flujo">Flujo Efectivo</Nav.Link>
              <Nav.Link as={Link} to="/vista/inventario">Inventario Valorizado</Nav.Link>

              {/* <Nav.Link as={Link} to="/pedidos">Pedidos</Nav.Link>
              <Nav.Link as={Link} to="/nuevo-pedido">Nuevo Pedido</Nav.Link>
              <Nav.Link as={Link} to="/detalles">Detalles</Nav.Link>
              <Nav.Link as={Link} to="/nuevo-detalle">Nuevo Detalle</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/paises" element={<PaisCrud />} />
          {/* <Route path="/pedidos" element={<PedidoList />} />
          <Route path="/nuevo-pedido" element={<PedidoForm />} />
          <Route path="/detalles" element={<DetallePedidoList />} />
          <Route path="/nuevo-detalle" element={<DetallePedidoForm />} /> */}
          <Route path="/vista/pedidos" element={<VistaPedidosPendientes />} />      
          <Route path="/vista/flujo" element={<VistaFlujoEfectivo />} />      
          <Route path="/vista/inventario" element={<VistaInventarioValorizado />} />      

        </Routes>
      </Container>
    </Router>
  );
}

export default App;

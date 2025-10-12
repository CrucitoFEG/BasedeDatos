import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logo from '../assets/logo2.png';

function Inicio() {
  return (
    <Container className="text-center mt-5">
      <img src={logo} alt="Logo" style={{ height: '200px' }} />
      <h1 className="mt-3">Confecciones Global S.A.</h1>
      <p className="lead">“Comprometidos con la calidad, conectados con el mundo.”</p>
      <Row className="mt-4">
        <Col md={6}>
          <h4>Nuestra Historia</h4>
          <p>Desde 1995, hemos confeccionado prendas con pasión y precisión, expandiéndonos desde Guatemala hacia México y USA.</p>
        </Col>
        <Col md={6}>
          <h4>Propósito</h4>
          <p>Optimizar la gestión de pedidos, inventario y producción con tecnología moderna y trazabilidad total.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Inicio;

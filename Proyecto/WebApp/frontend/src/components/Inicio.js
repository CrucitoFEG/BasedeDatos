// import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import logo from '../assets/logo2.png';

// function Inicio() {
//   return (
//     <Container className="text-center mt-5">
//       <img src={logo} alt="Logo" style={{ height: '200px' }} />
//       <h1 className="mt-3">Confecciones Global S.A.</h1>
//       <p className="lead">“Comprometidos con la calidad, conectados con el mundo.”</p>
//       <Row className="mt-4">
//         <Col md={6}>
//           <h4>Nuestra Historia</h4>
//           <p>Desde 1995, hemos confeccionado prendas con pasión y precisión, expandiéndonos desde Guatemala hacia México y USA.</p>
//         </Col>
//         <Col md={6}>
//           <h4>Propósito</h4>
//           <p>Optimizar la gestión de pedidos, inventario y producción con tecnología moderna y trazabilidad total.</p>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default Inicio;
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Table, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.png';

function Inicio() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const [pedidos, setPedidos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [inventario, setInventario] = useState([]);

  const [loadingCounts, setLoadingCounts] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalRows, setModalRows] = useState([]);
  const [modalCols, setModalCols] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    // Cargar datos resumidos al iniciar
    const load = async () => {
      try {
        setLoadingCounts(true);
        const [r1, r2, r3, r4] = await Promise.all([
          fetch(`${API_URL}/api/pedidos`).then(r => r.json()),
          fetch(`${API_URL}/api/paises`).then(r => r.json()),
          fetch(`${API_URL}/api/vistas/pedidos-pendientes`).then(r => r.json()),
          fetch(`${API_URL}/api/vistas/inventario-valorizado`).then(r => r.json())
        ]);
        setPedidos(r1 || []);
        setPaises(r2 || []);
        setPedidosPendientes(r3 || []);
        setInventario(r4 || []);
      } catch (err) {
        console.error('Error cargando resúmenes:', err);
      } finally {
        setLoadingCounts(false);
      }
    };
    load();
  }, [API_URL]);

  const navigate = useNavigate();

  const openModal = async (type) => {
    setShowModal(true);
    setModalRows([]);
    setModalCols([]);
    setModalLoading(true);

    try {
      let data = [];
      if (type === 'pedidos') {
        data = await fetch(`${API_URL}/api/pedidos`).then(r => r.json());
        setModalTitle('Pedidos (todos)');
      } else if (type === 'paises') {
        data = await fetch(`${API_URL}/api/paises`).then(r => r.json());
        setModalTitle('Países / Sucursales');
      } else if (type === 'pendientes') {
        data = await fetch(`${API_URL}/api/vistas/pedidos-pendientes`).then(r => r.json());
        setModalTitle('Pedidos Pendientes');
      } else if (type === 'inventario') {
        data = await fetch(`${API_URL}/api/vistas/inventario-valorizado`).then(r => r.json());
        setModalTitle('Inventario Valorizado');
      }

      // Normalize rows: backend returns arrays of arrays (Oracle); convert to array of objects if possible
      if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
        // We don't have column names from server; show as generic columns
        const cols = data[0].map((_, i) => `Col ${i+1}`);
        const rows = data.map(r => r.map((c,i) => ({ key: `c${i}`, value: c })));
        setModalCols(cols);
        setModalRows(rows);
      } else if (Array.isArray(data)) {
        // assume array of objects
        const cols = data.length > 0 ? Object.keys(data[0]) : [];
        setModalCols(cols);
        setModalRows(data);
      } else {
        setModalCols([]);
        setModalRows([]);
      }
    } catch (err) {
      console.error('Error cargando detalle:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => setShowModal(false);
  return (
    <>
      {/* Hero Section */}
      <div className="hero text-white py-5">
        <Container className="text-center">
          <div className="logo-animate mb-4">
            <img src={logo} alt="Logo" style={{ height: '160px' }} />
          </div>
          <h1 className="fs-1 text-white">Confecciones Global S.A.</h1>
          <p className="lead fs-4 mb-2">Sistema de Control Empresarial Integrado</p>
          <p className="fs-5 muted-2">"Comprometidos con la calidad, conectados con el mundo"</p>
        </Container>
      </div>

      {/* Stats Cards */}
      <Container className="mt-n5 mb-5" style={{ position: 'relative', zIndex: 10 }}>
        <Row className="g-3">
          <Col md={3} sm={6}>
            <Card className="shadow-sm h-100 text-center border-0 hover-card" style={{cursor:'pointer'}}>
              <div onClick={() => navigate('/paises')} style={{position: 'absolute', inset: 0, zIndex: 1}} aria-hidden></div>
              <Card.Body>
                <i className="bi bi-geo-alt fs-1 text-primary mb-2"></i>
                <p className="text-muted small mb-1">Sucursales / Países</p>
                {loadingCounts ? <Spinner animation="border" size="sm" /> : <h4 className="fw-bold">{paises.length}</h4>}
                <div className="mt-2">
                  <Button variant="link" onClick={(e) => { e.stopPropagation(); openModal('paises'); }}>Ver detalle</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="shadow-sm h-100 text-center border-0 hover-card" style={{cursor:'pointer'}}>
              <div onClick={() => navigate('/vista/inventario')} style={{position: 'absolute', inset: 0, zIndex: 1}} aria-hidden></div>
              <Card.Body>
                <i className="bi bi-box-seam fs-1 text-info mb-2"></i>
                <p className="text-muted small mb-1">Inventario Valorizado</p>
                {loadingCounts ? <Spinner animation="border" size="sm" /> : <h4 className="fw-bold">{inventario.length}</h4>}
                <div className="mt-2">
                  <Button variant="link" onClick={(e) => { e.stopPropagation(); openModal('inventario'); }}>Ver detalle</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="shadow-sm h-100 text-center border-0 hover-card" style={{cursor:'pointer'}}>
              <div onClick={() => navigate('/vista/pedidos')} style={{position: 'absolute', inset: 0, zIndex: 1}} aria-hidden></div>
              <Card.Body>
                <i className="bi bi-card-list fs-1 text-dark mb-2"></i>
                <p className="text-muted small mb-1">Pedidos (totales)</p>
                {loadingCounts ? <Spinner animation="border" size="sm" /> : <h4 className="fw-bold">{pedidos.length}</h4>}
                <div className="mt-2">
                  <Button variant="link" onClick={(e) => { e.stopPropagation(); openModal('pedidos'); }}>Ver detalle</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="shadow-sm h-100 text-center border-0 hover-card" style={{cursor:'pointer'}}>
              <div onClick={() => navigate('/vista/pedidos')} style={{position: 'absolute', inset: 0, zIndex: 1}} aria-hidden></div>
              <Card.Body>
                <i className="bi bi-hourglass-split fs-1 text-warning mb-2"></i>
                <p className="text-muted small mb-1">Pedidos Pendientes</p>
                {loadingCounts ? <Spinner animation="border" size="sm" /> : <h4 className="fw-bold">{pedidosPendientes.length}</h4>}
                <div className="mt-2">
                  <Button variant="link" onClick={(e) => { e.stopPropagation(); openModal('pendientes'); }}>Ver detalle</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* About Section */}
        <Container className="my-5">
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body className="p-4">
            <h2 className="text-center fw-secondary mb-4 fade-in">Nuestra Empresa</h2>
            <p className="lead text-center text-dark">
              Somos una empresa internacional líder en la confección de ropa de vestir al por mayor, con presencia en múltiples países. Fabricamos gran parte de nuestra materia prima y trabajamos con proveedores certificados para garantizar la más alta calidad.
            </p>
          </Card.Body>
        </Card>

        <Row className="mt-4 mb-4">
          <Col md={6}>
            <h4 className="fw-bold">
              <i className="bi bi-clock-history text-secondary me-2"></i>
              Nuestra Historia
            </h4>
            <p>Desde 1995, hemos confeccionado prendas con pasión y precisión, expandiéndonos desde Guatemala hacia México y USA, consolidándonos como líderes en la industria textil internacional.</p>
          </Col>
          <Col md={6}>
            <h4 className="fw-bold">
              <i className="bi bi-bullseye text-danger me-2"></i>
              Propósito
            </h4>
            <p>Optimizar la gestión de pedidos, inventario y producción con tecnología moderna y trazabilidad total, preparándonos para nuestra entrada a la bolsa de valores.</p>
          </Col>
        </Row>
      </Container>

      {/* World Map Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center fw-bold mb-4">Presencia Global</h2>
          
          <Row className="text-center">
            <Col md={4}>
              <div className="p-3">
                <i className="bi bi-building fs-1 text-info"></i>
                <h5 className="fw-bold mt-2">Guatemala</h5>
                <p className="text-muted small">Casa Matriz<br/>Producción Principal</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-3">
                <i className="bi bi-building fs-1 text-success"></i>
                <h5 className="fw-bold mt-2">México</h5>
                <p className="text-muted small">Planta de Manufactura<br/>Distribución Regional</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-3">
                <i className="bi bi-building fs-1" style={{ color: '#ce3fa8ff' }}></i>
                <h5 className="fw-bold mt-2">USA</h5>
                <p className="text-muted small">Centro Logístico<br/>Atención a Clientes</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="my-5">
        <h2 className="text-center fw-bold mb-4">Capacidades del Sistema</h2>
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body>
                <div className="d-flex align-items-start">
                  <i className="bi bi-shield-check fs-2 text-info me-3"></i>
                  <div>
                    <h5 className="fw-bold">Control Centralizado</h5>
                    <p className="text-muted small">Auditoría fácil de todas las operaciones en cada país desde un solo punto de control.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body>
                <div className="d-flex align-items-start">
                  <i className="bi bi-box-seam fs-2 text-danger me-3"></i>
                  <div>
                    <h5 className="fw-bold">Gestión de Inventario</h5>
                    <p className="text-muted small">Control total de activos e inventario en cada localidad con trazabilidad completa.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body>
                <div className="d-flex align-items-start">
                  <i className="bi bi-currency-dollar fs-2 text-dark me-3"></i>
                  <div>
                    <h5 className="fw-bold">Auditoría Financiera</h5>
                    <p className="text-muted small">Monitoreo en tiempo real del flujo de efectivo y gastos de planilla globalmente.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body>
                <div className="d-flex align-items-start">
                  <i className="bi bi-truck fs-2 text-dark me-3"></i>
                  <div>
                    <h5 className="fw-bold">Logística Integrada</h5>
                    <p className="text-muted small">Coordinación eficiente de materia prima y producto terminado entre fábricas.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body>
                <div className="d-flex align-items-start">
                  <i className="bi bi-cart-check fs-2 text-dark me-3"></i>
                  <div>
                    <h5 className="fw-bold">Portal de Clientes</h5>
                    <p className="text-muted small">Sistema integrable con portal de órdenes para aprobación por alta gerencia.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-card">
              <Card.Body>
                <div className="d-flex align-items-start">
                  <i className="bi bi-graph-up fs-2 text-dark me-3"></i>
                  <div>
                    <h5 className="fw-bold">Planificación Inteligente</h5>
                    <p className="text-muted small">Cálculo automático de tiempos de producción, transporte y entrega.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Vision Section */}
      <div className="bg-dark text-white py-5 mt-5">
        <Container className="text-center">
          <h2 className="fw-bold mb-3">Nuestra Visión</h2>
          <p className="lead">
            Transformar nuestras operaciones globales mediante un sistema integral de control que nos permita alcanzar la excelencia operativa, prepararnos para el mercado de valores y mantener nuestro liderazgo en la industria de confección internacional.
          </p>
        </Container>
      </div>

      <style>{`
        .hover-card:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25) !important;
          transition: box-shadow 0.3s ease-in-out;
          transform: translateY(-2px);
          transition: all 0.3s ease-in-out;
        }
        .mt-n5 {
          margin-top: -3rem;
        }
      `}</style>
    </>
  );
}

export default Inicio;
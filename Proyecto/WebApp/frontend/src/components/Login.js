// frontend/src/components/Login.js
import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import logo from '../assets/logo2.png';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Llamada real a la API de autenticación
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, clave }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar información del usuario en localStorage
        const userData = {
          ...data.user,
          isAuthenticated: true,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4 fade-in">
            <Card className="login-card border-0">
              <Card.Body>
                <div className="text-center mb-4">
                  <div className="logo-animate d-inline-block mb-3">
                    <img src={logo} alt="Logo" style={{ height: '120px' }} />
                  </div>
                  <h3 className="fw-bold">Iniciar Sesión</h3>
                  <p className="text-muted">Sistema de Control Empresarial</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese su usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      required
                      autoFocus
                      className="form-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Ingrese su contraseña"
                      value={clave}
                      onChange={(e) => setClave(e.target.value)}
                      required
                      className="form-input"
                    />
                  </Form.Group>

                  <Button
                    className="w-100 btn-primary-custom"
                    type="submit"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <small className="muted-2">
                    <i className="bi bi-shield-lock me-1"></i>
                    Confecciones Global S.A. © 2025
                  </small>
                </div>
              </Card.Body>
            </Card>
            
            {/* Demo credentials info */}
            <Card className="mt-3 border-0 bg-light shadow-sm">
              <Card.Body className="p-3">
                <small className="text-muted">
                  <strong>Usuarios de prueba:</strong><br/>
                  <code>cperez / 1234</code> (Empleado)<br/>
                  <code>tienda_estilo / abcd</code> (Cliente)
                </small>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Login;

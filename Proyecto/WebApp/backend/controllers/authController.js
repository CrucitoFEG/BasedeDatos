// backend/controllers/authController.js
const { getConnection } = require('../db');

exports.login = async (req, res) => {
  const { usuario, clave } = req.body;
  
  try {
    const conn = await getConnection();
    
    // Buscar usuario en la tabla usuario_portal
    const result = await conn.execute(
      `SELECT 
        up.codigo_usuario_portal,
        up.usuario,
        up.codigo_empleado,
        up.codigo_tercero,
        t_usuario.descripcion1 as tipo_usuario,
        t_estado.descripcion1 as estado,
        e.nombre as nombre_empleado,
        e.puesto,
        ter.nombre as nombre_tercero
       FROM usuario_portal up
       JOIN tipo t_usuario ON up.tipo_usuario = t_usuario.codigo_tipo
       JOIN tipo t_estado ON up.estado = t_estado.codigo_tipo
       LEFT JOIN empleado e ON up.codigo_empleado = e.codigo_empleado
       LEFT JOIN terceros ter ON up.codigo_tercero = ter.codigo_tercero
       WHERE up.usuario = :usuario AND up.clave = :clave`,
      { usuario, clave }
    );
    
    await conn.close();
    
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Usuario o contraseña incorrectos' 
      });
    }
    
    const userData = result.rows[0];
    
    // Verificar si el usuario está activo
    if (userData[5] !== 'Activo') {
      return res.status(403).json({ 
        error: 'Usuario inactivo. Contacte al administrador.' 
      });
    }
    
    // Retornar información del usuario (sin la contraseña)
    res.json({
      success: true,
      user: {
        id: userData[0],
        usuario: userData[1],
        tipo: userData[4],
        nombre: userData[6] || userData[8], // nombre empleado o nombre tercero
        puesto: userData[7] || 'Cliente',
        isEmpleado: userData[2] !== null,
        isCliente: userData[3] !== null
      }
    });
    
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud de inicio de sesión' 
    });
  }
};

exports.logout = async (req, res) => {
  // Aquí podrías invalidar tokens o sesiones si usas JWT o sessions
  res.json({ 
    success: true, 
    message: 'Sesión cerrada correctamente' 
  });
};

exports.verifySession = async (req, res) => {
  // Verificar si la sesión es válida
  // Esto es útil si implementas JWT o sesiones del lado del servidor
  const { usuario } = req.body;
  
  try {
    const conn = await getConnection();
    const result = await conn.execute(
      `SELECT up.usuario, t_estado.descripcion1 as estado
       FROM usuario_portal up
       JOIN tipo t_estado ON up.estado = t_estado.codigo_tipo
       WHERE up.usuario = :usuario`,
      { usuario }
    );
    await conn.close();
    
    if (result.rows.length === 0 || result.rows[0][1] !== 'Activo') {
      return res.status(401).json({ 
        valid: false, 
        error: 'Sesión inválida' 
      });
    }
    
    res.json({ valid: true });
    
  } catch (err) {
    console.error('Error verificando sesión:', err);
    res.status(500).json({ 
      valid: false, 
      error: 'Error al verificar sesión' 
    });
  }
};

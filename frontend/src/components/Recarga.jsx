import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../recarga.css';

const API_URL = 'http://localhost:3080';

export default function Recarga({ onRecharge }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [detalle, setDetalle] = useState('');
  const [cargando, setCargando] = useState(false);
  const montoRef = useRef(null);
  const metodoRef = useRef(null);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();

    const monto = Number(montoRef.current?.value || 0);
    const metodo = metodoRef.current?.value || 'tarjeta';

    if (!monto || monto <= 0) {
      alert('Selecciona un monto válido.');
      return;
    }

    const usuarioRaw = localStorage.getItem('user');
    if (!usuarioRaw) {
      alert('No hay usuario logueado. Inicia sesión primero.');
      return;
    }

    const usuario = JSON.parse(usuarioRaw);

    try {
      setCargando(true);

      // Llamada al backend para recargar saldo
      const resp = await fetch(`${API_URL}/users/recarga`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: usuario.id,
          monto,
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al recargar saldo');
      }

      const usuarioActualizado = await resp.json();

      // actualizar el usuario en localStorage
      const usuarioFrontend = {
        ...usuario,
        saldo: usuarioActualizado.saldo,
        monedas: usuarioActualizado.saldo, // para App.jsx
      };
      localStorage.setItem('user', JSON.stringify(usuarioFrontend));

      // avisar al App que se recargó
      onRecharge?.(monto);

      const fecha = new Date().toLocaleString();
      setDetalle(
        `Monto: ${monto} monedas\nMétodo: ${metodo}\nFecha: ${fecha}`
      );
      setShowReceipt(true);
      alert(`Pago procesado con ${metodo} ✅ Saldo actualizado en el servidor.`);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Ocurrió un error al procesar la recarga.');
    } finally {
      setCargando(false);
    }
  };

  const descargar = () => {
    const fecha = new Date().toLocaleString();
    const contenido = `StreamBoost - Comprobante de Recarga
    ---------------------------------------
     ${detalle}
    ---------------------------------------
    Fecha de descarga: ${fecha}
    ¡Gracias por tu recarga!`;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Comprobante_StreamBoost.txt';
    a.click();
  };

  return (
    <div className="recarga-page">
      <header className="navbar">
        <h1>Recargar Monedas 🪙</h1>
        <button className="btn-volver" onClick={() => navigate('/dashboard')}>
          Atrás
        </button>
      </header>

      <main className="container">
        <form onSubmit={submit} className="form-recarga">
          <label htmlFor="monto">Selecciona el monto:</label>
          <select id="monto" ref={montoRef} defaultValue="100">
            <option value="50">50 monedas - S/ 5.00</option>
            <option value="100">100 monedas - S/ 8.00</option>
            <option value="200">200 monedas - S/ 14.00</option>
            <option value="500">500 monedas - S/ 20.00</option>
            <option value="1000">1000 monedas - S/ 35.00</option>
          </select>

          <label htmlFor="metodo">Método de pago:</label>
          <select id="metodo" ref={metodoRef} defaultValue="tarjeta">
            <option value="tarjeta">Tarjeta</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
          </select>

          <button type="submit" className="btn-recargar" disabled={cargando}>
            {cargando ? 'Procesando...' : 'Pagar y Recargar'}
          </button>
        </form>

        {showReceipt && (
          <div className="comprobante">
            <h3>✅Recarga Exitosa</h3>
            <p>Gracias por tu compra.</p>
            <pre>{detalle}</pre>
            <button className="btn-descargar" onClick={descargar}>
              Descargar comprobante
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

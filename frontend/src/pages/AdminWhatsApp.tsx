import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Smartphone, Plus, LogOut, CheckCircle, RefreshCw, X } from 'lucide-react';

export const AdminWhatsApp = () => {
  const context = useContext(AuthContext);
  const [instances, setInstances] = useState<any[]>([]);
  const [activeInstanceName, setActiveInstanceName] = useState<string>('');
  const [newInstanceName, setNewInstanceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrModal, setQrModal] = useState<{name: string, base64: string} | null>(null);
  const pollInterval = useRef<any>(null);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/config');
      setActiveInstanceName(res.data.evolution_instance || '');
    } catch (e) {
      console.error('Error fetching config', e);
    }
  };

  const fetchInstances = async () => {
    try {
      const res = await api.get('/whatsapp/instances');
      // Evolution API devuelve un array, asegurarnos de extraerlo bien
      const data = Array.isArray(res.data) ? res.data : [];
      setInstances(data);
    } catch (e) {
      console.error('Error fetching instances', e);
    }
  };

  useEffect(() => {
    if (context?.user?.role !== 'ADMIN') return;

    fetchSettings();
    fetchInstances();

    // Polling cada 3 segundos
    pollInterval.current = setInterval(() => {
      fetchInstances();
    }, 3000);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [context?.user]);

  // Si el modal de QR esta abierto y el polling dice que ya se conectó, lo cerramos
  useEffect(() => {
    if (qrModal) {
      const currentInst = instances.find(i => i.instance.instanceName === qrModal.name);
      if (currentInst && currentInst.instance.status === 'open') {
        setQrModal(null);
        alert('¡Instancia conectada exitosamente!');
      }
    }
  }, [instances, qrModal]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstanceName) return;
    setLoading(true);
    try {
      await api.post('/whatsapp/instances', { instanceName: newInstanceName });
      setNewInstanceName('');
      await fetchInstances();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error creando instancia');
    } finally {
      setLoading(false);
    }
  };

  const handleShowQr = async (name: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/whatsapp/instances/${name}/qr`);
      if (res.data && res.data.base64) {
        setQrModal({ name, base64: res.data.base64 });
      } else {
        alert('La instancia no devolvió un QR válido. Puede que ya esté conectada o en un estado inválido.');
      }
    } catch (err: any) {
      alert('Error obteniendo QR. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (name: string) => {
    if (!confirm(`¿Seguro que deseas desconectar la instancia ${name}?`)) return;
    try {
      await api.delete(`/whatsapp/instances/${name}/logout`);
      await fetchInstances();
    } catch (err) {
      alert('Error cerrando sesión');
    }
  };

  const handleSetActive = async (name: string) => {
    try {
      await api.post('/config', { evolution_instance: name });
      setActiveInstanceName(name);
      alert(`Instancia "${name}" marcada como activa para enviar mensajes.`);
    } catch (err) {
      alert('Error guardando configuración');
    }
  };

  if (context?.user?.role !== 'ADMIN') {
    return <div className="page-container"><p>Acceso denegado.</p></div>;
  }

  return (
    <div className="page-container dashboard">
      <header className="page-header">
        <h2>Gestión de WhatsApp</h2>
      </header>

      <div className="glass-panel p-4 mb-4">
        <h3>Crear Nueva Instancia</h3>
        <form onSubmit={handleCreate} className="flex gap-2 mt-2">
          <input 
            type="text" 
            placeholder="Ej. colegio_principal" 
            value={newInstanceName}
            onChange={(e) => setNewInstanceName(e.target.value.replace(/ /g, '_'))}
            className="flex-1 input-elegant"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !newInstanceName} className="btn-primary" style={{width: 'auto'}}>
            <Plus size={20} />
          </button>
        </form>
      </div>

      <div className="instances-list">
        <h3>Instancias Registradas</h3>
        {instances.length === 0 ? (
          <p className="empty-state">No hay instancias creadas.</p>
        ) : (
          instances.map((inst) => {
            const name = inst.instance.instanceName;
            const status = inst.instance.status; // 'open', 'connecting', 'close'
            const isActive = name === activeInstanceName;

            return (
              <div key={name} className={`instance-card ${isActive ? 'is-active' : ''}`}>
                <div className="instance-header">
                  <div className="instance-info">
                    <Smartphone size={24} className={status === 'open' ? 'text-success' : 'text-warning'} />
                    <div>
                      <h4>{name}</h4>
                      <span className={`status-badge ${status}`}>{status}</span>
                    </div>
                  </div>
                  {isActive && <span className="active-badge"><CheckCircle size={16}/> Activa</span>}
                </div>

                <div className="instance-actions">
                  {status !== 'open' && (
                    <button onClick={() => handleShowQr(name)} disabled={loading} className="btn-action blue">
                      <RefreshCw size={16} /> Vincular (QR)
                    </button>
                  )}
                  {status === 'open' && (
                    <button onClick={() => handleLogout(name)} disabled={loading} className="btn-action red">
                      <LogOut size={16} /> Desconectar
                    </button>
                  )}
                  {!isActive && status === 'open' && (
                    <button onClick={() => handleSetActive(name)} disabled={loading} className="btn-action green">
                      <CheckCircle size={16} /> Fijar como Activa
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal QR */}
      {qrModal && (
        <div className="qr-modal-overlay">
          <div className="qr-modal-content glass-panel">
            <button className="close-btn" onClick={() => setQrModal(null)}><X size={24}/></button>
            <h3>Escanea este código</h3>
            <p>Abre WhatsApp en tu celular y vincula un dispositivo.</p>
            <div className="qr-image-container">
              <img src={qrModal.base64} alt="QR Code" />
            </div>
            <p className="loading-text"><RefreshCw className="spin-icon" size={16} /> Esperando escaneo...</p>
          </div>
        </div>
      )}
    </div>
  );
};

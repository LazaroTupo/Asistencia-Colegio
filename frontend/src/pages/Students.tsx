import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Plus, Edit2, Trash2, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface Student {
  id: number;
  qrCode: string;
  firstName: string;
  lastName: string;
  gradeSection: string;
  numApoderado: string;
  details: string | null;
}

export const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [isEditing, setIsEditing] = useState(false);

  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error al cargar alumnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenFormModal = (student?: Student) => {
    if (student) {
      setFormData(student);
      setIsEditing(true);
    } else {
      setFormData({ qrCode: '', firstName: '', lastName: '', gradeSection: '', numApoderado: '', details: '' });
      setIsEditing(false);
    }
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setFormData({});
  };

  const handleOpenQrModal = (student: Student) => {
    setSelectedStudent(student);
    setShowQrModal(true);
  };

  const handleCloseQrModal = () => {
    setShowQrModal(false);
    setSelectedStudent(null);
  };

  const downloadQrCode = () => {
    if (!qrRef.current || !selectedStudent) return;
    const canvas = qrRef.current;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${selectedStudent.qrCode}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/students/${formData.id}`, formData);
        alert('Alumno actualizado');
      } else {
        await api.post('/students', formData);
        alert('Alumno creado');
      }
      fetchStudents();
      handleCloseFormModal();
    } catch (error: any) {
      console.error('Error saving student:', error);
      alert(error.response?.data?.error || 'Error al guardar alumno');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este alumno? También se borrarán sus asistencias.')) {
      try {
        await api.delete(`/students/${id}`);
        alert('Alumno eliminado');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error al eliminar alumno');
      }
    }
  };

  if (loading) {
    return <div className="page-container">Cargando...</div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Gestión de Alumnos</h2>
        <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => handleOpenFormModal()}>
          <Plus size={20} /> Nuevo Alumno
        </button>
      </div>

      <div className="glass-panel table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código QR</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Grado/Sección</th>
              <th>WhatsApp Apoderado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center' }}>No hay alumnos registrados.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.qrCode}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.gradeSection}</td>
                  <td>{student.numApoderado}</td>
                  <td style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-primary" style={{ padding: '8px', background: '#3b82f6', width: 'auto' }} onClick={() => handleOpenQrModal(student)} title="Ver QR">
                      <QrCode size={16} />
                    </button>
                    <button className="btn-edit" onClick={() => handleOpenFormModal(student)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(student.id)} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Editar Alumno' : 'Nuevo Alumno'}</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Código QR *</label>
                <input type="text" className="form-control" name="qrCode" value={formData.qrCode || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Nombres *</label>
                <input type="text" className="form-control" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Apellidos *</label>
                <input type="text" className="form-control" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Grado y Sección *</label>
                <input type="text" className="form-control" name="gradeSection" value={formData.gradeSection || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>N° WhatsApp Apoderado</label>
                <input type="text" className="form-control" name="numApoderado" value={formData.numApoderado || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Detalles adicionales</label>
                <input type="text" className="form-control" name="details" value={formData.details || ''} onChange={handleChange} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseFormModal}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQrModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <h3>Código QR: {selectedStudent.qrCode}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              {selectedStudent.firstName} {selectedStudent.lastName} - {selectedStudent.gradeSection}
            </p>
            
            <div style={{ background: 'white', padding: '16px', display: 'inline-block', borderRadius: '8px' }}>
              <QRCodeCanvas 
                value={selectedStudent.qrCode} 
                size={256}
                level="H"
                includeMargin={true}
                ref={qrRef}
              />
            </div>
            
            <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
              <button type="button" className="btn-secondary" onClick={handleCloseQrModal}>Cerrar</button>
              <button type="button" className="btn-primary" style={{ width: 'auto' }} onClick={downloadQrCode}>Descargar QR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

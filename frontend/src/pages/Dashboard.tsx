import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface SummaryData {
  total: number;
  presentes: number;
  temprano: number;
  tarde: number;
  faltas: number;
}

interface HistoryRecord {
  id: number;
  dateTime: string;
  status: string;
  student: {
    firstName: string;
    lastName: string;
    gradeSection: string;
  }
}

export const Dashboard = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, historyRes] = await Promise.all([
          api.get('/metrics/summary'),
          api.get('/metrics/history?limit=10')
        ]);
        
        setSummary(summaryRes.data);
        setHistory(historyRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="page-container loading">Cargando métricas...</div>;

  return (
    <div className="page-container dashboard">
      <header className="page-header">
        <h2>Resumen del Día</h2>
      </header>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon blue"><Users size={20} /></div>
          <div className="metric-info">
            <span className="metric-value">{summary?.total || 0}</span>
            <span className="metric-label">Total Alumnos</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon green"><CheckCircle size={20} /></div>
          <div className="metric-info">
            <span className="metric-value">{summary?.temprano || 0}</span>
            <span className="metric-label">Temprano</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon yellow"><Clock size={20} /></div>
          <div className="metric-info">
            <span className="metric-value">{summary?.tarde || 0}</span>
            <span className="metric-label">Tarde</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon red"><AlertTriangle size={20} /></div>
          <div className="metric-info">
            <span className="metric-value">{summary?.faltas || 0}</span>
            <span className="metric-label">Faltas</span>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Últimos Registros</h3>
        <div className="history-list">
          {history.length === 0 ? (
            <p className="empty-state">No hay registros hoy</p>
          ) : (
            history.map((record) => (
              <div key={record.id} className="history-item">
                <div className="student-info">
                  <span className="name">{record.student.firstName} {record.student.lastName}</span>
                  <span className="grade">{record.student.gradeSection}</span>
                </div>
                <div className="scan-details">
                  <span className={`status-badge ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                  <span className="time">
                    {new Date(record.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

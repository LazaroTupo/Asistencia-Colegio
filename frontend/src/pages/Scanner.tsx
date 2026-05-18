import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import api from '../services/api';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ScanResult {
  success: boolean;
  message: string;
  studentName?: string;
}

export const Scanner = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const qrReader = document.getElementById("qr-reader");
    if (qrReader && qrReader.innerHTML !== "") {
      return; // Ya está inicializado
    }

    // Configuración del escaner
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
      }
    };
  }, []);

  const onScanSuccess = async (decodedText: string, _decodedResult: any) => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    try {
      const response = await api.post('/attendance/scan', { qrCode: decodedText });
      const record = response.data.record;
      
      setScanResult({
        success: true,
        message: 'Asistencia registrada',
        studentName: `${record.student.firstName} ${record.student.lastName}`
      });
    } catch (error: any) {
      console.error('Error en escaneo:', error);
      setScanResult({
        success: false,
        message: error.response?.data?.error || error.message || 'Error al procesar QR'
      });
    } finally {
      // Ocultar mensaje después de 2.5 segundos y permitir nuevo escaneo
      setTimeout(() => {
        setScanResult(null);
        isProcessingRef.current = false;
      }, 2500);
    }
  };

  const onScanFailure = (_error: any) => {
    // ignorar errores constantes de la cámara buscando un código
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>Lector QR</h2>
      </header>

      <div className="scanner-wrapper">
        <div id="qr-reader" className="qr-reader-container"></div>
        
        {/* Overlay Toast Feedback */}
        {scanResult && (
          <div className={`scan-feedback ${scanResult.success ? 'success' : 'error'}`}>
            <div className="feedback-content">
              {scanResult.success ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
              <h3>{scanResult.message}</h3>
              {scanResult.studentName && <p>{scanResult.studentName}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

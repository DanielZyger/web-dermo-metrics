'use client'

import { Card } from 'primereact/card';
import FingerprintUpload from './fingerprint-upload';
import { fingerParse } from '@/app/utils/constants';

const FingerprintSession = ({ volunteer, formData, setFormData, toast }) => {
  return (
    <Card 
      title="Cadastro de Digitais"
      style={{ 
        marginBottom: '32px',
        padding: 15,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
      }}
    >
      {/* Mão Esquerda */}
      <div style={{ marginBottom: '40px' }}>
        <h4 style={{ 
          margin: '10px 0 20px 0', 
          color: '#374151', 
          fontSize: '16px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Mão Esquerda
        </h4>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          gap: '16px',
          width: '100%'
        }}>
          {Object.keys(fingerParse).map(finger => (
            <div key={`left-${finger}`} style={{ flex: 1 }}>
              <FingerprintUpload 
                hand="leftHand" 
                finger={finger}
                handLabel="Esquerda"
                formData={formData}
                setFormData={setFormData}
                toast={toast}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mão Direita */}
      <div>
        <h4 style={{ 
          margin: '0 0 20px 0', 
          color: '#374151', 
          fontSize: '16px', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Mão Direita
        </h4>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          gap: '16px',
          width: '100%'
        }}>
          {Object.keys(fingerParse).map(finger => (
            <div key={`right-${finger}`} style={{ flex: 1 }}>
              <FingerprintUpload 
                hand="rightHand" 
                finger={finger}
                handLabel="Direita"
                formData={formData}
                setFormData={setFormData}
                toast={toast}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default FingerprintSession;
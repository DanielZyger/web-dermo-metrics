'use client'

import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { useEffect } from 'react';
import { useApi } from '@/app/hooks/use-api';
import { useApiItem } from '@/app/hooks/use-api-item';
import { genderParse } from '@/app/utils/constants';
import { useSearchParams } from 'next/navigation';

const PersonalDataForm = () => {    
  const searchParams = useSearchParams();
  const volunteerId = searchParams.get('volunteer_id');
  const {data: volunteer, loading} = useApiItem<Volunteer>(`/volunteers/${volunteerId}`)

    if(loading || !volunteer) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#F3F4F6" }}>
        Carregando Dados 
      </div>
    )
  }

  return (
    <Card title="Dados Pessoais" style={{ marginBottom: '24px', padding: 15 }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginTop: 10,
        marginBottom: '32px'
      }}>
        {/* ID do Voluntário */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px',
            fontWeight: '600', 
            color: '#6b7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            ID do Voluntário
          </label>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#111827'
          }}>
            {volunteer.id}
          </span>
        </div>

        {/* Nome Completo */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px',
            fontWeight: '600', 
            color: '#6b7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Nome Completo
          </label>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827'
          }}>
            {volunteer.name || '-'}
          </span>
        </div>

        {/* Idade */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px',
            fontWeight: '600', 
            color: '#6b7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Idade
          </label>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827'
          }}>
            {volunteer.age ? `${volunteer.age} anos` : '-'}
          </span>
        </div>

        {/* Gênero */}
        <div style={{ 
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px',
            fontWeight: '600', 
            color: '#6b7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Gênero
          </label>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827'
          }}>
            {genderParse[volunteer.gender]}
          </span>
        </div>

        <div style={{ 
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{ 
            display: 'block', 
            fontSize: '14px',
            fontWeight: '600', 
            color: '#6b7280',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Telefone de Contato

          </label>
          <span style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#111827'
          }}>
            {volunteer.phone}
          </span>
        </div>

      <div style={{ 
        padding: '24px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <label style={{ 
          display: 'block', 
          fontSize: '16px',
          fontWeight: '600', 
          color: '#6b7280',
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Observações
        </label>
        <div style={{ 
          fontSize: '16px', 
          lineHeight: '1.6',
          color: '#374151',
          backgroundColor: '#ffffff',
          padding: '16px',
          borderRadius: '6px',
          border: '1px solid #d1d5db',
          minHeight: '80px'
        }}>
          {volunteer.description || 'Nenhuma observação registrada.'}
        </div>
      </div>

    </div>
    </Card>
  )
};

export default PersonalDataForm;
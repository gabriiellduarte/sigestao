import React from 'react';

const TEST_DATA = {
  pacienteNome: 'Maria da Silva',
  procedimentoNome: 'Ultrassonografia Abdominal',
  pacienteCNS: '123 4567 8901 2345',
  pacienteTelefone1: '(88) 99999-8888',
  pacienteTelefone2: '(88) 98888-7777',
  pacienteNascimento: '1985-04-12',
  pacienteEndereco: 'Rua das Flores',
  pacienteEnderecoN: '123',
  pacienteCPF: '123.456.789-00',
  pacienteBairro: 'Centro',
  usuarioNome: 'João Operador',
  dataSolicitacao: '2024-07-10',
  protocolo: '20240710001'
};

const AtendimentoDocument = ({ data }: { data?: any }) => {
  const renderData = data || TEST_DATA;
  if (!renderData) return null;

  const {
    pacienteNome,
    procedimentoNome,
    pacienteCNS,
    pacienteTelefone1,
    pacienteTelefone2,
    pacienteNascimento,
    pacienteEndereco,
    pacienteEnderecoN,
    pacienteCPF,
    pacienteBairro,
    usuarioNome,
    dataSolicitacao,
    protocolo
  } = renderData;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Sans Serif', fontSize: 12, width: '100%', maxWidth: 800, margin: '0 auto' }}>
      <table style={{ width: '100%', marginBottom: 10 }}>
        <tbody>
          <tr>
            <td style={{ width: '20%', verticalAlign: 'center', textAlign: 'left' }}>
              <img src="/imagens/logopreta-vertical.png" alt="Logo" style={{ height: 50 }} />
            </td>
            <td style={{ width: '60%', verticalAlign: 'center', textAlign: 'left' }}>
              <h2 style={{ textAlign: 'left', margin: '5px 0' }}>Comprovante de Atendimento para Fila de Espera</h2>
              <h3 style={{ textAlign: 'left', fontSize: 10 }}>SECRETARIA MUNICIPAL DA SAÚDE DO ARACATI</h3>
            </td>
            <td style={{ width: '20%', verticalAlign: 'center', textAlign: 'right' }}>
              <div style={{ fontSize: 8 }}>Data de impressão: {formatDate(new Date().toISOString())}</div>
              <div style={{ fontSize: 8 }}>Nº de Solicitação: #{protocolo}</div>
              <div style={{ fontSize: 8 }}>Cadastrado por: {usuarioNome}</div>
            </td>
          </tr>
          
        </tbody>
      </table>
      <table style={{ width: '100%', marginBottom: 10 }}>
        <tbody>
          <tr>
            <td style={{width:'100%'}}>
              <hr />

            </td>
          </tr>
        </tbody>
        
      </table>
      
      <div style={{ fontSize: 9, marginBottom: 4 }}><strong>Nome:</strong> {pacienteNome}</div>
      <div style={{ fontSize: 9, marginBottom: 4 }}><strong>Nascimento:</strong> {formatDate(pacienteNascimento)}</div>
      <div style={{ fontSize: 9, marginBottom: 4 }}><strong>Cartão do SUS:</strong> {pacienteCNS || 'Não cadastrado'}</div>
      <div style={{ fontSize: 9, marginBottom: 4 }}><strong>CPF:</strong> {pacienteCPF || 'Não cadastrado'}</div>
      <div style={{ fontSize: 9, marginBottom: 4 }}><strong>Telefone:</strong> {pacienteTelefone1} | {pacienteTelefone2 || 'N/A'}</div>
      <div style={{ fontSize: 9, marginBottom: 4 }}><strong>Endereço:</strong> {pacienteEndereco || 'N/A'}, {pacienteEnderecoN || 'N/A'}</div>
      <table style={{width: '100%', border: '1px solid black', padding: '20px'}}>
        <tbody>
          <tr>
            <td style={{ fontSize: 9, paddingLeft: 10 }}>
              <strong>Procedimento:</strong> {procedimentoNome}
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: 9, paddingLeft: 10 }}>
              <strong>Data da Solicitação: </strong>{formatDate(dataSolicitacao)}
            </td>
          </tr>
        </tbody>
      </table>
      

      <div style={{ fontSize: 7, marginBottom: 4 }}><strong>Próximos passos:</strong></div>
      <div style={{ fontSize: 9, background: '#EEE', padding: 10 }}>
        Ao ser liberada vaga para o procedimento solicitado você receberá uma ligação para se digirir até a central de regulação para receber seu agendamento devendo ter em mãos o DOCUMENTO ORIGINAL DE IDENTIFICAÇÃO E GUIA DE REFERÊNCIA ORIGINAL.
      </div>

      <div style={{ background: '#E6E6E6', textAlign: 'center', fontSize: 8, padding: 5, marginTop: 20 }}>
        PREFEITURA DO ARACATI - CAMINHANDO COM O POVO
      </div>
    </div>
  );
};

export default AtendimentoDocument;

import React, { useRef } from 'react';
import {useReactToPrint} from 'react-to-print';
import AtendimentoDocument from './ComprovanteJasper';
import { usePage } from '@inertiajs/react';

type AtendimentoPageProps = {
    atendimento: {
      id: number
      data: string
      // adicione mais campos conforme necessário
    }
    paciente: {
      nome: string
      // etc.
    }
  }

const AtendimentoPrintPage = () => {
    const {atendimento} = usePage<AtendimentoPageProps>().props;
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  console.log(atendimento);
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button onClick={reactToPrintFn}>Imprimir</button>
      </div>

      <div ref={contentRef}>
        <AtendimentoDocument data={atendimento} />
      </div>
    </div>
  );
};

export default AtendimentoPrintPage;

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, MapPin, Star, Clock, Calendar } from 'lucide-react';

export const CrachaBugueiro: React.FC = () => {

  // Mock data - em produção viria da API baseado no ID
  const bugueiro = {
    id: '1',
    nome: 'Beto',
    telefone: '(85) 99999-9999',
    email: 'joao.silva@email.com',
    endereco: 'Rua das Palmeiras, 123 - Fortaleza/CE',
    status: 'Ativo',
    categoria: 'Premium',
    avaliacao: 4.8,
    totalPasseios: 156,
    dataRegistro: '15/03/2023',
    foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3pycN5eOxNdobV65uBPcwagivjUB12HWIyw&s',
    placa: 'ABC-1234',
    modeloBuggy: 'Fiber Laranja'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-green-500';
      case 'Inativo': return 'bg-red-500';
      case 'Suspenso': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Premium': return 'bg-gold text-black';
      case 'Padrão': return 'bg-blue-500 text-white';
      case 'Iniciante': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-600 text-white p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">CRACHÁ DIGITAL</h1>
          <p className="text-blue-100">Bugueiro Credenciado</p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Foto e Info Principal */}
          <div className="text-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 mx-auto border-4 border-blue-200">
                <AvatarImage src={bugueiro.foto} alt={bugueiro.nome} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                  {bugueiro.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${getStatusColor(bugueiro.status)} border-2 border-white`}></div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">{bugueiro.nome}</h2>
              <p className="text-gray-600">ID: #{bugueiro.id}</p>
            </div>

            <div className="flex justify-center gap-2">
              <Badge className={getCategoriaColor(bugueiro.categoria)}>
                {bugueiro.categoria}
              </Badge>
              <Badge variant="outline" className="text-green-700 border-green-300">
                {bugueiro.status}
              </Badge>
            </div>
          </div>

          {/* Avaliação */}
          <div className="text-center bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-xl font-bold text-yellow-700">{bugueiro.avaliacao}</span>
            </div>
            <p className="text-sm text-yellow-600">{bugueiro.totalPasseios} passeios realizados</p>
          </div>

          {/* Informações de Contato */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{bugueiro.telefone}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm">{bugueiro.endereco}</span>
            </div>
          </div>

          {/* Informações do Veículo */}
          <div className="bg-blue-50 rounded-lg p-3 space-y-2">
            <h3 className="font-semibold text-blue-800">Veículo</h3>
            <div className="text-sm text-blue-700">
              <p><strong>Modelo:</strong> {bugueiro.modeloBuggy}</p>
              <p><strong>Placa:</strong> {bugueiro.placa}</p>
            </div>
          </div>

          {/* Data de Registro */}
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Credenciado desde {bugueiro.dataRegistro}</span>
          </div>

          {/* QR Code Placeholder */}
          <div className="text-center pt-4 border-t">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-xs text-gray-500">QR</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Código de Verificação</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrachaBugueiro;
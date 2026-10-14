"use client";

import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  RotateCcw, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { FormSchema } from '@/components/builder/types';
import FormRunner from './FormRunner';

interface LivePreviewProps {
  schema: FormSchema;
  accentColor: string;
}

export default function LivePreview({ schema, accentColor }: LivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  const handleResetPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barra de Controle do Simulador */}
      <div className="bg-[#0e0e14]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 px-4 mb-4 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
            <Eye className="w-4 h-4" style={{ color: accentColor }} />
            Preview ao Vivo
          </span>
          <span className="hidden sm:inline-block text-[11px] text-white/40 border-l border-white/10 pl-2">
            Simulador Dinâmico
          </span>
        </div>

        {/* Alternador Desktop / Mobile */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-white/15 text-white shadow-md'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-white/15 text-white shadow-md'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Botão Reiniciar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetPreview}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Reiniciar Simulação"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Área de Visualização */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-y-auto min-h-[550px] relative rounded-3xl bg-neutral-950/60 border border-white/5">
        {/* Glow dinâmico no fundo */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 blur-3xl rounded-3xl transition-colors duration-500"
          style={{ 
            background: `radial-gradient(circle at 50% 30%, ${accentColor} 0%, transparent 70%)` 
          }}
        />

        {deviceMode === 'desktop' ? (
          /* Moldura Desktop */
          <div className="w-full max-w-2xl relative z-10 py-4">
            <FormRunner 
              key={`desktop_${previewKey}`}
              form={schema as any}
              isStandalone={false}
              onSubmitAnswers={(data: any) => {
                console.log('Simulação de envio (Desktop):', data);
              }}
            />
          </div>
        ) : (
          /* Moldura Smartphone */
          <div className="relative z-10 w-[380px] max-w-full my-6">
            <div className="rounded-[44px] p-3.5 bg-neutral-900/90 border-4 border-neutral-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl relative">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-neutral-800 mr-2" />
                <div className="w-10 h-1.5 rounded-full bg-neutral-800" />
              </div>

              {/* Tela do Celular */}
              <div className="rounded-[32px] overflow-hidden bg-black/95 border border-white/10 max-h-[640px] overflow-y-auto px-3.5 pt-10 pb-6 relative">
                <FormRunner 
                  key={`mobile_${previewKey}`}
                  form={schema as any}
                  isStandalone={false}
                  onSubmitAnswers={(data: any) => {
                    console.log('Simulação de envio (Mobile):', data);
                  }}
                />
              </div>

              {/* Barra Home */}
              <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-2" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-2xl font-bold">
          404
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Página não encontrada
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          O recurso ou documento solicitado não existe ou foi realocado na Plataforma Soberana.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/10"
          >
            Retornar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

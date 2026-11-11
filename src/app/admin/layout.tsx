import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { requireAdminSession } from '@/lib/auth/admin-guard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Bunker Administrativo Soberano | Mateus Celestino Pro X',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdminSession();

  if (!auth.authenticated) {
    redirect('/comunidade/login?redirectUrl=' + encodeURIComponent('/admin'));
  }

  if (!auth.authorized) {
    redirect('/comunidade?error=acesso_negado');
  }

  return <>{children}</>;
}

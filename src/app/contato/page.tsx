'use client';

import React from 'react';
import ContatoSection from '@/components/portal/ContatoSection';
import siteData from '@/data/siteData.json';

export default function ContatoPage() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full bg-transparent text-[#ececec] flex flex-col selection:bg-[#ff073a] selection:text-white">
      <ContatoSection profile={siteData?.profile || {}} />
    </div>
  );
}

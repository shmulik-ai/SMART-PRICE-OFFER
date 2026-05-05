import React from 'react';

interface Props {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  rtl?: boolean;
}

export default function FormSection({ title, icon, children, rtl }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-slate-100 ${rtl ? 'flex-row-reverse' : ''}`}>
        <span className="text-slate-400">{icon}</span>
        <h2 className="font-semibold text-slate-600 text-sm tracking-widest uppercase">{title}</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5" dir={rtl ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </div>
  );
}

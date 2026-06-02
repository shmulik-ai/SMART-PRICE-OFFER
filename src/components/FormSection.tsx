import React from 'react';

interface Props {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  rtl?: boolean;
}

export default function FormSection({ title, icon, children, rtl }: Props) {
  return (
    <div className="section-card overflow-hidden animate-slide-up">
      <div
        className={`relative flex items-center gap-3 px-6 py-4 border-b border-slate-100 ${rtl ? 'flex-row-reverse' : ''}`}
        style={{ background: 'linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)' }}
      >
        <span
          className="absolute top-0 bottom-0"
          style={{
            [rtl ? 'right' : 'left']: 0,
            width: 3,
            background: 'linear-gradient(180deg, #d4a847, #b8922a)',
          } as React.CSSProperties}
        />
        <span className="grid place-items-center w-8 h-8 rounded-lg bg-brand-50 text-brand-700">
          {icon}
        </span>
        <h2 className="font-bold text-navy-900 text-base tracking-wider uppercase">
          {title}
        </h2>
      </div>

      <div
        className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
        dir={rtl ? 'rtl' : 'ltr'}
      >
        {children}
      </div>
    </div>
  );
}

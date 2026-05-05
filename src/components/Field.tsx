import React from 'react';

interface FieldProps {
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  unit?: string;
  span?: boolean;
  rtl?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

const base =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 focus:bg-white transition';

export default function Field({ label, type, value, onChange, required, unit, span, rtl, placeholder, options, rows }: FieldProps) {
  const dir = rtl ? 'rtl' : 'ltr';
  const ta  = rtl ? 'text-right' : '';

  let control: React.ReactNode;

  if (type === 'select') {
    control = (
      <select value={value} onChange={e => onChange(e.target.value)} dir={dir} className={`${base} ${ta}`}>
        <option value="">{placeholder || '—'}</option>
        {(options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else if (type === 'textarea') {
    control = (
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows ?? 3} dir={dir}
        className={`${base} resize-none ${ta}`}
      />
    );
  } else {
    control = (
      <div className="relative flex items-center">
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} dir={dir}
          className={`${base} ${unit ? (rtl ? 'pl-12' : 'pr-12') : ''} ${ta}`}
        />
        {unit && (
          <span className={`absolute ${rtl ? 'left-3' : 'right-3'} text-xs font-medium text-slate-400 pointer-events-none`}>
            {unit}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={span ? 'md:col-span-2' : ''}>
      <label className={`block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest ${rtl ? 'text-right' : ''}`}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {control}
    </div>
  );
}

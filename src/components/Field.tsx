import React from 'react';

interface FieldProps {
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'combo';
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
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-500 focus:bg-white ' +
  'hover:border-slate-300 hover:bg-white transition-all duration-200';

export default function Field({ label, type, value, onChange, required, unit, span, rtl, placeholder, options, rows }: FieldProps) {
  const dir = rtl ? 'rtl' : 'ltr';
  const ta  = rtl ? 'text-right' : '';
  const filled = value && value.length > 0;

  let control: React.ReactNode;

  if (type === 'select') {
    control = (
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        dir={dir}
        className={`${base} ${ta} ${filled ? 'bg-white border-slate-300' : ''} appearance-none cursor-pointer`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: rtl ? 'left 12px center' : 'right 12px center',
          paddingRight: rtl ? '12px' : '34px',
          paddingLeft:  rtl ? '34px' : '12px',
        }}
      >
        <option value="">{placeholder || '-'}</option>
        {(options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  } else if (type === 'combo') {
    const listId = `dl-${label.replace(/\s+/g, '-')}`;
    control = (
      <>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          list={listId}
          className={`${base} ${ta} ${filled ? 'bg-white border-slate-300' : ''}`}
        />
        <datalist id={listId}>
          {(options || []).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </datalist>
      </>
    );
  } else if (type === 'textarea') {
    control = (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows ?? 3}
        dir={dir}
        className={`${base} resize-none ${ta} ${filled ? 'bg-white border-slate-300' : ''}`}
      />
    );
  } else {
    control = (
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          className={`${base} ${unit ? (rtl ? 'pl-12' : 'pr-12') : ''} ${ta} ${filled ? 'bg-white border-slate-300' : ''}`}
        />
        {unit && (
          <span className={`absolute ${rtl ? 'left-3' : 'right-3'} text-xs font-bold text-brand-700 pointer-events-none bg-brand-50 px-1.5 py-0.5 rounded`}>
            {unit}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={span ? 'md:col-span-2' : ''}>
      <label className={`block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wider ${rtl ? 'text-right' : ''}`}>
        {label}{required && <span className="text-red-400 ms-1">*</span>}
      </label>
      {control}
    </div>
  );
}

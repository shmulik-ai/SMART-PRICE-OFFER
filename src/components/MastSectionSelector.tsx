import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { MastSection } from '../types';
import { Translations } from '../i18n';

interface Props {
  sections: MastSection[];
  onChange: (sections: MastSection[]) => void;
  tr: Translations;
  rtl: boolean;
}

const inputBase =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-500 ' +
  'hover:border-slate-300 transition';

export default function MastSectionSelector({ sections, onChange, tr, rtl }: Props) {
  const update = (index: number, field: keyof MastSection, value: string) => {
    const next = sections.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange(next);
  };

  const add = () => onChange([...sections, { type: '', quantity: '' }]);

  const remove = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {sections.map((sec, i) => (
        <div
          key={i}
          className={`flex gap-2 items-center group ${rtl ? 'flex-row-reverse' : ''}`}
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          <select
            value={sec.type}
            onChange={e => update(i, 'type', e.target.value)}
            dir={rtl ? 'rtl' : 'ltr'}
            className={`${inputBase} flex-1`}
          >
            <option value="">{tr.selectPlaceholder}</option>
            {tr.mastTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            value={sec.quantity}
            onChange={e => update(i, 'quantity', e.target.value)}
            placeholder={tr.mastQty}
            min="0"
            dir={rtl ? 'rtl' : 'ltr'}
            className={`${inputBase} w-24 text-center font-semibold`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
            aria-label="Remove section"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className={`mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 border border-brand-200 transition ${rtl ? 'flex-row-reverse' : ''}`}
      >
        <Plus size={14} />
        {tr.addMastSection}
      </button>
    </div>
  );
}

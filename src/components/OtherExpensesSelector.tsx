import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { OtherExpense } from '../types';
import { Translations } from '../i18n';

interface Props {
  items: OtherExpense[];
  onChange: (items: OtherExpense[]) => void;
  tr: Translations;
  rtl: boolean;
}

const inputBase =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-500 ' +
  'hover:border-slate-300 transition min-w-0';

const COLS = '1fr 140px 36px';

export default function OtherExpensesSelector({ items, onChange, tr, rtl }: Props) {
  const update = (index: number, field: keyof OtherExpense, value: string) => {
    const next = items.map((it, i) => i === index ? { ...it, [field]: value } : it);
    onChange(next);
  };
  const add = () => onChange([...items, { description: '', amount: '' }]);
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <div
        className={`grid gap-2 mb-1 ${rtl ? 'text-right' : ''}`}
        style={{ gridTemplateColumns: COLS }}
      >
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{tr.expenseDesc}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold text-center">{tr.expenseAmount}</span>
        <span />
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          className="grid gap-2 items-center group"
          style={{ gridTemplateColumns: COLS, animation: 'slideUp 0.3s ease-out' }}
        >
          <input
            type="text"
            value={it.description}
            onChange={e => update(i, 'description', e.target.value)}
            placeholder={rtl ? 'לדוגמה: צביעה, שיפוץ, חלקי חילוף...' : 'e.g. painting, refurbishment, spare parts...'}
            dir={rtl ? 'rtl' : 'ltr'}
            className={`${inputBase} w-full`}
          />
          <input
            type="number"
            value={it.amount}
            onChange={e => update(i, 'amount', e.target.value)}
            placeholder="0"
            min="0"
            dir={rtl ? 'rtl' : 'ltr'}
            className={`${inputBase} w-full text-center font-semibold`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition justify-self-center"
            aria-label="Remove expense"
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
        {tr.addOtherExpense}
      </button>
      <div className={`text-[11px] text-slate-500 mt-1 ${rtl ? 'text-right' : ''}`}>{tr.otherExpensesHint}</div>
    </div>
  );
}

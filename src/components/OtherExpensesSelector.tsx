import React from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { OtherExpense } from '../types';
import { Translations } from '../i18n';

interface Props {
  items: OtherExpense[];
  onChange: (items: OtherExpense[]) => void;
  included: boolean;
  onToggleIncluded: (v: boolean) => void;
  tr: Translations;
  rtl: boolean;
  defaultCurrency?: string;
}

const inputBase =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-500 ' +
  'hover:border-slate-300 transition min-w-0';

const CURRENCIES = [
  { value: 'EUR', label: '€ EUR' },
  { value: 'ILS', label: '₪ ILS' },
  { value: 'USD', label: '$ USD' },
];

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '€', ILS: '₪', USD: '$' };
const VAT_RATE = 0.18;
const COLS = '1fr 100px 120px 36px';

function fmt(n: number) {
  return n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function OtherExpensesSelector({
  items, onChange, included, onToggleIncluded, tr, rtl, defaultCurrency = 'EUR',
}: Props) {
  const update = (index: number, field: keyof OtherExpense, value: string) => {
    const next = items.map((it, i) => (i === index ? { ...it, [field]: value } : it));
    onChange(next);
  };
  const add = () => onChange([...items, { description: '', amount: '', currency: defaultCurrency }]);
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const currencyTotals: Record<string, number> = {};
  for (const it of items) {
    const cur = it.currency || 'EUR';
    currencyTotals[cur] = (currencyTotals[cur] || 0) + (parseFloat(it.amount) || 0);
  }
  const ilsSubtotal = currencyTotals['ILS'] || 0;
  const ilsVat = ilsSubtotal * VAT_RATE;
  const ilsGross = ilsSubtotal + ilsVat;
  const nonIlsCurrencies = Object.keys(currencyTotals).filter((c) => c !== 'ILS');

  const shekelSign = '₪';
  const labelCurrency = rtl ? 'מטבע' : 'Currency';
  const labelSummary = rtl ? 'סיכום הוצאות' : 'Expense Summary';
  const labelTotal = rtl ? 'סהכ' : 'Total';
  const labelBeforeVat = rtl
    ? shekelSign + ' (לפני מעמ)'
    : '₪ (before VAT)';
  const labelVat = rtl ? 'מעמ 18%' : 'VAT 18%';
  const labelIncVat = rtl
    ? 'סהכ ' + shekelSign + ' כולל מעמ'
    : 'Total ₪ incl. VAT';
  const labelPlaceholder = rtl
    ? 'לדוגמא...'
    : 'e.g. painting, refurbishment...';
  const labelIncluded = rtl
    ? '✓ ההוצאות נכנסות לסכום הכולל'
    : '✓ Expenses are included in the final total';

  const rowCls = 'flex justify-between text-sm ' + (rtl ? 'flex-row-reverse' : '');
  const addBtnCls =
    'mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800 ' +
    'px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 border border-brand-200 transition' +
    (rtl ? ' flex-row-reverse' : '');
  const toggleCls =
    'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all ' +
    (included
      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      : 'border-brand-400 bg-brand-50 text-brand-700 hover:bg-brand-100') +
    (rtl ? ' flex-row-reverse' : '');

  return (
    <div className="space-y-2">
      <div className={'grid gap-2 mb-1' + (rtl ? ' text-right' : '')} style={{ gridTemplateColumns: COLS }}>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{tr.expenseDesc}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold text-center">{labelCurrency}</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold text-center">{tr.expenseAmount}</span>
        <span />
      </div>

      {items.map((it, i) => (
        <div key={i} className="grid gap-2 items-center group" style={{ gridTemplateColumns: COLS }}>
          <input
            type="text"
            value={it.description}
            onChange={(e) => update(i, 'description', e.target.value)}
            placeholder={labelPlaceholder}
            dir={rtl ? 'rtl' : 'ltr'}
            className={inputBase + ' w-full'}
          />
          <select
            value={it.currency || 'EUR'}
            onChange={(e) => update(i, 'currency', e.target.value)}
            className={inputBase + ' w-full text-center font-bold cursor-pointer appearance-none'}>
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={it.amount}
            onChange={(e) => update(i, 'amount', e.target.value)}
            placeholder="0"
            min="0"
            dir={rtl ? 'rtl' : 'ltr'}
            className={inputBase + ' w-full text-center font-semibold'}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition justify-self-center"
            aria-label="Remove">
            <Trash2 size={15} />
              </button>
        </div>
      ))}

      <button type="button" onClick={add} className={addBtnCls}>
        <Plus size={14} />
        {tr.addOtherExpense}
      </button>

      {items.length > 0 && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-1.5">
          <div className={'text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1' + (rtl ? ' text-right' : '')}>
            {labelSummary}
          </div>

          {nonIlsCurrencies.map((c) => (
            <div key={c} className={rowCls + ' text-slate-600'}>
              <span>{labelTotal} {c}</span>
              <span className="font-semibold">{CURRENCY_SYMBOLS[c] || c} {fmt(currencyTotals[c])}</span>
            </div>
          ))}

          {ilsSubtotal > 0 && (
            <div className="space-y-1">
              <div className={rowCls + ' text-slate-600'}>
                <span>{labelTotal} {labelBeforeVat}</span>
                <span className="font-semibold">{shekelSign} {fmt(ilsSubtotal)}</span>
              </div>
              <div className={rowCls + ' text-slate-500'}>
                <span>{labelVat}</span>
                <span>{shekelSign} {fmt(ilsVat)}</span>
              </div>
              <div className={rowCls + ' text-sm font-bold border-t border-slate-200 pt-1.5'} style={{ color: '#0f2744' }}>
                <span>{labelIncVat}</span>
                <span style={{ color: '#b8922a' }}>{shekelSign} {fmt(ilsGross)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-slate-200 pt-3 mt-3">
        <div className={'text-[11px] text-slate-400 mb-3' + (rtl ? ' text-right' : '')}>{tr.otherExpensesHint}</div>

        <button type="button" onClick={() => onToggleIncluded(!included)} className={toggleCls}>
          {included
            ? <CheckCircle2 size={16} className="text-emerald-500" />
            : <Circle size={16} className="text-brand-400" />}
          {included ? tr.includedInTotal : tr.addToTotal}
        </button>

        {included && (
          <span className={(rtl ? 'me-3' : 'ms-3') + ' text-[11px] text-emerald-600 font-semibold'}>
            {labelIncluded}
          </span>
        )}
      </div>
    </div>
  );
}

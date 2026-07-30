import React, { useRef } from 'react';
import {
  User, Cpu, Cog, Package, DollarSign, Hash,
  FileText, X, ImageIcon, CheckCircle2, Sparkles, Plus, Trash2,
} from 'lucide-react';
import FormSection from './FormSection';
import Field from './Field';
import MastSectionSelector from './MastSectionSelector';
import OtherExpensesSelector from './OtherExpensesSelector';
import { QuotationData } from '../types';
import { Translations } from '../i18n';

interface Props {
  data: QuotationData;
  onChange: (data: QuotationData) => void;
  tr: Translations;
  rtl: boolean;
}

const RMA_LOGO_URL = `${import.meta.env.BASE_URL}rma-logo.jpg`;

export default function QuotationForm({ data, onChange, tr, rtl }: Props) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof QuotationData) => (value: string) =>
    onChange({ ...data, [key]: value } as QuotationData);

  const val = (key: keyof QuotationData) => data[key] as string;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange({ ...data, companyLogo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const clearLogo = () => onChange({ ...data, companyLogo: '' });
  const hasCustomLogo = !!data.companyLogo;
  const displayLogo = hasCustomLogo ? data.companyLogo : RMA_LOGO_URL;

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar ($)' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'ILS', label: 'ILS - שקל ישראלי' },
    { value: 'AED', label: 'AED - UAE Dirham' },
  ];

  const cabinOptions = [
    { value: 'Ultra View',  label: tr.cabinUltraView },
    { value: 'Vision 140',  label: tr.cabinVision140 },
    { value: 'Delkos',      label: tr.cabinDelkos },
  ];

  const conditionOptions = [
    { value: 'New',          label: tr.condNew },
    { value: 'Refurbished',  label: tr.condRefurb },
    { value: 'Used - Good',  label: tr.condUsedGood },
    { value: 'Used - Fair',  label: tr.condUsedFair },
  ];

const trolleyTypeOptions = [
    { value: '2C',    label: '2C' },
    { value: 'SM/DM', label: 'SM/DM' },
  ];

  const incotermsOptions = [
    { value: 'EXW', label: tr.exw },
    { value: 'FOB', label: tr.fob },
    { value: 'CIF', label: tr.cif },
    { value: 'DAP', label: tr.dap },
    { value: 'DDP', label: tr.ddp },
    { value: 'AS IS', label: tr.asIs },
  ];

  return (
    <div className="space-y-5 animate-fade-in">

      <FormSection title={tr.secQuotation} icon={<Hash size={16} />} rtl={rtl}>
        <Field label={tr.quoteNumber}     type="text" value={val('quoteNumber')} onChange={set('quoteNumber')} required placeholder="QT-2025-001" rtl={rtl} />
        <Field label={tr.quoteDate}       type="date" value={val('quoteDate')}   onChange={set('quoteDate')}   required rtl={rtl} />
        <Field label={tr.validUntilField} type="date" value={val('validUntil')}  onChange={set('validUntil')}  required rtl={rtl} />
        <Field label={tr.quoteValidity}   type="text" value={val('quoteValidity')} onChange={set('quoteValidity')} rtl={rtl} placeholder="לדוגמה: 30 יום, 45 ימים..." />
        <Field label={tr.salesRepField}   type="text" value={val('salesRep')}    onChange={set('salesRep')}    rtl={rtl} />
        <Field label={tr.companyName}     type="text" value={val('companyName')} onChange={set('companyName')} required span rtl={rtl} placeholder="RMA Cranes Ltd." />

        <div className="md:col-span-2">
          <label className={`block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wider ${rtl ? 'text-right' : ''}`}>
            {tr.companyLogo}
          </label>

          <div
            className={`relative flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-300 ${
              hasCustomLogo
                ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white'
                : 'border-brand-200 bg-gradient-to-br from-brand-50/60 to-white'
            } ${rtl ? 'flex-row-reverse' : ''}`}
          >
            <div className="shrink-0 grid place-items-center bg-white rounded-lg shadow-sm border border-slate-100 p-2 h-20 w-20">
              <img src={displayLogo} alt="Logo" className="max-h-full max-w-full object-contain"
                onError={e => { (e.target as HTMLImageElement).src = RMA_LOGO_URL; }} />
            </div>

            <div className={`flex-1 min-w-0 ${rtl ? 'text-right' : ''}`}>
              <div
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
                  hasCustomLogo ? 'text-emerald-600' : 'text-brand-700'
                }`}
                style={{ flexDirection: rtl ? 'row-reverse' : 'row' }}
              >
                {hasCustomLogo ? <CheckCircle2 size={14} /> : <Sparkles size={14} />}
                <span>
                  {hasCustomLogo
                    ? (rtl ? 'לוגו מותאם אישית' : 'Custom logo loaded')
                    : (rtl ? 'לוגו ברירת מחדל - RMA' : 'Default logo - RMA')}
                </span>
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-700 truncate">
                {data.companyName || 'RMA Cranes'}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {hasCustomLogo
                  ? (rtl ? 'הלוגו יוצג בכותרת ובכל ההצעות' : 'Will appear on the header & every quote')
                  : (rtl ? 'לחץ להעלות לוגו של החברה שלך' : 'Click to upload your own company logo')}
              </div>
            </div>

            <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-700 hover:shadow-sm transition"
              >
                {hasCustomLogo ? tr.logoReplaceHint : tr.logoUploadHint}
              </button>
              {hasCustomLogo && (
                <button
                  type="button"
                  onClick={clearLogo}
                  className="grid place-items-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500 transition"
                  aria-label="Remove logo"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>
      </FormSection>

      <FormSection title={tr.secClient} icon={<User size={16} />} rtl={rtl}>
        {/* Highlighted "Prepared For" free-text field */}
        <div className="md:col-span-2">
          <label className={`block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wider ${rtl ? 'text-right' : ''}`}>
            {tr.preparedForField}
          </label>
          <div className="relative">
            <input
              type="text"
              value={val('preparedFor')}
              onChange={e => set('preparedFor')(e.target.value)}
              placeholder={tr.preparedForPlaceholder}
              dir={rtl ? 'rtl' : 'ltr'}
              className={`w-full rounded-lg border-2 border-brand-200 bg-gradient-to-br from-brand-50/40 to-white px-4 py-3 text-sm font-semibold text-navy-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-500 transition ${rtl ? 'text-right' : ''}`}
            />
          </div>
          <div className={`mt-1 text-[11px] text-slate-400 ${rtl ? 'text-right' : ''}`}>
            {tr.preparedForHint}
          </div>
        </div>

        <Field label={tr.clientCompany} type="text"  value={val('clientCompany')} onChange={set('clientCompany')} required rtl={rtl} />
        <Field label={tr.clientContact} type="text"  value={val('clientContact')} onChange={set('clientContact')} rtl={rtl} />
        <Field label={tr.clientAddress} type="text"  value={val('clientAddress')} onChange={set('clientAddress')} span rtl={rtl} />
        <Field label={tr.clientCity}    type="text"  value={val('clientCity')}    onChange={set('clientCity')}    rtl={rtl} />
        <Field label={tr.clientCountry} type="text"  value={val('clientCountry')} onChange={set('clientCountry')} rtl={rtl} />
        <Field label={tr.clientPhone}   type="tel"   value={val('clientPhone')}   onChange={set('clientPhone')}   rtl={rtl} />
        <Field label={tr.clientEmail}   type="email" value={val('clientEmail')}   onChange={set('clientEmail')}   rtl={rtl} />
      </FormSection>

      <FormSection title={tr.secSpecs} icon={<Cpu size={16} />} rtl={rtl}>
        <Field label={tr.manufacturer}       type="text"   value={val('manufacturer')}      onChange={set('manufacturer')}      rtl={rtl} placeholder="e.g. Liebherr / Potain / Comansa" />
        <Field label={tr.serialNumber}       type="text"   value={val('serialNumber')}      onChange={set('serialNumber')}      rtl={rtl} placeholder="לדוגמה: 12345" />
        <Field label={tr.craneModelField}    type="text"   value={val('craneModel')}        onChange={set('craneModel')}        required rtl={rtl} placeholder="לדוגמה: MDT219 J60" />
        <Field label={tr.manufacturingYear}  type="number" value={val('manufacturingYear')}  onChange={set('manufacturingYear')}  required rtl={rtl} placeholder="2021" />
        <Field label={tr.jibLength}          type="number" value={val('jibLength')}          onChange={set('jibLength')}          rtl={rtl} unit="m" placeholder="60" />
        <Field label={tr.freestandingHeight} type="number" value={val('freestandingHeight')} onChange={set('freestandingHeight')} rtl={rtl} unit="m" placeholder="45" />
        <Field label={tr.maxLoadCapacity}    type="number" value={val('maxLoadCapacity')}    onChange={set('maxLoadCapacity')}    rtl={rtl} unit="t" placeholder="8" />
        <Field label={tr.tipLoadCapacity}    type="number" value={val('tipLoadCapacity')}    onChange={set('tipLoadCapacity')}    rtl={rtl} unit="t" placeholder="2.3" />
        <Field label={tr.cabinType}          type="text"   value={val('cabinType')}          onChange={set('cabinType')}          rtl={rtl} placeholder="טקסט חופשי, לדוגמה: Ultra View" />
        <Field label={tr.craneCondition}     type="select" value={val('craneCondition')}     onChange={set('craneCondition')}     rtl={rtl} options={conditionOptions} placeholder={tr.selectPlaceholder} />

        <div className="md:col-span-2">
          <label className={`block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wider ${rtl ? 'text-right' : ''}`}>
            {tr.mastSectionsLabel}
          </label>
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className={`grid gap-1.5 mb-2 ${rtl ? 'text-right' : ''}`} style={{ gridTemplateColumns: '1fr 110px 36px' }}>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{tr.mastType}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold text-center">{tr.mastQty}</span>
              <span />
            </div>
            <MastSectionSelector
              sections={data.mastSections ?? [{ type: '', quantity: '' }]}
              onChange={ms => onChange({ ...data, mastSections: ms })}
              tr={tr}
              rtl={rtl}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title={tr.secWinches} icon={<Cog size={16} />} rtl={rtl}>
        <Field label={tr.hoistWinch}       type="text"  value={val('hoistWinch')}     onChange={set('hoistWinch')}     rtl={rtl} placeholder="e.g. 65 LVF 100" />
        <Field label={tr.trolleyWinch}     type="text"  value={val('trolleyWinch')}   onChange={set('trolleyWinch')}   rtl={rtl} placeholder="לדוגמה: 11 KW" />
        <Field label={tr.trolleyTypeField} type="combo" value={val('trolleyType')}    onChange={set('trolleyType')}    rtl={rtl} options={trolleyTypeOptions} placeholder={tr.selectPlaceholder} />
        <Field label={tr.certifications}   type="text"  value={val('certifications')} onChange={set('certifications')} span rtl={rtl} placeholder="לדוגמה: CE, ISO 9001..." />
      </FormSection>

      <FormSection title={tr.secCondition} icon={<Package size={16} />} rtl={rtl}>
        <Field label={tr.deliveryTerms}      type="select"   value={val('deliveryTerms')} onChange={set('deliveryTerms')} rtl={rtl} options={incotermsOptions} placeholder={tr.selectPlaceholder} />
        <Field label={tr.deliveryTimeField}  type="text"     value={val('deliveryTime')}  onChange={set('deliveryTime')}  rtl={rtl} placeholder="לדוגמה: 6-8 שבועות מרגע התשלום" />
        <Field label={tr.warrantyField}      type="text"     value={val('warranty')}      onChange={set('warranty')}      rtl={rtl} placeholder="לדוגמה: 12 חודשים" />
        <div />
        <Field label={tr.includedComponents} type="textarea" value={val('includedComponents')} onChange={set('includedComponents')} rtl={rtl} span rows={3} />
        <Field label={tr.excludedComponents} type="textarea" value={val('excludedComponents')} onChange={set('excludedComponents')} rtl={rtl} span rows={2} />
      </FormSection>

      <FormSection title={tr.secPricing} icon={<DollarSign size={16} />} rtl={rtl}>
        <Field label={tr.currency}          type="select"   value={val('currency')}        onChange={set('currency')}        rtl={rtl} options={currencyOptions} />
        <Field label={tr.unitPriceField}    type="number"   value={val('unitPrice')}       onChange={set('unitPrice')}       rtl={rtl} required placeholder="250000" />
        <Field label={tr.quantity}          type="number"   value={val('quantity')}        onChange={set('quantity')}        rtl={rtl} placeholder="1" />
        <Field label={tr.discountPct}       type="number"   value={val('discountPercent')} onChange={set('discountPercent')} rtl={rtl} unit="%" placeholder="0" />
        <Field label={tr.shippingCost}      type="number"   value={val('shippingCost')}    onChange={set('shippingCost')}    rtl={rtl} placeholder="0" />
        <Field label={tr.portPriceField}    type="number"   value={val('portPrice')}       onChange={set('portPrice')}       rtl={rtl} placeholder="0" />
        <Field label={tr.paymentTermsField} type="textarea" value={val('paymentTerms')}    onChange={set('paymentTerms')}    rtl={rtl} span rows={2} />
      </FormSection>

      <FormSection title={tr.secNotes} icon={<FileText size={16} />} rtl={rtl}>
        <div className="col-span-2 space-y-2">
          {(data.notes ? data.notes.split('\n').filter(l => l.trim()) : []).map((item, i, arr) => (
            <div key={i} className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
              <span className="text-xs font-bold text-amber-700 w-5 text-center flex-shrink-0">{i + 1}.</span>
              <input
                value={item.replace(/^\*\s*/, '')}
                onChange={e => {
                  const lines = data.notes.split('\n').filter(l => l.trim());
                  lines[i] = e.target.value;
                  onChange({ ...data, notes: lines.join('\n') });
                }}
                dir={rtl ? 'rtl' : 'ltr'}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                style={{ background: '#fffdf5' }}
                placeholder={rtl ? `הערה ${i + 1}...` : `Note ${i + 1}...`}
              />
              <button
                onClick={() => {
                  const lines = data.notes.split('\n').filter(l => l.trim());
                  lines.splice(i, 1);
                  onChange({ ...data, notes: lines.join('\n') });
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange({ ...data, notes: (data.notes ? data.notes + '\n' : '') + ' ' })}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-dashed border-amber-300 text-amber-700 hover:bg-amber-50 transition ${rtl ? 'flex-row-reverse' : ''}`}
          >
            <Plus size={13} /> {rtl ? '+ הוסף הערה' : '+ Add note'}
          </button>
        </div>
      </FormSection>

      <FormSection title={tr.secOtherExpenses} icon={<DollarSign size={16} />} rtl={rtl}>
        <div className="md:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <OtherExpensesSelector
              items={data.otherExpenses ?? []}
              onChange={items => onChange({ ...data, otherExpenses: items })}
              included={data.includeExpensesInTotal ?? false}
              onToggleIncluded={v => onChange({ ...data, includeExpensesInTotal: v })}
              tr={tr}
              rtl={rtl}
              defaultCurrency={data.currency}
            />
          </div>
        </div>
      </FormSection>

    </div>
  );
}

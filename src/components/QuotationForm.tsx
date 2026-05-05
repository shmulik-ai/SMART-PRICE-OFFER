import React, { useRef } from 'react';
import { User, Cpu, Zap, Package, DollarSign, Hash, Upload, FileText } from 'lucide-react';
import FormSection from './FormSection';
import Field from './Field';
import MastSectionSelector from './MastSectionSelector';
import { QuotationData } from '../types';
import { Translations } from '../i18n';

interface Props {
  data: QuotationData;
  onChange: (data: QuotationData) => void;
  tr: Translations;
  rtl: boolean;
}

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

  const currencyOptions = [
    { value: 'USD', label: 'USD — US Dollar ($)' },
    { value: 'EUR', label: 'EUR — Euro (€)' },
    { value: 'GBP', label: 'GBP — British Pound (£)' },
    { value: 'ILS', label: 'ILS — שקל ישראלי (₪)' },
    { value: 'AED', label: 'AED — UAE Dirham' },
  ];

  const cabinOptions = [
    { value: 'Standard', label: tr.cabinStandard },
    { value: 'Comfort',  label: tr.cabinComfort },
    { value: 'Deluxe',   label: tr.cabinDeluxe },
  ];

  const conditionOptions = [
    { value: 'New',          label: tr.condNew },
    { value: 'Refurbished',  label: tr.condRefurb },
    { value: 'Used – Good',  label: tr.condUsedGood },
    { value: 'Used – Fair',  label: tr.condUsedFair },
  ];

  const incotermsOptions = [
    { value: 'EXW', label: tr.exw },
    { value: 'FOB', label: tr.fob },
    { value: 'CIF', label: tr.cif },
    { value: 'DAP', label: tr.dap },
    { value: 'DDP', label: tr.ddp },
  ];

  return (
    <div className="space-y-5">

      {/* 1 – Quotation Details */}
      <FormSection title={tr.secQuotation} icon={<Hash size={16} />} rtl={rtl}>
        <Field label={tr.quoteNumber}     type="text" value={val('quoteNumber')} onChange={set('quoteNumber')} required placeholder="QT-2025-001" rtl={rtl} />
        <Field label={tr.quoteDate}       type="date" value={val('quoteDate')}   onChange={set('quoteDate')}   required rtl={rtl} />
        <Field label={tr.validUntilField} type="date" value={val('validUntil')}  onChange={set('validUntil')}  required rtl={rtl} />
        <Field label={tr.salesRepField}   type="text" value={val('salesRep')}    onChange={set('salesRep')}    rtl={rtl} />
        <Field label={tr.companyName}     type="text" value={val('companyName')} onChange={set('companyName')} required span rtl={rtl} placeholder="RMA Cranes Ltd." />

        {/* Logo upload */}
        <div className="md:col-span-2">
          <label className={`block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-widest ${rtl ? 'text-right' : ''}`}>
            {tr.companyLogo}
          </label>
          <div
            onClick={() => logoInputRef.current?.click()}
            className={`flex items-center gap-3 cursor-pointer border border-dashed border-slate-200 rounded-xl p-4 hover:border-brand-300 hover:bg-slate-50 transition group ${rtl ? 'flex-row-reverse' : ''}`}
          >
            {data.companyLogo
              ? <img src={data.companyLogo} alt="Logo" className="h-10 object-contain" />
              : <div className={`flex items-center gap-2 text-slate-300 group-hover:text-brand-400 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <Upload size={18} /><span className="text-sm">{tr.logoUploadHint}</span>
                </div>}
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>
      </FormSection>

      {/* 2 – Client */}
      <FormSection title={tr.secClient} icon={<User size={16} />} rtl={rtl}>
        <Field label={tr.clientCompany} type="text"  value={val('clientCompany')} onChange={set('clientCompany')} required rtl={rtl} />
        <Field label={tr.clientContact} type="text"  value={val('clientContact')} onChange={set('clientContact')} rtl={rtl} />
        <Field label={tr.clientAddress} type="text"  value={val('clientAddress')} onChange={set('clientAddress')} span rtl={rtl} />
        <Field label={tr.clientCity}    type="text"  value={val('clientCity')}    onChange={set('clientCity')}    rtl={rtl} />
        <Field label={tr.clientCountry} type="text"  value={val('clientCountry')} onChange={set('clientCountry')} rtl={rtl} />
        <Field label={tr.clientPhone}   type="tel"   value={val('clientPhone')}   onChange={set('clientPhone')}   rtl={rtl} />
        <Field label={tr.clientEmail}   type="email" value={val('clientEmail')}   onChange={set('clientEmail')}   rtl={rtl} />
      </FormSection>

      {/* 3 – Crane Specs */}
      <FormSection title={tr.secSpecs} icon={<Cpu size={16} />} rtl={rtl}>
        <Field label={tr.craneModelField}    type="text"   value={val('craneModel')}        onChange={set('craneModel')}        required rtl={rtl} placeholder="e.g. Liebherr 132 EC-H 8" />
        <Field label={tr.manufacturingYear}  type="number" value={val('manufacturingYear')}  onChange={set('manufacturingYear')}  required rtl={rtl} placeholder="2021" />
        <Field label={tr.jibLength}          type="number" value={val('jibLength')}          onChange={set('jibLength')}          rtl={rtl} unit="m" placeholder="60" />
        <Field label={tr.freestandingHeight} type="number" value={val('freestandingHeight')} onChange={set('freestandingHeight')} rtl={rtl} unit="m" placeholder="45" />
        <Field label={tr.maxLoadCapacity}    type="number" value={val('maxLoadCapacity')}    onChange={set('maxLoadCapacity')}    rtl={rtl} unit="t" placeholder="8" />
        <Field label={tr.maxHookHeight}      type="number" value={val('maxHookHeight')}      onChange={set('maxHookHeight')}      rtl={rtl} unit="m" placeholder="80" />
        <Field label={tr.cabinType}          type="select" value={val('cabinType')}          onChange={set('cabinType')}          rtl={rtl} options={cabinOptions} placeholder={tr.selectPlaceholder} />
        <Field label={tr.craneCondition}     type="select" value={val('craneCondition')}     onChange={set('craneCondition')}     rtl={rtl} options={conditionOptions} placeholder={tr.selectPlaceholder} />

        {/* Mast sections */}
        <div className="md:col-span-2">
          <label className={`block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest ${rtl ? 'text-right' : ''}`}>
            {tr.mastSectionsLabel}
          </label>
          <div className={`grid grid-cols-2 gap-1.5 mb-2 ${rtl ? 'text-right' : ''}`}>
            <span className="text-xs text-slate-400 uppercase tracking-widest">{tr.mastType}</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">{tr.mastQty}</span>
          </div>
          <MastSectionSelector
            sections={data.mastSections ?? [{ type: '', quantity: '' }]}
            onChange={ms => onChange({ ...data, mastSections: ms })}
            tr={tr}
            rtl={rtl}
          />
        </div>
      </FormSection>

      {/* 4 – Performance */}
      <FormSection title={tr.secElec} icon={<Zap size={16} />} rtl={rtl}>
        <Field label={tr.hoistingSpeed} type="number" value={val('hoistingSpeed')} onChange={set('hoistingSpeed')} rtl={rtl} unit="m/min" placeholder="100" />
        <Field label={tr.slewingSpeed}  type="number" value={val('slewingSpeed')}  onChange={set('slewingSpeed')}  rtl={rtl} unit="rpm"   placeholder="0.8" />
        <Field label={tr.trolleySpeed}  type="number" value={val('trolleySpeed')}  onChange={set('trolleySpeed')}  rtl={rtl} unit="m/min" placeholder="52" />
        <Field label={tr.certifications} type="text"  value={val('certifications')} onChange={set('certifications')} rtl={rtl} placeholder="CE, ISO 9001…" />
      </FormSection>

      {/* 5 – Condition & Logistics */}
      <FormSection title={tr.secCondition} icon={<Package size={16} />} rtl={rtl}>
        <Field label={tr.deliveryTerms}    type="select" value={val('deliveryTerms')} onChange={set('deliveryTerms')} rtl={rtl} options={incotermsOptions} placeholder={tr.selectPlaceholder} />
        <Field label={tr.deliveryTimeField} type="text"  value={val('deliveryTime')}  onChange={set('deliveryTime')}  rtl={rtl} placeholder="6–8 weeks after payment" />
        <Field label={tr.warrantyField}    type="text"   value={val('warranty')}      onChange={set('warranty')}      rtl={rtl} placeholder="12 months" />
        <div />
        <Field label={tr.includedComponents} type="textarea" value={val('includedComponents')} onChange={set('includedComponents')} rtl={rtl} span rows={3} />
        <Field label={tr.excludedComponents} type="textarea" value={val('excludedComponents')} onChange={set('excludedComponents')} rtl={rtl} span rows={2} />
      </FormSection>

      {/* 6 – Notes (before pricing) */}
      <FormSection title={tr.secNotes} icon={<FileText size={16} />} rtl={rtl}>
        <Field label={tr.additionalNotes} type="textarea" value={val('notes')} onChange={set('notes')} rtl={rtl} span rows={4} />
      </FormSection>

      {/* 7 – Pricing */}
      <FormSection title={tr.secPricing} icon={<DollarSign size={16} />} rtl={rtl}>
        <Field label={tr.currency}          type="select" value={val('currency')}        onChange={set('currency')}        rtl={rtl} options={currencyOptions} />
        <Field label={tr.unitPriceField}    type="number" value={val('unitPrice')}       onChange={set('unitPrice')}       rtl={rtl} required placeholder="250000" />
        <Field label={tr.quantity}          type="number" value={val('quantity')}        onChange={set('quantity')}        rtl={rtl} placeholder="1" />
        <Field label={tr.discountPct}       type="number" value={val('discountPercent')} onChange={set('discountPercent')} rtl={rtl} unit="%" placeholder="0" />
        <Field label={tr.shippingCost}      type="number" value={val('shippingCost')}    onChange={set('shippingCost')}    rtl={rtl} placeholder="0" />
        <Field label={tr.taxVat}            type="number" value={val('taxPercent')}      onChange={set('taxPercent')}      rtl={rtl} unit="%" placeholder="0" />
        <Field label={tr.paymentTermsField} type="textarea" value={val('paymentTerms')} onChange={set('paymentTerms')}    rtl={rtl} span rows={2} />
      </FormSection>

    </div>
  );
}

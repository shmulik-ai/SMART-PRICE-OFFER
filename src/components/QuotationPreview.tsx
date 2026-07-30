import React from 'react';
import { QuotationData } from '../types';
import { Translations } from '../i18n';

interface Props {
  data: QuotationData;
  previewRef: React.RefObject<HTMLDivElement>;
  tr: Translations;
  rtl: boolean;
}

const NAVY   = '#0f2744';
const NAVY2  = '#1a3a5c';
const GOLD   = '#b8922a';
const GOLD_L = '#d4a847';
const SLATE  = '#64748b';
const RULE   = '#e2e8f0';
const BG     = '#f8fafc';

const RMA_LOGO_URL = `${import.meta.env.BASE_URL}rma-logo.jpg`;

function sym(c: string) {
  return ({ USD: '$', EUR: 'EUR ', GBP: 'GBP ', ILS: 'ILS ', AED: 'AED ' } as Record<string,string>)[c] ?? c + ' ';
}
function fmt(n: string, c: string) {
  const v = parseFloat(n);
  return isNaN(v) ? '-' : sym(c) + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function condHe(v: string): string {
  const map: Record<string, string> = {
    'New': 'חדש',
    'Refurbished': 'שופץ',
    'Used - Good': 'משומש - מצב מצוין',
    'Used - Fair': 'משומש - מצב סביר',
  };
  return map[v] || v;
}

function calcTotals(d: QuotationData) {
  const unit = parseFloat(d.unitPrice) || 0;
  const qty  = parseFloat(d.quantity)  || 1;
  const disc = parseFloat(d.discountPercent) || 0;
  const tax  = parseFloat(d.taxPercent)      || 0;
  const ship = parseFloat(d.shippingCost)    || 0;
  const sub  = unit * qty;
  const da   = sub  * (disc / 100);
  const ad   = sub  - da;
  // Only add expenses to total if explicitly included
  const extras = (d.includeExpensesInTotal ?? false)
    ? (d.otherExpenses ?? []).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0)
    : 0;
  const preVat = ad + extras + ship;
  const ta   = 0; // VAT on imports shown as note only
  return { sub, da, ad, ta, ship, extras, preVat, total: preVat };
}

function SpecRow({ label, value, unit }: { label: string; value?: string; unit?: string }) {
  if (!value) return null;
  return (
    <tr>
      <td style={{ padding: '5px 0', fontSize: 14, color: NAVY, fontWeight: 800, width: '52%', borderBottom: `1px solid ${RULE}`, letterSpacing: '0.005em' }}>{label}</td>
      <td style={{ padding: '5px 8px', fontSize: 13, color: NAVY, fontWeight: 600, borderBottom: `1px solid ${RULE}` }}>
        {value}{unit ? <span style={{ color: SLATE, fontWeight: 500, marginLeft: 3 }}>{unit}</span> : null}
      </td>
    </tr>
  );
}

function PageBackgroundCrane() {
  return (
    <svg viewBox="0 0 260 1100" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', top: 0, right: 40, width: 220, height: '92%',
               opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
      {/* Tower - vertical mast */}
      <rect x="110" y="120" width="18" height="940" fill={NAVY} />
      {/* Mast cross-bracing */}
      <line x1="110" y1="200" x2="128" y2="280" stroke={NAVY} strokeWidth="3" />
      <line x1="128" y1="200" x2="110" y2="280" stroke={NAVY} strokeWidth="3" />
      <line x1="110" y1="280" x2="128" y2="360" stroke={NAVY} strokeWidth="3" />
      <line x1="128" y1="280" x2="110" y2="360" stroke={NAVY} strokeWidth="3" />
      <line x1="110" y1="360" x2="128" y2="440" stroke={NAVY} strokeWidth="3" />
      <line x1="128" y1="360" x2="110" y2="440" stroke={NAVY} strokeWidth="3" />
      <line x1="110" y1="440" x2="128" y2="520" stroke={NAVY} strokeWidth="3" />
      <line x1="128" y1="440" x2="110" y2="520" stroke={NAVY} strokeWidth="3" />
      {/* Operator cabin at top */}
      <rect x="100" y="80" width="38" height="44" rx="4" fill={NAVY} />
      {/* Main jib (long arm to the left) */}
      <rect x="0" y="118" width="200" height="10" fill={NAVY} />
      {/* Counter-jib (short arm to the right) */}
      <rect x="128" y="118" width="80" height="8" fill={NAVY} />
      {/* Pendant cables from mast top to jib */}
      <line x1="119" y1="82" x2="30"  y2="128" stroke={NAVY} strokeWidth="3" />
      <line x1="119" y1="82" x2="90"  y2="128" stroke={NAVY} strokeWidth="2" />
      <line x1="119" y1="82" x2="180" y2="128" stroke={NAVY} strokeWidth="2" />
      {/* Trolley on jib */}
      <rect x="55" y="128" width="16" height="10" rx="2" fill={NAVY} />
      {/* Hook rope */}
      <line x1="63" y1="138" x2="63" y2="200" stroke={NAVY} strokeWidth="2.5" />
      {/* Hook */}
      <path d="M58 200 Q55 215 63 220 Q72 215 69 200" stroke={NAVY} strokeWidth="3" fill="none" />
      {/* Base */}
      <rect x="90" y="1058" width="58" height="14" rx="3" fill={NAVY} />
      <rect x="80" y="1042" width="78" height="18" rx="3" fill={NAVY} />
    </svg>
  );
}

function CraneWatermark() {
  return (
    <svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', right: 10, bottom: 0, width: 260, height: 400,
               opacity: 0.028, pointerEvents: 'none', zIndex: 0 }}>
      <rect x="138" y="90" width="22" height="390" fill={NAVY} />
      <rect x="18"  y="82" width="262" height="14" fill={NAVY} />
      <line x1="149" y1="48" x2="18"  y2="96" stroke={NAVY} strokeWidth="6" />
      <line x1="149" y1="48" x2="280" y2="96" stroke={NAVY} strokeWidth="6" />
      <line x1="72"  y1="96" x2="72"  y2="175" stroke={NAVY} strokeWidth="5" />
      <rect x="62" y="175" width="20" height="12" rx="2" fill={NAVY} />
      <path d="M72 187 Q58 205 65 218 Q73 232 84 221 Q92 210 80 204" stroke={NAVY} strokeWidth="4" fill="none" />
      <rect x="128" y="46" width="44" height="36" rx="3" fill={NAVY} />
      <rect x="226" y="96" width="40" height="22" rx="2" fill={NAVY} />
      <rect x="100" y="468" width="100" height="14" rx="3" fill={NAVY} />
      <rect x="116" y="452" width="68" height="18" rx="2" fill={NAVY} />
    </svg>
  );
}

export default function QuotationPreview({ data, previewRef, tr, rtl }: Props) {
  const totals = calcTotals(data);
  const cur    = data.currency || 'USD';
  const dir    = rtl ? 'rtl' : 'ltr';

  const hasMastSections = (data.mastSections ?? []).some(s => s.type);
  const hasSpecs   = !!(data.manufacturer || data.craneModel || data.manufacturingYear || data.jibLength || hasMastSections || data.cabinType || data.tipLoadCapacity);
  const hasWinches = !!(data.hoistWinch || data.trolleyWinch || data.trolleyType);

  const headerLogo = data.companyLogo || RMA_LOGO_URL;
  // "Prepared For" main text: free-text wins, then clientCompany, then placeholder
  const preparedForMain = (data.preparedFor && data.preparedFor.trim())
    ? data.preparedFor
    : (data.clientCompany || '-');

  return (
    <div ref={previewRef}
      style={{ width: 794, fontFamily: "'Heebo', 'Inter', 'Helvetica Neue', Arial, sans-serif",
               color: NAVY, background: 'white', position: 'relative', overflow: 'hidden' }}>

      <PageBackgroundCrane />

      <div style={{ background: NAVY, padding: 0, position: 'relative', overflow: 'hidden', zIndex: 1 }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L}, ${GOLD})` }} />
        <div style={{ padding: '16px 36px 14px', display: 'flex',
                      justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: logo + company name + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <img src={headerLogo} alt="Logo"
              onError={e => { (e.target as HTMLImageElement).src = RMA_LOGO_URL; }}
              style={{ height: 80, width: 80, objectFit: 'cover', borderRadius: 14,
                       border: `2.5px solid ${GOLD}`, display: 'block', background: 'white',
                       boxShadow: '0 6px 18px -8px rgba(212, 168, 71, 0.5)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white',
                            letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                {data.companyName || 'RMA Cranes'}
              </div>
              <div style={{ fontSize: 10, color: GOLD_L, marginTop: 3,
                            letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
                {rtl ? 'הצעת מחיר לרכישת עגורן' : 'Crane Purchase Quotation'}
              </div>
            </div>
          </div>
          {/* Right: quote number + date + validity */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: GOLD_L, letterSpacing: '0.2em',
                          textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>
              {tr.priceQuotation}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'white',
                          letterSpacing: '-1px', lineHeight: 1 }}>
              {data.quoteNumber || 'QT-2025-001'}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.55)',
                          lineHeight: 1.6 }}>
              <div>{tr.date}: <span style={{ color: 'rgba(255,255,255,0.85)' }}>{data.quoteDate || '-'}</span></div>
              {data.quoteValidity
                ? <div>{tr.quoteValidity}: <span style={{ color: 'rgba(255,255,255,0.85)' }}>{data.quoteValidity}</span></div>
                : <div>{tr.validUntil}: <span style={{ color: 'rgba(255,255,255,0.85)' }}>{data.validUntil || '-'}</span></div>
              }
              {data.salesRep && <div>{tr.salesRep}: <span style={{ color: 'rgba(255,255,255,0.85)' }}>{data.salesRep}</span></div>}
            </div>
          </div>
        </div>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L}, ${GOLD})` }} />
      </div>

      <div style={{ padding: '16px 36px', position: 'relative', zIndex: 1 }}>
        <CraneWatermark />

        <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
          <div style={{ flex: 1, borderLeft: rtl ? 'none' : `3px solid ${GOLD}`,
                        borderRight: rtl ? `3px solid ${GOLD}` : 'none',
                        paddingLeft: rtl ? 0 : 16, paddingRight: rtl ? 16 : 0 }} dir={dir}>
            <div style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.18em',
                          textTransform: 'uppercase', marginBottom: 4 }}>{tr.preparedFor}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: NAVY, marginBottom: 3 }}>
              {preparedForMain}
            </div>
            {/* Show clientCompany on a second line ONLY if preparedFor is filled and different */}
            {data.preparedFor && data.preparedFor.trim() && data.clientCompany && (
              <div style={{ fontSize: 12, color: SLATE, marginBottom: 2, fontWeight: 500 }}>
                {data.clientCompany}
              </div>
            )}
            {data.clientContact && (
              <div style={{ fontSize: 12, color: SLATE }}>
                {rtl ? 'לתשומת לב: ' : 'Attn: '}{data.clientContact}
              </div>
            )}
            <div style={{ fontSize: 11, color: SLATE, marginTop: 4, lineHeight: 1.55 }}>
              {[data.clientAddress, data.clientCity, data.clientCountry].filter(Boolean).join(', ')}
              {data.clientPhone && <><br />{data.clientPhone}</>}
              {data.clientEmail && <><br />{data.clientEmail}</>}
            </div>
          </div>
        </div>

        {data.craneModel && (() => {
          // Build stat list in RTL display order: model first (rightmost), then year, condition, height, load, jib
          const stats = [
            { label: tr.craneModel,  value: data.craneModel,                              unit: '',  bold: true },
            { label: tr.year,        value: data.manufacturingYear,                        unit: ''  },
            { label: tr.condition,   value: condHe(data.craneCondition || '') || undefined, unit: '' },
            { label: tr.height,      value: data.freestandingHeight,                       unit: 'm' },
            { label: tr.maxLoad,     value: data.maxLoadCapacity,                          unit: 't' },
            { label: tr.jib,         value: data.jibLength,                                unit: 'm' },
          ].filter(x => x.value);
          return (
            <div style={{ background: BG, border: `1px solid ${RULE}`, borderRadius: 12,
                          padding: '10px 16px', marginBottom: 7, position: 'relative', zIndex: 1,
                          boxShadow: '0 1px 3px rgba(15,39,68,0.04)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
                            direction: rtl ? 'rtl' : 'ltr' }}>
                {stats.map((x, i) => (
                  <div key={x.label} style={{
                    textAlign: 'center', padding: '4px 8px',
                    borderRight: i < stats.length - 1 ? `1px solid ${RULE}` : 'none',
                  }}>
                    <div style={{ fontSize: 9, color: GOLD, textTransform: 'uppercase',
                                  letterSpacing: '0.14em', marginBottom: 5, fontWeight: 700 }}>{x.label}</div>
                    <div style={{ fontSize: x.bold ? 20 : 17, fontWeight: 900, color: NAVY,
                                  letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                      {x.value}{x.unit && <span style={{ fontSize: 12, color: SLATE, fontWeight: 600, marginLeft: 2 }}>{x.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {(hasSpecs || hasWinches) && (
          <div style={{ display: 'grid', gridTemplateColumns: hasSpecs && hasWinches ? '1fr 1fr' : '1fr',
                        gap: 22, marginBottom: 7, position: 'relative', zIndex: 1 }}>
            {hasSpecs && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, textTransform: 'uppercase',
                              letterSpacing: '0.16em', marginBottom: 7,
                              borderBottom: `2px solid ${GOLD}`, paddingBottom: 7 }}>
                  {tr.technicalSpecs}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <SpecRow label={tr.manufacturer}       value={data.manufacturer} />
                    <SpecRow label={tr.serialNumber}       value={data.serialNumber} />
                    <SpecRow label={tr.craneModelField}    value={data.craneModel} />
                    <SpecRow label={tr.manufacturingYear}  value={data.manufacturingYear} />
                    <SpecRow label={tr.jibLength}          value={data.jibLength}          unit="m" />
                    <SpecRow label={tr.freestandingHeight} value={data.freestandingHeight} unit="m" />
                    <SpecRow label={tr.maxLoadCapacity}    value={data.maxLoadCapacity}    unit="t" />
                    <SpecRow label={tr.tipLoadCapacity}    value={data.tipLoadCapacity}    unit="t" />
                    <SpecRow label={tr.cabinType}          value={data.cabinType} />
                    <SpecRow label={tr.craneCondition}     value={condHe(data.craneCondition || '')} />
                    <SpecRow label={tr.certifications}     value={data.certifications} />
                    {hasMastSections && (
                      <tr>
                        <td style={{ padding: '5px 0', fontSize: 14, color: NAVY, fontWeight: 800,
                                     borderBottom: `1px solid ${RULE}`, verticalAlign: 'top', letterSpacing: '0.005em' }}>
                          {tr.mastSectionsLabel}
                        </td>
                        <td style={{ padding: '5px 8px', borderBottom: `1px solid ${RULE}`, verticalAlign: 'top' }}>
                          {(data.mastSections ?? []).filter(s => s.type).map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8,
                                                   marginBottom: 3, fontSize: 13 }}>
                              <span style={{ color: NAVY, fontWeight: 600 }}>{s.type}</span>
                              {s.quantity && (
                                <span style={{ color: SLATE, fontSize: 11, fontWeight: 400 }}>
                                  &nbsp;&times;&nbsp;{s.quantity}
                                </span>
                              )}
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {hasWinches && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: NAVY2, textTransform: 'uppercase',
                              letterSpacing: '0.16em', marginBottom: 7,
                              borderBottom: `2px solid ${NAVY2}`, paddingBottom: 7 }}>
                  {tr.winches}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <SpecRow label={tr.hoistWinch}       value={data.hoistWinch} />
                    <SpecRow label={tr.trolleyWinch}     value={data.trolleyWinch} />
                    <SpecRow label={tr.trolleyTypeField} value={data.trolleyType} />
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {(data.includedComponents || data.excludedComponents) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
                        marginBottom: 7, position: 'relative', zIndex: 1 }}>
            {data.includedComponents && (
              <div style={{ background: '#f0fdf4', border: '1px solid #d1fae5',
                            borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase',
                              letterSpacing: '0.15em', marginBottom: 4 }}>+ {tr.included}</div>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, fontWeight: 600,
                              whiteSpace: 'pre-wrap' }}>{data.includedComponents}</div>
              </div>
            )}
            {data.excludedComponents && (
              <div style={{ background: '#fafafa', border: `1px solid ${RULE}`,
                            borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: SLATE, textTransform: 'uppercase',
                              letterSpacing: '0.15em', marginBottom: 5 }}>x {tr.excluded}</div>
                <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.6,
                              whiteSpace: 'pre-wrap' }}>{data.excludedComponents}</div>
              </div>
            )}
          </div>
        )}

        {(data.deliveryTerms || data.deliveryTime || data.warranty) && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 7,
                        flexDirection: rtl ? 'row-reverse' : 'row', position: 'relative', zIndex: 1 }}>
            {data.deliveryTerms && (
              <div style={{ background: NAVY, color: 'white', borderRadius: 8, padding: '7px 10px', flex: 0 }}>
                <div style={{ fontSize: 8, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tr.incoterms}</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{data.deliveryTerms}</div>
              </div>
            )}
            {data.deliveryTime && (
              <div style={{ background: BG, border: `1px solid ${RULE}`, borderRadius: 8, padding: '7px 10px', flex: 2 }}>
                <div style={{ fontSize: 8, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tr.deliveryTime}</div>
                <div style={{ fontSize: 12, color: NAVY, fontWeight: 600, marginTop: 2 }}>{data.deliveryTime}</div>
              </div>
            )}
            {data.warranty && (
              <div style={{ background: BG, border: `1px solid ${RULE}`, borderRadius: 8, padding: '7px 10px', flex: 2 }}>
                <div style={{ fontSize: 8, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tr.warranty}</div>
                <div style={{ fontSize: 12, color: NAVY, fontWeight: 600, marginTop: 2 }}>{data.warranty}</div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: 7, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: GOLD, textTransform: 'uppercase',
                        letterSpacing: '0.18em', marginBottom: 6,
                        borderBottom: `1.5px solid ${GOLD}`, paddingBottom: 5 }}>
            {tr.pricingSummary}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: NAVY, color: 'white' }}>
                <th style={{ padding: '7px 12px', textAlign: rtl ? 'right' : 'left', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.08em' }}>{tr.description}</th>
                <th style={{ padding: '7px 12px', textAlign: 'center', fontWeight: 600, fontSize: 10.5, width: 60 }}>{tr.qty}</th>
                <th style={{ padding: '7px 12px', textAlign: rtl ? 'left' : 'right', fontWeight: 600, fontSize: 10.5, width: 140 }}>{tr.unitPrice}</th>
                <th style={{ padding: '7px 12px', textAlign: rtl ? 'left' : 'right', fontWeight: 600, fontSize: 10.5, width: 140 }}>{tr.amount}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${RULE}` }}>
                <td style={{ padding: '7px 12px' }}>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{data.craneModel || 'Tower Crane'}</div>
                  {data.craneCondition && <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>{condHe(data.craneCondition)} - {data.manufacturingYear}</div>}
                  {data.portPrice && parseFloat(data.portPrice) > 0 && <div style={{ fontSize: 10, color: SLATE, marginTop: 1 }}>{tr.portPriceField}: {fmt(data.portPrice, cur)}</div>}
                </td>
                <td style={{ padding: '7px 12px', textAlign: 'center' }}>{data.quantity || 1}</td>
                <td style={{ padding: '7px 12px', textAlign: rtl ? 'left' : 'right' }}>{fmt(data.unitPrice, cur)}</td>
                <td style={{ padding: '7px 12px', textAlign: rtl ? 'left' : 'right', fontWeight: 700 }}>
                  {fmt(String((parseFloat(data.unitPrice)||0)*(parseFloat(data.quantity)||1)), cur)}
                </td>
              </tr>
            </tbody>
          </table>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <tbody>
              {totals.da > 0 && (<>
                <tr style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '4px 12px', color: SLATE }}>{tr.subtotal}</td>
                  <td style={{ padding: '4px 12px', textAlign: rtl ? 'left' : 'right' }}>{fmt(String(totals.sub), cur)}</td>
                </tr>
                <tr style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '4px 12px', color: '#dc2626' }}>{tr.discount} ({data.discountPercent}%)</td>
                  <td style={{ padding: '4px 12px', textAlign: rtl ? 'left' : 'right', color: '#dc2626' }}>- {fmt(String(totals.da), cur)}</td>
                </tr>
              </>)}
              {(data.includeExpensesInTotal ?? false) && (data.otherExpenses ?? []).filter(e => (parseFloat(e.amount) || 0) > 0).map((e, i) => (
                <tr key={`exp-${i}`} style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '4px 12px', color: SLATE }}>{e.description || tr.expenseDesc}</td>
                  <td style={{ padding: '4px 12px', textAlign: rtl ? 'left' : 'right' }}>{fmt(e.amount, e.currency || cur)}</td>
                </tr>
              ))}
              {totals.ship > 0 && (
                <tr style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '4px 12px', color: SLATE }}>{tr.shipping}</td>
                  <td style={{ padding: '4px 12px', textAlign: rtl ? 'left' : 'right' }}>{fmt(String(totals.ship), cur)}</td>
                </tr>
              )}


              <tr style={{ background: NAVY }}>
                <td style={{ padding: '7px 12px', fontWeight: 800, fontSize: 12, color: 'white' }}>{tr.total}</td>
                <td style={{ padding: '7px 12px', textAlign: rtl ? 'left' : 'right', fontWeight: 900, fontSize: 14, color: GOLD_L }}>{fmt(String(totals.total), cur)}</td>
              </tr>
            </tbody>
          </table>
          <div style={{
            margin: '8px 0 0', padding: '7px 14px',
            background: '#fff8e6', border: '1.5px solid #f0c040',
            borderRadius: 7, display: 'flex', alignItems: 'center', gap: 7,
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 15, lineHeight: 1 }}>⚠️</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#7a5200' }}>
              {rtl ? 'המחיר אינו כולל מע"מ על ייבוא טובין' : 'Price does not include VAT on import of goods'}
            </span>
          </div>
          {data.paymentTerms && (
            <div style={{ marginTop: 8, padding: '7px 14px', background: BG,
                          border: `1px solid ${RULE}`, borderRadius: 7 }} dir={dir}>
              <span style={{ fontSize: 9, fontWeight: 700, color: NAVY, textTransform: 'uppercase',
                             letterSpacing: '0.15em', marginLeft: 6 }}>{tr.paymentTerms}: </span>
              <span style={{ fontSize: 11, color: SLATE }}>{data.paymentTerms}</span>
            </div>
          )}
        </div>

        {/* Optional expenses section - shown only when NOT included in total */}
        {!(data.includeExpensesInTotal ?? false) && (data.otherExpenses ?? []).filter(e => (parseFloat(e.amount) || 0) > 0).length > 0 && (() => {
          const optExp = (data.otherExpenses ?? []).filter(e => (parseFloat(e.amount) || 0) > 0);
          const ilsOpt = optExp.filter(e => (e.currency || 'EUR') === 'ILS').reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
          const ilsOptVat = ilsOpt * 0.18;
          const ilsOptGross = ilsOpt + ilsOptVat;
          return (
            <div style={{ marginBottom: 7, position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: SLATE, textTransform: 'uppercase',
                            letterSpacing: '0.18em', marginBottom: 6,
                            borderBottom: `1.5px solid ${RULE}`, paddingBottom: 5 }}>
                {tr.optionalExpensesSection}
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    <th style={{ padding: '6px 12px', textAlign: rtl ? 'right' : 'left', fontWeight: 600, fontSize: 10, color: SLATE, letterSpacing: '0.06em' }}>{tr.description}</th>
                    <th style={{ padding: '6px 12px', textAlign: rtl ? 'left' : 'right', fontWeight: 600, fontSize: 10, color: SLATE, width: 140 }}>{tr.amount}</th>
                  </tr>
                </thead>
                <tbody>
                  {optExp.map((e, i) => (
                    <tr key={`opt-${i}`} style={{ borderTop: `1px solid ${RULE}` }}>
                      <td style={{ padding: '5px 12px', color: SLATE, fontStyle: 'italic' }}>{e.description || tr.expenseDesc}</td>
                      <td style={{ padding: '5px 12px', textAlign: rtl ? 'left' : 'right', color: SLATE }}>{fmt(e.amount, e.currency || cur)}</td>
                    </tr>
                  ))}
                  {ilsOpt > 0 && (<>
                    <tr><td colSpan={2} style={{ padding: 0 }}><div style={{ borderTop: `2.5px solid ${NAVY}`, margin: '4px 14px 0', opacity: 0.15 }} /></td></tr>
                    <tr style={{ borderTop: `1px solid ${RULE}` }}>
                      <td style={{ padding: '4px 12px', color: SLATE }}>{rtl ? 'סהכ (לפני מעמ)' : 'Subtotal (before VAT)'}</td>
                      <td style={{ padding: '4px 12px', textAlign: rtl ? 'left' : 'right', color: SLATE }}>{'\u20aa'} {ilsOpt.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr style={{ borderTop: `1px solid ${RULE}` }}>
                      <td style={{ padding: '4px 12px', color: SLATE }}>{rtl ? 'מעמ 18%' : 'VAT 18%'}</td>
                      <td style={{ padding: '4px 12px', textAlign: rtl ? 'left' : 'right', color: SLATE }}>{'\u20aa'} {ilsOptVat.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                    <tr style={{ background: '#f8fafc', borderTop: `1.5px solid ${RULE}` }}>
                      <td style={{ padding: '6px 12px', fontWeight: 800, color: NAVY }}>{rtl ? 'סהכ כולל מעמ' : 'Total incl. VAT'}</td>
                      <td style={{ padding: '6px 12px', textAlign: rtl ? 'left' : 'right', fontWeight: 900, color: '#b8922a' }}>{'\u20aa'} {ilsOptGross.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  </>)}
                </tbody>
              </table>
              <div style={{ marginTop: 10, padding: '6px 12px', borderRadius: 6,
                            background: '#fef9ec', border: '1px solid #fde68a',
                            fontSize: 12, fontWeight: 700, color: '#92400e',
                            textAlign: rtl ? 'right' : 'left' }}>
                ⚠ {rtl ? 'הוצאות אלו אינן כלולות בסכום הכולל לעיל' : 'These expenses are not included in the total above'}
              </div>
            </div>
          );
        })()}

        {data.notes && (
          <div style={{ background: '#fffdf5', border: `1px solid #fde68a`, borderRadius: 8,
                        padding: '8px 12px', marginBottom: 7, position: 'relative', zIndex: 1 }} dir={dir}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#92400e', textTransform: 'uppercase',
                          letterSpacing: '0.15em', marginBottom: 5 }}>{tr.notes}</div>
            <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.7 }}>
              {data.notes.split('\n').filter(l => l.trim()).map((line, i) => (
                <div key={i} style={{ marginBottom: 3, display: 'flex', gap: 6, alignItems: 'flex-start',
                                      flexDirection: 'row', textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, color: '#92400e', flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ flex: 1, textAlign: 'right' }}>{line.trim().replace(/^\*\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
                      marginTop: 14, position: 'relative', zIndex: 1 }}>
          {[
            { top: tr.authorizedSignature, bot: `${data.companyName || 'RMA Cranes'} - ${data.salesRep || ''}` },
            { top: tr.clientSignature,     bot: `${data.clientCompany || tr.client} - ${data.clientContact || ''}` },
          ].map((s, i) => (
            <div key={i} dir={dir}>
              <div style={{ fontSize: 10, color: SLATE, marginBottom: 20 }}>{s.top}</div>
              <div style={{ borderTop: `1.5px solid ${RULE}`, paddingTop: 7,
                            fontSize: 10, color: SLATE }}>{s.bot}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: NAVY, position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L}, ${GOLD})` }} />

        <div style={{ padding: '10px 36px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: GOLD_L, letterSpacing: '0.04em',
                        fontStyle: 'italic', lineHeight: 1.5 }}>
            "{tr.marketingTagline}"
          </div>
        </div>

        <div style={{ padding: '0 36px 12px', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', flexDirection: rtl ? 'row-reverse' : 'row' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14,
                        flexDirection: rtl ? 'row-reverse' : 'row' }}>
            <img src={RMA_LOGO_URL} alt="RMA"
              style={{ height: 44, width: 44, objectFit: 'cover', borderRadius: 8,
                         border: '2px solid rgba(212,168,71,0.3)', background: 'white' }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{data.companyName || 'RMA Cranes'}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>המלאכה 10 לוד, מיקוד 7152018</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>טל: 08-9202882 | www.rma.co.il</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{tr.footerSubject}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

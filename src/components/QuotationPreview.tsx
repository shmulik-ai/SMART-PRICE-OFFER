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
function calcTotals(d: QuotationData) {
  const unit = parseFloat(d.unitPrice) || 0;
  const qty  = parseFloat(d.quantity)  || 1;
  const disc = parseFloat(d.discountPercent) || 0;
  const tax  = parseFloat(d.taxPercent)      || 0;
  const ship = parseFloat(d.shippingCost)    || 0;
  const sub  = unit * qty;
  const da   = sub  * (disc / 100);
  const ad   = sub  - da;
  const extras = (d.otherExpenses ?? []).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const preVat = ad + extras + ship;
  const ta   = preVat * (tax / 100);
  return { sub, da, ad, ta, ship, extras, preVat, total: preVat + ta };
}

function SpecRow({ label, value, unit }: { label: string; value?: string; unit?: string }) {
  if (!value) return null;
  return (
    <tr>
      <td style={{ padding: '8px 0', fontSize: 14, color: NAVY, fontWeight: 800, width: '52%', borderBottom: `1px solid ${RULE}`, letterSpacing: '0.005em' }}>{label}</td>
      <td style={{ padding: '8px 8px', fontSize: 13, color: NAVY, fontWeight: 600, borderBottom: `1px solid ${RULE}` }}>
        {value}{unit ? <span style={{ color: SLATE, fontWeight: 500, marginLeft: 3 }}>{unit}</span> : null}
      </td>
    </tr>
  );
}

function PageBackgroundCrane() {
  return (
    <svg viewBox="0 0 800 1100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
               opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}>
      {/* Massive tower-crane silhouette spanning the page */}
      <rect x="380" y="180" width="40" height="820" fill={NAVY} />
      <rect x="60" y="160" width="680" height="22" fill={NAVY} />
      <line x1="400" y1="80" x2="60"  y2="180" stroke={NAVY} strokeWidth="9" />
      <line x1="400" y1="80" x2="740" y2="180" stroke={NAVY} strokeWidth="9" />
      <line x1="400" y1="80" x2="200" y2="160" stroke={NAVY} strokeWidth="6" />
      <line x1="400" y1="80" x2="600" y2="160" stroke={NAVY} strokeWidth="6" />
      <line x1="180" y1="180" x2="180" y2="350" stroke={NAVY} strokeWidth="7" />
      <rect x="160" y="350" width="40" height="22" rx="3" fill={NAVY} />
      <path d="M180 372 Q150 410 162 444 Q180 480 210 458 Q230 432 200 420" stroke={NAVY} strokeWidth="7" fill="none" />
      <rect x="370" y="60" width="60" height="46" rx="4" fill={NAVY} />
      <rect x="660" y="180" width="68" height="34" rx="3" fill={NAVY} />
      <rect x="320" y="990" width="160" height="22" rx="5" fill={NAVY} />
      <rect x="350" y="960" width="100" height="32" rx="4" fill={NAVY} />
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
        <div style={{ height: 4, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L}, ${GOLD})` }} />
        <div style={{ padding: '28px 44px 24px', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexDirection: rtl ? 'row-reverse' : 'row' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22,
                        flexDirection: rtl ? 'row-reverse' : 'row' }}>
            <div style={{ position: 'relative' }}>
              <img src={headerLogo} alt="Logo"
                style={{ height: 84, width: 84, objectFit: 'cover', borderRadius: 12,
                         border: `2.5px solid ${GOLD}`, display: 'block', background: 'white',
                         boxShadow: '0 6px 18px -8px rgba(212, 168, 71, 0.5)' }} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'white',
                            letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                {data.companyName || 'RMA Cranes'}
              </div>
              <div style={{ fontSize: 11, color: GOLD_L, marginTop: 4,
                            letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>
                {tr.appSub}
              </div>
            </div>
          </div>
          <div style={{ textAlign: rtl ? 'left' : 'right' }}>
            <div style={{ fontSize: 11, color: GOLD_L, letterSpacing: '0.2em',
                          textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>
              {tr.priceQuotation}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'white',
                          letterSpacing: '-1px', lineHeight: 1 }}>
              {data.quoteNumber || 'QT-2025-001'}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.55)',
                          lineHeight: 1.8 }}>
              <div>{tr.date}: <span style={{ color: 'rgba(255,255,255,0.85)' }}>{data.quoteDate || '-'}</span></div>
              <div>{tr.validUntil}: <span style={{ color: 'rgba(255,255,255,0.85)' }}>{data.validUntil || '-'}</span></div>
              {data.salesRep && <div>{tr.salesRep}: <span style={{ color: 'rgba(255,255,255,0.85)' }}>{data.salesRep}</span></div>}
            </div>
          </div>
        </div>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L}, ${GOLD})` }} />
      </div>

      <div style={{ padding: '32px 44px', position: 'relative', zIndex: 1 }}>
        <CraneWatermark />

        <div style={{ display: 'flex', gap: 0, marginBottom: 22 }}>
          <div style={{ flex: 1, borderLeft: rtl ? 'none' : `3px solid ${GOLD}`,
                        borderRight: rtl ? `3px solid ${GOLD}` : 'none',
                        paddingLeft: rtl ? 0 : 16, paddingRight: rtl ? 16 : 0 }} dir={dir}>
            <div style={{ fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.18em',
                          textTransform: 'uppercase', marginBottom: 6 }}>{tr.preparedFor}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: NAVY, marginBottom: 3 }}>
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
            <div style={{ fontSize: 11, color: SLATE, marginTop: 4, lineHeight: 1.7 }}>
              {[data.clientAddress, data.clientCity, data.clientCountry].filter(Boolean).join(', ')}
              {data.clientPhone && <><br />{data.clientPhone}</>}
              {data.clientEmail && <><br />{data.clientEmail}</>}
            </div>
          </div>
        </div>

        {data.craneModel && (
          <div style={{ background: BG, border: `1px solid ${RULE}`, borderRadius: 12,
                        padding: '20px 26px', marginBottom: 22, display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                        flexDirection: rtl ? 'row-reverse' : 'row', position: 'relative', zIndex: 1,
                        boxShadow: '0 1px 3px rgba(15, 39, 68, 0.04)' }}>
            <div style={{ borderLeft: rtl ? 'none' : `3px solid ${GOLD}`,
                          borderRight: rtl ? `3px solid ${GOLD}` : 'none',
                          paddingLeft: rtl ? 0 : 16, paddingRight: rtl ? 16 : 0 }}>
              <div style={{ fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: '0.18em',
                            textTransform: 'uppercase', marginBottom: 4 }}>{tr.craneModel}</div>
              {data.manufacturer && (
                <div style={{ fontSize: 11, color: SLATE, fontWeight: 600, marginBottom: 2,
                              letterSpacing: '0.04em' }}>
                  {data.manufacturer}
                </div>
              )}
              <div style={{ fontSize: 24, fontWeight: 900, color: NAVY, letterSpacing: '-0.5px' }}>
                {data.craneModel}
              </div>
              {data.serialNumber && (
                <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8,
                              background: '#fff', border: `1px solid ${RULE}`, borderRadius: 8,
                              padding: '6px 12px' }}>
                  <span style={{ fontSize: 9, color: GOLD, fontWeight: 700, letterSpacing: '0.15em',
                                 textTransform: 'uppercase' }}>{tr.serialNumber}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: NAVY, letterSpacing: '0.5px' }}>
                    {data.serialNumber}
                  </span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 32, flexDirection: rtl ? 'row-reverse' : 'row' }}>
              {[
                { label: tr.year,    value: data.manufacturingYear, unit: '' },
                { label: tr.jib,     value: data.jibLength,         unit: 'm' },
                { label: tr.maxLoad, value: data.maxLoadCapacity,   unit: 't' },
                { label: tr.height,  value: data.freestandingHeight, unit: 'm' },
                { label: tr.condition, value: data.craneCondition,  unit: '' },
              ].filter(x => x.value).map(x => (
                <div key={x.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: SLATE, textTransform: 'uppercase',
                                letterSpacing: '0.14em', marginBottom: 4, fontWeight: 600 }}>{x.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: NAVY, letterSpacing: '-0.3px' }}>
                    {x.value}{x.unit && <span style={{ fontSize: 14, color: SLATE, fontWeight: 600, marginLeft: 2 }}>{x.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(hasSpecs || hasWinches) && (
          <div style={{ display: 'grid', gridTemplateColumns: hasSpecs && hasWinches ? '1fr 1fr' : '1fr',
                        gap: 22, marginBottom: 22, position: 'relative', zIndex: 1 }}>
            {hasSpecs && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: GOLD, textTransform: 'uppercase',
                              letterSpacing: '0.16em', marginBottom: 12,
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
                    <SpecRow label={tr.craneCondition}     value={data.craneCondition} />
                    <SpecRow label={tr.certifications}     value={data.certifications} />
                    {hasMastSections && (
                      <tr>
                        <td style={{ padding: '8px 0', fontSize: 14, color: NAVY, fontWeight: 800,
                                     borderBottom: `1px solid ${RULE}`, verticalAlign: 'top', letterSpacing: '0.005em' }}>
                          {tr.mastSectionsLabel}
                        </td>
                        <td style={{ padding: '8px 8px', fontSize: 13, color: NAVY,
                                     fontWeight: 600, borderBottom: `1px solid ${RULE}` }}>
                          {(data.mastSections ?? []).filter(s => s.type).map(s =>
                            `${s.type}${s.quantity ? ` x ${s.quantity}` : ''}`
                          ).join(', ')}
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
                              letterSpacing: '0.16em', marginBottom: 12,
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
                        marginBottom: 22, position: 'relative', zIndex: 1 }}>
            {data.includedComponents && (
              <div style={{ background: '#f0fdf4', border: '1px solid #d1fae5',
                            borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase',
                              letterSpacing: '0.15em', marginBottom: 5 }}>+ {tr.included}</div>
                <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.75,
                              whiteSpace: 'pre-wrap' }}>{data.includedComponents}</div>
              </div>
            )}
            {data.excludedComponents && (
              <div style={{ background: '#fafafa', border: `1px solid ${RULE}`,
                            borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: SLATE, textTransform: 'uppercase',
                              letterSpacing: '0.15em', marginBottom: 5 }}>x {tr.excluded}</div>
                <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.75,
                              whiteSpace: 'pre-wrap' }}>{data.excludedComponents}</div>
              </div>
            )}
          </div>
        )}

        {(data.deliveryTerms || data.deliveryTime || data.warranty) && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 22,
                        flexDirection: rtl ? 'row-reverse' : 'row', position: 'relative', zIndex: 1 }}>
            {data.deliveryTerms && (
              <div style={{ background: NAVY, color: 'white', borderRadius: 8, padding: '10px 16px', flex: 0 }}>
                <div style={{ fontSize: 8, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tr.incoterms}</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{data.deliveryTerms}</div>
              </div>
            )}
            {data.deliveryTime && (
              <div style={{ background: BG, border: `1px solid ${RULE}`, borderRadius: 8, padding: '10px 16px', flex: 2 }}>
                <div style={{ fontSize: 8, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tr.deliveryTime}</div>
                <div style={{ fontSize: 12, color: NAVY, fontWeight: 600, marginTop: 2 }}>{data.deliveryTime}</div>
              </div>
            )}
            {data.warranty && (
              <div style={{ background: BG, border: `1px solid ${RULE}`, borderRadius: 8, padding: '10px 16px', flex: 2 }}>
                <div style={{ fontSize: 8, color: SLATE, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{tr.warranty}</div>
                <div style={{ fontSize: 12, color: NAVY, fontWeight: 600, marginTop: 2 }}>{data.warranty}</div>
              </div>
            )}
          </div>
        )}

        {data.notes && (
          <div style={{ background: '#fffdf5', border: `1px solid #fde68a`, borderRadius: 8,
                        padding: '12px 16px', marginBottom: 22, position: 'relative', zIndex: 1 }} dir={dir}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#92400e', textTransform: 'uppercase',
                          letterSpacing: '0.15em', marginBottom: 5 }}>{tr.notes}</div>
            <div style={{ fontSize: 11, color: '#374151', lineHeight: 1.75,
                          whiteSpace: 'pre-wrap' }}>{data.notes}</div>
          </div>
        )}

        <div style={{ marginBottom: 22, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: GOLD, textTransform: 'uppercase',
                        letterSpacing: '0.18em', marginBottom: 10,
                        borderBottom: `1.5px solid ${GOLD}`, paddingBottom: 5 }}>
            {tr.pricingSummary}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: NAVY, color: 'white' }}>
                <th style={{ padding: '10px 14px', textAlign: rtl ? 'right' : 'left', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.08em' }}>{tr.description}</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, fontSize: 10.5, width: 60 }}>{tr.qty}</th>
                <th style={{ padding: '10px 14px', textAlign: rtl ? 'left' : 'right', fontWeight: 600, fontSize: 10.5, width: 140 }}>{tr.unitPrice}</th>
                <th style={{ padding: '10px 14px', textAlign: rtl ? 'left' : 'right', fontWeight: 600, fontSize: 10.5, width: 140 }}>{tr.amount}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${RULE}` }}>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{data.craneModel || 'Tower Crane'}</div>
                  {data.craneCondition && <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>{data.craneCondition} - {data.manufacturingYear}</div>}
                </td>
                <td style={{ padding: '11px 14px', textAlign: 'center' }}>{data.quantity || 1}</td>
                <td style={{ padding: '11px 14px', textAlign: rtl ? 'left' : 'right' }}>{fmt(data.unitPrice, cur)}</td>
                <td style={{ padding: '11px 14px', textAlign: rtl ? 'left' : 'right', fontWeight: 700 }}>
                  {fmt(String((parseFloat(data.unitPrice)||0)*(parseFloat(data.quantity)||1)), cur)}
                </td>
              </tr>
            </tbody>
          </table>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <tbody>
              {totals.da > 0 && (<>
                <tr style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '6px 14px', color: SLATE }}>{tr.subtotal}</td>
                  <td style={{ padding: '6px 14px', textAlign: rtl ? 'left' : 'right' }}>{fmt(String(totals.sub), cur)}</td>
                </tr>
                <tr style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '6px 14px', color: '#dc2626' }}>{tr.discount} ({data.discountPercent}%)</td>
                  <td style={{ padding: '6px 14px', textAlign: rtl ? 'left' : 'right', color: '#dc2626' }}>- {fmt(String(totals.da), cur)}</td>
                </tr>
              </>)}
              {(data.otherExpenses ?? []).filter(e => (parseFloat(e.amount) || 0) > 0).map((e, i) => (
                <tr key={`exp-${i}`} style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '6px 14px', color: SLATE }}>{e.description || tr.expenseDesc}</td>
                  <td style={{ padding: '6px 14px', textAlign: rtl ? 'left' : 'right' }}>{fmt(e.amount, cur)}</td>
                </tr>
              ))}
              {totals.ship > 0 && (
                <tr style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '6px 14px', color: SLATE }}>{tr.shipping}</td>
                  <td style={{ padding: '6px 14px', textAlign: rtl ? 'left' : 'right' }}>{fmt(String(totals.ship), cur)}</td>
                </tr>
              )}
              {totals.ta > 0 && (
                <tr style={{ borderTop: `1px solid ${RULE}` }}>
                  <td style={{ padding: '6px 14px', color: SLATE }}>{tr.tax} ({data.taxPercent}%)</td>
                  <td style={{ padding: '6px 14px', textAlign: rtl ? 'left' : 'right' }}>{fmt(String(totals.ta), cur)}</td>
                </tr>
              )}
              <tr style={{ background: NAVY }}>
                <td style={{ padding: '13px 14px', fontWeight: 800, fontSize: 14, color: 'white' }}>{tr.total}</td>
                <td style={{ padding: '13px 14px', textAlign: rtl ? 'left' : 'right', fontWeight: 900, fontSize: 18, color: GOLD_L }}>{fmt(String(totals.total), cur)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {data.paymentTerms && (
          <div style={{ background: BG, border: `1px solid ${RULE}`, borderRadius: 8,
                        padding: '12px 16px', marginBottom: 24, position: 'relative', zIndex: 1 }} dir={dir}>
            <div style={{ fontSize: 9, fontWeight: 700, color: NAVY, textTransform: 'uppercase',
                          letterSpacing: '0.15em', marginBottom: 4 }}>{tr.paymentTerms}</div>
            <div style={{ fontSize: 11, color: SLATE, lineHeight: 1.75 }}>{data.paymentTerms}</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
                      marginTop: 28, position: 'relative', zIndex: 1 }}>
          {[
            { top: tr.authorizedSignature, bot: `${data.companyName || 'RMA Cranes'} - ${data.salesRep || ''}` },
            { top: tr.clientSignature,     bot: `${data.clientCompany || tr.client} - ${data.clientContact || ''}` },
          ].map((s, i) => (
            <div key={i} dir={dir}>
              <div style={{ fontSize: 10, color: SLATE, marginBottom: 36 }}>{s.top}</div>
              <div style={{ borderTop: `1.5px solid ${RULE}`, paddingTop: 7,
                            fontSize: 10, color: SLATE }}>{s.bot}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: NAVY, position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: 2, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L}, ${GOLD})` }} />

        <div style={{ padding: '20px 44px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: GOLD_L, letterSpacing: '0.04em',
                        fontStyle: 'italic', lineHeight: 1.5 }}>
            "{tr.marketingTagline}"
          </div>
        </div>

        <div style={{ padding: '0 44px 18px', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', flexDirection: rtl ? 'row-reverse' : 'row' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12,
                        flexDirection: rtl ? 'row-reverse' : 'row' }}>
            <img src={RMA_LOGO_URL} alt="RMA"
              style={{ height: 38, width: 38, objectFit: 'cover', borderRadius: 7,
                       border: `1.5px solid ${GOLD}`, opacity: 0.95 }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600,
                           letterSpacing: '0.04em' }}>
              {data.companyName || 'RMA Cranes'}
            </span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: rtl ? 'left' : 'right' }}>
            {tr.footerValidity} {data.validUntil || '-'}<br />{tr.footerSubject}
          </div>
        </div>
      </div>
    </div>
  );
}

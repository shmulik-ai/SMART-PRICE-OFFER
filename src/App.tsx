import React, { useRef, useState, useEffect } from 'react';
import { FileDown, Eye, Edit3, RefreshCw, Globe2, FilePlus, Save } from 'lucide-react';
import QuotationForm from './components/QuotationForm';
import QuotationPreview from './components/QuotationPreview';
import { QuotationData, defaultData } from './types';
import QuoteHistoryPanel, { addToHistory, HISTORY_KEY } from './components/QuoteHistoryPanel';
import { History } from 'lucide-react';
import { Lang, t } from './i18n';

type Tab = 'form' | 'preview' | 'history';

const RMA_LOGO_URL = `${import.meta.env.BASE_URL}rma-logo.jpg`;

// Compact single-page PDF export
async function exportPDF(element: HTMLDivElement, filename: string) {
  if (!element) throw new Error('Preview element not found');

  const html2canvasModule = await import('html2canvas');
  const html2canvas = html2canvasModule.default ?? html2canvasModule;

  const jspdfModule = await import('jspdf');
  const jsPDF = jspdfModule.jsPDF ?? jspdfModule.default ?? (jspdfModule as any).default;

  // Render at scale 2 for crisp output
  const canvas = await (html2canvas as any)(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    removeContainer: true,
  });

  const pw     = 210;   // A4 width  mm
  const pageH  = 297;   // A4 height mm

  // How many mm per canvas pixel (width axis)
  const mmPerPx = pw / canvas.width;
  // Full content height in mm
  const contentH = canvas.height * mmPerPx;
  // How many pixels fit in one A4 page
  const pageHeightPx = pageH / mmPerPx;

  const pdf = new (jsPDF as any)({
    orientation: 'portrait', unit: 'mm', format: 'a4', compress: true,
  });

  const totalPages = Math.ceil(contentH / pageH);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    const srcY      = Math.round(page * pageHeightPx);
    const sliceH    = Math.min(pageHeightPx, canvas.height - srcY);
    const sliceHmm  = sliceH * mmPerPx;

    // Create a one-page-tall slice canvas
    const slice     = document.createElement('canvas');
    slice.width     = canvas.width;
    slice.height    = Math.ceil(sliceH);
    const ctx       = slice.getContext('2d')!;
    ctx.fillStyle   = '#ffffff';
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, -srcY);

    const imgData = slice.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pw, sliceHmm, undefined, 'FAST');
  }

  // Download via blob URL
  const blob = pdf.output('blob');
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function PageCrane() {
  return (
    <svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'fixed', bottom: 0, right: 0, width: 360, height: 500,
               opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}>
      <rect x="185" y="80"  width="30" height="460" fill="#0f2744" />
      <rect x="10"  y="70"  width="360" height="18"  fill="#0f2744" />
      <line x1="200" y1="30" x2="10"   y2="88"  stroke="#0f2744" strokeWidth="8" />
      <line x1="200" y1="30" x2="370"  y2="88"  stroke="#0f2744" strokeWidth="8" />
      <line x1="90"  y1="88" x2="90"   y2="200" stroke="#0f2744" strokeWidth="6" />
      <rect x="76" y="200" width="28" height="18" rx="3" fill="#0f2744" />
      <path d="M90 218 Q72 240 80 260 Q90 278 106 264 Q116 250 100 242" stroke="#0f2744" strokeWidth="6" fill="none" />
      <rect x="162" y="28" width="56" height="42" rx="4" fill="#0f2744" />
      <rect x="290" y="88" width="56" height="28" rx="3" fill="#0f2744" />
      <rect x="120" y="532" width="160" height="20" rx="5" fill="#0f2744" />
      <rect x="145" y="510" width="110" height="24" rx="4" fill="#0f2744" />
    </svg>
  );
}

const STORAGE_KEY = 'rma-quote-data-v1';

function loadFromStorage(): QuotationData {
  if (typeof window === 'undefined') return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    // Merge with defaults so newly added fields don't break old saved data
    const merged = { ...defaultData, ...parsed };
    // If saved logo is a corrupted/truncated base64, clear it so the default logo shows
    if (merged.companyLogo && !merged.companyLogo.startsWith('data:image/') && !merged.companyLogo.startsWith('http') && !merged.companyLogo.startsWith('/')) {
      merged.companyLogo = '';
    }
    return merged;
  } catch {
    return defaultData;
  }
}

export default function App() {
  const [data, setData]        = useState<QuotationData>(loadFromStorage);
  const [tab, setTab]          = useState<Tab>('form');
  const [lang, setLang]        = useState<Lang>('en');
  const [exporting, setExport] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null!);

  // Auto-save: every change to `data` is persisted instantly
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage might be full or disabled - silently ignore
    }
  }, [data]);

  const tr  = t[lang];
  const rtl = lang === 'he';

  const handleNewQuote = () => {
    if (!confirm(tr.newQuoteConfirm)) return;
    // Save current quote to history before clearing
    if (data.quoteNumber || data.clientCompany) addToHistory(data);
    const year = new Date().getFullYear();
    const num  = String(Math.floor(Math.random() * 900) + 100);
    const fresh = { ...defaultData, quoteNumber: `QT-${year}-${num}` };
    localStorage.removeItem(STORAGE_KEY);
    setData(fresh);
    setTab('form');
  };

  const [savedFlash, setSavedFlash] = React.useState(false);

  const handleSave = () => {
    addToHistory(data);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const handleExport = async () => {
    setTab('preview');
    setExport(true);
    // Give React time to mount the preview and paint it
    await new Promise(r => setTimeout(r, 700));
    try {
      addToHistory(data);
      await exportPDF(previewRef.current, `Quote-${data.quoteNumber || 'draft'}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      // Fallback: open print dialog
      window.print();
    } finally {
      setExport(false);
    }
  };

  return (
    <div className="min-h-screen relative" dir={rtl ? 'rtl' : 'ltr'} style={{ fontFamily: rtl ? "'Heebo', 'Inter', sans-serif" : "'Inter', sans-serif" }}>
      <PageCrane />

      <header
        className="sticky top-0 z-50 shadow-navy backdrop-blur-md"
        style={{ background: 'linear-gradient(180deg, #0a1c33 0%, #0f2744 100%)' }}
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg, #b8922a, #d4a847, #b8922a)' }} />

        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">

          <div className={`flex items-center gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            <div
              style={{
                width: 48, height: 48, borderRadius: 10,
                background: 'white',
                border: '2px solid #d4a847',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
                boxShadow: '0 4px 12px -4px rgba(212, 168, 71, 0.5)',
              }}
            >
              <img
                src={RMA_LOGO_URL}
                alt="RMA Cranes"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div
                className="text-white font-extrabold text-lg leading-tight tracking-tight"
                style={{ fontFamily: "'Manrope', 'Inter', sans-serif" }}
              >
                RMA <span style={{ color: '#d4a847' }}>Cranes</span>
              </div>
              <div className="text-[11px] leading-tight font-medium" style={{ color: '#d4a847' }}>
                {tr.appSub}
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => setLang(l => l === 'en' ? 'he' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition hover:scale-105"
              style={{
                color: '#d4a847',
                border: '1px solid rgba(212,168,71,0.35)',
                background: 'rgba(212,168,71,0.08)',
              }}
            >
              <Globe2 size={13} />
              <span>{lang === 'en' ? 'עברית' : 'English'}</span>
            </button>

            <button
              onClick={handleNewQuote}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-bold transition"
              style={{ color: '#d4a847', border: '1px solid rgba(212,168,71,0.35)', background: 'rgba(212,168,71,0.08)' }}
            >
              <FilePlus size={13} /> {tr.newQuote}
            </button>

            <button
              onClick={() => { if (confirm(rtl ? 'לאפס את כל השדות לתבנית המקורית?' : 'Reset all fields to original template?')) { localStorage.removeItem(STORAGE_KEY); setData(defaultData); } }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition text-white/50 hover:text-white hover:bg-white/5"
            >
              <RefreshCw size={13} /> {tr.reset}
            </button>

            <button
              onClick={() => setTab(tab === 'form' ? 'preview' : 'form')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition text-white/70 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              {tab === 'form' ? <><Eye size={13} /> {tr.preview}</> : <><Edit3 size={13} /> {tr.form}</>}
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-bold transition"
              style={{ color: savedFlash ? '#16a34a' : '#d4a847', border: `1px solid ${savedFlash ? 'rgba(22,163,74,0.4)' : 'rgba(212,168,71,0.35)'}`, background: savedFlash ? 'rgba(22,163,74,0.1)' : 'rgba(212,168,71,0.08)' }}
            >
              <Save size={13} /> {savedFlash ? (rtl ? '✓ נשמר' : '✓ Saved') : (rtl ? 'שמור הצעה' : 'Save')}
            </button>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-gold flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg shadow-brand text-white disabled:opacity-60"
            >
              <FileDown size={15} />
              {exporting ? tr.generating : tr.exportPdf}
            </button>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 flex border-t border-white/5">
          {([
            { key: 'form',    label: `> ${tr.form}` },
            { key: 'preview', label: `[ ${tr.preview} ]` },
            { key: 'history', label: rtl ? '⏱ הצעות קודמות' : '⏱ History' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition border-b-2 ${
                tab === key
                  ? 'border-brand-500 text-brand-400'
                  : 'border-transparent text-white/40 hover:text-white/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-8 relative z-10">
        {tab === 'form' ? (
          <div className="max-w-3xl mx-auto">

            <div className="mb-8 text-center animate-fade-in">
              <div className="inline-flex items-center gap-3 mb-4">
                <div
                  className="grid place-items-center rounded-2xl shadow-brand"
                  style={{
                    width: 72, height: 72,
                    background: 'white',
                    border: '3px solid #d4a847',
                  }}
                >
                  <img src={RMA_LOGO_URL} alt="RMA" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10 }} />
                </div>
              </div>

              <div
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3"
                style={{ background: 'rgba(212, 168, 71, 0.12)', color: '#967622', border: '1px solid rgba(212, 168, 71, 0.3)' }}
              >
                {rtl ? 'RMA CRANES - הצעת מחיר חכמה' : 'RMA CRANES - SMART QUOTATION'}
              </div>

              <h1
                className="text-3xl md:text-4xl font-black text-navy-900 tracking-tight"
                style={{ fontFamily: rtl ? "'Heebo', sans-serif" : "'Manrope', sans-serif" }}
              >
                {tr.buildQuote}
              </h1>
              <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">{tr.buildQuoteSub}</p>

              <div className="mt-5 mx-auto gold-divider" style={{ height: 2, width: 80 }} />
            </div>

            <QuotationForm data={data} onChange={setData} tr={tr} rtl={rtl} />

            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => setTab('preview')}
                className="btn-navy flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl shadow-navy text-white"
              >
                <Eye size={16} /> {tr.preview}
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="btn-gold flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl shadow-brand text-white disabled:opacity-60"
              >
                <FileDown size={16} />
                {exporting ? tr.generating : tr.exportPdf}
              </button>
            </div>
          </div>
        ) : tab === 'history' ? (
          <div className="animate-fade-in">
            <QuoteHistoryPanel
              tr={tr}
              rtl={rtl}
              onLoad={(q) => { setData(q); setTab('form'); }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setTab('form')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-white rounded-xl transition hover:scale-105"
                style={{ background: '#334155' }}
              >
                <Edit3 size={14} /> {tr.backToForm}
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="btn-gold flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl shadow-brand text-white disabled:opacity-60"
              >
                <FileDown size={14} />
                {exporting ? tr.generating : tr.downloadPdf}
              </button>
            </div>
            <div className="shadow-2xl rounded-sm overflow-hidden ring-1 ring-slate-200">
              <QuotationPreview data={data} previewRef={previewRef} tr={tr} rtl={rtl} />
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-slate-200 mt-12 py-6 text-center">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <img src={RMA_LOGO_URL} alt="RMA" style={{ width: 18, height: 18, objectFit: 'cover', borderRadius: 3 }} />
          <span>RMA Cranes - {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}

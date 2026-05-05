import React, { useRef, useState } from 'react';
import { FileDown, Eye, Edit3, RefreshCw } from 'lucide-react';
import QuotationForm from './components/QuotationForm';
import QuotationPreview from './components/QuotationPreview';
import { QuotationData, defaultData } from './types';
import { Lang, t } from './i18n';

type Tab = 'form' | 'preview';

async function exportPDF(element: HTMLDivElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas');
  const { default: jsPDF }       = await import('jspdf');

  const canvas = await html2canvas(element, {
    scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
  });

  const imgData  = canvas.toDataURL('image/png');
  const pw       = 210;
  const ph       = (canvas.height * pw) / canvas.width;
  const pageH    = 297;
  const pdf      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  if (ph <= pageH) {
    pdf.addImage(imgData, 'PNG', 0, 0, pw, ph);
  } else {
    const pageCount = Math.ceil(ph / pageH);
    const pageHpx   = (pageH * canvas.width) / pw;
    for (let i = 0; i < pageCount; i++) {
      const srcY = i * pageHpx;
      const pc   = document.createElement('canvas');
      pc.width   = canvas.width;
      pc.height  = Math.min(pageHpx, canvas.height - srcY);
      pc.getContext('2d')!.drawImage(canvas, 0, srcY, canvas.width, pc.height, 0, 0, canvas.width, pc.height);
      if (i > 0) pdf.addPage();
      pdf.addImage(pc.toDataURL('image/png'), 'PNG', 0, 0, pw, (pc.height * pw) / canvas.width);
    }
  }
  pdf.save(filename);
}

// Very subtle page-background crane
function PageCrane() {
  return (
    <svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'fixed', bottom: 0, right: 0, width: 360, height: 500,
               opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
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

export default function App() {
  const [data, setData]        = useState<QuotationData>(defaultData);
  const [tab, setTab]          = useState<Tab>('form');
  const [lang, setLang]        = useState<Lang>('en');
  const [exporting, setExport] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null!);

  const tr  = t[lang];
  const rtl = lang === 'he';

  const handleExport = async () => {
    setTab('preview');
    setExport(true);
    await new Promise(r => setTimeout(r, 400));
    try {
      await exportPDF(previewRef.current, `Quote-${data.quoteNumber || 'draft'}.pdf`);
    } finally {
      setExport(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative" dir={rtl ? 'rtl' : 'ltr'}>
      <PageCrane />

      {/* ── NAV ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 shadow-md" style={{ background: '#0f2744' }}>
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Brand */}
          <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
            <div style={{ position: 'relative' }}>
              <img src="/rma-logo.jpg" alt="RMA Cranes"
                className="h-11 w-11 object-cover rounded-lg"
                style={{ border: '2px solid #b8922a' }} />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight tracking-tight">RMA Cranes</div>
              <div className="text-xs leading-tight" style={{ color: '#d4a847' }}>{tr.appSub}</div>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
            {/* Language */}
            <button onClick={() => setLang(l => l === 'en' ? 'he' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              style={{ color: '#d4a847', border: '1px solid rgba(212,168,71,0.3)',
                       background: 'rgba(212,168,71,0.06)' }}>
              <span>{lang === 'en' ? '🇮🇱' : '🇬🇧'}</span>
              <span>{lang === 'en' ? 'עברית' : 'English'}</span>
            </button>

            <button onClick={() => { if (confirm(rtl ? 'לאפס?' : 'Reset all fields?')) setData(defaultData); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              <RefreshCw size={13} /> {tr.reset}
            </button>

            <button onClick={() => setTab(tab === 'form' ? 'preview' : 'form')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition"
              style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)' }}>
              {tab === 'form' ? <><Eye size={13} /> {tr.preview}</> : <><Edit3 size={13} /> {tr.form}</>}
            </button>

            <button onClick={handleExport} disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow transition disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #b8922a, #d4a847)', color: 'white' }}>
              <FileDown size={15} />
              {exporting ? tr.generating : tr.exportPdf}
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-screen-xl mx-auto px-6 flex border-t border-white/5">
          {(['form', 'preview'] as Tab[]).map(t2 => (
            <button key={t2} onClick={() => setTab(t2)}
              className={`px-5 py-2.5 text-xs font-semibold tracking-wider transition border-b-2 ${
                tab === t2
                  ? 'border-yellow-600 text-yellow-500'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}>
              {t2 === 'form' ? `✏️  ${tr.form}` : `📄  ${tr.preview}`}
            </button>
          ))}
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-4 py-8 relative z-10">
        {tab === 'form' ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{tr.buildQuote}</h1>
              <p className="text-slate-400 text-sm mt-1">{tr.buildQuoteSub}</p>
            </div>

            <QuotationForm data={data} onChange={setData} tr={tr} rtl={rtl} />

            <div className="mt-8 flex justify-center gap-4">
              <button onClick={() => setTab('preview')}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl shadow transition"
                style={{ background: '#0f2744', color: 'white' }}>
                <Eye size={16} /> {tr.preview}
              </button>
              <button onClick={handleExport} disabled={exporting}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl shadow transition disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #b8922a, #d4a847)', color: 'white' }}>
                <FileDown size={16} />
                {exporting ? tr.generating : tr.exportPdf}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className={`flex gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
              <button onClick={() => setTab('form')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-white rounded-xl transition"
                style={{ background: '#334155' }}>
                <Edit3 size={14} /> {tr.backToForm}
              </button>
              <button onClick={handleExport} disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl shadow transition disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #b8922a, #d4a847)', color: 'white' }}>
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
    </div>
  );
}

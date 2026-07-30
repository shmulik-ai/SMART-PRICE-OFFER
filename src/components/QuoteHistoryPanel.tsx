import React, { useState, useEffect } from 'react';
import { QuotationData } from '../types';
import { Translations } from '../i18n';
import { Copy, Edit3, Folder, FolderPlus, Trash2, Search, ChevronDown, ChevronRight } from 'lucide-react';

export interface SavedQuote {
  id: string;
  savedAt: string;
  folder: string;
  data: QuotationData;
}

export const HISTORY_KEY = 'rma-quote-history-v1';

export function loadHistory(): SavedQuote[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveHistory(history: SavedQuote[]): void {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch {}
}

export function addToHistory(data: QuotationData, folder = ''): void {
  const history = loadHistory();
  // Update existing entry if same quoteNumber exists, else add new
  const existing = history.findIndex(q => q.data.quoteNumber === data.quoteNumber);
  const entry: SavedQuote = {
    id: existing >= 0 ? history[existing].id : `q-${Date.now()}`,
    savedAt: new Date().toISOString(),
    folder: existing >= 0 ? history[existing].folder : folder,
    data: { ...data },
  };
  if (existing >= 0) history[existing] = entry;
  else history.unshift(entry);
  saveHistory(history);
}

function fmt(n: string, c: string) {
  const v = parseFloat(n);
  if (isNaN(v)) return '-';
  const sym: Record<string, string> = { USD: '$', EUR: '€', ILS: '₪', GBP: '£' };
  return (sym[c] ?? c + ' ') + v.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

interface Props {
  tr: Translations;
  rtl: boolean;
  onLoad: (data: QuotationData) => void;
}

export default function QuoteHistoryPanel({ tr, rtl, onLoad }: Props) {
  const [history, setHistory] = useState<SavedQuote[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'client' | 'number'>('date');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [movingId, setMovingId] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const reload = () => setHistory(loadHistory());
  useEffect(() => { reload(); }, []);

  const del = (id: string) => {
    if (!confirm(rtl ? 'למחוק הצעה זו?' : 'Delete this quote?')) return;
    const h = history.filter(q => q.id !== id);
    saveHistory(h);
    setHistory(h);
  };

  const duplicate = (q: SavedQuote) => {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 900) + 100);
    const copy: SavedQuote = {
      id: `q-${Date.now()}`,
      savedAt: new Date().toISOString(),
      folder: q.folder,
      data: { ...q.data, quoteNumber: `QT-${year}-${num}`, quoteDate: new Date().toISOString().split('T')[0] },
    };
    const h = [copy, ...history];
    saveHistory(h);
    setHistory(h);
  };

  const moveToFolder = (id: string, folder: string) => {
    const h = history.map(q => q.id === id ? { ...q, folder } : q);
    saveHistory(h);
    setHistory(h);
    setMovingId(null);
  };

  const createFolder = () => {
    const name = newFolder.trim();
    if (!name) return;
    // Move the currently-moving quote to the new folder
    if (movingId) moveToFolder(movingId, name);
    setNewFolder('');
    setShowNewFolder(false);
  };

  const allFolders = Array.from(new Set(history.map(q => q.folder).filter(Boolean)));

  const filtered = history
    .filter(q => {
      const s = search.toLowerCase();
      return !s ||
        q.data.quoteNumber?.toLowerCase().includes(s) ||
        q.data.clientCompany?.toLowerCase().includes(s) ||
        q.data.preparedFor?.toLowerCase().includes(s) ||
        q.folder.toLowerCase().includes(s);
    })
    .sort((a, b) => {
      if (sortBy === 'date')   return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      if (sortBy === 'client') return (a.data.clientCompany || a.data.preparedFor || '').localeCompare(b.data.clientCompany || b.data.preparedFor || '');
      if (sortBy === 'number') return (a.data.quoteNumber || '').localeCompare(b.data.quoteNumber || '');
      return 0;
    });

  // Group by folder
  const groups: Record<string, SavedQuote[]> = {};
  const noFolder = rtl ? 'ללא תיקייה' : 'Unfiled';
  filtered.forEach(q => {
    const key = q.folder || noFolder;
    if (!groups[key]) groups[key] = [];
    groups[key].push(q);
  });

  const toggleCollapse = (key: string) =>
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));

  const NAVY = '#0f2744';
  const GOLD = '#b8922a';

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 16px 40px' }} dir={rtl ? 'rtl' : 'ltr'}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 20, flexDirection: rtl ? 'row-reverse' : 'row' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: NAVY, margin: 0 }}>
            {rtl ? 'הצעות קודמות' : 'Quote History'}
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
            {history.length} {rtl ? 'הצעות שמורות' : 'saved quotes'}
          </p>
        </div>
      </div>

      {/* Search + Sort */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                                      [rtl ? 'right' : 'left']: 12, color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={rtl ? 'חיפוש לפי מספר הצעה, לקוח...' : 'Search by quote number, client...'}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: rtl ? '9px 36px 9px 12px' : '9px 12px 9px 36px',
              border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13,
              outline: 'none', background: 'white', color: NAVY,
              direction: rtl ? 'rtl' : 'ltr',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
          {([
            { key: 'date',   label: rtl ? 'תאריך' : 'Date' },
            { key: 'client', label: rtl ? 'לקוח' : 'Client' },
            { key: 'number', label: rtl ? 'מספר' : 'Number' },
          ] as { key: typeof sortBy; label: string }[]).map(({ key, label }) => (
            <button key={key} onClick={() => setSortBy(key)}
              style={{
                padding: '5px 11px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
                background: sortBy === key ? 'white' : 'transparent',
                color: sortBy === key ? NAVY : '#94a3b8',
                boxShadow: sortBy === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <Folder size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <div style={{ fontSize: 15, fontWeight: 600 }}>
            {rtl ? 'אין הצעות שמורות עדיין' : 'No saved quotes yet'}
          </div>
          <div style={{ fontSize: 12, marginTop: 6 }}>
            {rtl ? 'הצעות נשמרות אוטומטית בעת ייצוא PDF או יצירת הצעה חדשה'
                 : 'Quotes are auto-saved when exporting PDF or creating a new quote'}
          </div>
        </div>
      ) : (
        Object.entries(groups).map(([folderName, quotes]) => (
          <div key={folderName} style={{ marginBottom: 24 }}>
            {/* Folder header */}
            <button
              onClick={() => toggleCollapse(folderName)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none',
                       border: 'none', cursor: 'pointer', padding: '6px 0', width: '100%',
                       flexDirection: rtl ? 'row-reverse' : 'row' }}
            >
              {collapsed[folderName]
                ? <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                : <ChevronDown  size={14} style={{ color: '#94a3b8' }} />}
              <Folder size={14} style={{ color: GOLD }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569',
                             letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {folderName}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                ({quotes.length})
              </span>
              <div style={{ flex: 1, height: 1, background: '#f1f5f9',
                            marginLeft: rtl ? 0 : 8, marginRight: rtl ? 8 : 0 }} />
            </button>

            {!collapsed[folderName] && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12, marginTop: 8 }}>
                {quotes.map(q => (
                  <QuoteCard
                    key={q.id}
                    q={q}
                    rtl={rtl}
                    allFolders={allFolders}
                    isMoving={movingId === q.id}
                    onLoad={() => onLoad(q.data)}
                    onDuplicate={() => duplicate(q)}
                    onDelete={() => del(q.id)}
                    onStartMove={() => setMovingId(movingId === q.id ? null : q.id)}
                    onMoveToFolder={folder => moveToFolder(q.id, folder)}
                    onShowNewFolder={() => { setMovingId(q.id); setShowNewFolder(true); }}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}

      {/* New folder dialog */}
      {showNewFolder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 340,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} dir={rtl ? 'rtl' : 'ltr'}>
            <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 14 }}>
              {rtl ? 'תיקייה חדשה' : 'New Folder'}
            </div>
            <input
              autoFocus
              value={newFolder}
              onChange={e => setNewFolder(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') setShowNewFolder(false); }}
              placeholder={rtl ? 'שם התיקייה...' : 'Folder name...'}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px',
                       border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                       outline: 'none', marginBottom: 14, direction: rtl ? 'rtl' : 'ltr' }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexDirection: rtl ? 'row-reverse' : 'row' }}>
              <button onClick={() => setShowNewFolder(false)}
                style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #e2e8f0',
                         background: 'white', fontSize: 13, cursor: 'pointer', color: '#64748b' }}>
                {rtl ? 'ביטול' : 'Cancel'}
              </button>
              <button onClick={createFolder}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none',
                         background: NAVY, color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {rtl ? 'צור' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  q: SavedQuote;
  rtl: boolean;
  allFolders: string[];
  isMoving: boolean;
  onLoad: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onStartMove: () => void;
  onMoveToFolder: (f: string) => void;
  onShowNewFolder: () => void;
}

function QuoteCard({ q, rtl, allFolders, isMoving, onLoad, onDuplicate, onDelete, onStartMove, onMoveToFolder, onShowNewFolder }: CardProps) {
  const NAVY = '#0f2744';
  const GOLD = '#b8922a';

  const date = new Date(q.savedAt).toLocaleDateString(rtl ? 'he-IL' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const client = q.data.preparedFor?.trim() || q.data.clientCompany || (rtl ? 'ללא לקוח' : 'No client');
  const amount = fmt(q.data.unitPrice, q.data.currency || 'EUR');

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12,
                  padding: '14px 16px', position: 'relative', overflow: 'visible',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'box-shadow 0.15s',
                  direction: rtl ? 'rtl' : 'ltr' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)')}
    >
      {/* Quote number + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    marginBottom: 8, flexDirection: rtl ? 'row-reverse' : 'row' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: NAVY }}>{q.data.quoteNumber}</div>
        <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap', marginTop: 1 }}>{date}</div>
      </div>

      {/* Client */}
      <div style={{ fontSize: 12, color: '#475569', fontWeight: 500, marginBottom: 6,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {client}
      </div>

      {/* Amount + model */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 12, flexDirection: rtl ? 'row-reverse' : 'row' }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: GOLD }}>{amount}</div>
        <div style={{ fontSize: 10, color: '#94a3b8', background: '#f8fafc',
                      padding: '2px 7px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
          {q.data.craneModel || '-'}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexDirection: rtl ? 'row-reverse' : 'row' }}>
        <button onClick={onLoad}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                   gap: 5, padding: '7px 0', borderRadius: 8, border: 'none',
                   background: NAVY, color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
          <Edit3 size={11} /> {rtl ? 'ערוך' : 'Edit'}
        </button>
        <button onClick={onDuplicate}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                   gap: 5, padding: '7px 0', borderRadius: 8, fontSize: 11, fontWeight: 600,
                   border: '1px solid #e2e8f0', background: 'white', color: '#475569', cursor: 'pointer' }}>
          <Copy size={11} /> {rtl ? 'העתק' : 'Copy'}
        </button>
        <button onClick={onStartMove} title={rtl ? 'העבר לתיקייה' : 'Move to folder'}
          style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                   borderRadius: 8, border: '1px solid #e2e8f0', background: isMoving ? '#f1f5f9' : 'white',
                   color: isMoving ? NAVY : '#94a3b8', cursor: 'pointer' }}>
          <FolderPlus size={12} />
        </button>
        <button onClick={onDelete} title={rtl ? 'מחק' : 'Delete'}
          style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                   borderRadius: 8, border: '1px solid #fecaca', background: '#fff5f5',
                   color: '#ef4444', cursor: 'pointer' }}>
          <Trash2 size={11} />
        </button>
      </div>

      {/* Folder picker dropdown */}
      {isMoving && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, zIndex: 50,
                      background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
          {allFolders.length > 0 && (
            <>
              {allFolders.filter(f => f !== q.folder).map(f => (
                <button key={f} onClick={() => onMoveToFolder(f)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                           padding: '9px 14px', border: 'none', background: 'white',
                           fontSize: 13, color: '#374151', cursor: 'pointer', textAlign: rtl ? 'right' : 'left',
                           flexDirection: rtl ? 'row-reverse' : 'row' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  <Folder size={13} style={{ color: GOLD }} /> {f}
                </button>
              ))}
              <div style={{ height: 1, background: '#f1f5f9' }} />
            </>
          )}
          {q.folder && (
            <button onClick={() => onMoveToFolder('')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                       padding: '9px 14px', border: 'none', background: 'white',
                       fontSize: 12, color: '#94a3b8', cursor: 'pointer',
                       flexDirection: rtl ? 'row-reverse' : 'row' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = 'white')}
            >
              {rtl ? 'הסר מתיקייה' : 'Remove from folder'}
            </button>
          )}
          <button onClick={onShowNewFolder}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                     padding: '9px 14px', border: 'none', background: 'white',
                     fontSize: 12, color: '#475569', fontWeight: 600, cursor: 'pointer',
                     flexDirection: rtl ? 'row-reverse' : 'row' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}
          >
            <FolderPlus size={12} style={{ color: GOLD }} />
            {rtl ? '+ תיקייה חדשה' : '+ New folder'}
          </button>
        </div>
      )}
    </div>
  );
}

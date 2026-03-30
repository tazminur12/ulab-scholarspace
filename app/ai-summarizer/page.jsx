"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AISummarizer() {
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState('paste'); // paste | upload | mynotes | pdfs
  const [textInput, setTextInput] = useState('');
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedPdf, setSelectedPdf] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium'); // short, medium, long
  const [summaryStyle, setSummaryStyle] = useState('paragraph'); // bullets, paragraph, outline
  const [focusOn, setFocusOn] = useState('all'); // keyconcepts, definitions, examples, all
  const [language, setLanguage] = useState('simple'); // simple, academic, technical
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [examHighlights, setExamHighlights] = useState({points: [], questions: [], formulas: []});
  const [history, setHistory] = useState([]);
  const [query, setQuery] = useState('');

  const fileInputRef = useRef();

  useEffect(() => {
    let t = setTimeout(() => setMounted(true), 0);
    const saved = localStorage.getItem('ulab_summaries');
    if (saved) {
      // defer setState to avoid synchronous setState in effect
      setTimeout(() => setHistory(JSON.parse(saved)), 0);
    }

    // Check for prefill from other parts of the app (e.g., Notebook "Summarize This Note")
    const pre = localStorage.getItem('ulab_summarizer_prefill');
    if (pre) {
      try {
        const p = JSON.parse(pre);
        if (p && p.text) {
          setTimeout(() => {
            setTextInput(p.text);
            setTab('paste');
            // remove after consumed
            localStorage.removeItem('ulab_summarizer_prefill');
          }, 0);
        }
      } catch (e) { console.error('Invalid summarizer prefill', e); }
    }

    return () => clearTimeout(t);
  }, []);

  // Mock notes/pdfs from localStorage or fallback
  const myNotes = (() => {
    const s = localStorage.getItem('ulab_notes');
    if (!s) return [
      { id: 'n1', title: 'OS - Deadlocks', text: 'Deadlock is a state where processes are blocked. The conditions are mutual exclusion, hold and wait, no preemption, and circular wait. Banker algorithm is used for avoidance.' },
      { id: 'n2', title: 'DB - Normalization', text: 'Normalization reduces redundancy. 1NF, 2NF, 3NF explained. Functional dependencies and anomalies.' }
    ];
    try { return JSON.parse(s); } catch { return []; }
  })();

  const myPdfs = (() => {
    const s = localStorage.getItem('ulab_pdfs');
    if (!s) return [
      { id: 'p1', title: 'OS Concepts (slide)', pages: 45 },
      { id: 'p2', title: 'DBMS Past Papers', pages: 12 }
    ];
    try { return JSON.parse(s); } catch { return []; }
  })();

  function readUploadedFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || '');
      reader.onerror = (e) => reject(e);
      if (file.type === 'application/pdf') {
        // For demo, we won't parse PDF binary; just return filename as placeholder
        resolve(`[PDF FILE] ${file.name} (preview not available in demo)`);
      } else {
        reader.readAsText(file);
      }
    });
  }

  // Very simple rule-based extractive summarizer
  function generateSummaryFromText(text) {
    if (!text) return {
      summary: 'No content provided.',
      keyPoints: [], definitions: [], examHighlights: {points:[],questions:[],formulas:[]}
    };

    // Split into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);

    // Keywords to boost
    const keywords = ['important','exam','significant','definition','means','is','are','key','remember','formula','result','therefore','because','leads to','causes','avoid'];

    // Score sentences by keyword presence and length
    const scored = sentences.map(s => {
      const low = s.toLowerCase();
      let score = 0;
      keywords.forEach(k => { if (low.includes(k)) score += 3; });
      // named entities or caps words
      const caps = (s.match(/[A-Z]{2,}/g) || []).length;
      score += Math.min(caps, 3);
      // length preference
      const len = s.split(' ').length;
      if (len > 6 && len < 40) score += 1;
      return { s, score };
    });

    // Keep top N sentences based on summaryLength
    const N = summaryLength === 'short' ? 2 : summaryLength === 'medium' ? 5 : 10;
    const top = scored.sort((a,b) => b.score - a.score).slice(0, N).map(x => x.s);

    // Remove duplicates preserving order from original text
    const ordered = sentences.filter(s => top.includes(s));

    // Build summary string according to style
    let sum = '';
    if (summaryStyle === 'paragraph') {
      sum = ordered.join(' ');
    } else if (summaryStyle === 'bullets') {
      sum = ordered.map(s => `- ${s.trim()}`).join('\n');
    } else if (summaryStyle === 'outline') {
      sum = ordered.map((s,i) => `${i+1}. ${s.trim()}`).join('\n');
    }

    // Key points: extract nouns/phrases naively (words longer than 5 chars and TitleCase)
    const nounCandidates = Array.from(new Set((text.match(/\b([A-Z][a-z]{2,}|[a-z]{6,})\b/g) || []))).slice(0, 8);
    const keyPoints = nounCandidates.map(p => p.replace(/\n+/g,' ')).slice(0,8);

    // Definitions: find 'X is ...' patterns
    const definitions = [];
    const defRegex = /([A-Za-z0-9\-\s]{2,50}?)\s+is\s+(?:a|an|the)?\s+([^\.\n]+)\.?/gi;
    let m;
    while ((m = defRegex.exec(text)) !== null && definitions.length < 6) {
      definitions.push({ term: m[1].trim(), definition: m[2].trim() });
    }

    // Exam highlights: sentences containing 'important','exam','remember','formula'
    const examSent = sentences.filter(s => /exam|important|remember|formula|likely|must know|practice|question/i.test(s));
    const formulas = (text.match(/([A-Za-z0-9]+\s*=\s*[A-Za-z0-9\+\-\/*\^\(\)]+)/g) || []).slice(0,5);

    const examHighlights = {
      points: examSent.slice(0,5),
      questions: examSent.slice(0,3).map(s => `Explain: ${s.replace(/\.$/, '')}?`),
      formulas
    };

    return { summary: sum, keyPoints, definitions, examHighlights };
  }

  async function handleGenerate(e) {
    e?.preventDefault();
    setIsGenerating(true);
    setSummary('');
    setKeyPoints([]);
    setDefinitions([]);
    setExamHighlights({points:[],questions:[],formulas:[]});

    // Determine source text
    let sourceText = textInput;
    if (tab === 'mynotes' && selectedNote) {
      const note = myNotes.find(n => n.id === selectedNote);
      if (note) sourceText = `${note.title}. ${note.text}`;
    }
    if (tab === 'pdfs' && selectedPdf) {
      const pdf = myPdfs.find(p => p.id === selectedPdf);
      if (pdf) sourceText = `[PDF] ${pdf.title} - preview not available in demo.`;
    }

    // small delay to simulate work
    setTimeout(() => {
      const res = generateSummaryFromText(sourceText);
      setSummary(res.summary);
      setKeyPoints(res.keyPoints);
      setDefinitions(res.definitions);
      setExamHighlights(res.examHighlights);

      // Save to history
      const entry = {
        id: Date.now(),
        query: (tab === 'paste' ? textInput.slice(0,60) : tab === 'mynotes' ? myNotes.find(n=>n.id===selectedNote)?.title : selectedPdf ? myPdfs.find(p=>p.id===selectedPdf)?.title : 'Upload'),
        source: tab,
        date: new Date().toISOString(),
        summary: res.summary,
        keyPoints: res.keyPoints
      };
      const newHist = [entry, ...history].slice(0,50);
      setHistory(newHist);
      localStorage.setItem('ulab_summaries', JSON.stringify(newHist));

      setIsGenerating(false);
    }, 600);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    readUploadedFile(file).then(text => setTextInput(text));
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(summary).then(() => alert('Copied to clipboard')); 
  }

  function saveToNotes() {
    const notes = JSON.parse(localStorage.getItem('ulab_notes') || '[]');
    const note = { id: 'sum_'+Date.now(), title: `Summary: ${new Date().toLocaleString()}`, text: summary };
    notes.unshift(note);
    localStorage.setItem('ulab_notes', JSON.stringify(notes));
    alert('Saved summary to Notes');
  }

  function downloadPDF() {
    // For demo: create a simple text blob and download with .pdf extension
    const blob = new Blob([summary], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function shareSummary() {
    if (navigator.share) {
      navigator.share({ title: 'AI Summary', text: summary }).catch(()=>{});
    } else {
      alert('Share not supported in this browser. Copy the summary instead.');
    }
  }

  function loadHistoryItem(id) {
    const item = history.find(h => h.id === id);
    if (!item) return;
    setSummary(item.summary);
    setKeyPoints(item.keyPoints || []);
  }

  if (!mounted) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Notes Summarizer</h1>
        <Link href="/dashboard" className="text-sm text-blue-600">Back to Dashboard</Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex gap-2 mb-4">
          {['paste','upload','mynotes','pdfs'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 rounded-md font-semibold ${tab===t? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{t==='paste'? 'Paste Text' : t==='upload'? 'Upload File' : t==='mynotes'? 'My Notes' : 'My PDFs'}</button>
          ))}
        </div>

        <div>
          {tab === 'paste' && (
            <div>
              <textarea value={textInput} onChange={e=>setTextInput(e.target.value)} placeholder="Paste your notes here..." className="w-full min-h-40 p-3 border border-gray-200 rounded-lg" />
            </div>
          )}

          {tab === 'upload' && (
            <div className="flex flex-col gap-3">
              <input ref={fileInputRef} type="file" accept=".txt,application/pdf" onChange={handleFileChange} />
              <p className="text-xs text-gray-500">Supported: .txt (full text), .pdf (demo preview)</p>
            </div>
          )}

          {tab === 'mynotes' && (
            <div>
              <select className="w-full p-2 border rounded" value={selectedNote} onChange={e=> setSelectedNote(e.target.value)}>
                <option value="">Select a note...</option>
                {myNotes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
            </div>
          )}

          {tab === 'pdfs' && (
            <div>
              <select className="w-full p-2 border rounded" value={selectedPdf} onChange={e=> setSelectedPdf(e.target.value)}>
                <option value="">Select a PDF...</option>
                {myPdfs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-semibold">Summary Length</label>
            <select className="w-full p-2 border rounded" value={summaryLength} onChange={e=>setSummaryLength(e.target.value)}>
              <option value="short">Short (1 para)</option>
              <option value="medium">Medium (3 paras)</option>
              <option value="long">Long (Detailed)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold">Style</label>
            <select className="w-full p-2 border rounded" value={summaryStyle} onChange={e=>setSummaryStyle(e.target.value)}>
              <option value="paragraph">Paragraph</option>
              <option value="bullets">Bullet points</option>
              <option value="outline">Outline</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold">Focus</label>
            <select className="w-full p-2 border rounded" value={focusOn} onChange={e=>setFocusOn(e.target.value)}>
              <option value="all">All</option>
              <option value="keyconcepts">Key concepts</option>
              <option value="definitions">Definitions</option>
              <option value="examples">Examples</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold">Language</label>
            <select className="w-full p-2 border rounded" value={language} onChange={e=>setLanguage(e.target.value)}>
              <option value="simple">Simple English</option>
              <option value="academic">Academic</option>
              <option value="technical">Technical</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={handleGenerate} disabled={isGenerating} className="bg-[#1e3a8a] text-white px-4 py-2 rounded font-bold">{isGenerating? 'Generating...' : 'Generate Summary'}</button>
          <button onClick={()=>{ setTextInput(''); setSummary(''); }} className="bg-gray-100 px-4 py-2 rounded">Reset</button>
        </div>
      </div>

      {/* Output */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex justify-between items-start gap-4">
          <h2 className="font-bold">Summary Output</h2>
          <div className="flex gap-2">
            <button onClick={copyToClipboard} className="px-3 py-1 rounded bg-gray-100">Copy</button>
            <button onClick={saveToNotes} className="px-3 py-1 rounded bg-blue-50 text-blue-700">Save to Notes</button>
            <button onClick={downloadPDF} className="px-3 py-1 rounded bg-gray-100">Download PDF</button>
            <button onClick={shareSummary} className="px-3 py-1 rounded bg-gray-100">Share</button>
          </div>
        </div>

        <div className="mt-3 min-h-24 p-3 border rounded bg-gray-50 whitespace-pre-wrap text-sm">
          {isGenerating ? 'Working...' : (summary || 'Your generated summary will appear here.')}
        </div>

        {/* Key Points  26 Definitions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-bold mb-2">Key Highlights</h3>
            <ul className="list-disc ml-5 text-sm">
              {keyPoints.length ? keyPoints.map((k,i)=>(<li key={i}>{k}</li>)) : <li className="text-gray-400">No highlights extracted.</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Important Terms</h3>
            {definitions.length ? definitions.map((d,i)=> (
              <div key={i} className="mb-2">
                <div className="font-semibold">{d.term}</div>
                <div className="text-sm text-gray-600">{d.definition}</div>
              </div>
            )) : <div className="text-sm text-gray-400">No definitions found.</div>}
          </div>
          <div>
            <h3 className="font-bold mb-2">Quick Revision</h3>
            <div className="text-sm text-gray-700">
              {examHighlights.points.length ? (
                <ul className="list-disc ml-5 text-sm">{examHighlights.points.map((p,i)=>(<li key={i}>{p}</li>))}</ul>
              ) : <div className="text-gray-400">No exam highlights detected.</div>}
            </div>
          </div>
        </div>

        {/* Exam Highlights */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">What&apos;s important for the exam?</h3>
          <div className="bg-gray-50 p-3 rounded">
            <div className="mb-2"><strong>Likely Questions:</strong></div>
            <ul className="list-disc ml-5 text-sm">
              {examHighlights.questions.length ? examHighlights.questions.map((q,i)=>(<li key={i}>{q}</li>)) : <li className="text-gray-400">No likely questions generated.</li>}
            </ul>
            <div className="mt-3"><strong>Formulas / Definitions to remember:</strong></div>
            <div className="text-sm mt-1">{examHighlights.formulas.length ? examHighlights.formulas.join(', ') : 'None detected.'}</div>
          </div>
        </div>

        {/* History */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">Summary History</h3>
          <div className="flex gap-2 mb-3">
            <input className="flex-1 p-2 border rounded" placeholder="Search history..." value={query} onChange={e=>setQuery(e.target.value)} />
            <button onClick={()=>{ setQuery(''); }} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.filter(h => h.query.toLowerCase().includes(query.toLowerCase())).map(h => (
              <div key={h.id} className="p-2 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{h.query}</div>
                  <div className="text-xs text-gray-500">{new Date(h.date).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=> loadHistoryItem(h.id)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">Load</button>
                </div>
              </div>
            ))}
            {history.length===0 && <div className="text-gray-400">No summaries yet.</div>}
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">Note: This summarizer uses a simple rule-based extractive approach for demo purposes. It highlights likely important sentences, extracts candidate key terms, and surfaces exam-focused tips.</div>
    </div>
  );
}

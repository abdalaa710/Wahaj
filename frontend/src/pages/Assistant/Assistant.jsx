import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Send, Bot, Database, Sparkles, Settings, Key, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import { askNL2SQL, getNL2SQLStatus, configureLLMAPI } from '../../services/api';

export const Assistant = () => {
  const { lang } = useApp();
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: lang === 'ar'
        ? 'أهلاً بك! أنا المساعد البحثي لمنصة وهّاج (WAHAJ AI Assistant). يمكنك طرح أي سؤال حول أبحاث وتحقيقات ناسا لاحتراق المواد في الفضاء، وسأقوم بتحليل سجلات وبيانات الطيران المعتمدة للإجابة عليك بإجابة علمية شاملة وموثقة بالأرقام والأدلة.'
        : 'Welcome! I am the WAHAJ Scientific AI Research Assistant. Ask any question regarding NASA’s microgravity combustion investigations, and I will consult verified flight records in the background to provide a comprehensive, evidence-backed response.'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  // LLM Configuration Modal State
  const [showConfig, setShowConfig] = useState(false);
  const [llmStatus, setLlmStatus] = useState(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [providerInput, setProviderInput] = useState('auto');
  const [modelInput, setModelInput] = useState('');
  const [configSuccess, setConfigSuccess] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const st = await getNL2SQLStatus();
    if (st && st.llm_status) {
      setLlmStatus(st.llm_status);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    const res = await configureLLMAPI(apiKeyInput.trim(), providerInput, modelInput.trim() || null);
    if (res && res.success) {
      setConfigSuccess(true);
      setLlmStatus(res.status);
      setTimeout(() => {
        setConfigSuccess(false);
        setShowConfig(false);
      }, 1500);
    }
  };

  // Section 5 categorized sample questions
  const sampleCategories = [
    {
      category: lang === 'ar' ? 'معلومات التحقيقات' : 'Investigations',
      questions: [
        'Show me all investigations.',
        'Find the investigation with the acronym FLEX.',
        'Which research center manages this investigation?'
      ]
    },
    {
      category: lang === 'ar' ? 'القياسات المعملية' : 'Experimental Measurements',
      questions: [
        'What is the maximum recorded temperature?',
        'Find experiments where cool flame was observed.',
        'What are the average burn durations?'
      ]
    },
    {
      category: lang === 'ar' ? 'ملفات المصادر والأدلة' : 'Source Evidence Files',
      questions: [
        'Show all files associated with FLEX.',
        'Find all CSV files.'
      ]
    },
    {
      category: lang === 'ar' ? 'استعلامات متقدمة' : 'Multi-Domain Inquiries',
      questions: [
        'Show all investigations with their associated source files.',
        'Find investigations that have XLSX experimental files.'
      ]
    }
  ];

  const handleSend = async (textToSend) => {
    const q = textToSend || inputVal;
    if (!q.trim() || loading) return;

    const newMsgs = [...messages, { sender: 'user', text: q }];
    setMessages(newMsgs);
    setInputVal('');
    setLoading(true);

    try {
      const res = await askNL2SQL(q);
      if (res && res.answer) {
        setMessages([
          ...newMsgs,
          {
            sender: 'ai',
            text: res.answer
          }
        ]);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('API error', e);
    }

    setMessages([
      ...newMsgs,
      {
        sender: 'ai',
        text: lang === 'ar'
          ? 'تعذر الاتصال بالخادم. يرجى التأكد من تشغيل FastAPI Backend على المنفذ 8000.'
          : 'Unable to communicate with the backend. Please verify FastAPI is running on port 8000.'
      }
    ]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 py-4 max-w-4xl mx-auto">
      
      {/* Header with Title and LLM Settings Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-midnight dark:text-ivory tracking-tight">
              {lang === 'ar' ? 'المساعد البحثي بالذكاء الاصطناعي' : 'AI Scientific Research Assistant'}
            </h1>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>{lang === 'ar' ? 'مدعوم بقاعدة بيانات ناسا' : 'NASA Database Connected'}</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-ivory/60 mt-1">
            {lang === 'ar'
              ? 'مساعد بحثي متخصص يجيبك بإجابات علمية شاملة مدعومة بأدلة وأرقام مسجلة من أبحاث ناسا في الفضاء'
              : 'Evidence-backed conversational agent analyzing verified NASA microgravity combustion archives'}
          </p>
        </div>

        {/* API Settings Button */}
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-white dark:bg-deepblue border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-ivory hover:border-inferno transition shadow-sm"
        >
          <Settings className="w-3.5 h-3.5 text-inferno" />
          <span>{lang === 'ar' ? 'إعدادات الذكاء الاصطناعي (API Key)' : 'LLM API Settings'}</span>
          {llmStatus?.has_api_key ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="API Key Connected" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-amber-500" title="Using Fallback Engine" />
          )}
        </button>
      </div>

      {/* LLM Configuration Panel */}
      {showConfig && (
        <div className="p-5 rounded-2xl bg-white dark:bg-deepblue border border-neutral-200 dark:border-neutral-700 shadow-md animate-fadeIn space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-inferno" />
              <h3 className="text-sm font-bold text-midnight dark:text-ivory">
                {lang === 'ar' ? 'تهيئة مزود الذكاء الاصطناعي' : 'Configure LLM Provider & API Key'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              Active: {llmStatus?.provider || 'fallback_engine'} ({llmStatus?.has_api_key ? 'Live API' : 'Deterministic Mode'})
            </span>
          </div>

          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-ivory/70 mb-1">
                API Key (OpenAI / Gemini / Groq / Anthropic)
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk-... or AIzaSy... or gsk_..."
                className="w-full text-xs px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-midnight border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-inferno text-midnight dark:text-ivory"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 dark:text-ivory/70 mb-1">
                Provider
              </label>
              <select
                value={providerInput}
                onChange={(e) => setProviderInput(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-neutral-100 dark:bg-midnight border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-inferno text-midnight dark:text-ivory"
              >
                <option value="auto">Auto-Detect</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="gemini">Google Gemini (1.5 Flash)</option>
                <option value="groq">Groq (Llama 3.3 70B)</option>
                <option value="anthropic">Anthropic Claude</option>
              </select>
            </div>

            <div className="md:col-span-3 flex items-center justify-between pt-2">
              <p className="text-[10px] text-neutral-500 dark:text-ivory/50">
                {lang === 'ar'
                  ? 'إذا لم يتم إدخال مفتاح، يعمل النظام تلقائياً بالمحرك الدلالي المدمج المدعوم ببيانات ناسا'
                  : 'If no key is entered, the system uses the high-precision built-in fallback engine seamlessly.'}
              </p>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-inferno text-midnight font-bold text-xs hover:opacity-95 transition"
              >
                {configSuccess ? 'Saved ✓' : (lang === 'ar' ? 'حفظ وتفعيل' : 'Save & Activate')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Suggested Questions by Category */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          {lang === 'ar' ? 'أسئلة بحثية مقترحة للاستكشاف:' : 'Suggested Research Questions:'}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {sampleCategories.map((cat, cIdx) => (
            <div key={cIdx} className="p-3 rounded-xl bg-white dark:bg-deepblue/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="text-[10px] font-bold text-inferno flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3 h-3" />
                <span>{cat.category}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {cat.questions.map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="text-left rtl:text-right p-1.5 px-2.5 rounded-lg bg-neutral-50 dark:bg-midnight/60 hover:bg-neutral-100 dark:hover:bg-midnight text-neutral-700 dark:text-ivory/90 hover:text-inferno transition text-[11px] truncate flex items-center justify-between group"
                  >
                    <span className="truncate">{q}</span>
                    <span className="text-[10px] text-neutral-400 group-hover:text-inferno shrink-0 ml-2">↵</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-[24px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 min-h-[520px] flex flex-col justify-between space-y-4">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-2 max-h-[600px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 items-start ${m.sender === 'user' ? 'justify-end' : ''}`}
            >
              {m.sender === 'ai' && (
                <div className="w-9 h-9 rounded-full bg-gradient-inferno text-midnight font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                  W
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-2xl text-xs leading-relaxed space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-gradient-inferno text-midnight font-semibold shadow-sm ml-12'
                    : 'bg-neutral-100 dark:bg-midnight/70 text-neutral-800 dark:text-ivory border border-neutral-200 dark:border-neutral-700 mr-12'
                }`}
              >
                {/* Natural Language Response from LLM */}
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                
                {m.sender === 'ai' && (
                  <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1 text-amber font-medium">
                      <span>•</span>
                      <span>{lang === 'ar' ? 'بيانات مؤكدة من أرشيف ناسا للعلوم الفيزيائية (PSI)' : 'NASA Physical Sciences Informatics (PSI) Verified Evidence'}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-neutral-500 dark:text-ivory/60 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gradient-inferno text-midnight font-black flex items-center justify-center text-xs">
                W
              </div>
              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-midnight/70 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-inferno animate-spin" />
                <span>
                  {lang === 'ar' ? 'جارٍ تحليل البيانات وصياغة الإجابة الموثقة...' : 'Analyzing database evidence & synthesizing response...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <input
            type="text"
            value={inputVal}
            disabled={loading}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              lang === 'ar'
                ? 'اطرح سؤالك هنا (مثال: ما هي أعلى درجة حرارة مسجلة في التجارب؟ أو ما هي تجربة FLEX؟)...'
                : 'Ask a question (e.g. What is the maximum recorded temperature? or Tell me about FLEX)...'
            }
            className="flex-1 bg-neutral-100 dark:bg-midnight text-xs rounded-full px-5 py-3.5 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-inferno text-midnight dark:text-ivory placeholder:text-neutral-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputVal.trim()}
            className="bg-gradient-inferno text-midnight font-bold text-xs px-6 py-3.5 rounded-full hover:opacity-95 active:scale-95 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>{lang === 'ar' ? 'إرسال' : 'Send'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

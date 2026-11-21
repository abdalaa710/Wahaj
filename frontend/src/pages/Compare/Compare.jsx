import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend, ResponsiveContainer, Tooltip
} from 'recharts';
import { Layers, CheckCircle2, RotateCcw, AlertTriangle, ShieldCheck, Flame, Scale, Sparkles } from 'lucide-react';

const SCORE_KEYS = ['safety_impact', 'evidence', 'mission_fit', 'actionability', 'novelty'];

const SCORE_LABELS = {
  en: {
    safety_impact: 'Safety Impact',
    evidence: 'Evidence Strength',
    mission_fit: 'Mission Fit',
    actionability: 'Actionability',
    novelty: 'Novelty'
  },
  ar: {
    safety_impact: 'أثر السلامة',
    evidence: 'قوة الأدلة',
    mission_fit: 'ملاءمة المهمة',
    actionability: 'قابلية التطبيق',
    novelty: 'الأصالة العلمية'
  }
};

// WAHAJ Brand Aerospace Palette
const COLORS = ['#FF641C', '#3B82F6', '#10B981', '#8B5CF6'];

export const Compare = () => {
  const { lang, theme } = useApp();
  const [allExps, setAllExps] = useState([]);
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch with API + Fallback
  useEffect(() => {
    fetch(`${API_URL}/api/experiments`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(data => {
        setAllExps(data);
        if (data.length >= 2) setSelected([data[0].id, data[1].id]);
        setLoading(false);
      })
      .catch(() => {
        // Built-in fallback
        import('../../data/investigations').then(() => {
          fetch('/api/experiments')
            .then(r => r.json())
            .then(setAllExps)
            .catch(() => {});
        });
        setLoading(false);
      });
  }, []);

  // Compare fetch
  useEffect(() => {
    if (selected.length === 0) {
      setDetail([]);
      return;
    }

    fetch(`${API_URL}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected }),
    })
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setDetail)
      .catch(() => {
        // Fallback filter
        const matched = allExps.filter(e => selected.includes(e.id));
        setDetail(matched);
      });
  }, [selected, allExps]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );
  };

  const labels = SCORE_LABELS[lang] || SCORE_LABELS.en;

  // Radar data
  const radarData = SCORE_KEYS.map(k => {
    const entry = { subject: labels[k].split(' ')[0] };
    detail.forEach(e => {
      entry[e.name] = Math.round(((e.scores || {})[k] || 0) * 100);
    });
    return entry;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-midnight/60 text-inferno border border-inferno/20 text-xs font-bold mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مقارنة الأبحاث والتجارب' : 'Multi-Investigation Comparison'}</span>
          </div>
          <h1 className="text-3xl font-black text-midnight dark:text-ivory tracking-tight">
            {lang === 'ar' ? 'مقارنة تحقيقات ناسا' : 'Compare NASA Investigations'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-ivory/60 mt-1">
            {lang === 'ar'
              ? 'اختر حتى 4 تحقيقات للمقارنة المباشرة جنباً إلى جنب في درجات الأمان، والأدلة، وظروف التشغيل'
              : 'Select up to 4 experiments to compare side-by-side across safety impact, evidence strength, and test conditions'}
          </p>
        </div>

        {selected.length > 0 && (
          <button
            onClick={() => setSelected([])}
            className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-deepblue/80 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-ivory hover:border-inferno transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إعادة ضبط' : 'Clear Selection'}</span>
          </button>
        )}
      </div>

      {/* Select Experiments Chips Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {lang === 'ar' ? 'اختر التجارب للمقارنة (حد أقصى 4)' : 'Select Experiments (Max 4)'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {allExps.map(e => {
            const isSel = selected.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={() => toggle(e.id)}
                className={`p-3 rounded-2xl text-left rtl:text-right transition-all border ${
                  isSel
                    ? 'bg-gradient-inferno text-midnight border-transparent font-bold shadow-md shadow-inferno/20 scale-[1.02]'
                    : 'bg-white dark:bg-deepblue/70 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-ivory hover:border-inferno/50'
                }`}
              >
                <div className="text-sm font-black truncate">{e.name}</div>
                <div className={`text-[10px] truncate mt-0.5 ${isSel ? 'text-midnight/80' : 'text-neutral-500 dark:text-ivory/60'}`}>
                  {e.domain} • {e.fuel_type?.split(' ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {detail.length > 0 ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Radar Chart Card */}
          <div className="p-6 md:p-8 rounded-[24px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-midnight dark:text-ivory">
                  {lang === 'ar' ? 'مخطط مقارنة درجات التقييم (Radar Profile)' : 'Score Profile Comparison'}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-ivory/60 mt-0.5">
                  {lang === 'ar' ? 'مقارنة خماسية الأبعاد لمعايير القوة والأمان والأثر' : '5-Dimensional score evaluation across selected NASA studies'}
                </p>
              </div>
            </div>

            <div className="w-full h-72 md:h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={theme === 'dark' ? '#22385c' : '#e2e8f0'} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: theme === 'dark' ? '#F8F3E9' : '#08152E', fontSize: 12, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  {detail.map((e, i) => (
                    <Radar
                      key={e.id}
                      name={e.name}
                      dataKey={e.name}
                      stroke={COLORS[i % COLORS.length]}
                      fill={COLORS[i % COLORS.length]}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend
                    wrapperStyle={{ paddingTop: 10, fontSize: 13, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#08152E' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#142B50' : '#E2E8F0',
                      borderRadius: 12,
                      color: theme === 'dark' ? '#F8F3E9' : '#08152E'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Table Card */}
          <div className="p-6 md:p-8 rounded-[24px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4 overflow-hidden">
            <h3 className="text-lg font-bold text-midnight dark:text-ivory">
              {lang === 'ar' ? 'جدول المقارنة التفصيلي' : 'Detailed Attribute Comparison'}
            </h3>

            <div className="overflow-x-auto pb-2">
              <table className="w-full text-xs text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 min-w-[140px]">{lang === 'ar' ? 'الخاصية / المعيار' : 'Attribute'}</th>
                    {detail.map((e, i) => (
                      <th key={e.id} className="py-3 px-4 min-w-[160px] text-sm font-black" style={{ color: COLORS[i % COLORS.length] }}>
                        {e.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</td>
                    {detail.map(e => <td key={e.id} className="py-3 px-4 text-midnight dark:text-ivory font-bold">{e.full_name}</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'مجال السلامة' : 'Domain'}</td>
                    {detail.map(e => (
                      <td key={e.id} className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-inferno/10 text-inferno border border-inferno/20 uppercase font-mono">
                          {e.domain}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'نوع الوقود' : 'Fuel / Material'}</td>
                    {detail.map(e => <td key={e.id} className="py-3 px-4 text-neutral-700 dark:text-ivory/80">{e.fuel_description}</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'المنصة / المعمل' : 'Facility'}</td>
                    {detail.map(e => <td key={e.id} className="py-3 px-4 text-neutral-700 dark:text-ivory/80">{e.facility}</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'نطاق الأكسجين' : 'O₂ Range'}</td>
                    {detail.map(e => (
                      <td key={e.id} className="py-3 px-4 font-mono font-bold text-inferno">
                        {e.conditions?.o2_pct_range?.join(' – ') ?? '—'}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'الضغط (kPa)' : 'Pressure (kPa)'}</td>
                    {detail.map(e => (
                      <td key={e.id} className="py-3 px-4 font-mono text-neutral-700 dark:text-ivory/80">
                        {e.conditions?.pressure_kpa_range?.join(' – ') ?? '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'سرعة التدفق (cm/s)' : 'Flow Speed (cm/s)'}</td>
                    {detail.map(e => (
                      <td key={e.id} className="py-3 px-4 font-mono text-neutral-700 dark:text-ivory/80">
                        {e.conditions?.flow_cm_s_range?.join(' – ') ?? '—'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'سنوات النشاط' : 'Years Active'}</td>
                    {detail.map(e => (
                      <td key={e.id} className="py-3 px-4 font-mono text-neutral-700 dark:text-ivory/80">
                        {e.years_active?.join(' – ') ?? '—'}
                      </td>
                    ))}
                  </tr>

                  {/* 5-Dimensional Scores Comparison */}
                  {SCORE_KEYS.map(k => (
                    <tr key={k} className="bg-neutral-50/50 dark:bg-midnight/20">
                      <td className="py-3 px-4 text-neutral-500 dark:text-ivory/60 font-semibold">{labels[k]}</td>
                      {detail.map((e, i) => {
                        const val = ((e.scores || {})[k] || 0) * 100;
                        return (
                          <td key={e.id} className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-20 bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${val}%`, backgroundColor: COLORS[i % COLORS.length] }}
                                />
                              </div>
                              <span className="font-mono font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                                {val.toFixed(0)}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'أهم الاكتشافات' : 'Key Findings'}</td>
                    {detail.map(e => (
                      <td key={e.id} className="py-3 px-4 font-bold text-midnight dark:text-ivory">
                        {e.findings?.length ?? 0} {lang === 'ar' ? 'اكتشافات علمية' : 'findings'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{lang === 'ar' ? 'ملاءمة المهمة' : 'Mission Relevance'}</td>
                    {detail.map(e => (
                      <td key={e.id} className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(e.mission_relevance || []).map(m => (
                            <span
                              key={m}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-midnight text-neutral-600 dark:text-ivory/70 border border-neutral-200 dark:border-neutral-700"
                            >
                              {m.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-[24px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 text-neutral-400">
          <Layers className="w-8 h-8 mx-auto mb-2 text-inferno opacity-70" />
          <p className="text-sm font-semibold">
            {lang === 'ar' ? 'اختر تجارب من الأعلى للبدء في المقارنة جنباً إلى جنب' : 'Select investigations above to start side-by-side comparison'}
          </p>
        </div>
      )}
    </div>
  );
};

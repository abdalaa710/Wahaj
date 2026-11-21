import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { Award, ChevronDown, ChevronUp, Sliders, ShieldCheck, Radio, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

const WEIGHT_LABELS = {
  en: {
    safety_impact: 'Safety Impact',
    evidence: 'Evidence Strength',
    mission_fit: 'Mission Fit',
    actionability: 'Actionability',
    novelty: 'Novelty'
  },
  ar: {
    safety_impact: 'أثر السلامة الفضائية',
    evidence: 'قوة وموثوقية الأدلة',
    mission_fit: 'ملاءمة المهمة والرحلات',
    actionability: 'قابلية التطبيق المباشر',
    novelty: 'الأصالة والاكتشاف العلمي'
  }
};

const DOMAIN_ICONS = {
  prevention: { labelEn: 'Prevention', labelAr: 'الوقاية', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  detection:  { labelEn: 'Detection',  labelAr: 'الكشف المبكر', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  suppression:{ labelEn: 'Suppression',labelAr: 'الإخماد والإطفاء', color: 'bg-inferno/10 text-inferno border-inferno/20' }
};

const KIND_BADGES = {
  observed: { labelEn: 'Observed Flight', labelAr: 'رصد طيران حقيقي', color: 'bg-emerald-500/10 text-emerald-500' },
  model: { labelEn: 'Validated Model', labelAr: 'نموذج فيزيائي مؤكد', color: 'bg-blue-500/10 text-blue-500' },
  statistical: { labelEn: 'Statistical Run', labelAr: 'إحصاء تجريبي', color: 'bg-purple-500/10 text-purple-500' },
  hypothetical: { labelEn: 'Theoretical', labelAr: 'نظري فرضي', color: 'bg-neutral-500/10 text-neutral-400' }
};

export const About = () => {
  const { lang, theme } = useApp();
  const [weights, setWeights] = useState({
    safety_impact: 0.35,
    evidence: 0.25,
    mission_fit: 0.20,
    actionability: 0.10,
    novelty: 0.10
  });
  const [ranked, setRanked] = useState([]);
  const [exps, setExps] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial fetch for experiments
  useEffect(() => {
    fetch(`${API_URL}/api/experiments`)
      .then(r => r.json())
      .then(list => {
        const map = {};
        list.forEach(e => { map[e.id] = e; });
        setExps(map);
        setLoading(false);
      })
      .catch(() => {
        // Fallback local fetch
        fetch('/api/experiments')
          .then(r => r.json())
          .then(list => {
            const map = {};
            list.forEach(e => { map[e.id] = e; });
            setExps(map);
          })
          .catch(() => {});
        setLoading(false);
      });
  }, []);

  // Compute ranking whenever weights or experiments change
  useEffect(() => {
    if (!weights) return;

    fetch(`${API_URL}/api/rank`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights }),
    })
      .then(r => r.json())
      .then(setRanked)
      .catch(() => {
        // Fallback ranking calculation
        const expList = Object.values(exps);
        const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 1.0;
        const res = expList.map(exp => {
          const scores = exp.scores || {};
          const breakdown = {};
          let comp = 0;
          for (const k in weights) {
            const part = (scores[k] || 0) * (weights[k] / totalW);
            breakdown[k] = part;
            comp += part;
          }
          return {
            id: exp.id,
            name: exp.name,
            score: comp,
            breakdown
          };
        });
        res.sort((a, b) => b.score - a.score);
        setRanked(res);
      });
  }, [weights, exps]);

  const labels = WEIGHT_LABELS[lang] || WEIGHT_LABELS.en;

  const handleWeightChange = (key, val) => {
    setWeights(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-midnight/60 text-inferno border border-inferno/20 text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'التصنيف المعياري وملاءمة السلامة' : 'Scenario-Based Safety Ranking'}</span>
        </div>
        <h1 className="text-3xl font-black text-midnight dark:text-ivory tracking-tight">
          {lang === 'ar' ? 'تصنيف أمان أبحاث ناسا' : 'NASA Investigation Safety Ranking'}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-ivory/60 mt-1">
          {lang === 'ar'
            ? 'حدد أوزان التقييم بالأشرطة التفاعلية لإعادة ترتيب تحقيقات ناسا ديناميكياً وفق أولويات رحلتك الفضائية'
            : 'Adjust multi-criteria scenario weights to dynamically re-rank NASA investigations based on your mission priorities'}
        </p>
      </div>

      {/* Weight Sliders Card */}
      <div className="p-6 md:p-8 rounded-[24px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-inferno" />
            <h3 className="text-sm font-bold text-midnight dark:text-ivory uppercase tracking-wider">
              {lang === 'ar' ? 'أوزان معايير التقييم (اسحب للتعديل)' : 'Ranking Criteria Weights (Drag to Adjust)'}
            </h3>
          </div>
          <button
            onClick={() => setWeights({ safety_impact: 0.35, evidence: 0.25, mission_fit: 0.20, actionability: 0.10, novelty: 0.10 })}
            className="text-xs font-bold text-inferno hover:underline"
          >
            {lang === 'ar' ? 'الأوزان الافتراضية' : 'Reset Defaults'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-2">
          {Object.keys(WEIGHT_LABELS.en).map(k => (
            <div key={k} className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-600 dark:text-ivory/80">{labels[k]}</span>
                <span className="text-inferno font-mono font-bold">
                  {((weights[k] || 0) * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights[k] || 0}
                onChange={e => handleWeightChange(k, e.target.value)}
                className="w-full accent-inferno cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Ranked Investigations List */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          {lang === 'ar' ? 'نتائج الترتيب والمفاضلة (اضغط للتفاصيل الكاملة)' : 'Ranked Investigations (Click to Expand Details)'}
        </div>

        <div className="space-y-3">
          {ranked.map((r, i) => {
            const exp = exps[r.id] || {};
            const isOpen = expanded === r.id;
            const domainInfo = DOMAIN_ICONS[exp.domain] || DOMAIN_ICONS.prevention;

            // Radar data for expanded view
            const radarData = Object.keys(WEIGHT_LABELS.en).map(k => ({
              subject: labels[k].split(' ')[0],
              value: Math.round(((exp.scores || {})[k] || 0) * 100)
            }));

            let rankBadgeColor = 'bg-neutral-100 dark:bg-midnight text-neutral-500';
            if (i === 0) rankBadgeColor = 'bg-gradient-inferno text-midnight font-black shadow-md shadow-inferno/20';
            if (i === 1) rankBadgeColor = 'bg-amber text-midnight font-black';
            if (i === 2) rankBadgeColor = 'bg-golden text-midnight font-bold';

            return (
              <div
                key={r.id}
                className={`p-6 rounded-[24px] bg-white dark:bg-deepblue/80 border transition-all duration-300 ${
                  isOpen
                    ? 'border-inferno shadow-lg ring-1 ring-inferno/30'
                    : 'border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-inferno/40'
                }`}
              >
                {/* Card Main Header (Clickable) */}
                <div
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-mono shrink-0 ${rankBadgeColor}`}>
                      #{i + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-midnight dark:text-ivory">{r.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${domainInfo.color}`}>
                          {lang === 'ar' ? domainInfo.labelAr : domainInfo.labelEn}
                        </span>
                        {exp.fuel_type && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-midnight text-neutral-600 dark:text-ivory/70 border border-neutral-200 dark:border-neutral-700 font-mono">
                            {exp.fuel_type}
                          </span>
                        )}
                        {(exp.years_active || []).length === 2 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-midnight text-neutral-500 dark:text-ivory/50 font-mono">
                            {exp.years_active[0]}–{exp.years_active[1]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-ivory/60 font-medium">
                        {exp.full_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100 dark:border-neutral-800">
                    <div className="text-right rtl:text-left">
                      <div className="text-2xl font-black text-inferno font-mono">
                        {(r.score * 100).toFixed(0)}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        {lang === 'ar' ? 'الدرجة الكلية / 100' : 'Score / 100'}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-midnight flex items-center justify-center text-neutral-400 hover:text-inferno transition">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Progress Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                  {Object.keys(WEIGHT_LABELS.en).map(k => {
                    const scoreVal = ((exp.scores || {})[k] || 0) * 100;
                    return (
                      <div key={k} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-neutral-500 dark:text-ivory/60">
                          <span className="truncate">{labels[k].split(' ')[0]}</span>
                          <span className="font-mono font-bold text-midnight dark:text-ivory">{scoreVal.toFixed(0)}</span>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-inferno h-full rounded-full transition-all duration-500"
                            style={{ width: `${scoreVal}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Expanded Accordion Details */}
                {isOpen && (
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Summary, Conditions, Findings */}
                      <div className="lg:col-span-8 space-y-6">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                            {lang === 'ar' ? 'الملخص العلمي للتحقيق' : 'Scientific Summary'}
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-ivory/80 leading-relaxed">
                            {exp.summary}
                          </p>
                        </div>

                        {/* Test Conditions */}
                        {exp.conditions && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                              {lang === 'ar' ? 'ظروف الاختبار المعملية' : 'Test Conditions'}
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-midnight/60 border border-neutral-100 dark:border-neutral-800 text-center">
                                <div className="text-base font-black text-inferno font-mono">
                                  {exp.conditions.o2_pct_range?.join('–') ?? '—'}%
                                </div>
                                <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                                  {lang === 'ar' ? 'تركيز الأكسجين O₂' : 'O₂ Concentration'}
                                </div>
                              </div>

                              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-midnight/60 border border-neutral-100 dark:border-neutral-800 text-center">
                                <div className="text-base font-black text-amber font-mono">
                                  {exp.conditions.pressure_kpa_range?.join('–') ?? '—'} kPa
                                </div>
                                <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                                  {lang === 'ar' ? 'الضغط الجوي' : 'Chamber Pressure'}
                                </div>
                              </div>

                              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-midnight/60 border border-neutral-100 dark:border-neutral-800 text-center">
                                <div className="text-base font-black text-golden font-mono">
                                  {exp.conditions.flow_cm_s_range?.join('–') ?? '—'} cm/s
                                </div>
                                <div className="text-[10px] text-neutral-400 font-semibold mt-0.5">
                                  {lang === 'ar' ? 'سرعة تدفق الهواء' : 'Flow Speed'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Key Findings */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                            {lang === 'ar' ? 'أهم النتائج والاكتشافات العلمية' : 'Key Scientific Findings'}
                          </h4>
                          <div className="space-y-2">
                            {(exp.findings || []).map((f, fi) => {
                              const badge = KIND_BADGES[f.kind] || KIND_BADGES.observed;
                              return (
                                <div
                                  key={fi}
                                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-midnight/40 border border-neutral-100 dark:border-neutral-800/80 flex items-start gap-3"
                                >
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${badge.color}`}>
                                    {lang === 'ar' ? badge.labelAr : badge.labelEn}
                                  </span>
                                  <p className="text-xs text-neutral-700 dark:text-ivory/90 leading-relaxed">
                                    {f.text}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right: Radar Chart & Mission Relevance */}
                      <div className="lg:col-span-4 space-y-6">
                        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-midnight/40 border border-neutral-100 dark:border-neutral-800 space-y-3">
                          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider text-center">
                            {lang === 'ar' ? 'مخطط تقييم التجربة' : 'Score Profile (Radar)'}
                          </h4>
                          <div className="w-full h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={radarData}>
                                <PolarGrid stroke={theme === 'dark' ? '#22385c' : '#e2e8f0'} />
                                <PolarAngleAxis
                                  dataKey="subject"
                                  tick={{ fill: theme === 'dark' ? '#F8F3E9' : '#08152E', fontSize: 10, fontWeight: 600 }}
                                />
                                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                  dataKey="value"
                                  stroke="#FF641C"
                                  fill="#FF641C"
                                  fillOpacity={0.25}
                                  strokeWidth={2}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: theme === 'dark' ? '#08152E' : '#FFFFFF',
                                    borderColor: theme === 'dark' ? '#142B50' : '#E2E8F0',
                                    borderRadius: 12,
                                    fontSize: 11
                                  }}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Mission Relevance Tags */}
                        {exp.mission_relevance && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                              {lang === 'ar' ? 'الملاءمة لمهام الفضاء' : 'Mission Relevance'}
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {exp.mission_relevance.map(m => (
                                <span
                                  key={m}
                                  className="text-[10px] px-2.5 py-1 rounded-full bg-white dark:bg-deepblue border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-ivory/70 font-semibold"
                                >
                                  {m.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { investigationsData } from '../../data/investigations';
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, FileText, Database, Shield } from 'lucide-react';

export const InvestigationDetails = () => {
  const { id } = useParams();
  const { lang, t } = useApp();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const inv = investigationsData.find((i) => i.psi_id.toLowerCase() === id?.toLowerCase()) || investigationsData[0];

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Top back button */}
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-bold text-inferno hover:underline"
        >
          <ArrowIcon className="w-4 h-4 rotate-180" />
          <span>{lang === 'ar' ? 'العودة لجميع التحقيقات' : 'Back to All Investigations'}</span>
        </Link>
      </div>

      {/* Main Investigation Header */}
      <div className="p-8 rounded-[24px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-black px-3.5 py-1.5 rounded-full bg-inferno/10 text-inferno border border-inferno/20">
            {inv.psi_id}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{inv.measuredVsSimulated}</span>
          </span>
        </div>

        <h1 className="text-3xl font-black text-midnight dark:text-ivory tracking-tight">{inv.name}</h1>
        <p className="text-sm text-neutral-600 dark:text-ivory/80 leading-relaxed">
          {lang === 'ar' ? inv.descriptionAr : inv.description}
        </p>

        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-neutral-400 block">{t.common.platform}</span>
            <strong className="text-midnight dark:text-ivory font-bold">{inv.platform}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">{t.common.materials}</span>
            <strong className="text-midnight dark:text-ivory font-bold">{inv.materials}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">Total Runs</span>
            <strong className="text-inferno font-mono font-bold">{inv.totalRuns}</strong>
          </div>
          <div>
            <span className="text-neutral-400 block">Burn Duration</span>
            <strong className="text-amber font-mono font-bold">{inv.burnTime}</strong>
          </div>
        </div>
      </div>

      {/* Scientific Conditions & Provenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-[20px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-inferno font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الظروف التجريبية والفيزيائية' : 'Experimental Conditions'}</span>
          </div>
          <div className="space-y-2 text-xs text-neutral-600 dark:text-ivory/70 pt-2">
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span>Ventilation Airflow:</span>
              <strong className="text-midnight dark:text-ivory">{inv.airflow}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span>Oxygen Concentration:</span>
              <strong className="text-midnight dark:text-ivory">{inv.oxygen}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span>Gravity Environment:</span>
              <strong className="text-midnight dark:text-ivory">Microgravity (μ-g Spaceflight)</strong>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-[20px] bg-white dark:bg-deepblue/80 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-golden font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>{lang === 'ar' ? 'المصدر والتوثيق المعتمد' : 'Source & Provenance'}</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-ivory/70 leading-relaxed pt-2">
            {inv.provenance}
          </p>
          <div className="pt-2">
            <a
              href="https://psi.ndc.nasa.gov/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-inferno hover:underline"
            >
              <span>NASA PSI Physical Science Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

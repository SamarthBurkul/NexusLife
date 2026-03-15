import { HiHeart, HiCash, HiBriefcase, HiShieldCheck, HiArrowRight } from 'react-icons/hi';

const categoryConfig = {
  health: { icon: HiHeart, color: 'text-red-400', bg: 'bg-red-400/10' },
  finance: { icon: HiCash, color: 'text-primary', bg: 'bg-primary/10' },
  jobs: { icon: HiBriefcase, color: 'text-secondary', bg: 'bg-secondary/10' },
  insurance: { icon: HiShieldCheck, color: 'text-accent', bg: 'bg-accent/10' },
};

const urgencyColors = {
  high: 'bg-red-500/10 text-red-400',
  medium: 'bg-accent/10 text-accent',
  low: 'bg-primary/10 text-primary',
};

export default function InsightCard({ insight, onClick }) {
  const config = categoryConfig[insight.category] || categoryConfig.finance;
  const Icon = config.icon;

  return (
    <div onClick={onClick}
      className="bg-gray-800/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 cursor-pointer transition group">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
          <Icon className={`${config.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColors[insight.urgency]}`}>
              {insight.urgency}
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{insight.text}</p>
          <button className="flex items-center gap-1 text-xs text-primary mt-2 group-hover:gap-2 transition-all">
            {insight.action} <HiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

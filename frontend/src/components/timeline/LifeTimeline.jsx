import { motion } from 'framer-motion';
import { HiCheckCircle, HiClock } from 'react-icons/hi';

const typeConfig = {
  education: { color: 'bg-primary', dotColor: 'border-primary', textColor: 'text-primary' },
  employment: { color: 'bg-secondary', dotColor: 'border-secondary', textColor: 'text-secondary' },
  health: { color: 'bg-red-400', dotColor: 'border-red-400', textColor: 'text-red-400' },
  finance: { color: 'bg-accent', dotColor: 'border-accent', textColor: 'text-accent' },
};

export default function LifeTimeline({ events }) {
  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gray-800" />

      <div className="space-y-12">
        {events.map((event, i) => {
          const config = typeConfig[event.type] || typeConfig.education;
          const isLeft = i % 2 === 0;

          return (
            <motion.div key={event.id}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>

              {/* Card */}
              <div className={`w-5/12 ${isLeft ? 'text-right' : 'text-left'}`}>
                <div className="bg-card border border-gray-800 rounded-xl p-4 inline-block hover:border-gray-700 transition">
                  <div className={`flex items-center gap-2 mb-1 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-xs font-medium ${config.textColor}`}>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                    {event.verified && <HiCheckCircle className="text-green-400 text-sm" />}
                  </div>
                  <h3 className="text-white font-semibold text-sm">{event.title}</h3>
                  <p className="text-gray-400 text-xs">{event.institution}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                    <HiClock className="text-xs" />
                    {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>

              {/* Dot */}
              <div className="flex-shrink-0 relative z-10">
                <div className={`w-4 h-4 rounded-full border-2 ${config.dotColor} bg-dark`} />
              </div>

              {/* Spacer */}
              <div className="w-5/12" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

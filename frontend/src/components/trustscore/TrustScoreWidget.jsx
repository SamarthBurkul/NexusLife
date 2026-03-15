import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function TrustScoreWidget({ score = 78 }) {
  const color = score > 70 ? '#00C9A7' : score > 50 ? '#FFB800' : '#ef4444';
  const data = [{ name: 'score', value: score, fill: color }];

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24">
        <ResponsiveContainer>
          <RadialBarChart innerRadius="75%" outerRadius="100%" data={data} startAngle={225} endAngle={-45}>
            <RadialBar background={{ fill: '#1f2937' }} dataKey="value" cornerRadius={10} max={100} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-white font-semibold">Trust Score</p>
        <p className="text-sm" style={{ color }}>+2 this month ↑</p>
      </div>
    </div>
  );
}

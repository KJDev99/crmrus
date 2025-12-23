import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const data = [
  { month: 'Янв', value: 70 },
  { month: 'Фев', value: 100 },
  { month: 'Мар', value: 60 },
  { month: 'Апр', value: 80 },
  { month: 'Май', value: 70 },
  { month: 'Июн', value: 90 },
  { month: 'Июл', value: 100 },
  { month: 'Авг', value: 60 },
  { month: 'Сен', value: 80 },
  { month: 'Окт', value: 90 },
  { month: 'Ноя', value: 100 },
  { month: 'Дек', value: 40 },
];
const lines = [
  { key: 'line1', color: '#ef4444' },  
  { key: 'line2', color: '#22c55e' },  
  { key: 'line3', color: '#3b82f6' },  
  { key: 'line4', color: '#eab308' },  
  { key: 'line5', color: '#a855f7' }, 
];
const chartData = data.map((item, index) => ({
  month: item.month,
  line1: item.value + Math.sin(index) * 20,
  line2: item.value - Math.cos(index) * 15 + 20,
  line3: item.value + Math.tan(index / 2) * 10,
  line4: item.value + index * 3,
  line5: item.value - index * 2 + 30,
}));
export default function Reports() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-[#0f172a]">
        <h2 className="text-white text-2xl font-bold mb-8 text-center">
          Годовая статистика
        </h2>

        <div className="bg-[#0f172a] p-6 rounded-lg">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: '#94a3b8' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />
              <YAxis
                tick={{ fill: '#94a3b8' }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
                domain={[0, 100]}
                ticks={[0, 50, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              {lines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
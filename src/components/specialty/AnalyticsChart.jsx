import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function fmt(value) {
  if (typeof value !== 'number') return value;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}K`;
  return value;
}

function AnalyticsChart({ type = 'line', title, data = [], xAxisKey, yAxisKey }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#AAAAAA] shadow-sm p-5">
      {title && (
        <h3 className="text-sm font-semibold text-deep-blue mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={260}>
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} width={36} />
            <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey={yAxisKey} fill="#ACEA63" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#AAAAAA' }} axisLine={false} tickLine={false} width={36} />
            <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke="#44CE7F"
              strokeWidth={2.5}
              dot={{ fill: '#244F93', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsChart;

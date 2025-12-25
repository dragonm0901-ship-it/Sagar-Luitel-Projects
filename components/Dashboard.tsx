
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { PROVINCES, PARTIES } from '../constants';
import { ShieldCheck, Users, Activity } from 'lucide-react';

const COLORS = ['#DC143C', '#003893', '#34d399', '#f87171', '#fbbf24', '#60a5fa'];

const Dashboard: React.FC = () => {
  const pieData = PARTIES.map((p, i) => ({
    name: p.nameEn,
    value: Math.floor(Math.random() * 1000) + 500,
    color: p.color
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <ShieldCheck className="text-green-500" size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Network Integrity</p>
            <h3 className="text-xl font-bold">100% SECURE</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Users className="text-blue-500" size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Active Voters</p>
            <h3 className="text-xl font-bold">6,471,023</h3>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Activity className="text-red-500" size={28} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Server Latency</p>
            <h3 className="text-xl font-bold">14ms</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            Turnout by Province (%)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PROVINCES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="turnout" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC143C" />
                    <stop offset="100%" stopColor="#003893" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-6 text-white">Party Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

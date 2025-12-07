import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MOCK_STATS_DATA, COLORS } from '../constants';

const Stats: React.FC = () => {
  return (
    <section className="py-16 px-[5%] bg-[#0A2218] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Populære Services i Denne Måned</h2>
        <p className="text-[#B0C4BB] text-center mb-10 text-sm">Indsigt baseret på faktiske bookinger i Aarhus-området.</p>
        
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_STATS_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F4234" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#B0C4BB" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis 
                        stroke="#B0C4BB" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#113826', borderColor: '#00D16F', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{fill: 'rgba(0, 209, 111, 0.1)'}}
                    />
                    <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
                        {MOCK_STATS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS.accentGreen} fillOpacity={0.8} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default Stats;
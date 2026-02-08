"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { getInsightsData } from '@/app/actions/insights';
import { Loader2 } from 'lucide-react';

export default function InsightsPage() {
    const { messages, append, isLoading: isAiLoading } = useChat({
        api: '/api/chat',
        maxSteps: 5,
    });
    const [inputValue, setInputValue] = useState("");
    const [data, setData] = useState<{ burn_rate: any[], attrition_risk: any[] } | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const result = await getInsightsData();
            if (result.success && result.data) {
                setData(result.data);
            }
            setIsLoadingData(false);
        };
        loadData();
    }, []);

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue) {
            e.preventDefault();
            await append({ role: 'user', content: inputValue });
            setInputValue("");
        }
    }

    const lastMessage = messages[messages.length - 1];

    if (isLoadingData) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Executive Insights</h1>
                <p className="text-muted-foreground mt-2">Real-time pulse on organizational health.</p>
            </header>

            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Ask a question (e.g., 'Show me engineering salary spread vs market')"
                    className="w-full p-4 pl-12 rounded-xl border shadow-sm bg-background text-lg outline-none focus:ring-2 ring-primary/20"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">✨</span>
            </div>

            {/* AI Answer Section */}
            {(messages.length > 0 || isAiLoading) && (
                 <div className="bg-muted/50 p-6 rounded-xl border animate-in fade-in slide-in-from-top-4">
                    {isAiLoading && !lastMessage ? (
                         <div className="flex items-center gap-2 text-primary font-medium">
                            <span>✨ Analyzing data...</span>
                         </div>
                    ) : (
                        <div className="flex gap-4">
                            <span className="text-2xl">🤖</span>
                            <div className="space-y-2 w-full">
                                <div className="prose dark:prose-invert max-w-none">
                                    {lastMessage?.content}
                                </div>
                                {lastMessage?.toolInvocations?.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {lastMessage.toolInvocations.map(tool => (
                                            <span key={tool.toolCallId} className="px-2 py-1 bg-background border rounded text-xs text-muted-foreground font-mono">
                                                Used Tool: {tool.toolName}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                 </div>
            )}

            {data && (
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold mb-6">Budget Burn Rate</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.burn_rate}>
                                <defs>
                                    <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#8884d8" fillOpacity={1} fill="url(#colorBurn)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold mb-6 flex justify-between">
                        Attrition Risk Heatmap 
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">AI Predicted</span>
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.attrition_risk} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 14}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="risk" radius={[0, 4, 4, 0]} barSize={30}>
                                    {data.attrition_risk.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.risk > 70 ? '#ef4444' : entry.risk > 40 ? '#f59e0b' : '#22c55e'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

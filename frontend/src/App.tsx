/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Bell, 
  ChevronRight, 
  Home, 
  BarChart3, 
  Target, 
  Settings, 
  Plus, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Coffee,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface Transaction {
  id: string;
  merchant: string;
  category: string;
  time: string;
  amount: number;
  icon: React.ReactNode;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("today");

  const transactions: Transaction[] = [
    { 
      id: "1", 
      merchant: "Zomato", 
      category: "Food", 
      time: "2:45 PM", 
      amount: 420, 
      icon: <Utensils className="w-5 h-5 text-orange-500" /> 
    },
    { 
      id: "2", 
      merchant: "Uber", 
      category: "Transport", 
      time: "1:15 PM", 
      amount: 150, 
      icon: <Car className="w-5 h-5 text-blue-500" /> 
    },
    { 
      id: "3", 
      merchant: "Starbucks", 
      category: "Drinks", 
      time: "10:30 AM", 
      amount: 280, 
      icon: <Coffee className="w-5 h-5 text-emerald-600" /> 
    },
    { 
      id: "4", 
      merchant: "Reliance Digital", 
      category: "Electronics", 
      time: "Yesterday", 
      amount: 1200, 
      icon: <Smartphone className="w-5 h-5 text-purple-500" /> 
    },
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#f0f4f8] overflow-hidden relative selection:bg-emerald-100"
      style={{
        backgroundImage: "radial-gradient(at 0% 0%, #d1fae5 0px, transparent 50%), radial-gradient(at 100% 0%, #dbeafe 0px, transparent 50%), radial-gradient(at 100% 100%, #fef3c7 0px, transparent 50%), radial-gradient(at 0% 100%, #e0e7ff 0px, transparent 50%)"
      }}
    >
      {/* Background Decor */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-200/30 blur-[120px] -top-24 -left-24 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-blue-200/30 blur-[120px] -bottom-24 -right-24 pointer-events-none" />

      {/* Mobile viewport simulator */}
      <div className="w-full max-w-[375px] h-[750px] bg-white/70 backdrop-blur-3xl border border-white/40 rounded-[48px] shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="px-8 pt-12 pb-4 flex justify-between items-end">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              Monday, Apr 20
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-semibold text-slate-800 mt-0.5 tracking-tight"
            >
              Good evening, Sam
            </motion.h1>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-emerald-100/50 flex items-center justify-center border border-emerald-200/50"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
          </motion.button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-6 pb-24 space-y-6 no-scrollbar">
          
          {/* Today's Spending Hero Card */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 border border-white/60 shadow-sm text-center"
          >
            <p className="text-slate-500 text-sm font-medium">Spent today</p>
            <h2 className="text-6xl font-bold text-slate-900 mt-1 mb-6 tracking-tighter">
              ₹850
            </h2>
            
            <div className="space-y-3 px-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span>₹850 used</span>
                <span className="opacity-40 uppercase tracking-wider">Limit ₹1500</span>
              </div>
              {/* Progress Bar */}
              <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden border border-white/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "57%" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                You’ve used <span className="text-emerald-600 font-bold">57%</span> of your daily budget
              </p>
            </div>
          </motion.section>

          {/* Insight Card */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50/50 backdrop-blur-sm rounded-[24px] p-5 border border-blue-100/50 flex items-start gap-4"
          >
            <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500 shadow-sm border border-blue-200/20">
              <BarChart3 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Higher than usual</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                ₹420 spent on dining today. You're usually lower on Mondays.
              </p>
            </div>
          </motion.section>

          {/* Recent Activity */}
          <section className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
              <button className="text-xs font-bold text-emerald-600">View all</button>
            </div>
            
            <div className="space-y-3">
              {transactions.slice(0, 3).map((tx, i) => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="bg-white/40 backdrop-blur-sm p-4 rounded-[20px] flex items-center gap-4 border border-white/40"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50/50`}>
                    {tx.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{tx.merchant}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{tx.time} • {tx.category}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-800">₹{tx.amount}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* Floating Action Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-28 right-6 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-xl shadow-slate-300 z-20"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </motion.button>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-4 z-30">
          <NavItem 
            icon={<Home className="w-5 h-5 stroke-[2.5]" />} 
            label="Today" 
            isActive={activeTab === "today"} 
            onClick={() => setActiveTab("today")}
          />
          <NavItem 
            icon={<BarChart3 className="w-5 h-5 stroke-[2.5]" />} 
            label="Insights" 
            isActive={activeTab === "insights"} 
            onClick={() => setActiveTab("insights")}
          />
          <NavItem 
            icon={<Target className="w-5 h-5 stroke-[2.5]" />} 
            label="Goals" 
            isActive={activeTab === "goals"} 
            onClick={() => setActiveTab("goals")}
          />
          <NavItem 
            icon={<Settings className="w-5 h-5 stroke-[2.5]" />} 
            label="Profile" 
            isActive={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")}
          />
        </nav>

      </div>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-emerald-600 scale-110" : "text-slate-400 opacity-40"}`}
    >
      {isActive ? (
        <div className="bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg shadow-emerald-200">
          {icon}
        </div>
      ) : (
        icon
      )}
      <span className="text-[10px] font-bold tracking-tight">{label}</span>
    </button>
  );
}

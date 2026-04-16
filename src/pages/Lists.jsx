import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, Users, Code2, BookOpen, ChevronLeft, Search, 
  Plus, Filter, MoreHorizontal, Star, Activity, GitCommit,
  CheckCircle2
} from 'lucide-react';

// --- Dummy Data ---

const LISTS = [
  {
    id: '1',
    title: 'Frontend Elite',
    description: 'Top-tier React and Vue developers for the upcoming Q3 project.',
    category: 'Talent Pools',
    type: 'developer',
    metrics: { count: 12, label: 'Developers' },
    collaborators: [
      'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      'https://i.pravatar.cc/150?u=a04258a2462d826712d'
    ],
    items: [
      {
        id: 'd1',
        name: 'Sarah Drasner',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        scores: [
          { skill: 'Vue.js', score: 98 },
          { skill: 'Animations', score: 95 },
          { skill: 'Architecture', score: 92 }
        ]
      },
      {
        id: 'd2',
        name: 'Dan Abramov',
        avatar: 'https://i.pravatar.cc/150?u=dan',
        scores: [
          { skill: 'React', score: 99 },
          { skill: 'Redux', score: 96 },
          { skill: 'JavaScript', score: 95 }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Rust Microservices',
    description: 'High-performance backend architectures and boilerplates.',
    category: 'Tech Stack Inspiration',
    type: 'project',
    metrics: { count: '12k', label: 'Total Repo Stars' },
    collaborators: [
      'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    ],
    items: [
      {
        id: 'p1',
        name: 'tokio-rs/tokio',
        language: 'Rust',
        stars: '24.5k',
        activity: [40, 60, 45, 80, 75, 90, 85]
      },
      {
        id: 'p2',
        name: 'actix/actix-web',
        language: 'Rust',
        stars: '19.2k',
        activity: [30, 50, 40, 70, 65, 80, 75]
      }
    ]
  },
  {
    id: '3',
    title: 'Web3 Onboarding',
    description: 'Essential reading and starter projects for new blockchain devs.',
    category: 'Learning Path',
    type: 'project',
    metrics: { count: 8, label: 'Resources' },
    collaborators: [
      'https://i.pravatar.cc/150?u=a04258114e29026702d',
      'https://i.pravatar.cc/150?u=a04258114e29026703d',
      'https://i.pravatar.cc/150?u=a04258114e29026704d'
    ],
    items: [
      {
        id: 'p3',
        name: 'ethers-io/ethers.js',
        language: 'TypeScript',
        stars: '7.8k',
        activity: [20, 30, 25, 40, 35, 50, 45]
      }
    ]
  }
];

// --- Components ---

const Sparkline = ({ data }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 60;
  const step = width / (data.length - 1);

  const points = data.map((val, i) => {
    const x = i * step;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ListCard = ({ list, onClick }) => {
  const icons = {
    'Talent Pools': Users,
    'Tech Stack Inspiration': Code2,
    'Learning Path': BookOpen
  };
  const Icon = icons[list.category] || Folder;

  return (
    <motion.div
      layoutId={`list-container-${list.id}`}
      onClick={onClick}
      className="relative group cursor-pointer h-64"
      whileHover={{ y: -5 }}
    >
      {/* Blurred Stack Effect - Back Cards */}
      <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl transform translate-y-4 scale-90 blur-[2px] transition-transform group-hover:translate-y-6 group-hover:scale-95" />
      <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl transform translate-y-2 scale-95 blur-[1px] transition-transform group-hover:translate-y-3 group-hover:scale-[0.97]" />
      
      {/* Main Card */}
      <motion.div 
        layoutId={`list-card-${list.id}`}
        className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col justify-between overflow-hidden"
      >
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Icon size={20} className="text-zinc-300" />
            </div>
            <span className="text-xs font-medium text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              {list.category}
            </span>
          </div>
          <motion.h3 layoutId={`list-title-${list.id}`} className="text-xl font-semibold text-zinc-100 mb-2">
            {list.title}
          </motion.h3>
          <p className="text-sm text-zinc-400 line-clamp-2">
            {list.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex -space-x-2">
            {list.collaborators.map((avatar, i) => (
              <img 
                key={i} 
                src={avatar} 
                alt="Collaborator" 
                className="w-7 h-7 rounded-full border-2 border-[#050505] object-cover"
              />
            ))}
          </div>
          <div className="text-xs font-mono text-zinc-500">
            {list.metrics.count} {list.metrics.label}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ListDetail = ({ list, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 bg-[#050505] flex flex-col"
    >
      {/* Header */}
      <motion.div 
        layoutId={`list-card-${list.id}`}
        className="bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/10 p-8 sticky top-0 z-20"
      >
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={onClose}
            className="flex items-center text-sm text-zinc-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Lists
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-[#3b82f6] bg-[#3b82f6]/10 px-2.5 py-1 rounded-full border border-[#3b82f6]/20">
                  {list.category}
                </span>
              </div>
              <motion.h1 layoutId={`list-title-${list.id}`} className="text-3xl font-bold text-white mb-2">
                {list.title}
              </motion.h1>
              <p className="text-zinc-400 max-w-2xl">
                {list.description}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-4">
              <div className="flex -space-x-2">
                {list.collaborators.map((avatar, i) => (
                  <img 
                    key={i} 
                    src={avatar} 
                    alt="Collaborator" 
                    className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] object-cover"
                  />
                ))}
                <button className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <div className="text-sm font-mono text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                {list.metrics.count} {list.metrics.label}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-white/10 rounded-lg border border-white/10">
                <Filter size={14} />
                Highest Confidence Score
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                Recent Activity
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                Lines of Code
              </button>
            </div>
            
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search list..." 
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20 transition-colors w-64"
              />
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group cursor-pointer"
              >
                {list.type === 'developer' ? (
                  // Developer Card
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <span className="text-xs text-zinc-500 font-mono">Available for hire</span>
                        </div>
                      </div>
                      <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {item.scores.map((score, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <CheckCircle2 size={14} className="text-[#10b981]" />
                            {score.skill}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]" 
                                style={{ width: `${score.score}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-zinc-400 w-6 text-right">{score.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Project Card
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-white font-medium mb-1">{item.name}</h4>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-zinc-400">
                          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                          {item.language}
                        </span>
                      </div>
                      <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                    <div className="flex items-end justify-between mt-6">
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Star size={14} />
                          {item.stars}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <GitCommit size={14} />
                          Active
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">30d Activity</span>
                        <Sparkline data={item.activity} />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

const Lists = () => {
  const [selectedList, setSelectedList] = useState(null);

  return (
    <div className="flex-1 min-w-0 bg-[#050505] min-h-[calc(100vh-4rem)] relative overflow-hidden">
      
      {/* Main Grid View */}
      <div className={`p-8 h-full overflow-y-auto transition-opacity duration-300 ${selectedList ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Lists</h1>
              <p className="text-zinc-400">Curate developers, repositories, and learning paths.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/10 transition-colors font-medium">
              <Plus size={18} />
              Create List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {LISTS.map((list) => (
              <ListCard 
                key={list.id} 
                list={list} 
                onClick={() => setSelectedList(list)} 
              />
            ))}
          </div>

        </div>
      </div>

      {/* Detail View Overlay */}
      <AnimatePresence>
        {selectedList && (
          <ListDetail 
            list={selectedList} 
            onClose={() => setSelectedList(null)} 
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Lists;

import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { Star, MessageSquare, GitFork, CheckCircle, TrendingUp, Users, Activity } from 'lucide-react';

const SkillsConfidenceMeter = ({ percentage, label }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-48 h-48 bg-gradient-to-b from-[#111] to-[#050505] rounded-full border-4 border-[#1a1a1a] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.5)]">
      {/* Inner dial background */}
      <div className="absolute inset-2 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] to-[#0a0a0a] border border-white/5"></div>
      
      <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
        {/* Watch face ticks - minor */}
        {[...Array(60)].map((_, i) => (
          <line
            key={`minor-${i}`}
            x1="50" y1="4" x2="50" y2="6"
            transform={`rotate(${i * 6} 50 50)`}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        ))}
        {/* Watch face ticks - major */}
        {[...Array(12)].map((_, i) => (
          <line
            key={`major-${i}`}
            x1="50" y1="2" x2="50" y2="8"
            transform={`rotate(${i * 30} 50 50)`}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
          />
        ))}
        {/* Background track */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="4"
        />
        {/* Progress arc */}
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          className="drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center z-10">
        <span className="font-mono text-4xl font-light text-white tracking-tighter flex items-start">
          {percentage}<span className="text-lg text-zinc-500 mt-1">%</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#3b82f6] mt-1 font-semibold">{label}</span>
      </div>
      
      {/* Glass reflection highlight */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-[2px] pointer-events-none"></div>
    </div>
  );
};

const TrendingRepoCard = ({ repo }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="min-w-[320px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 snap-start flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-bold text-lg text-white">{repo.name}</h3>
        <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{repo.description}</p>
      </div>
      <div className="bg-[#3b82f6]/10 text-[#3b82f6] px-2 py-1 rounded text-xs font-mono font-bold border border-[#3b82f6]/20 whitespace-nowrap ml-3">
        {repo.match}% Match
      </div>
    </div>
    
    {/* Mini Sparkline */}
    <div className="h-12 w-full mt-2 relative">
      <svg viewBox="0 0 100 30" className="w-full h-full preserve-aspect-ratio-none">
        <defs>
          <linearGradient id={`sparkline-gradient-${repo.id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${repo.sparklinePath} L 100 30 L 0 30 Z`}
          fill={`url(#sparkline-gradient-${repo.id})`}
        />
        <motion.path
          d={repo.sparklinePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
    </div>
  </motion.div>
);

const LivePulsePost = ({ post }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full border border-white/20" />
        <div>
          <h4 className="font-bold text-white">{post.author}</h4>
          <p className="text-xs text-zinc-400">{post.timeAgo}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1.5 bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1 rounded-full">
        <CheckCircle size={14} className="text-[#10b981]" />
        <span className="text-xs font-mono text-[#10b981] font-medium">{post.verifiedSkill}</span>
      </div>
    </div>
    
    <p className="text-zinc-300 mb-4 text-sm leading-relaxed">{post.content}</p>
    
    <div className="bg-[#050505] border border-white/10 rounded-xl p-4 mb-4 overflow-x-auto shadow-inner">
      <pre className="font-mono text-sm text-[#3b82f6]">
        <code>{post.codeSnippet}</code>
      </pre>
    </div>
    
    <div className="flex items-center space-x-6 text-zinc-400 border-t border-white/10 pt-4 mt-2">
      <button className="flex items-center space-x-2 hover:text-white transition-colors group">
        <Star size={18} className="group-hover:fill-yellow-500 group-hover:text-yellow-500 transition-colors" /> 
        <span className="text-sm font-mono">{post.stars}</span>
      </button>
      <button className="flex items-center space-x-2 hover:text-white transition-colors">
        <MessageSquare size={18} /> 
        <span className="text-sm font-mono">{post.comments}</span>
      </button>
      <button className="flex items-center space-x-2 hover:text-[#3b82f6] transition-colors ml-auto">
        <GitFork size={18} /> 
        <span className="text-sm font-medium">Fork to Portfolio</span>
      </button>
    </div>
  </motion.div>
);

const SkillLeaderboardItem = ({ skill, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="mb-5"
  >
    <div className="flex justify-between items-end mb-2">
      <span className="font-medium text-sm text-white">{skill.name}</span>
      <span className="font-mono text-xs text-[#10b981]">{skill.trend}</span>
    </div>
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        className="h-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full"
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 + index * 0.1 }}
      />
    </div>
  </motion.div>
);

const DiscoverySuggestion = ({ user }) => (
  <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-white/10">
    <div className="flex items-center space-x-3">
      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white/10" />
      <div>
        <h4 className="font-medium text-sm text-white">{user.name}</h4>
        <div className="flex space-x-2 mt-1.5">
          {user.overlap.map(tech => (
            <span key={tech} className="text-[10px] font-mono text-[#3b82f6] bg-[#3b82f6]/10 px-1.5 py-0.5 rounded border border-[#3b82f6]/20">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
    <button className="text-xs font-medium border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-white">
      Sync
    </button>
  </div>
);

// Dummy Data
const trendingRepos = [
  { id: 1, name: 'rust-analyzer', description: 'A Rust compiler front-end for IDEs.', match: 92, sparklinePath: 'M 0 20 Q 10 10 20 25 T 40 15 T 60 20 T 80 5 T 100 10' },
  { id: 2, name: 'next.js', description: 'The React Framework.', match: 88, sparklinePath: 'M 0 25 Q 15 5 30 20 T 60 10 T 80 15 T 100 5' },
  { id: 3, name: 'supabase', description: 'The open source Firebase alternative.', match: 76, sparklinePath: 'M 0 15 Q 20 25 40 10 T 70 20 T 100 5' },
  { id: 4, name: 'tailwind-merge', description: 'Merge Tailwind CSS classes without style conflicts.', match: 95, sparklinePath: 'M 0 30 Q 20 10 40 20 T 60 5 T 80 15 T 100 0' },
];

const livePosts = [
  {
    id: 1,
    author: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    timeAgo: '2h ago',
    verifiedSkill: 'React - Expert 94%',
    content: 'Just optimized our main dashboard render cycle. Memoizing these heavy chart components dropped our TTI by 40%. Here is the custom hook I wrote to handle the deep comparison:',
    codeSnippet: `function useDeepCompareMemoize(value) {
  const ref = useRef()
  if (!isEqual(value, ref.current)) {
    ref.current = value
  }
  return ref.current
}

export function useDeepCompareEffect(callback, deps) {
  useEffect(callback, deps.map(useDeepCompareMemoize))
}`,
    stars: 128,
    comments: 24
  },
  {
    id: 2,
    author: 'David Kumar',
    avatar: 'https://i.pravatar.cc/150?u=david',
    timeAgo: '5h ago',
    verifiedSkill: 'Rust - Advanced 82%',
    content: 'Finally got the hang of Rust lifetimes in this multithreaded context. The borrow checker is strict but saves so many headaches in production.',
    codeSnippet: `use std::thread;
use std::sync::{Arc, Mutex};

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }
}`,
    stars: 342,
    comments: 56
  },
  {
    id: 3,
    author: 'Elena Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    timeAgo: '8h ago',
    verifiedSkill: 'TypeScript - Expert 91%',
    content: 'Type-safe event emitters are a game changer. Built this tiny utility to ensure our socket events are strictly typed across the entire monorepo.',
    codeSnippet: `type Events = {
  'user:login': { id: string; name: string };
  'user:logout': void;
};

class TypedEmitter<T extends Record<string, any>> {
  emit<K extends keyof T>(event: K, payload: T[K]) {
    // implementation
  }
  on<K extends keyof T>(event: K, cb: (p: T[K]) => void) {
    // implementation
  }
}`,
    stars: 215,
    comments: 18
  }
];

const trendingSkills = [
  { name: 'Rust', trend: '+14% this week', level: 85 },
  { name: 'TypeScript', trend: '+8% this week', level: 92 },
  { name: 'Go', trend: '+11% this week', level: 78 },
  { name: 'Python (AI/ML)', trend: '+22% this week', level: 88 },
];

const discoveryUsers = [
  { id: 1, name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=alex', overlap: ['React', 'TS', 'Node'] },
  { id: 2, name: 'Marcus Johnson', avatar: 'https://i.pravatar.cc/150?u=marcus', overlap: ['Python', 'Docker'] },
  { id: 3, name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?u=priya', overlap: ['Go', 'Kubernetes'] },
];

const Explore = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 font-sans pb-24">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
        <p className="text-zinc-400 mt-1">Discover trending projects, top skills, and developers in your network.</p>
      </div>

      {/* Trending Repositories (Top Horizontal Scroll) */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-white">
          <Activity className="mr-2 text-[#3b82f6]" size={20} /> 
          Trending Repositories
        </h2>
        <div className="flex overflow-x-auto space-x-4 pb-6 snap-x scrollbar-hide">
           {trendingRepos.map(repo => (
             <TrendingRepoCard key={repo.id} repo={repo} />
           ))}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Live Pulse Feed (Center) */}
        <div className="flex-1 space-y-6 max-w-3xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-white">
            <TrendingUp className="mr-2 text-[#10b981]" size={20} /> 
            Live Pulse
          </h2>
          <div className="space-y-6">
            {livePosts.map(post => (
              <LivePulsePost key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-80 space-y-8 flex-shrink-0">
          
          {/* Confidence Meter */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-xs font-semibold text-zinc-400 mb-6 uppercase tracking-[0.15em]">Global Confidence Score</h2>
            <SkillsConfidenceMeter percentage={92} label="Expert" />
            <p className="text-xs text-zinc-500 mt-6 text-center leading-relaxed">
              Based on your recent verified commits, code reviews, and community impact.
            </p>
          </div>

          {/* Skill Leaderboards */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
             <h2 className="text-lg font-semibold mb-6 text-white">Trending Skills</h2>
             <div>
               {trendingSkills.map((skill, index) => (
                 <SkillLeaderboardItem key={skill.name} skill={skill} index={index} />
               ))}
             </div>
          </div>

          {/* Discovery Suggestions */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
             <h2 className="text-lg font-semibold mb-4 flex items-center text-white">
               <Users className="mr-2 text-[#3b82f6]" size={20} /> 
               Sync Suggestions
             </h2>
             <div className="space-y-2">
               {discoveryUsers.map(user => (
                 <DiscoverySuggestion key={user.id} user={user} />
               ))}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Explore;

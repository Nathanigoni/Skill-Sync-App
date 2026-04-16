import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { Heart, Repeat, MessageSquare, TrendingUp, Activity, FolderGit2, Eye, Users, Bell, Star } from 'lucide-react';

const NotificationIcon = ({ type, action }) => {
  // Technical = Green, Social = Blue, System = Amber
  const colors = {
    technical: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20',
    social: 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20',
    system: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20',
  };

  const colorClass = colors[type] || colors.system;

  // Luxury Detail: Glowing yellow SVG star with pulse animation
  if (action === 'star') {
    return (
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20">
        <Star className="w-5 h-5 text-yellow-400 relative z-10" fill="currentColor" />
        <motion.div 
          className="absolute inset-0 rounded-full border border-yellow-400"
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  const IconMap = {
    like: Heart,
    repost: Repeat,
    comment: MessageSquare,
    level_up: TrendingUp,
    trending: Activity,
    portfolio: FolderGit2,
    view: Eye,
    match: Users
  };

  const Icon = IconMap[action] || Bell;

  return (
    <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
  );
};

const NotificationCard = ({ notification }) => {
  const { type, action, isUnread, users, othersCount, content, timeAgo, quickAction } = notification;
  
  // The "Unread" Glow: Left-border glow in "Electric Violet" (#8b5cf6)
  const unreadClass = isUnread 
    ? 'border-l-[3px] border-l-[#8b5cf6] shadow-[-4px_0_15px_-3px_rgba(139,92,246,0.3)]' 
    : 'border-l-[3px] border-l-transparent';

  const renderUsers = () => {
    if (!users || users.length === 0) return null;
    
    if (users.length === 1 && !othersCount) {
      return <span className="font-semibold text-white">{users[0].name}</span>;
    }

    if (users.length === 2 && !othersCount) {
      return <><span className="font-semibold text-white">{users[0].name}</span> and <span className="font-semibold text-white">{users[1].name}</span></>;
    }

    return (
      <>
        <span className="font-semibold text-white">{users[0].name}</span>, <span className="font-semibold text-white">{users[1].name}</span>, and <span className="font-semibold text-white">{othersCount} others</span>
      </>
    );
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      className={`group relative flex items-start gap-4 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 ${unreadClass}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-1">
        <NotificationIcon type={type} action={action} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-24">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {users && users.length > 0 && (
            <div className="flex -space-x-2 mr-2">
              {users.map((u, i) => (
                <img key={i} src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full border border-[#050505] relative z-10" style={{ zIndex: users.length - i }} />
              ))}
            </div>
          )}
          <p className="text-sm text-zinc-300 leading-relaxed">
            {renderUsers()} {renderUsers() ? ' ' : ''}{content}
          </p>
        </div>
        <p className="text-xs text-zinc-500 font-mono">{timeAgo}</p>
      </div>

      {/* Quick Action Button (Hover) */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-6 top-1/2 -translate-y-1/2">
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-medium text-white backdrop-blur-md transition-colors">
          {quickAction}
        </button>
      </div>
    </motion.div>
  );
};

const notificationsData = [
  {
    id: 1,
    type: 'social',
    action: 'star',
    isUnread: true,
    users: [{ name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=alex' }],
    content: "starred your project 'react-liquid-glass'.",
    timeAgo: '2m ago',
    quickAction: 'View Repo'
  },
  {
    id: 2,
    type: 'technical',
    action: 'level_up',
    isUnread: true,
    content: "Your Python Confidence Score increased to 92% based on your latest commit to [data-pipeline-v2].",
    timeAgo: '15m ago',
    quickAction: 'View Diff'
  },
  {
    id: 3,
    type: 'social',
    action: 'like',
    isUnread: false,
    users: [
      { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      { name: 'David Kumar', avatar: 'https://i.pravatar.cc/150?u=david' },
    ],
    othersCount: 12,
    content: "liked your 'Clean Code' article.",
    timeAgo: '1h ago',
    quickAction: 'View Post'
  },
  {
    id: 4,
    type: 'system',
    action: 'view',
    isUnread: false,
    users: [{ name: 'A Senior Dev', avatar: 'https://i.pravatar.cc/150?u=senior' }],
    content: "from Vercel viewed your Portfolio Analytics.",
    timeAgo: '3h ago',
    quickAction: 'View Analytics'
  },
  {
    id: 5,
    type: 'system',
    action: 'match',
    isUnread: false,
    users: [{ name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?u=elena' }],
    content: "has a 95% stack overlap with you. Connect?",
    timeAgo: '5h ago',
    quickAction: 'Sync Back'
  },
  {
    id: 6,
    type: 'technical',
    action: 'trending',
    isUnread: false,
    content: "Your repository [nextjs-dashboard] is trending in the 'TypeScript' category.",
    timeAgo: '1d ago',
    quickAction: 'View Leaderboard'
  },
  {
    id: 7,
    type: 'technical',
    action: 'portfolio',
    isUnread: false,
    content: "New project detected: [rust-cli-tools]. 12 new skills added to your profile.",
    timeAgo: '2d ago',
    quickAction: 'Review Skills'
  }
];

const Notifications = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 font-sans pb-24">
      {/* Header */}
      <div className="mb-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-zinc-400 mt-1">Stay synced with your network, code, and career growth.</p>
      </div>

      {/* Notifications List */}
      <motion.div 
        className="max-w-3xl mx-auto space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {notificationsData.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </motion.div>
    </div>
  );
};

export default Notifications;

import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Code2, FolderGit2, Send, MoreVertical, 
  Github, ExternalLink, CheckCircle2, XCircle, 
  Terminal, Paperclip, Info, ChevronRight, User
} from 'lucide-react';

// --- Dummy Data ---
const CONVERSATIONS = [
  {
    id: '1',
    user: {
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?u=alex',
      online: true,
      role: 'Senior Frontend Engineer',
      skills: ['React', 'TypeScript', 'WebGL'],
      github: 'alexc-dev',
      portfolioUrl: 'https://alexchen.dev'
    },
    lastMessage: 'I pushed the initial boilerplate here:',
    time: '2m ago',
    unread: 2
  },
  {
    id: '2',
    user: {
      name: 'Sarah Jenkins',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      online: false,
      role: 'Backend Developer',
      skills: ['Node.js', 'PostgreSQL', 'Redis'],
      github: 'sjenkins',
      portfolioUrl: 'https://sarahj.dev'
    },
    lastMessage: 'Let me know when the API is ready.',
    time: '1h ago',
    unread: 0
  },
  {
    id: '3',
    user: {
      name: 'David Kumar',
      avatar: 'https://i.pravatar.cc/150?u=david',
      online: true,
      role: 'DevOps Engineer',
      skills: ['Docker', 'Kubernetes', 'AWS'],
      github: 'dkumar-ops',
      portfolioUrl: 'https://davidkumar.io'
    },
    lastMessage: 'The CI/CD pipeline is green.',
    time: '3h ago',
    unread: 0
  }
];

const MESSAGES_DATA = {
  '1': [
    { id: 'm1', senderId: '1', type: 'text', content: 'Hey, are you available for a quick sync on the new dashboard?', timestamp: '10:00 AM' },
    { id: 'm2', senderId: 'me', type: 'text', content: 'Sure thing. Just wrapping up a PR. What\'s the stack?', timestamp: '10:05 AM' },
    { id: 'm3', senderId: '1', type: 'invite', content: 'Collaboration Invite', project: 'SkillSync Dashboard', match: '95%', timestamp: '10:06 AM' },
    { id: 'm4', senderId: 'me', type: 'code', content: 'const handleSync = async () => {\n  await db.sync();\n  console.log("Synced!");\n};', language: 'typescript', timestamp: '10:10 AM' },
    { id: 'm5', senderId: '1', type: 'project', content: 'I pushed the initial boilerplate here:', project: { name: 'nextjs-dashboard', description: 'High-performance admin dashboard', stars: 128 }, timestamp: '10:12 AM' }
  ],
  '2': [
    { id: 'm1', senderId: '2', type: 'text', content: 'Hey, did you check the new API docs?', timestamp: 'Yesterday' },
    { id: 'm2', senderId: 'me', type: 'text', content: 'Not yet, will do it today.', timestamp: 'Yesterday' },
    { id: 'm3', senderId: '2', type: 'text', content: 'Let me know when the API is ready.', timestamp: '1h ago' }
  ],
  '3': [
    { id: 'm1', senderId: '3', type: 'text', content: 'The CI/CD pipeline is green.', timestamp: '3h ago' }
  ]
};

// --- Components ---

const Avatar = ({ src, online, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizes[size]} flex-shrink-0`}>
      <img src={src} alt="Avatar" className="w-full h-full rounded-full object-cover" />
      {online && (
        <div className="absolute inset-0 rounded-full border-2 border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)] pointer-events-none" />
      )}
    </div>
  );
};

const MessageBubble = React.forwardRef(({ message, isMe, otherUser }, ref) => {
  const bubbleClass = isMe 
    ? 'bg-gradient-to-br from-[#312e81]/80 to-[#18181b]/80 border border-[#4f46e5]/30 text-zinc-100 rounded-2xl rounded-tr-sm' 
    : 'bg-white/5 backdrop-blur-md border border-white/10 text-zinc-200 rounded-2xl rounded-tl-sm';

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {!isMe && <Avatar src={otherUser.avatar} online={otherUser.online} size="sm" />}
        
        <div className="flex flex-col gap-1">
          <div className={`p-4 ${bubbleClass} shadow-lg`}>
            
            {/* Text Message */}
            {message.type === 'text' && (
              <p className="text-sm leading-relaxed font-sans">{message.content}</p>
            )}

            {/* Code Snippet */}
            {message.type === 'code' && (
              <div className="font-mono text-xs">
                <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 rounded-t-lg border-b border-white/10">
                  <span className="text-zinc-400">{message.language}</span>
                  <Terminal size={14} className="text-zinc-500" />
                </div>
                <pre className="bg-black/60 p-4 rounded-b-lg overflow-x-auto minimal-scrollbar">
                  <code className="text-[#a5b4fc]">{message.content}</code>
                </pre>
              </div>
            )}

            {/* Project Card */}
            {message.type === 'project' && (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed font-sans">{message.content}</p>
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 hover:bg-black/60 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2">
                    <FolderGit2 className="text-[#3b82f6]" size={20} />
                    <span className="font-semibold text-white group-hover:text-[#3b82f6] transition-colors">{message.project.name}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{message.project.description}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                    <span className="flex items-center gap-1"><Github size={12}/> {message.project.stars}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Collaboration Invite */}
            {message.type === 'invite' && (
              <div className="bg-black/40 border border-[#10b981]/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h4 className="text-[#10b981] font-semibold text-sm mb-1 flex items-center gap-2">
                  <CheckCircle2 size={16} /> {message.content}
                </h4>
                <p className="text-white font-medium text-lg mb-1">{message.project}</p>
                <p className="text-xs text-zinc-400 font-mono mb-4">Tech Stack Match: <span className="text-[#10b981]">{message.match}</span></p>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#10b981] hover:bg-[#059669] text-black font-semibold py-2 rounded-lg text-xs transition-colors">
                    Accept Invite
                  </button>
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg text-xs transition-colors">
                    View Repo
                  </button>
                </div>
              </div>
            )}

          </div>
          <span className={`text-[10px] text-zinc-500 font-mono ${isMe ? 'text-right' : 'text-left'} px-1`}>
            {message.timestamp}
          </span>
        </div>
      </div>
    </motion.div>
  );
});
MessageBubble.displayName = 'MessageBubble';

const Messages = () => {
  const [activeThreadId, setActiveThreadId] = useState(CONVERSATIONS[0].id);
  const [showThreadInfo, setShowThreadInfo] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isSnippetMode, setIsSnippetMode] = useState(false);
  
  const activeThread = CONVERSATIONS.find(c => c.id === activeThreadId);
  const messages = MESSAGES_DATA[activeThreadId] || [];
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThreadId, messages]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#050505] text-white overflow-hidden border-l border-zinc-800 font-sans">
      
      {/* Left Pane: Conversation List */}
      <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950/50 flex-shrink-0">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold tracking-tight mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-black/50 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto minimal-scrollbar">
          {CONVERSATIONS.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveThreadId(conv.id)}
              className={`p-4 border-b border-zinc-800/50 cursor-pointer transition-colors flex gap-3 items-center ${
                activeThreadId === conv.id ? 'bg-white/5 border-l-2 border-l-[#4f46e5]' : 'hover:bg-white/5 border-l-2 border-l-transparent'
              }`}
            >
              <Avatar src={conv.user.avatar} online={conv.user.online} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-sm truncate">{conv.user.name}</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">{conv.time}</span>
                </div>
                <p className="text-xs text-zinc-400 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[#4f46e5] flex items-center justify-center text-[10px] font-bold">
                  {conv.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center Pane: Active Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
        {/* Chat Header */}
        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <Avatar src={activeThread.user.avatar} online={activeThread.user.online} size="sm" />
            <div>
              <h3 className="font-semibold text-sm">{activeThread.user.name}</h3>
              <p className="text-xs text-zinc-500 font-mono">{activeThread.user.online ? 'Online' : 'Offline'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowThreadInfo(!showThreadInfo)}
              className={`p-2 rounded-lg transition-colors ${showThreadInfo ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Info size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto minimal-scrollbar p-6">
          <AnimatePresence mode="popLayout">
            {messages.map(msg => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isMe={msg.senderId === 'me'} 
                otherUser={activeThread.user} 
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
          <div className={`bg-black/50 border ${isSnippetMode ? 'border-[#4f46e5]/50' : 'border-zinc-800'} rounded-2xl p-2 transition-colors`}>
            {isSnippetMode && (
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 mb-2">
                <span className="text-xs font-mono text-[#a5b4fc]">Snippet Mode (Markdown)</span>
                <button onClick={() => setIsSnippetMode(false)} className="text-zinc-500 hover:text-white">
                  <XCircle size={14} />
                </button>
              </div>
            )}
            <textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isSnippetMode ? "```javascript\n// Write your code here...\n```" : "Type a message... (Markdown supported)"}
              className={`w-full bg-transparent resize-none focus:outline-none px-3 py-2 text-sm text-zinc-200 minimal-scrollbar ${isSnippetMode ? 'font-mono h-32' : 'h-12'}`}
            />
            <div className="flex items-center justify-between px-2 pt-2">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsSnippetMode(!isSnippetMode)}
                  className={`p-2 rounded-lg transition-colors ${isSnippetMode ? 'text-[#4f46e5] bg-[#4f46e5]/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                  title="Code Snippet"
                >
                  <Code2 size={18} />
                </button>
                <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" title="Quick-Share Project">
                  <FolderGit2 size={18} />
                </button>
                <button className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" title="Attach File">
                  <Paperclip size={18} />
                </button>
              </div>
              <button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white p-2 rounded-xl transition-colors flex items-center justify-center">
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane: Thread Info Sidebar */}
      <AnimatePresence>
        {showThreadInfo && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-zinc-800 bg-zinc-950/50 flex-shrink-0 overflow-hidden flex flex-col"
          >
            <div className="w-[280px] p-6 flex flex-col h-full overflow-y-auto minimal-scrollbar">
              <div className="flex flex-col items-center text-center mb-8 mt-4">
                <Avatar src={activeThread.user.avatar} online={activeThread.user.online} size="lg" />
                <h3 className="font-bold text-lg mt-4">{activeThread.user.name}</h3>
                <p className="text-sm text-zinc-400">{activeThread.user.role}</p>
              </div>

              <div className="space-y-6">
                {/* Verified Skills */}
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Verified Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeThread.user.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* GitHub Sync */}
                <div>
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Integrations</h4>
                  <a 
                    href={activeThread.user.portfolioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Github size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
                      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">@{activeThread.user.github}</span>
                    </div>
                    <ExternalLink size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </a>
                </div>
                
                {/* Actions */}
                <div className="pt-4 border-t border-zinc-800/50">
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <User size={16} /> View Full Profile
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Messages;

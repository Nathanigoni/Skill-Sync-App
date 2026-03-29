import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { analyticsService } from '../services/analytics'
import { projectsService } from '../services/projects'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Eye, MousePointer, User, TrendingUp, RefreshCw, GitBranch, Star, Code2, Zap } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [projects, setProjects] = useState([])
  const [githubStats, setGithubStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [analyticsData, projectsData] = await Promise.all([
        analyticsService.getStats(),
        projectsService.getProjects()
      ])
      setStats(analyticsData)
      setProjects(projectsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGitHubStats = async () => {
    try {
      const stats = await analyticsService.getGitHubStats(user?.githubUsername)
      setGithubStats(stats)
    } catch (error) {
      console.error('Error fetching GitHub stats:', error)
    }
  }

  const handleSyncGitHub = async () => {
    setSyncing(true)
    try {
      await analyticsService.syncGitHubData(user?.githubUsername)
      await fetchGitHubStats()
      document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.add('pulse')
        setTimeout(() => card.classList.remove('pulse'), 1000)
      })
    } catch (error) {
      console.error('Error syncing GitHub data:', error)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-400 border-t-zinc-900"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Zap className="text-zinc-100" size={20} />
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Profile Views',
      value: stats?.profileViews || 0,
      icon: Eye,
      trend: '+12%',
      gradient: 'from-indigo-400 to-zinc-400',
      bgColor: 'bg-gradient-to-br from-indigo-400/20 to-zinc-400/10'
    },
    {
      title: 'Project Views',
      value: stats?.projectViews || 0,
      icon: TrendingUp,
      trend: '+23%',
      gradient: 'from-indigo-300 to-indigo-400',
      bgColor: 'bg-gradient-to-br from-indigo-300/20 to-indigo-400/10'
    },
    {
      title: 'Project Clicks',
      value: stats?.projectClicks || 0,
      icon: MousePointer,
      trend: '+8%',
      gradient: 'from-zinc-400 to-zinc-900',
      bgColor: 'bg-gradient-to-br from-zinc-400/20 to-zinc-900/10'
    },
    {
      title: 'Total Visitors',
      value: stats?.totalVisitors || 0,
      icon: User,
      trend: '+15%',
      gradient: 'from-zinc-900 to-zinc-400',
      bgColor: 'bg-gradient-to-br from-zinc-900/20 to-zinc-400/10'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-400 to-zinc-900 rounded-3xl opacity-5"></div>
        <div className="relative p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-400 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.profile?.name || user?.name || user?.email?.split('@')?.[0]}!
          </h1>
          <p className="text-zinc-400 text-lg">
            Your portfolio is performing exceptionally well today. 
            <span className="text-indigo-400 font-semibold"> Keep up the great work!</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="stat-card p-6 relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-100 transition-colors">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-zinc-100 mt-1">{stat.value}</p>
                  <span className="text-xs font-semibold text-indigo-400">{stat.trend}</span>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* GitHub Stats */}
      {user?.githubUsername && (
        <Card className="p-8 relative overflow-hidden border border-zinc-800 hover:border-indigo-400 transition-all duration-300">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-300 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-400 bg-clip-text text-transparent">
                  GitHub Activity
                </h2>
                <p className="text-zinc-400">Real-time development insights</p>
              </div>
              <Button 
                className="bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleSyncGitHub}
                disabled={syncing}
              >
                <RefreshCw className={`mr-2 ${syncing ? 'animate-spin' : ''}`} size={16} />
                {syncing ? 'Syncing...' : 'Sync Data'}
              </Button>
            </div>

            {githubStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Code2, value: githubStats.totalRepos || 0, label: 'Repositories', color: 'from-indigo-400 to-zinc-400' },
                  { icon: Star, value: githubStats.totalStars || 0, label: 'Stars Earned', color: 'from-indigo-300 to-indigo-400' },
                  { icon: User, value: githubStats.followers || 0, label: 'Followers', color: 'from-zinc-400 to-zinc-900' },
                  { icon: GitBranch, value: githubStats.totalCommits || 0, label: 'Total Commits', color: 'from-zinc-900 to-zinc-400' }
                ].map((item, index) => (
                  <div key={index} className="text-center p-6 bg-zinc-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:transform hover:scale-105">
                    <div className={`inline-flex p-3 bg-gradient-to-r ${item.color} rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-zinc-100 mb-1">{item.value}</p>
                    <p className="text-sm font-medium text-zinc-400">{item.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-indigo-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code2 className="text-zinc-100" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">Connect Your GitHub</h3>
                <p className="text-zinc-400 mb-6">Showcase your development activity and contributions</p>
                <Button 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-500 text-white border-0"
                  onClick={fetchGitHubStats}
                >
                  Load GitHub Stats
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Projects Section */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-300 rounded-full -translate-y-10 translate-x-10 opacity-10"></div>
        
        <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-400 bg-clip-text text-transparent mb-6">
          Recent Projects
        </h2>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-6 bg-gradient-to-r from-zinc-900 to-zinc-800\/30 rounded-2xl border border-zinc-800 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-indigo-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Code2 className="text-zinc-100" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-100 group-hover:text-zinc-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-zinc-400">{project.techStack?.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex space-x-4 text-sm">
                    <span className="text-zinc-100 font-semibold">{project.viewCount || 0} views</span>
                    <span className="text-indigo-400 font-semibold">{project.clickCount || 0} clicks</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-400 to-indigo-300 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((project.clickCount || 0) / (project.viewCount || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-zinc-200 to-indigo-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code2 className="text-zinc-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">No Projects Yet</h3>
            <p className="text-zinc-400 mb-6">Start building your portfolio with amazing projects</p>
            <a 
              href="/projects" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              Create First Project
            </a>
          </div>
        )}
      </Card>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .pulse {
          animation: pulse 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default Dashboard

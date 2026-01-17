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
      const stats = await analyticsService.getGitHubStats()
      setGithubStats(stats)
    } catch (error) {
      console.error('Error fetching GitHub stats:', error)
    }
  }

  const handleSyncGitHub = async () => {
    setSyncing(true)
    try {
      await analyticsService.syncGitHubData()
      await fetchGitHubStats()
      // Add a subtle animation effect
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#B7CECE] border-t-[#1C0F13]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Zap className="text-[#1C0F13]" size={20} />
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
      gradient: 'from-[#B7CECE] to-[#6E7E85]',
      bgColor: 'bg-gradient-to-br from-[#B7CECE]/20 to-[#6E7E85]/10'
    },
    {
      title: 'Project Views',
      value: stats?.projectViews || 0,
      icon: TrendingUp,
      trend: '+23%',
      gradient: 'from-[#BBBAC6] to-[#B7CECE]',
      bgColor: 'bg-gradient-to-br from-[#BBBAC6]/20 to-[#B7CECE]/10'
    },
    {
      title: 'Project Clicks',
      value: stats?.projectClicks || 0,
      icon: MousePointer,
      trend: '+8%',
      gradient: 'from-[#6E7E85] to-[#1C0F13]',
      bgColor: 'bg-gradient-to-br from-[#6E7E85]/20 to-[#1C0F13]/10'
    },
    {
      title: 'Total Visitors',
      value: stats?.totalVisitors || 0,
      icon: User,
      trend: '+15%',
      gradient: 'from-[#1C0F13] to-[#6E7E85]',
      bgColor: 'bg-gradient-to-br from-[#1C0F13]/20 to-[#6E7E85]/10'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section with Glass Morphism */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C0F13] via-[#6E7E85] to-[#1C0F13] rounded-3xl opacity-5"></div>
        <div className="relative p-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] bg-clip-text text-transparent mb-2">
            Welcome back, {user?.profile?.name}!
          </h1>
          <p className="text-[#6E7E85] text-lg">
            Your portfolio is performing exceptionally well today. 
            <span className="text-[#B7CECE] font-semibold"> Keep up the great work!</span>
          </p>
        </div>
      </div>

      {/* Enhanced Stats Grid with Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="stat-card p-6 relative overflow-hidden group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {/* Animated background */}
            <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B7CECE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6E7E85] group-hover:text-[#1C0F13] transition-colors">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-[#1C0F13] mt-1">{stat.value}</p>
                  <span className="text-xs font-semibold text-[#B7CECE]">{stat.trend}</span>
                </div>
                <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* GitHub Stats - Completely Redesigned */}
      {user?.githubUsername && (
        <Card className="p-8 relative overflow-hidden border border-[#E2E2E2] hover:border-[#B7CECE] transition-all duration-300">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#B7CECE] rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#BBBAC6] rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] bg-clip-text text-transparent">
                  GitHub Activity
                </h2>
                <p className="text-[#6E7E85]">Real-time development insights</p>
              </div>
              <Button 
                className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] hover:from-[#BBBAC6] hover:to-[#B7CECE] text-[#1C0F13] border-0 shadow-lg hover:shadow-xl transition-all duration-300"
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
                  { icon: Code2, value: githubStats.totalRepos || 0, label: 'Repositories', color: 'from-[#B7CECE] to-[#6E7E85]' },
                  { icon: Star, value: githubStats.totalStars || 0, label: 'Stars Earned', color: 'from-[#BBBAC6] to-[#B7CECE]' },
                  { icon: User, value: githubStats.followers || 0, label: 'Followers', color: 'from-[#6E7E85] to-[#1C0F13]' },
                  { icon: GitBranch, value: githubStats.totalCommits || 0, label: 'Total Commits', color: 'from-[#1C0F13] to-[#6E7E85]' }
                ].map((item, index) => (
                  <div key={index} className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:transform hover:scale-105">
                    <div className={`inline-flex p-3 bg-gradient-to-r ${item.color} rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-[#1C0F13] mb-1">{item.value}</p>
                    <p className="text-sm font-medium text-[#6E7E85]">{item.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code2 className="text-[#1C0F13]" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-[#1C0F13] mb-2">Connect Your GitHub</h3>
                <p className="text-[#6E7E85] mb-6">Showcase your development activity and contributions</p>
                <Button 
                  className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] hover:from-[#BBBAC6] hover:to-[#B7CECE] text-[#1C0F13] border-0"
                  onClick={fetchGitHubStats}
                >
                  Load GitHub Stats
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Projects Section - Premium Redesign */}
      <Card className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#B7CECE] to-[#BBBAC6] rounded-full -translate-y-10 translate-x-10 opacity-10"></div>
        
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] bg-clip-text text-transparent mb-6">
          Recent Projects
        </h2>
        
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects.slice(0, 3).map((project, index) => (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-[#E2E2E2]/30 rounded-2xl border border-[#E2E2E2] hover:border-[#B7CECE] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Code2 className="text-[#1C0F13]" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1C0F13] group-hover:text-[#6E7E85] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#6E7E85]">{project.techStack?.join(', ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex space-x-4 text-sm">
                    <span className="text-[#1C0F13] font-semibold">{project.viewCount || 0} views</span>
                    <span className="text-[#B7CECE] font-semibold">{project.clickCount || 0} clicks</span>
                  </div>
                  <div className="w-full bg-[#E2E2E2] rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(((project.clickCount || 0) / (project.viewCount || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-[#E2E2E2] to-[#BBBAC6] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Code2 className="text-[#6E7E85]" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-[#1C0F13] mb-2">No Projects Yet</h3>
            <p className="text-[#6E7E85] mb-6">Start building your portfolio with amazing projects</p>
            <a 
              href="/projects" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              Create First Project
            </a>
          </div>
        )}
      </Card>

      <style jsx>{`
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
import React, { useState, useEffect } from 'react'
import { analyticsService } from '../services/analytics'
import Card from '../components/ui/Card'
import { Eye, MousePointer, User, TrendingUp, Calendar, Sparkles, Target, Zap, Users, BarChart3, Activity } from 'lucide-react'

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState(30)
  const [loading, setLoading] = useState(true)
  const [animatedValues, setAnimatedValues] = useState({})

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  useEffect(() => {
    if (stats) {
      Object.keys(stats).forEach(key => {
        const targetValue = stats[key] || 0
        animateValue(key, 0, targetValue, 1500)
      })
    }
  }, [stats])

  const animateValue = (key, start, end, duration) => {
    const startTime = performance.now()
    
    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(start + (end - start) * easeOutQuart)
      
      setAnimatedValues(prev => ({
        ...prev,
        [key]: currentValue
      }))

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }
    
    requestAnimationFrame(updateValue)
  }

  const fetchAnalytics = async () => {
    try {
      const data = await analyticsService.getStats(timeRange)
      setStats(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-400 border-t-zinc-900 mx-auto mb-4"></div>
            <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-zinc-100" size={20} />
          </div>
          <p className="text-zinc-400 mt-4">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Profile Views',
      value: animatedValues.profileViews || 0,
      icon: Eye,
      description: 'People who viewed your profile',
      trend: '+12%',
      color: 'from-indigo-400 to-zinc-400'
    },
    {
      title: 'Project Views',
      value: animatedValues.projectViews || 0,
      icon: TrendingUp,
      description: 'Total project impressions',
      trend: '+23%',
      color: 'from-indigo-300 to-indigo-400'
    },
    {
      title: 'Project Clicks',
      value: animatedValues.projectClicks || 0,
      icon: MousePointer,
      description: 'Clicks on your project links',
      trend: '+8%',
      color: 'from-zinc-400 to-zinc-900'
    },
    {
      title: 'Unique Visitors',
      value: animatedValues.totalVisitors || 0,
      icon: Users,
      description: 'Total individual visitors',
      trend: '+15%',
      color: 'from-zinc-900 to-indigo-300'
    }
  ]

  const engagementRate = stats?.projectViews ? ((stats.projectClicks / stats.projectViews) * 100) : 0
  const profileEngagement = stats?.totalVisitors ? ((stats.profileViews / stats.totalVisitors) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Header - LinkedIn inspired */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-zinc-900 to-zinc-400 rounded-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-zinc-100">Analytics Dashboard</h1>
          </div>
          <p className="text-zinc-400 text-lg">Track your portfolio performance and engagement</p>
        </div>
        
        {/* Time Range Selector - GitHub inspired */}
        <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 shadow-sm">
          <Calendar size={18} className="text-zinc-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="bg-transparent border-none focus:ring-0 text-zinc-100 font-medium cursor-pointer text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid - LinkedIn/GitHub hybrid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card 
            key={index} 
            className="p-6 border border-zinc-800 hover:border-indigo-400 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-sm`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <span className="text-xs font-semibold bg-green-900\/50 text-green-400 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-zinc-100 mb-1 font-sans">
              {stat.value.toLocaleString()}
            </h3>
            <p className="font-semibold text-zinc-100 text-sm mb-2">
              {stat.title}
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">{stat.description}</p>
          </Card>
        ))}
      </div>

      {/* Engagement Metrics - Professional layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Engagement Rate Card */}
        <Card className="p-6 border border-zinc-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-400 rounded-lg">
              <Target className="text-zinc-100" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Engagement Rate</h3>
              <p className="text-sm text-zinc-400">Project click-through performance</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-100 font-semibold text-sm">Click-through Rate</span>
                <span className="text-lg font-bold text-zinc-100">
                  {engagementRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-400 to-zinc-400 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${engagementRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                {stats?.projectClicks || 0} clicks out of {stats?.projectViews || 0} views
              </p>
            </div>
          </div>
        </Card>

        {/* Profile Engagement Card */}
        <Card className="p-6 border border-zinc-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-300 rounded-lg">
              <User className="text-zinc-100" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Profile Engagement</h3>
              <p className="text-sm text-zinc-400">Visitor to viewer conversion</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-100 font-semibold text-sm">Profile Views</span>
                <span className="text-lg font-bold text-zinc-100">
                  {profileEngagement.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-300 to-indigo-400 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${profileEngagement}%` }}
                ></div>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                {stats?.profileViews || 0} views from {stats?.totalVisitors || 0} visitors
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Summary - GitHub insights style */}
      <Card className="p-6 border border-zinc-800">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-zinc-400 to-zinc-900 rounded-lg">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Performance Insights</h3>
            <p className="text-sm text-zinc-400">Key metrics and trends</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: 'Avg. Daily Views', 
              value: timeRange ? Math.round((stats?.profileViews || 0) / timeRange) : 0,
              icon: Eye,
              color: 'text-indigo-400'
            },
            { 
              label: 'Peak Activity', 
              value: '2:00 PM',
              icon: TrendingUp,
              color: 'text-indigo-300'
            },
            { 
              label: 'Bounce Rate', 
              value: '42%',
              icon: Target,
              color: 'text-zinc-400'
            },
            { 
              label: 'Avg. Session', 
              value: '3m 24s',
              icon: Calendar,
              color: 'text-zinc-100'
            }
          ].map((metric, index) => (
            <div key={index} className="text-center p-4 border border-zinc-800 rounded-lg hover:border-indigo-400 transition-colors">
              <metric.icon className={`${metric.color} mx-auto mb-2`} size={20} />
              <div className="text-2xl font-bold text-zinc-100 mb-1">{metric.value}</div>
              <div className="text-sm text-zinc-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Empty State */}
      {(!stats || Object.values(stats).every(val => val === 0)) && (
        <Card className="text-center py-12 border border-zinc-800">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-zinc-100" size={28} />
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-3">
            No Data Yet
          </h3>
          <p className="text-zinc-400 max-w-md mx-auto mb-6">
            Your analytics will appear here once you start sharing your portfolio and receiving visits.
          </p>
          <button className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white font-semibold px-6 py-2 rounded-lg hover:shadow-md transition-all duration-300">
            Share Your Profile
          </button>
        </Card>
      )}
    </div>
  )
}

export default Analytics
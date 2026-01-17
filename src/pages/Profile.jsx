import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { githubService } from '../services/github'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { User, Mail, Github, Linkedin, Globe, Save, RefreshCw, Star, GitBranch, Users, Calendar, Edit, Award } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    links: {
      github: '',
      linkedin: '',
      website: ''
    }
  })
  const [githubStats, setGithubStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [githubUsername, setGithubUsername] = useState('')

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        name: user.profile.name || '',
        bio: user.profile.bio || '',
        avatar: user.profile.avatar || '',
        links: {
          github: user.profile.links?.github || '',
          linkedin: user.profile.links?.linkedin || '',
          website: user.profile.links?.website || ''
        }
      })
    }
    if (user?.githubUsername) {
      setGithubUsername(user.githubUsername)
      fetchGitHubStats()
    }
  }, [user])

  const fetchGitHubStats = async () => {
    try {
      const stats = await githubService.getGitHubStats()
      setGithubStats(stats)
    } catch (error) {
      console.error('Error fetching GitHub stats:', error)
    }
  }

  const handleSyncGitHub = async () => {
    setSyncing(true)
    try {
      await githubService.syncGitHubData()
      await fetchGitHubStats()
      alert('GitHub data synced successfully!')
    } catch (error) {
      console.error('Error syncing GitHub data:', error)
      alert('Failed to sync GitHub data')
    } finally {
      setSyncing(false)
    }
  }

  const handleConnectGitHub = async () => {
    if (!githubUsername.trim()) {
      alert('Please enter a GitHub username')
      return
    }

    setLoading(true)
    try {
      await githubService.connectGitHub(githubUsername)
      alert('GitHub account connected successfully!')
      await fetchGitHubStats()
    } catch (error) {
      console.error('Error connecting GitHub:', error)
      alert('Failed to connect GitHub account')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement profile update API call
    setTimeout(() => {
      setLoading(false)
      alert('Profile updated successfully!')
    }, 1000)
  }

  const handleLinkChange = (platform, value) => {
    setFormData({
      ...formData,
      links: {
        ...formData.links,
        [platform]: value
      }
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header - LinkedIn inspired */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] rounded-lg">
              <User className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-[#1C0F13]">Profile Settings</h1>
          </div>
          <p className="text-[#6E7E85] text-lg">Manage your professional presence and connections</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content - 3 columns */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Information Card */}
          <Card className="p-6 border border-[#E2E2E2]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#1C0F13]">Profile Information</h3>
              <div className="w-10 h-10 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-lg flex items-center justify-center">
                <Edit className="text-[#1C0F13]" size={20} />
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  icon={User}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your full name"
                />
                
                <div>
                  <label className="block text-sm font-medium text-[#1C0F13] mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 px-3 py-2 border border-[#E2E2E2] rounded-lg bg-[#F8F9FA]">
                    <Mail size={18} className="text-[#6E7E85]" />
                    <span className="text-[#1C0F13] font-medium">{user?.email}</span>
                  </div>
                  <p className="text-sm text-[#6E7E85] mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C0F13] mb-2">
                  Professional Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E2E2E2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent"
                  placeholder="Describe your professional background, skills, and experience..."
                />
                <p className="text-sm text-[#6E7E85] mt-1">This appears on your public profile</p>
              </div>

              {/* Social Links Section */}
              <div className="pt-4 border-t border-[#E2E2E2]">
                <h3 className="text-lg font-bold text-[#1C0F13] mb-4">Professional Links</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="GitHub"
                    icon={Github}
                    value={formData.links.github}
                    onChange={(e) => handleLinkChange('github', e.target.value)}
                    placeholder="https://github.com/username"
                  />
                  
                  <Input
                    label="LinkedIn"
                    icon={Linkedin}
                    value={formData.links.linkedin}
                    onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                  
                  <Input
                    label="Personal Website"
                    icon={Globe}
                    value={formData.links.website}
                    onChange={(e) => handleLinkChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E2E2E2]">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold hover:shadow-md transition-all"
                >
                  <Save className="mr-2" size={20} />
                  {loading ? 'Saving Changes...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar - GitHub inspired */}
        <div className="space-y-6">
          {/* GitHub Integration */}
          <Card className="p-6 border border-[#E2E2E2]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-[#1C0F13] rounded-lg">
                <Github className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#1C0F13]">GitHub Integration</h3>
            </div>
            
            {!user?.githubUsername ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C0F13] mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E2E2E2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent"
                    placeholder="Enter GitHub username"
                  />
                </div>
                <Button 
                  onClick={handleConnectGitHub} 
                  className="w-full bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold hover:shadow-md transition-all"
                  disabled={loading}
                >
                  <Github className="mr-2" size={20} />
                  {loading ? 'Connecting...' : 'Connect GitHub'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] border border-[#E2E2E2] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#1C0F13] rounded-lg flex items-center justify-center">
                      <Github className="text-white" size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C0F13] text-sm">Connected</p>
                      <p className="text-[#6E7E85] text-sm">@{user.githubUsername}</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <Button 
                  onClick={handleSyncGitHub} 
                  variant="outline" 
                  className="w-full border-[#E2E2E2] text-[#1C0F13] hover:bg-[#F8F9FA] font-medium"
                  disabled={syncing}
                >
                  <RefreshCw className={`mr-2 ${syncing ? 'animate-spin' : ''}`} size={18} />
                  {syncing ? 'Syncing...' : 'Sync Data'}
                </Button>
                
                <p className="text-xs text-[#6E7E85] text-center">
                  Last synced: {githubStats?.lastSynced ? 
                    new Date(githubStats.lastSynced).toLocaleDateString() : 
                    'Never'}
                </p>
              </div>
            )}
          </Card>

          {/* GitHub Stats */}
          {githubStats && (
            <Card className="p-6 border border-[#E2E2E2]">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-lg">
                  <Award className="text-[#1C0F13]" size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#1C0F13]">GitHub Stats</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E2E2]">
                  <div className="flex items-center space-x-3">
                    <Star size={18} className="text-[#6E7E85]" />
                    <span className="text-sm font-medium text-[#1C0F13]">Total Stars</span>
                  </div>
                  <span className="font-bold text-[#1C0F13] text-lg">{githubStats.totalStars || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E2E2]">
                  <div className="flex items-center space-x-3">
                    <GitBranch size={18} className="text-[#6E7E85]" />
                    <span className="text-sm font-medium text-[#1C0F13]">Repositories</span>
                  </div>
                  <span className="font-bold text-[#1C0F13] text-lg">{githubStats.totalRepos || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg border border-[#E2E2E2]">
                  <div className="flex items-center space-x-3">
                    <Users size={18} className="text-[#6E7E85]" />
                    <span className="text-sm font-medium text-[#1C0F13]">Followers</span>
                  </div>
                  <span className="font-bold text-[#1C0F13] text-lg">{githubStats.followers || 0}</span>
                </div>
                
                {githubStats.mostUsedLanguages && (
                  <div className="pt-3 border-t border-[#E2E2E2]">
                    <p className="text-sm font-semibold text-[#1C0F13] mb-2">Top Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(githubStats.mostUsedLanguages)
                        .slice(0, 4)
                        .map(([lang, percent]) => (
                          <span
                            key={lang}
                            className="px-3 py-1 bg-[#E2E2E2] text-[#1C0F13] text-sm rounded-lg font-medium border border-[#E2E2E2]"
                          >
                            {lang}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Account Information */}
          <Card className="p-6 border border-[#E2E2E2]">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#6E7E85] to-[#1C0F13] rounded-lg">
                <Calendar className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#1C0F13]">Account</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[#E2E2E2]">
                <span className="text-sm font-medium text-[#6E7E85]">Member Since</span>
                <span className="text-sm font-semibold text-[#1C0F13]">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-[#6E7E85]">Last Updated</span>
                <span className="text-sm font-semibold text-[#1C0F13]">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
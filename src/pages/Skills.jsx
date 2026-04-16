import React, { useState, useEffect } from 'react'
import { skillsService } from '../services/skills'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { RefreshCw, Check, X, Trash2, Code2, TrendingUp, Target, Zap, Star, GitBranch } from 'lucide-react'

const Skills = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [extracting, setExtracting] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const data = await skillsService.getMySkills()
      setSkills(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExtractSkills = async () => {
    setExtracting(true)
    try {
      await skillsService.extractSkills()
      await fetchSkills()
      alert('Skills extracted successfully!')
    } catch (error) {
      alert('Failed to extract skills')
    } finally {
      setExtracting(false)
    }
  }

  const handleVerifySkill = async (skillId, verified) => {
    try {
      const updatedSkill = await skillsService.verifySkill(skillId, verified)
      setSkills(skills.map(skill => 
        skill.id === skillId ? updatedSkill : skill
      ))
    } catch (error) {
      alert('Failed to update skill')
    }
  }

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillsService.deleteSkill(skillId)
        setSkills(skills.filter(skill => skill.id !== skillId))
      } catch (error) {
        alert('Failed to delete skill')
      }
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'LANGUAGE': return 'bg-zinc-900 text-white'
      case 'FRAMEWORK': return 'bg-zinc-800 text-zinc-300'
      case 'TOOL': return 'bg-zinc-500 text-white'
      case 'DATABASE': return 'bg-zinc-400 text-white'
      default: return 'bg-zinc-800 text-zinc-200'
    }
  }

  const getProficiencyLevel = (proficiency) => {
    switch (proficiency) {
      case 'BEGINNER': return 1
      case 'INTERMEDIATE': return 2
      case 'ADVANCED': return 3
      case 'EXPERT': return 4
      default: return 0
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-400 border-t-zinc-900 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading your skills...</p>
        </div>
      </div>
    )
  }

  const verifiedSkills = skills.filter(s => s.verified).length
  const totalSkills = skills.length

  return (
    <div className="space-y-8">
      {/* Header - LinkedIn inspired */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-zinc-900 to-zinc-400 rounded-lg">
              <Code2 className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-zinc-100">Skills & Expertise</h1>
          </div>
          <p className="text-zinc-400 text-lg">Manage and showcase your technical skills</p>
        </div>
        
        <Button 
          onClick={handleExtractSkills} 
          disabled={extracting}
          className="bg-gradient-to-r from-zinc-500 to-zinc-400 text-white font-semibold hover:shadow-md transition-all"
        >
          <RefreshCw className={`mr-2 ${extracting ? 'animate-spin' : ''}`} size={20} />
          {extracting ? 'Extracting...' : 'Extract from GitHub'}
        </Button>
      </div>

      {/* Skills Overview - GitHub stats style */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center border border-zinc-800">
          <div className="w-12 h-12 bg-gradient-to-r from-zinc-900 to-zinc-400 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Code2 className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{totalSkills}</div>
          <div className="text-sm text-zinc-400">Total Skills</div>
        </Card>

        <Card className="p-6 text-center border border-zinc-800">
          <div className="w-12 h-12 bg-gradient-to-r from-zinc-400 to-zinc-300 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Check className="text-zinc-100" size={24} />
          </div>
          <div className="text-2xl font-bold text-zinc-100">{verifiedSkills}</div>
          <div className="text-sm text-zinc-400">Verified Skills</div>
        </Card>

        <Card className="p-6 text-center border border-zinc-800">
          <div className="w-12 h-12 bg-gradient-to-r from-zinc-400 to-zinc-900 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-zinc-100">
            {totalSkills > 0 ? Math.round((verifiedSkills / totalSkills) * 100) : 0}%
          </div>
          <div className="text-sm text-zinc-400">Completion</div>
        </Card>

        <Card className="p-6 text-center border border-zinc-800">
          <div className="w-12 h-12 bg-gradient-to-r from-zinc-300 to-zinc-400 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Zap className="text-zinc-100" size={24} />
          </div>
          <div className="text-2xl font-bold text-zinc-100">
            {skills.filter(s => s.proficiency === 'EXPERT' || s.proficiency === 'ADVANCED').length}
          </div>
          <div className="text-sm text-zinc-400">Advanced Skills</div>
        </Card>
      </div>

      {/* Skills List - Professional layout */}
      <Card className="p-6 border border-zinc-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Your Skills</h2>
            <p className="text-zinc-400">
              {verifiedSkills} of {totalSkills} skills verified • 
              Sorted by proficiency and usage
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <div className="flex items-center space-x-1 text-sm text-zinc-400">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-zinc-400">
              <div className="w-3 h-3 bg-zinc-700 rounded-full"></div>
              <span>Unverified</span>
            </div>
          </div>
        </div>

        {skills.length > 0 ? (
          <div className="space-y-4">
            {skills.map((skill) => {
              const category = typeof skill.category === 'string' && skill.category.trim() ? skill.category.trim() : 'GENERAL'
              const proficiency =
                typeof skill.proficiency === 'string' && skill.proficiency.trim()
                  ? skill.proficiency.trim().toUpperCase()
                  : 'BEGINNER'
              const usageCount = Number.isFinite(Number(skill.usageCount)) ? Number(skill.usageCount) : 0
              const lineCount = Number.isFinite(Number(skill.lineCount)) ? Number(skill.lineCount) : 0
              const confidence = Number.isFinite(Number(skill.confidence)) ? Number(skill.confidence) : 0

              return (
              <div key={skill.id} className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg hover:border-zinc-400 transition-all duration-300">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <h3 className="font-semibold text-zinc-100 text-lg">{skill.name}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(category)}`}>
                        {category.toLowerCase()}
                      </span>
                    </div>
                    
                    {skill.verified && (
                      <div className="flex items-center space-x-1 bg-green-900\/50 text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                        <Check size={12} />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    {/* Proficiency Bar */}
                    <div className="flex items-center space-x-2">
                      <Target size={14} />
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map(level => (
                          <div
                            key={level}
                            className={`w-3 h-3 rounded-full ${
                              level <= getProficiencyLevel(proficiency)
                                ? 'bg-zinc-100' 
                                : 'bg-zinc-800'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-zinc-100 text-xs">
                        {proficiency}
                      </span>
                    </div>

                    {/* Usage Stats */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <GitBranch size={14} />
                        <span>{usageCount} repos</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Code2 size={14} />
                        <span>{lineCount.toLocaleString()} lines</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={14} />
                        <span>{(confidence * 100).toFixed(0)}% confidence</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  {!skill.verified ? (
                    <Button
                      size="sm"
                      onClick={() => handleVerifySkill(skill.id, true)}
                      className="bg-zinc-500 hover:bg-zinc-400 text-white font-medium"
                      title="Verify skill"
                    >
                      <Check size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifySkill(skill.id, false)}
                      className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 font-medium"
                      title="Unverify skill"
                    >
                      <X size={16} />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="border-zinc-800 text-zinc-400 hover:bg-zinc-800 font-medium"
                    title="Delete skill"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-zinc-400 to-zinc-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code2 className="text-zinc-100" size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">No Skills Found</h3>
            <p className="text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
              Start by extracting skills from your GitHub repositories to showcase your technical expertise.
            </p>
            <Button 
              onClick={handleExtractSkills}
              className="bg-gradient-to-r from-zinc-500 to-zinc-400 text-white font-semibold hover:shadow-md transition-all"
            >
              <RefreshCw className="mr-2" size={20} />
              Extract Skills from GitHub
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Skills

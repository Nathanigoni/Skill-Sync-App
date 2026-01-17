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

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'BEGINNER': return 'from-green-500 to-green-600'
      case 'INTERMEDIATE': return 'from-blue-500 to-blue-600'
      case 'ADVANCED': return 'from-purple-500 to-purple-600'
      case 'EXPERT': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'LANGUAGE': return 'bg-[#1C0F13] text-white'
      case 'FRAMEWORK': return 'bg-[#6E7E85] text-white'
      case 'TOOL': return 'bg-[#B7CECE] text-[#1C0F13]'
      case 'DATABASE': return 'bg-[#BBBAC6] text-[#1C0F13]'
      default: return 'bg-gray-100 text-gray-800'
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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B7CECE] border-t-[#1C0F13] mx-auto mb-4"></div>
          <p className="text-[#6E7E85]">Loading your skills...</p>
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
            <div className="p-2 bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] rounded-lg">
              <Code2 className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-[#1C0F13]">Skills & Expertise</h1>
          </div>
          <p className="text-[#6E7E85] text-lg">Manage and showcase your technical skills</p>
        </div>
        
        <Button 
          onClick={handleExtractSkills} 
          disabled={extracting}
          className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold hover:shadow-md transition-all"
        >
          <RefreshCw className={`mr-2 ${extracting ? 'animate-spin' : ''}`} size={20} />
          {extracting ? 'Extracting...' : 'Extract from GitHub'}
        </Button>
      </div>

      {/* Skills Overview - GitHub stats style */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center border border-[#E2E2E2]">
          <div className="w-12 h-12 bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] rounded-lg flex items-center justify-center mx-auto mb-3">
            <Code2 className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-[#1C0F13]">{totalSkills}</div>
          <div className="text-sm text-[#6E7E85]">Total Skills</div>
        </Card>

        <Card className="p-6 text-center border border-[#E2E2E2]">
          <div className="w-12 h-12 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-lg flex items-center justify-center mx-auto mb-3">
            <Check className="text-[#1C0F13]" size={24} />
          </div>
          <div className="text-2xl font-bold text-[#1C0F13]">{verifiedSkills}</div>
          <div className="text-sm text-[#6E7E85]">Verified Skills</div>
        </Card>

        <Card className="p-6 text-center border border-[#E2E2E2]">
          <div className="w-12 h-12 bg-gradient-to-r from-[#6E7E85] to-[#1C0F13] rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div className="text-2xl font-bold text-[#1C0F13]">
            {totalSkills > 0 ? Math.round((verifiedSkills / totalSkills) * 100) : 0}%
          </div>
          <div className="text-sm text-[#6E7E85]">Completion</div>
        </Card>

        <Card className="p-6 text-center border border-[#E2E2E2]">
          <div className="w-12 h-12 bg-gradient-to-r from-[#BBBAC6] to-[#B7CECE] rounded-lg flex items-center justify-center mx-auto mb-3">
            <Zap className="text-[#1C0F13]" size={24} />
          </div>
          <div className="text-2xl font-bold text-[#1C0F13]">
            {skills.filter(s => s.proficiency === 'EXPERT' || s.proficiency === 'ADVANCED').length}
          </div>
          <div className="text-sm text-[#6E7E85]">Advanced Skills</div>
        </Card>
      </div>

      {/* Skills List - Professional layout */}
      <Card className="p-6 border border-[#E2E2E2]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1C0F13] mb-2">Your Skills</h2>
            <p className="text-[#6E7E85]">
              {verifiedSkills} of {totalSkills} skills verified • 
              Sorted by proficiency and usage
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <div className="flex items-center space-x-1 text-sm text-[#6E7E85]">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-[#6E7E85]">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Unverified</span>
            </div>
          </div>
        </div>

        {skills.length > 0 ? (
          <div className="space-y-4">
            {skills.map(skill => (
              <div key={skill.id} className="flex items-center justify-between p-4 border border-[#E2E2E2] rounded-lg hover:border-[#B7CECE] transition-all duration-300">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <h3 className="font-semibold text-[#1C0F13] text-lg">{skill.name}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getCategoryColor(skill.category)}`}>
                        {skill.category.toLowerCase()}
                      </span>
                    </div>
                    
                    {skill.verified && (
                      <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                        <Check size={12} />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#6E7E85]">
                    {/* Proficiency Bar */}
                    <div className="flex items-center space-x-2">
                      <Target size={14} />
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map(level => (
                          <div
                            key={level}
                            className={`w-3 h-3 rounded-full ${
                              level <= getProficiencyLevel(skill.proficiency) 
                                ? 'bg-[#1C0F13]' 
                                : 'bg-[#E2E2E2]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-[#1C0F13] text-xs">
                        {skill.proficiency}
                      </span>
                    </div>

                    {/* Usage Stats */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <GitBranch size={14} />
                        <span>{skill.usageCount} repos</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Code2 size={14} />
                        <span>{skill.lineCount.toLocaleString()} lines</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={14} />
                        <span>{(skill.confidence * 100).toFixed(0)}% confidence</span>
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
                      className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13] font-medium"
                      title="Verify skill"
                    >
                      <Check size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifySkill(skill.id, false)}
                      className="border-[#E2E2E2] text-[#6E7E85] hover:bg-[#E2E2E2] font-medium"
                      title="Unverify skill"
                    >
                      <X size={16} />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="border-[#E2E2E2] text-[#6E7E85] hover:bg-[#E2E2E2] font-medium"
                    title="Delete skill"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code2 className="text-[#1C0F13]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#1C0F13] mb-3">No Skills Found</h3>
            <p className="text-[#6E7E85] max-w-md mx-auto mb-6 leading-relaxed">
              Start by extracting skills from your GitHub repositories to showcase your technical expertise.
            </p>
            <Button 
              onClick={handleExtractSkills}
              className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold hover:shadow-md transition-all"
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
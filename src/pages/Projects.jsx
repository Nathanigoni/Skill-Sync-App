import React, { useState, useEffect } from 'react'
import { projectsService } from '../services/projects'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { Plus, Edit, Trash2, ExternalLink, Github, Folder, Star, Eye, MousePointer, Calendar } from 'lucide-react'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [],
    repoUrl: '',
    liveUrl: '',
    featured: false
  })
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProject) {
        await projectsService.updateProject(editingProject.id, formData)
      } else {
        await projectsService.createProject(formData)
      }
      setShowForm(false)
      setEditingProject(null)
      setFormData({
        title: '',
        description: '',
        techStack: [],
        repoUrl: '',
        liveUrl: '',
        featured: false
      })
      fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectsService.deleteProject(projectId)
        fetchProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, techInput.trim()]
      })
      setTechInput('')
    }
  }

  const removeTech = (techToRemove) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter(tech => tech !== techToRemove)
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#BBBAC6] border-t-[#1C0F13] mx-auto mb-4"></div>
          <p className="text-[#6E7E85]">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header - LinkedIn inspired */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-[#1C0F13] to-[#6E7E85] rounded-lg">
              <Folder className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-[#1C0F13]">Projects</h1>
          </div>
          <p className="text-[#6E7E85] text-lg">Showcase your work and technical expertise</p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold hover:shadow-md transition-all duration-300"
        >
          <Plus className="mr-2" size={20} />
          Add Project
        </Button>
      </div>

      {/* Project Form Modal - Professional design */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#E2E2E2]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C0F13]">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
              <div className="w-10 h-10 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-lg flex items-center justify-center">
                <Folder className="text-[#1C0F13]" size={20} />
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Project Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Enter project name"
              />

              <div>
                <label className="block text-sm font-medium text-[#1C0F13] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E2E2E2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent"
                  placeholder="Describe your project and its key features"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C0F13] mb-2">
                  Tech Stack
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    className="flex-1 px-3 py-2 border border-[#E2E2E2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B7CECE] focus:border-transparent"
                    placeholder="Add technology (e.g., React, Node.js)"
                  />
                  <Button type="button" onClick={addTech} className="bg-[#B7CECE] hover:bg-[#BBBAC6] text-[#1C0F13] font-medium">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.techStack.map(tech => (
                    <span
                      key={tech}
                      className="bg-[#E2E2E2] text-[#1C0F13] px-3 py-1 rounded-lg text-sm flex items-center gap-2 font-medium"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:text-[#6E7E85] text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Repository URL"
                  type="url"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
                  placeholder="https://github.com/username/repo"
                />

                <Input
                  label="Live Demo URL"
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                  placeholder="https://your-project.com"
                />
              </div>

              <div className="flex items-center gap-3 p-3 border border-[#E2E2E2] rounded-lg">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded border-[#6E7E85] text-[#B7CECE] focus:ring-[#B7CECE]"
                />
                <label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium text-[#1C0F13]">
                  <Star size={16} className="text-[#B7CECE]" />
                  Feature this project on your profile
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E2E2E2]">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold hover:shadow-md transition-all">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProject(null)
                    setFormData({
                      title: '',
                      description: '',
                      techStack: [],
                      repoUrl: '',
                      liveUrl: '',
                      featured: false
                    })
                  }}
                  className="border-[#E2E2E2] text-[#6E7E85] hover:bg-[#E2E2E2] font-medium"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Projects Grid - GitHub repository style */}
      {projects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="p-6 border border-[#E2E2E2] hover:border-[#B7CECE] transition-all duration-300 hover:shadow-md">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Folder className="text-[#1C0F13]" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#1C0F13] truncate text-lg">{project.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {project.featured && (
                        <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] px-2 py-1 rounded-full text-xs font-medium">
                          <Star size={12} />
                          <span>Featured</span>
                        </span>
                      )}
                      <span className="text-xs text-[#6E7E85]">
                        Updated {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Project Description */}
              <p className="text-[#6E7E85] text-sm mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
              
              {/* Tech Stack - GitHub language bar style */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.slice(0, 4).map(tech => (
                  <span
                    key={tech}
                    className="bg-[#E2E2E2] text-[#1C0F13] px-2.5 py-1 rounded text-xs font-medium border border-[#E2E2E2]"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="text-[#6E7E85] text-xs font-medium px-2 py-1">
                    +{project.techStack.length - 4} more
                  </span>
                )}
              </div>

              {/* Analytics - LinkedIn style metrics */}
              <div className="flex items-center justify-between text-sm text-[#6E7E85] mb-4 py-2 border-t border-b border-[#E2E2E2]">
                <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{project.viewCount || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MousePointer size={14} />
                  <span>{project.clickCount || 0} clicks</span>
                </div>
              </div>

              {/* Actions - Professional layout */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 text-[#6E7E85] hover:text-[#1C0F13] hover:bg-[#E2E2E2] rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <Github size={16} />
                      <span>Code</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 text-[#6E7E85] hover:text-[#1C0F13] hover:bg-[#E2E2E2] rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <ExternalLink size={16} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingProject(project)
                      setFormData({
                        title: project.title,
                        description: project.description,
                        techStack: project.techStack,
                        repoUrl: project.repoUrl,
                        liveUrl: project.liveUrl,
                        featured: project.featured
                      })
                      setShowForm(true)
                    }}
                    className="p-2 text-[#6E7E85] hover:text-[#1C0F13] hover:bg-[#E2E2E2] rounded-lg transition-all duration-200"
                    title="Edit project"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-[#6E7E85] hover:text-[#1C0F13] hover:bg-[#E2E2E2] rounded-lg transition-all duration-200"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 border border-[#E2E2E2]">
          <div className="w-20 h-20 bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Folder className="text-[#1C0F13]" size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#1C0F13] mb-3">No projects yet</h3>
          <p className="text-[#6E7E85] max-w-md mx-auto mb-6 leading-relaxed">
            Showcase your best work to potential employers and collaborators. Add your first project to get started.
          </p>
          <Button 
            onClick={() => setShowForm(true)} 
            className="bg-gradient-to-r from-[#B7CECE] to-[#BBBAC6] text-[#1C0F13] font-semibold hover:shadow-md transition-all duration-300"
          >
            <Plus className="mr-2" size={20} />
            Create Your First Project
          </Button>
        </Card>
      )}
    </div>
  )
}

export default Projects
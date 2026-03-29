import api from './api'

const githubHeaders = {
  Accept: 'application/vnd.github+json',
}

const fetchPublicGitHubStats = async (username) => {
  const trimmed = username.toString().trim()
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(trimmed)}`, {
    headers: githubHeaders,
  })
  if (!userRes.ok) {
    const error = new Error('Failed to fetch GitHub user')
    error.status = userRes.status
    throw error
  }
  const userData = await userRes.json()

  let totalStars = 0
  const languageCounts = {}
  let page = 1

  while (page <= 10) {
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(trimmed)}/repos?per_page=100&page=${page}&sort=pushed`,
      { headers: githubHeaders }
    )
    if (!reposRes.ok) {
      const error = new Error('Failed to fetch GitHub repos')
      error.status = reposRes.status
      throw error
    }
    const repos = await reposRes.json()
    if (!Array.isArray(repos) || repos.length === 0) break

    for (const repo of repos) {
      totalStars += Number(repo?.stargazers_count || 0)
      const lang = repo?.language
      if (typeof lang === 'string' && lang.trim()) {
        languageCounts[lang] = (languageCounts[lang] || 0) + 1
      }
    }

    if (repos.length < 100) break
    page += 1
  }

  const languageEntries = Object.entries(languageCounts).sort((a, b) => b[1] - a[1])
  const totalLangCount = languageEntries.reduce((sum, [, count]) => sum + count, 0)
  const mostUsedLanguages = {}
  for (const [lang, count] of languageEntries.slice(0, 6)) {
    mostUsedLanguages[lang] = totalLangCount ? Math.round((count / totalLangCount) * 100) : 0
  }

  return {
    followers: Number(userData?.followers || 0),
    totalRepos: Number(userData?.public_repos || 0),
    publicRepos: Number(userData?.public_repos || 0),
    totalStars,
    totalCommits: 0,
    mostUsedLanguages,
    lastSynced: new Date().toISOString(),
  }
}

export const githubService = {
  async getGitHubStats(username) {
    const trimmed = typeof username === 'string' ? username.trim() : ''
    if (trimmed) {
      return await fetchPublicGitHubStats(trimmed)
    }

    const response = await api.get('/github/stats')
    return response.data?.data ?? response.data
  },
  async connectGitHub(username) {
    const trimmed = typeof username === 'string' ? username.trim() : ''
    if (!trimmed) {
      throw new Error('GitHub username is required')
    }

    try {
      const response = await api.post('/github/connect', { username: trimmed })
      return response.data?.data ?? response.data
    } catch (error) {
      const status = error?.response?.status
      if (status === 404) {
        await fetchPublicGitHubStats(trimmed)
        return { githubUsername: trimmed }
      }
      throw error
    }
  },
  async syncGitHubData(username) {
    const trimmed = typeof username === 'string' ? username.trim() : ''
    if (trimmed) {
      return await fetchPublicGitHubStats(trimmed)
    }

    const response = await api.post('/github/sync')
    return response.data?.data ?? response.data
  },
  getRepos: async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}/repos`)
    return await response.json()
  },
}

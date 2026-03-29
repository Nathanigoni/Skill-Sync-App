import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- MOCK DATA ---
  let users = [
    { id: 1, name: 'Test User', email: 'test@example.com', password: 'password', githubUsername: 'testuser' }
  ];
  
  let feedPosts = [
    {
      id: 1,
      userName: 'Alice',
      userGithubUsername: 'alice',
      content: 'Just launched my new portfolio!',
      postType: 'TEXT',
      likes: 12,
      comments: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      userName: 'Bob',
      userGithubUsername: 'bob',
      content: 'Check out this cool React component I built.',
      postType: 'CODE',
      codeSnippet: 'const Button = () => <button>Click me</button>;',
      language: 'javascript',
      likes: 45,
      comments: 10,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  let projects = [
    { id: 1, title: 'Portfolio Website', description: 'My personal portfolio built with React.', link: 'https://example.com', github: 'https://github.com/testuser/portfolio' }
  ];

  let skills = [
    { id: 1, name: 'React', proficiency: 'Expert', verified: true },
    { id: 2, name: 'JavaScript', proficiency: 'Expert', verified: true },
    { id: 3, name: 'Node.js', proficiency: 'Intermediate', verified: false }
  ];

  // --- API ROUTES ---
  const apiRouter = express.Router();

  // Auth
  apiRouter.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ data: { token: 'mock-jwt-token', user } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  apiRouter.post('/auth/register', (req, res) => {
    const { email, password, name, githubUsername } = req.body;
    const newUser = { id: users.length + 1, email, password, name, githubUsername };
    users.push(newUser);
    res.json({ data: { token: 'mock-jwt-token', user: newUser } });
  });

  apiRouter.get('/users/me', (req, res) => {
    res.json({ data: users[0] });
  });

  // Feed
  apiRouter.get('/feed/global', (req, res) => {
    res.json(feedPosts);
  });

  apiRouter.post('/feed/post/:type', (req, res) => {
    const newPost = {
      id: feedPosts.length + 1,
      userName: users[0].name,
      userGithubUsername: users[0].githubUsername,
      ...req.body,
      postType: req.params.type.toUpperCase(),
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    feedPosts.unshift(newPost);
    res.json(newPost);
  });

  apiRouter.post('/feed/:id/like', (req, res) => {
    const post = feedPosts.find(p => p.id === parseInt(req.params.id));
    if (post) post.likes += 1;
    res.json({ success: true });
  });

  apiRouter.post('/feed/:id/view', (req, res) => {
    res.json({ success: true });
  });

  // Projects
  apiRouter.get('/projects', (req, res) => {
    res.json({ data: projects });
  });

  apiRouter.get('/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    res.json({ data: project });
  });

  apiRouter.post('/projects', (req, res) => {
    const newProject = { id: projects.length + 1, ...req.body };
    projects.push(newProject);
    res.json({ data: newProject });
  });

  apiRouter.put('/projects/:id', (req, res) => {
    const index = projects.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
      projects[index] = { ...projects[index], ...req.body };
      res.json({ data: projects[index] });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  apiRouter.delete('/projects/:id', (req, res) => {
    projects = projects.filter(p => p.id !== parseInt(req.params.id));
    res.json({ success: true });
  });

  // Skills
  const skillsCache = new Map();

  const proficiencyFromUsageCount = (usageCount) => {
    if (usageCount >= 10) return 'EXPERT';
    if (usageCount >= 5) return 'ADVANCED';
    if (usageCount >= 2) return 'INTERMEDIATE';
    return 'BEGINNER';
  };

  const fetchGitHubSkills = async (username) => {
    const trimmed = username.toString().trim();
    const cached = skillsCache.get(trimmed);
    if (cached && Date.now() - cached.fetchedAt < 10 * 60 * 1000) {
      return cached.skills;
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'SkillSync',
    };

    const repos = [];
    let page = 1;
    while (page <= 5) {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(trimmed)}/repos?per_page=100&page=${page}&sort=pushed`,
        { headers }
      );
      if (!reposRes.ok) {
        const error = new Error('GitHub repos lookup failed');
        error.status = reposRes.status;
        throw error;
      }
      const batch = await reposRes.json();
      if (!Array.isArray(batch) || batch.length === 0) break;
      repos.push(...batch);
      if (batch.length < 100) break;
      page += 1;
    }

    const totalRepos = repos.length || 1;
    const usageByName = new Map();

    const incSkill = (key, category, sizeKb) => {
      const prev = usageByName.get(key) || {
        name: key,
        category,
        usageCount: 0,
        lineCount: 0,
      };
      const addLines = Number.isFinite(Number(sizeKb)) ? Math.round(Number(sizeKb) * 20) : 0;
      usageByName.set(key, {
        ...prev,
        usageCount: prev.usageCount + 1,
        lineCount: prev.lineCount + addLines,
      });
    };

    for (const repo of repos) {
      const primaryLanguage = repo?.language;
      if (typeof primaryLanguage === 'string' && primaryLanguage.trim()) {
        incSkill(primaryLanguage.trim(), 'LANGUAGE', repo?.size);
      }

      const repoName = (repo?.name || '').toString().toLowerCase();
      const repoDesc = (repo?.description || '').toString().toLowerCase();
      if (repoName.includes('react') || repoDesc.includes('react')) {
        incSkill('React', 'FRAMEWORK', repo?.size);
      }
    }

    const jsTsRepos = repos
      .filter((repo) => {
        const lang = (repo?.language || '').toString().toLowerCase();
        return lang === 'javascript' || lang === 'typescript';
      })
      .slice(0, 15);

    for (const repo of jsTsRepos) {
      const owner = repo?.owner?.login;
      const name = repo?.name;
      if (!owner || !name) continue;

      try {
        const pkgRes = await fetch(
          `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/contents/package.json`,
          { headers }
        );
        if (!pkgRes.ok) continue;
        const pkgJson = await pkgRes.json();
        const content = pkgJson?.content;
        if (typeof content !== 'string') continue;

        const decoded = Buffer.from(content, 'base64').toString('utf-8');
        const pkg = JSON.parse(decoded);
        const deps = pkg?.dependencies || {};
        const devDeps = pkg?.devDependencies || {};
        if (deps.react || devDeps.react) {
          incSkill('React', 'FRAMEWORK', repo?.size);
        }
      } catch (err) {
        void err;
      }
    }

    const computed = Array.from(usageByName.values())
      .map((item, index) => {
        const usageCount = item.usageCount || 0;
        const confidence = Math.max(0, Math.min(1, usageCount / totalRepos));
        return {
          id: index + 1,
          name: item.name,
          category: item.category,
          proficiency: proficiencyFromUsageCount(usageCount),
          verified: true,
          usageCount,
          lineCount: item.lineCount || 0,
          confidence,
        };
      })
      .sort((a, b) => b.usageCount - a.usageCount);

    skillsCache.set(trimmed, { fetchedAt: Date.now(), skills: computed });
    return computed;
  };

  apiRouter.post('/skills/extract', async (req, res) => {
    const username = (req.body?.username || req.query?.username || users?.[0]?.githubUsername);
    if (!username) {
      return res.status(400).json({ message: 'No GitHub account connected' });
    }

    try {
      const computed = await fetchGitHubSkills(username);
      skills = computed;
      res.json({ success: true, data: computed });
    } catch (err) {
      const status = err?.status || 500;
      res.status(status).json({ message: status === 404 ? 'GitHub user not found' : 'Failed to extract skills' });
    }
  });

  apiRouter.get('/skills/me', async (req, res) => {
    const username = (req.query?.username || users?.[0]?.githubUsername);
    if (username) {
      try {
        const computed = await fetchGitHubSkills(username);
        skills = computed;
      } catch (err) {
        void err;
      }
    }
    res.json({ data: skills });
  });

  apiRouter.get('/skills/user/:id', (req, res) => {
    res.json({ data: skills });
  });

  apiRouter.put('/skills/:id/verify', (req, res) => {
    const index = skills.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
      skills[index].verified = req.query.verified === 'true';
      res.json({ data: skills[index] });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  apiRouter.delete('/skills/:id', (req, res) => {
    skills = skills.filter(s => s.id !== parseInt(req.params.id));
    res.json({ success: true });
  });

  // Analytics
  apiRouter.get('/analytics/stats', (req, res) => {
    res.json({
      data: {
        profileViews: 120,
        projectClicks: 45,
        feedEngagement: 89
      }
    });
  });

  apiRouter.post('/analytics/event', (req, res) => {
    res.json({ success: true });
  });

  // GitHub
  const githubCache = new Map();

  const fetchGitHubStats = async (username) => {
    const trimmed = username.toString().trim();
    const cached = githubCache.get(trimmed);
    if (cached && Date.now() - cached.fetchedAt < 5 * 60 * 1000) {
      return cached.stats;
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'SkillSync',
    };

    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(trimmed)}`, { headers });
    if (!userRes.ok) {
      const error = new Error('GitHub user lookup failed');
      error.status = userRes.status;
      throw error;
    }
    const userData = await userRes.json();

    let totalStars = 0;
    const languageCounts = {};
    let page = 1;

    while (page <= 10) {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(trimmed)}/repos?per_page=100&page=${page}&sort=pushed`,
        { headers }
      );
      if (!reposRes.ok) {
        const error = new Error('GitHub repos lookup failed');
        error.status = reposRes.status;
        throw error;
      }
      const repos = await reposRes.json();
      if (!Array.isArray(repos) || repos.length === 0) {
        break;
      }

      for (const repo of repos) {
        totalStars += Number(repo?.stargazers_count || 0);
        const lang = repo?.language;
        if (typeof lang === 'string' && lang.trim()) {
          languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        }
      }

      if (repos.length < 100) break;
      page += 1;
    }

    const languageEntries = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);
    const totalLangCount = languageEntries.reduce((sum, [, count]) => sum + count, 0);
    const mostUsedLanguages = {};
    for (const [lang, count] of languageEntries.slice(0, 6)) {
      mostUsedLanguages[lang] = totalLangCount ? Math.round((count / totalLangCount) * 100) : 0;
    }

    const stats = {
      followers: Number(userData?.followers || 0),
      totalRepos: Number(userData?.public_repos || 0),
      publicRepos: Number(userData?.public_repos || 0),
      totalStars,
      totalCommits: 0,
      mostUsedLanguages,
      lastSynced: new Date().toISOString(),
    };

    githubCache.set(trimmed, { fetchedAt: Date.now(), stats });
    return stats;
  };

  apiRouter.post('/github/connect', async (req, res) => {
    const username = (req.body?.username || req.body?.githubUsername || '').toString().trim();
    if (!username) {
      return res.status(400).json({ message: 'GitHub username is required' });
    }

    try {
      await fetchGitHubStats(username);
      users = users.map(u => (u.id === 1 ? { ...u, githubUsername: username } : u));
      res.json({ success: true, data: { githubUsername: username } });
    } catch (err) {
      const status = err?.status || 500;
      res.status(status).json({ message: status === 404 ? 'GitHub user not found' : 'Failed to connect GitHub' });
    }
  });

  apiRouter.get('/github/stats', async (req, res) => {
    const username = users?.[0]?.githubUsername;
    if (!username) {
      return res.status(400).json({ message: 'No GitHub account connected', data: null });
    }

    try {
      const stats = await fetchGitHubStats(username);
      res.json({ data: stats });
    } catch (err) {
      const status = err?.status || 500;
      res.status(status).json({ message: status === 404 ? 'GitHub user not found' : 'Failed to fetch GitHub stats' });
    }
  });

  apiRouter.get('/github/stats/:username', async (req, res) => {
    const username = req.params.username;
    try {
      const stats = await fetchGitHubStats(username);
      res.json({ data: stats });
    } catch (err) {
      const status = err?.status || 500;
      res.status(status).json({ message: status === 404 ? 'GitHub user not found' : 'Failed to fetch GitHub stats' });
    }
  });

  apiRouter.post('/github/sync', async (req, res) => {
    const username = users?.[0]?.githubUsername;
    if (!username) {
      return res.status(400).json({ message: 'No GitHub account connected' });
    }

    githubCache.delete(username.toString().trim());
    try {
      const stats = await fetchGitHubStats(username);
      res.json({ success: true, data: stats });
    } catch (err) {
      const status = err?.status || 500;
      res.status(status).json({ message: status === 404 ? 'GitHub user not found' : 'Failed to sync GitHub' });
    }
  });

  app.use('/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

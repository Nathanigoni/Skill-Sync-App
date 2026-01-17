export const githubService = {
  async getGitHubStats(username) {
    const response = await api.get(`/github/stats/${username}`)
    return response.data
  },
  getRepos: async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    return await response.json();
  }
};
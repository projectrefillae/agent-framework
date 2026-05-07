// src/tools/github.js
/**
 * GitHub tools for the agent framework.
 * These functions wrap the Octokit REST API.
 * @see https://octokit.github.io/rest.js/
 */

let octokit;

/**
 * Initialize the GitHub tools with a personal access token.
 * @param {string} token - GitHub personal access token.
 */
function init(token) {
  if (!token) {
    throw new Error('GitHub token is required');
  }
  const { Octokit } = require("@octokit/rest");
  octokit = new Octokit({ auth: token });
}

/**
 * List repositories for the authenticated user.
 * @returns {Promise<Array>} Array of repository objects.
 */
async function listRepos() {
  if (!octokit) {
    throw new Error('GitHub tools not initialized. Call init() first.');
  }
  const { data } = await octokit.rest.repos.listForAuthenticatedUser();
  return data;
}

/**
 * Create a new repository.
 * @param {Object} options - Repository options.
 * @param {string} options.name - Repository name.
 * @param {string} [options.description] - Repository description.
 * @param {boolean} [options.private] - Whether the repo should be private.
 * @returns {Promise<Object>} The created repository.
 */
async function createRepo({ name, description, private: isPrivate = false }) {
  if (!octokit) {
    throw new Error('GitHub tools not initialized. Call init() first.');
  }
  const { data } = await octokit.rest.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate,
  });
  return data;
}

/**
 * Get the contents of a file.
 * @param {Object} params - File parameters.
 * @param {string} params.owner - Repository owner.
 * @param {string} params.repo - Repository name.
 * @param {string} params.path - File path.
 * @param {string} [params.ref] - Branch, tag, or commit SHA.
 * @returns {Promise<Object>} The file object.
 */
async function getFile({ owner, repo, path, ref }) {
  if (!octokit) {
    throw new Error('GitHub tools not initialized. Call init() first.');
  }
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref,
  });
  return data;
}

module.exports = {
  init,
  listRepos,
  createRepo,
  getFile,
};
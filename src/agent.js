// src/agent.js
/**
 * Base Agent class for the agent framework.
 * An agent operates in a cycle: plan, act, observe, reflect.
 */
class Agent {
  /**
   * Create an agent.
   * @param {Object} options - Configuration options.
   * @param {string} options.name - The name of the agent.
   * @param {Object} [options.tools] - Available tools for the agent.
   */
  constructor({ name, tools = {} } = {}) {
    this.name = name || 'Unnamed Agent';
    this.tools = tools;
    this.state = {};
    this.history = [];
  }

  /**
   * Plan the next action based on current state and goals.
   * This method should be overridden by subclasses to implement specific planning logic.
   * @returns {Promise<Object>} A plan object describing the intended action.
   */
  async plan() {
    throw new Error('Agent.plan() must be implemented by subclass');
  }

  /**
   * Execute the planned action.
   * @param {Object} plan - The plan returned by the plan() method.
   * @returns {Promise<Object>} The result of executing the action.
   */
  async act(plan) {
    throw new Error('Agent.act() must be implemented by subclass');
  }

  /**
   * Observe the outcome of the action and update the agent's state.
   * @param {Object} actionResult - The result from the act() method.
   * @returns {Promise<void>}
   */
  async observe(actionResult) {
    // By default, just update state with the result.
    this.state.lastActionResult = actionResult;
    this.history.push({ actionResult, timestamp: new Date() });
  }

  /**
   * Reflect on the recent action and outcome, potentially adjusting future plans.
   * @returns {Promise<void>}
   */
  async reflect() {
    // Default reflection: do nothing, can be overridden.
  }

  /**
   * Run one step of the agent cycle: plan -> act -> observe -> reflect.
   * @returns {Promise<Object>} The result of the action.
   */
  async step() {
    const plan = await this.plan();
    const actionResult = await this.act(plan);
    await this.observe(actionResult);
    await this.reflect();
    return actionResult;
  }

  /**
   * Run the agent for a specified number of steps or until a condition is met.
   * @param {Object} [options] - Run options.
   * @param {number} [options.maxSteps] - Maximum number of steps to run.
   * @param {Function} [options.shouldStop] - Function that returns true to stop early.
   * @returns {Promise<Array>} Array of results from each step.
   */
  async run({ maxSteps = Infinity, shouldStop = () => false } = {}) {
    const results = [];
    let stepCount = 0;
    while (stepCount < maxSteps && !shouldStop()) {
      try {
        const result = await this.step();
        results.push(result);
        stepCount++;
      } catch (error) {
        // In case of error, we can break or continue depending on implementation.
        // For now, we break and return the error as the last result.
        results.push({ error: error.message });
        break;
      }
    }
    return results;
  }
}

module.exports = Agent;
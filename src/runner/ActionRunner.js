/** @typedef {import('../ArcAction.js').ArcAction} ArcAction */

// From https://github.com/advanced-rest-client/request-hooks-logic/blob/stage/request-logic-action.js

/**
 * A class that is responsible for running a signle action.
 */
export class ActionRunner {
  /**
   * @param {ArcAction} action [description]
   */
  constructor(action) {
    this.action = action;
  }

  get hasRunCondition() {
    return this.action.type === 'response';
  }

  /**
   * Runs the request hook action.
   *
   * @param {Object} request ARC request object
   * @param {Object=} response ARC response object
   * @return {Promise<boolean>} Promise resolved to Boolean `true` if the action was
   * performed or `false` if the action wasn't performed because haven't meet
   * defined conditions.
   */
  async run(request, response) {
    if (this.hasRunCondition) {
      const cResult = this._areConditionsMeet(request, response);
      if (!cResult) {
        return false;
      }
    }
    return true;
    // return this._execute(request, response);
  }

  /**
   * Checks is conditions for the actions are meet.
   *
   * @param {Object} request ARC request object
   * @param {Object=} response ARC response object
   * @return {boolean} False of any of the conditions aren't meet.
   */
  _areConditionsMeet(request, response) {
    const cond = this.action.config.condition || [];
    if (!cond || !cond.length) {
      return true;
    }
    for (let i = 0, len = cond.length; i < len; i++) {
      if (!cond[i].satisfied(request, response)) {
        return false;
      }
    }
    return true;
  }
}

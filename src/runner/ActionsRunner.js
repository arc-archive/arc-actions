import { EventsTargetMixin } from '@advanced-rest-client/events-target-mixin';
import { VariablesMixin } from '@advanced-rest-client/variables-evaluator/index.js';

export class ActionsRunner extends VariablesMixin(EventsTargetMixin(Object)) {
  /**
   * @param {Object} [config={}] Configuration options
   * @param {?Node} config.eventsTarget
   * @param {?Object} opts.context Variables context
   * @param {?Object} opts.cache Variables cache object
   * @param {?String} opts.jexlPath JavaScript path to Jexl library
   * @param {?Object} opts.jexl A reference to Jexl object. When set `jexlPath` is not needed.
   */
  constructor({ context, cache, jexlPath, jexl, eventsTarget } = {}) {
    super();
    this.context = context;
    this.cache = cache;
    this.jexlPath = jexlPath;
    this.jexl = jexl;
    this._eventsTargetChanged(eventsTarget);
  }

  dispatchEvent(e) {
    this.eventsTarget.dispatchEvent(e);
  }

  async processRequestActions(actions, request) {
    if (!actions || !request) {
      throw new Error('Expecting 2 arguments.');
    }
  }

  /**
   * Processes actions when response object is ready.
   * @param {Array<Object>} actions List of actions to perform
   * @param {Object} request ArcRequest object. See this doc for data model:
   * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/api-request-and-response.md#api-request
   * @param {Object} response ArcResponse object. See this doc for data model:
   * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/api-request-and-response.md#api-request
   * @return {Promise} A promise resolved when actions were performed.
   */
  async processResponseActions(actions, request, response) {
    if (!actions || !request || !response) {
      throw new Error('Expecting 3 arguments.');
    }
  }

  _createActionRunner(action) {
    // todo: create action runner depending on the action name.
  }
}

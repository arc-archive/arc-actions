import { RequestDataExtractor } from './RequestDataExtractor.js';
import * as ConditionRunner from './ConditionRunner.js';

/**
 * An element that performs a logic condition check defined in request / response
 * actions for ARC.
 */
export class RequestLogicCondition {
  /**
   * @param {Object} args
   * @param {Boolean=} args.enabled A flag to determine if the condition is enabled.
   * @param {String=} args.source Condition data source
   * @param {String=} args.operator The comparator name
   * @param {String|Number=} args.condition A value to test against the source value.
   */
  constructor({ enabled = false, source, operator, condition }) {
    /**
     * A flag to determine if the condition is enabled.
     * When set the `satisfied()` function always returns `false`.
     * @type {Boolean}
     */
    this.enabled = enabled;
    /**
     * Condition data source
     *
     * @type {String}
     */
    this.source = source;
    /**
     * The comparator name
     * @type {String}
     */
    this.operator = operator;
    /**
     * A value to test against the source value.
     * @type {String|Number}
     */
    this.condition = condition;
  }

  /**
   * Checks if the condition has been satisfied for current request and response
   * objects.
   *
   * @param {Object} request The ARC request object. Contains `url`, `method`,
   * `headers` and `payload` (all strings)
   * @param {Object=} response ARC Response object as defined in
   * https://github.com/advanced-rest-client/api-components-api/blob/master/
   * docs/api-request-and-response.md
   * @return {Boolean} True if the condition is satisfied and false otherwise.
   */
  satisfied(request, response) {
    if (!this.enabled) {
      return false;
    }
    const extractor = new RequestDataExtractor({
      request,
      response,
      path: this.source
    });
    const value = extractor.extract();
    return ConditionRunner.checkCondition(value, this.operator, this.condition);
  }
}

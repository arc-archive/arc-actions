/**
 * Class responsible for extracting data from JSON values.
 */
export class ActionIterableObject {
  /**
   * @param {?Object} [config={}] Iterator options
   * @param {Array<String>} config.source Source of the data split by `.` character
   * @param {String} config.operator Comparision operator
   * @param {String|Number} config.condition Comparision value
   */
  constructor(config = {}) {
    /**
     * Thether the configuration is valid or not.
     * @type {Boolean}
     */
    this.valid = this._validate(config);
    if (!this.valid) {
      return;
    }
    const { source, operator, condition } = config;
    /**
     * Source of the data split by `.` character
     * @type {Array<String>}
     */
    this.source = source.split('.');
    /**
     * Comparision operator
     * @type {String}
     */
    this.operator = operator;
    /**
     * Comparision value
     * @type {String|Number}
     */
    this.condition = condition;
  }
  /**
   * Validates passed options and sets `valid` flag.
   *
   * @param {Object} opts Iterator options
   * @return {Boolean} True when options are valid
   */
  _validate(opts) {
    let valid = true;
    if (!opts.source) {
      valid = false;
    }
    if (valid && !opts.operator) {
      valid = false;
    }
    if (valid && !opts.condition) {
      valid = false;
    }
    if (valid) {
      const ops = [
        'equal',
        'not-equal',
        'greater-than',
        'greater-than-equal',
        'less-than',
        'less-than-equal',
        'contains',
        'regex'
      ];
      if (ops.indexOf(opts.operator) === -1) {
        valid = false;
      }
    }
    return valid;
  }
}

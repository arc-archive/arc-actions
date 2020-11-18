/**
 * @typedef {Object} IterableConfig
 * @property {string[]|string=} config.source Source of the data split by `.` character
 * @property {string=} config.operator Comparison operator
 * @property {string|number=} config.condition Comparison value
 */

/**
 * Validates passed options and sets `valid` flag.
 *
 * @param {IterableConfig} opts Iterator options
 * @return {boolean} True when options are valid
 */
export function validate(opts) {
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

/**
 * Class responsible for extracting data from JSON values.
 */
export class ActionIterableObject {
  /**
   * @param {IterableConfig=} [config={}] Iterator options
   */
  constructor(config = {}) {
    /**
     * Whether the configuration is valid or not.
     * @type {Boolean}
     */
    this.valid = validate(config);
    if (!this.valid) {
      return;
    }
    const { source, operator, condition } = config;
    let src = /** @type string[] */ (source);
    if (typeof source === 'string') {
      src = source.split('.');
    }
    /**
     * Source of the data split by `.` character
     * @type {string[]}
     */
    this.source = src;
    /**
     * Comparison operator
     * @type {String}
     */
    this.operator = operator;
    /**
     * Comparison value
     * @type {String|Number}
     */
    this.condition = condition;
  }
}

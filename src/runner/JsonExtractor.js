import { ActionIterableObject } from './ActionIterableObject.js';
import { RequestLogicCondition } from './RequestLogicCondition.js';
/**
 * Class responsible for extracting data from JSON values.
 */
export class JsonExtractor {
  /**
   * @constructor
   * @param {String|Object|Array} json JSON string or object. Strings are
   * parsed to objects.
   * @param {Array<String>} path Path to the data.
   * @param {?Object} iterator Data iterator
   */
  constructor(json, path, iterator) {
    /**
     * JS object or array.
     */
    this._data = this._processJson(json);
    if (typeof path === 'string') {
      path = path.split('.');
    }
    this._path = path;
    this._iterator = new ActionIterableObject(iterator);
  }
  /**
   * Processes input JSON data and returns Array or Object. It returns
   * `undefined` if the data are empty, falsy or a primitive (except for JSON
   * strings).
   *
   * @param {Array|Object|String} data Data to process
   * @return {Array|Object|undefined} JS object or undefined if conversion
   * wasn't possible.
   */
  _processJson(data) {
    if (!data) {
      return;
    }
    switch (typeof data) {
      case 'number':
      case 'boolean':
        return;
      case 'string':
        try {
          return JSON.parse(data);
        } catch (e) {
          return;
        }
    }
    return data;
  }
  /**
   * Extracts the data for given conditions.
   *
   * @return {String|undefined} Data found for given conditions.
   */
  extract() {
    if (this._iterator.valid) {
      const obj = this._getValue(this._data, this._iterator.source);
      if (!obj) {
        return;
      }
      return this._getValue(obj, this._path);
    }
    return this._getValue(this._data, this._path);
  }

  /**
   * Reads a value of an JSON object for given path.
   *
   * @param {Object|Array} json JSON value to read
   * @param {Array<String>} path Path to search for the value.
   * @param {Object=} iterableOptions
   * @return {String|undefined} Value for given path.
   */
  _getValue(json, path, iterableOptions) {
    if (!json || typeof json !== 'object') {
      return json;
    }
    if (iterableOptions) {
      return this._getIterableValue(json, path, iterableOptions);
    }
    let part = path.shift();
    if (!part) {
      return json;
    }
    if (part === '*') {
      iterableOptions = this._iterator;
      return this._getValue(json, path, iterableOptions);
    }
    let isNumber = false;
    if (!isNaN(part)) {
      part = Number(part);
      isNumber = true;
    }
    if (json instanceof Array && !isNumber && !iterableOptions) {
      return;
    }
    return this._getValue(json[part], path, iterableOptions);
  }
  /**
   * Searches for a value in iterable object.
   *
   * @param {Object|Array} json Iterable object
   * @param {Array<String>} path Path for the value
   * @param {ActionIterableObject} opts Iterable object configuration
   * @return {Object|undefined} Object that matches iterable condition
   * or undefined if none matches the condition.
   */
  _getIterableValue(json, path, opts) {
    path = Array.from(path);
    if (json instanceof Array) {
      return this._getIterableValueArray(json, path, opts);
    }
    return this._getIterableValueObject(json, path, opts);
  }
  /**
   * Searches for a value in Array.
   *
   * @param {Object|Array} json Iterable object
   * @param {Array<String>} path Path for the value
   * @param {ActionIterableObject|Object=} opts Iterable object configuration
   * @return {Object|undefined} Object that matches iterable condition
   * or undefined if none matches the condition.
   */
  _getIterableValueArray(json, path, opts = {}) {
    const { operator, condition } = opts;
    const cond = new RequestLogicCondition({
      enabled: true,
      source: 'noop',
      operator,
      condition
    });
    for (let i = 0, len = json.length; i < len; i++) {
      const item = json[i];
      const copy = Array.from(path);
      const value = this._getValue(item, copy);
      if (!value) {
        continue;
      }
      if (cond.checkCondition(value, opts.operator, opts.condition)) {
        return json[i];
      }
    }
  }
  /**
   * Searches for a value in JS Object.
   *
   * @param {Object|Array} json Iterable object
   * @param {Array<String>} path Path for the value
   * @param {ActionIterableObject|Object=} opts Iterable object configuration
   * @return {Object|undefined} Object that matches iterable condition
   * or undefined if none matches the condition.
   */
  _getIterableValueObject(json, path, opts = {}) {
    const type = typeof json;
    if (!json || type === 'string' || type === 'number') {
      return;
    }
    const { operator, condition } = opts;
    const cond = new RequestLogicCondition({
      enabled: true,
      source: 'noop',
      operator,
      condition
    });

    const keys = Object.keys(json);
    for (let i = 0, len = keys.length; i < len; i++) {
      const copy = Array.from(path);
      const item = {};
      item[keys[i]] = json[keys[i]];
      const value = this._getValue(item, copy);
      if (!value) {
        continue;
      }
      if (cond.checkCondition(value, opts.operator, opts.condition)) {
        return json;
      }
    }
  }
}

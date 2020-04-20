import { ActionIterableObject } from './ActionIterableObject.js';
/**
 * A helper class to extract data from an XML response.
 */
export class XmlExtractor {
  /**
   * @constructor
   * @param {String} xml XML string.
   * @param {Array<String>} path Path to the data.
   * @param {?Object} iterator Data iterator
   */
  constructor(xml, path, iterator) {
    /**
     * JS object or array.
     */
    this._data = xml;
    if (typeof path === 'string') {
      path = path.split('.');
    }
    this._path = path;
    this._iterator = new ActionIterableObject(iterator);
  }
  /**
   * Gets a value of the XML type string for given path.
   *
   * @return {String|undefined} Value for given path.
   */
  extract() {
    const parser = new DOMParser();
    const dom = parser.parseFromString(this._data, 'text/xml');
    if (dom.querySelector('parsererror')) {
      return;
    }
    return this._getValue(dom, this._path);
  }
  /**
   * Gets a value for the XML document for given path.
   *
   * @param {Element} dom DOM document.
   * @param {Array<String>} path Path to search for the value.
   * @return {String|undefined} Value for given path.
   */
  _getValue(dom, path) {
    const part = path.shift();
    if (!dom) {
      return;
    }
    if (!part) {
      return dom.innerHTML.trim();
    }
    if (part.trim().indexOf('attr(') === 0) {
      return this._valueForAttr(dom, part);
    }
    let nextPart = path[0];
    let selector = part;
    if (!isNaN(nextPart)) {
      nextPart = Number(nextPart);
      nextPart++;
      selector += ':nth-child(' + nextPart + ')';
      path.shift();
    }
    return this._getValue(dom.querySelector(selector), path);
  }
  /**
   * Reads attribute value for current path.
   *
   * @param {Element} dom DOM element object
   * @param {String} part Current part of the path.
   * @return {String|undefined} Returned value for path or undefined
   * if not found.
   */
  _valueForAttr(dom, part) {
    const match = part.match(/attr\((.+)\)/);
    if (!match) {
      return;
    }
    const attrName = match[1];
    if (!dom.hasAttribute(attrName)) {
      return;
    }
    const attrValue = dom.getAttribute(attrName);
    return attrValue;
  }
}

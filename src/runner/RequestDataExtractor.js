import { HeadersParserMixin } from '@advanced-rest-client/headers-parser-mixin';
import { JsonExtractor } from './JsonExtractor.js';
import { XmlExtractor } from './XmlExtractor.js';
/**
 * A class to extract data from JSON or XML body.
 *
 * The `request` is ARC request object as described in
 * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/
 * api-request-and-response.md#api-request document.
 * It should contain at lease `url`, `method`, `headers`, and `payload`
 *
 * The `response` is a "response" property of the `api-response` custom event
 * as described in
 * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/
 * api-request-and-response.md#api-response.
 * It should contain `status`, `payload`, `headers` and `url` properties.
 * The `url` property should be the final request URL after all redirects.
 *
 * Note: This element uses `URLSearchParams` class which is relatively new
 * interface in current browsers. You may need to provide a polyfill if you
 * are planning to use this component in older browsers.
 *
 * @appliesMixin HeadersParserMixin
 */
export class RequestDataExtractor extends HeadersParserMixin(Object) {
  /**
   * @param {Object} args
   * @param {Object=} args.request ARC request object
   * @param {Object=} args.response ARC response object
   * @param {String=} [args.pathDelimiter='.'] Source path delimiter
   * @param {Array<String>|String=} args.path Source data path. Either array of path segments
   * or full path as string.
   */
  constructor({ request, response, pathDelimiter = '.', path }) {
    super();
    /**
     * Source path delimiter
     * @type {String}
     */
    this.pathDelimiter = pathDelimiter;
    /**
     * Source data path. Either array of path segments
     * or full path as string.
     *
     * @type {Array<String>|String}
     */
    this.path = path;
    /**
     * ARC request object
     * @type {Object}
     */
    this.request = request;
    /**
     * ARC response object
     * @type {Object}
     */
    this.response = response;
  }

  /**
   * Gets the data from selected path.
   *
   * @param {Object=} iterator Iterator model. Used only with response body.
   * @return {String|Number|URLSearchParams|Headers|undefined} Data to be processed
   */
  extract(iterator) {
    let path = this.path;
    if (typeof path === 'string') {
      path = path.split(this.pathDelimiter);
    }
    let source;
    if (path[0] === 'request') {
      source = this.request;
      iterator = undefined;
    } else {
      source = this.response;
    }
    switch (path[1]) {
      case 'url':
        return this._getDataUrl(source.url, path.slice(2));
      case 'headers':
        return this._getDataHeaders(source, path.slice(2));
      case 'status':
        return source.status;
      case 'body':
        return this._getDataPayload(source, path, iterator);
      default:
        throw new Error('Unknown path for source ' + path[0]);
    }
  }
  /**
   * Returns the value for path for given source object
   *
   * @param {String} url An url to parse.
   * @param {?Array<String>} path Path to the object
   * @return {String|URLSearchParams|Number} Value for the path.
   */
  _getDataUrl(url, path) {
    if (!path || path.length === 0 || !url) {
      return url;
    }
    const value = new URL(url);
    switch (path[0]) {
      case 'host':
        return value.host;
      case 'protocol':
        return value.protocol;
      case 'path':
        return value.pathname;
      case 'query':
        return this._readUrlQueryValue(value, path[1]);
      case 'hash':
        return this._readUrlHashValue(value, path[1]);
      default:
        throw new Error('Unknown path in the URL: ' + path);
    }
  }
  /**
   * Reads value of the URL query parameters.
   *
   * The `?` at the beginning of the query string is removed.
   *
   * @param {URL} url The URL object instance
   * @param {?String} param Param name to return. If not set then it returns
   * whole query string value.
   * @return {String} Full query string value if `param` is not set or paramter
   * value. This function does not returns `null` values.
   */
  _readUrlQueryValue(url, param) {
    if (!param) {
      let v = url.search || '';
      if (v[0] === '?') {
        v = v.substr(1);
      }
      return v;
    }
    let value = url.searchParams.get(param);
    if (!value && value !== '') {
      value = undefined;
    }
    return value;
  }
  /**
   * Reads value of the URL hash.
   *
   * The `#` at the beginning of the hash string is removed.
   *
   * If the `param` argument is set then it treats hahs value as a query
   * parameters string and parses it to get the value.
   *
   * @param {URL} url The URL object instance
   * @param {?String} param Param name to return. If not set then it returns
   * whole hash string value.
   * @return {String} Hash parameter or whole hash value.
   */
  _readUrlHashValue(url, param) {
    let value = (url.hash || '').substr(1);
    if (!param) {
      return value;
    }
    const obj = new URLSearchParams(value);
    value = obj.get(param);
    if (!value && value !== '') {
      value = undefined;
    }
    return value;
  }
  /**
   * Returns a value for the headers.
   *
   * @param {Request|Response} source An object to read the url value from.
   * @param {?Array<String>} path Path to the object
   * @return {Headers|String} Value for the path.
   */
  _getDataHeaders(source, path) {
    const headers = this.headersToJSON(source.headers);
    if (!path || !path.length || !path[0] || !headers || !headers.length) {
      return;
    }
    const lowerName = path[0].toLowerCase();
    for (let i = 0, len = headers.length; i < len; i++) {
      if (headers[i].name.toLowerCase() === lowerName) {
        return headers[i].value;
      }
    }
  }
  /**
   * Returns a value for the payload field.
   *
   * @param {Object} source An object to read the url value from.
   * @param {?Array<String>} path Path to the object
   * @param {Object} iterator Iterator model. Used only with response body.
   * @return {String} Value for the path.
   */
  _getDataPayload(source, path, iterator) {
    const ct = this.getContentType(source.headers);
    if (!ct) {
      return;
    }
    if (path[0] === 'request') {
      source = this.request.payload;
    } else {
      source = this.response.payload;
    }
    return this._getPayloadValue(source, ct, path.slice(2), iterator);
  }
  /**
   * Gets a value from a text for current path. Path is part of the
   * configuration object passed to the constructor.
   *
   * @param {String} data Payload value.
   * @param {String} contentType Body content type.
   * @param {Array<String>} path Remaining path to follow
   * @param {Object} iterator Iterator model
   * @return {String|undefined} Value for given path.
   */
  _getPayloadValue(data, contentType, path, iterator) {
    if (!path || !path.length || !data) {
      return data;
    }
    data = String(data);
    if (contentType.indexOf('application/json') !== -1) {
      const extractor = new JsonExtractor(data, path, iterator);
      return extractor.extract();
    }
    if (
      contentType.indexOf('/xml') !== -1 ||
      contentType.indexOf('+xml') !== -1 ||
      contentType.indexOf('text/html') === 0
    ) {
      const extractor = new XmlExtractor(data, path, iterator);
      return extractor.extract();
    }
  }
}

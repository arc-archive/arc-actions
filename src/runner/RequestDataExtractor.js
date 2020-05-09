import * as DataUtils from './DataUtils.js';

/* eslint-disable no-param-reassign */

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
 */
export class RequestDataExtractor {
  /**
   * @param {Object} args
   * @param {Object=} args.request ARC request object
   * @param {Object=} args.response ARC response object
   * @param {String=} [args.pathDelimiter='.'] Source path delimiter
   * @param {Array<String>|String=} args.path Source data path. Either array of path segments
   * or full path as string.
   */
  constructor({ request, response, pathDelimiter = '.', path }) {
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
    let { path } = this;
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
        return DataUtils.getDataUrl(source.url, path.slice(2));
      case 'headers':
        return DataUtils.getDataHeaders(source, path.slice(2));
      case 'status':
        return source.status;
      case 'body':
        return DataUtils.getDataPayload(source, path, iterator, this.request, this.response);
      default:
        throw new Error(`Unknown path ${path[1]} for source ${path[0]}`);
    }
  }
}

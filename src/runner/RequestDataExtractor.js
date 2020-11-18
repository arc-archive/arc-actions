import * as DataUtils from './DataUtils.js';

/* eslint-disable no-param-reassign */

/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ArcBaseRequest} ArcBaseRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCSavedRequest} ARCSavedRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCHistoryRequest} ARCHistoryRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.TransportRequest} TransportRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.Response} Response */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.ErrorResponse} ErrorResponse */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.IteratorConfiguration} IteratorConfiguration */
/** @typedef {import('../types').DataExtractorInit} DataExtractorInit */

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
   * @param {DataExtractorInit} init
   */
  constructor({ request, executedRequest, response, pathDelimiter = '.', path, iterator }) {
    /**
     * Source path delimiter
     * @type {string}
     */
    this.pathDelimiter = pathDelimiter;
    /**
     * Source data path. Either array of path segments
     * or full path as string.
     *
     * @type {string}
     */
    this.path = path;
    /**
     * ARC request object
     * @type {(ArcBaseRequest | ARCSavedRequest | ARCHistoryRequest)}
     */
    this.request = request;
    /**
     * ARC request object
     * @type {TransportRequest}
     */
    this.executedRequest = executedRequest;
    /**
     * ARC response object
     * @type {Response | ErrorResponse}
     */
    this.response = response;

    /**
     * The iterator to search in array values.
     * @type {IteratorConfiguration}
     */
    this.iterator = iterator;
  }

  /**
   * Gets the data from selected path.
   * @return {String|Number|URLSearchParams|Headers|undefined} Data to be processed
   */
  extract() {
    const { path } = this;
    const parts = path.split(this.pathDelimiter);
    const [baseSource, typeSource, ...args] = parts;
    switch (typeSource) {
      case 'url':
        return DataUtils.getDataUrl(this.getUrl(baseSource), args);
      case 'headers':
        return DataUtils.getDataHeaders(this.getHeaders(baseSource), args);
      case 'status':
        return this.response.status;
      case 'body':
        return DataUtils.getDataPayload(this.getBody(baseSource), this.getHeaders(baseSource), args, this.iterator);
      default:
        throw new Error(`Unknown path ${path[1]} for source ${path[0]}`);
    }
  }

  /**
   * @param {string} source The source name 
   * @returns {string} The URL of executed request (or request to be executed)
   */
  getUrl(source) {
    if (source === 'request') {
      return this.request.url;
    }
    return this.executedRequest.url;
  }

  /**
   * @param {string} source The source name 
   * @returns {string} The headers from the request / response
   */
  getHeaders(source) {
    if (source === 'request') {
      return (this.executedRequest || this.request).headers;
    }
    return this.response.headers;
  }
  
  /**
   * @param {string} source The source name 
   * @returns {string | File | Blob | Buffer | ArrayBuffer | FormData} The headers from the request / response
   */
  getBody(source) {
    if (source === 'request') {
      return this.request.payload;
    }
    // @ts-ignore
    return this.response.payload;
  }
}

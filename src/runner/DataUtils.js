import { toJSON, contentType } from '@advanced-rest-client/headers-parser-mixin/src/HeadersParser.js';
import { JsonExtractor } from './JsonExtractor.js';
import { XmlExtractor } from './XmlExtractor.js';

/* eslint-disable no-plusplus */

/**
 * Gets a value from a text for current path. Path is part of the
 * configuration object passed to the constructor.
 *
 * @param {string} data Payload value.
 * @param {string} ct Body content type.
 * @param {string[]} path Remaining path to follow
 * @param {Object} iterator Iterator model
 * @return {String|undefined} Value for given path.
 */
export function getPayloadValue(data, ct, path, iterator) {
  if (!path || !path.length || !data) {
    return data;
  }
  const typedData = String(data);
  if (ct.indexOf('application/json') !== -1) {
    const extractor = new JsonExtractor(typedData, path, iterator);
    return extractor.extract();
  }
  if (
    ct.indexOf('/xml') !== -1 ||
    ct.indexOf('+xml') !== -1 ||
    ct.indexOf('text/html') === 0
  ) {
    const extractor = new XmlExtractor(typedData, path, iterator);
    return extractor.extract();
  }
  return undefined;
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
export function readUrlQueryValue(url, param) {
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
export function readUrlHashValue(url, param) {
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
 * Returns the value for path for given source object
 *
 * @param {String} url An url to parse.
 * @param {?Array<String>} path Path to the object
 * @return {String|URLSearchParams|Number} Value for the path.
 */
export function getDataUrl(url, path) {
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
      return readUrlQueryValue(value, path[1]);
    case 'hash':
      return readUrlHashValue(value, path[1]);
    default:
      throw new Error(`Unknown path in the URL: ${path}`);
  }
}

/**
 * Returns a value for the headers.
 *
 * @param {Request|Response} source An object to read the headers value from.
 * @param {string[]} path Path to the object
 * @return {string|undefined} Value for the path.
 */
export function getDataHeaders(source, path) {
  const headers = toJSON(source.headers);
  if (!path || !path.length || !path[0] || !headers || !headers.length) {
    return undefined;
  }
  const lowerName = path[0].toLowerCase();
  for (let i = 0, len = headers.length; i < len; i++) {
    if (headers[i].name.toLowerCase() === lowerName) {
      return /** @type string */ (headers[i].value);
    }
  }
  return undefined;
}

/**
 * Returns a value for the payload field.
 *
 * @param {Object} source An object to read the url value from.
 * @param {string[]} path Path to the object
 * @param {Object} iterator Iterator model. Used only with response body.
 * @param {Object} request The request object
 * @param {Object=} response The resposne object
 * @return {String} Value for the path.
 */
export function getDataPayload(source, path, iterator, request, response={}) {
  const ct = contentType(source.headers);
  if (!ct) {
    return undefined;
  }
  let data;
  if (path[0] === 'request') {
    data = request.payload;
  } else {
    data = response.payload;
  }
  return getPayloadValue(data, ct, path.slice(2), iterator);
}

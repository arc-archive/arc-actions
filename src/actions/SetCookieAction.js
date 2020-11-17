/* eslint-disable class-methods-use-this */
import { SessionCookieEvents } from '@advanced-rest-client/arc-events';
import { RequestDataExtractor } from '../runner/RequestDataExtractor.js';

/** @typedef {import('../ArcAction').ArcAction} ArcAction */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.SetCookieConfig} SetCookieConfig */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.DataSourceConfiguration} DataSourceConfiguration */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ArcBaseRequest} ArcBaseRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCSavedRequest} ARCSavedRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCHistoryRequest} ARCHistoryRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.TransportRequest} TransportRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.Response} Response */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.ErrorResponse} ErrorResponse */

/**
 * Executes the `set-cookie` action.
 */
export class SetCookieAction {
  /**
   * @param {ArcAction} action The action instance.
   * @param {ArcBaseRequest | ARCSavedRequest | ARCHistoryRequest | TransportRequest} request ARC request object
   * @param {Response|ErrorResponse=} response ARC response object
   * @param {EventTarget} eventTarget An target to use to dispatch DOM events.
   */
  constructor(action, request, response, eventTarget=window) {
    this.action = action;
    this.request = request;
    this.response = response;
    this.eventTarget = eventTarget;
  }

  async execute() {
    const cnf = /** @type SetCookieConfig */ (this.action.config);
    const value = this.readValue(cnf.source);
    await this.setCookie(cnf, String(value));
  }

  /**
   * @param {DataSourceConfiguration} source 
   * @returns {string | number | URLSearchParams | Headers}
   */
  readValue(source) {
    let value;
    if (source.source === 'value') {
      value = source.value;
    } else {
      const extractor = new RequestDataExtractor({
        request: this.request,
        response: this.response,
        path: source.path,
      });
      const it = source.iteratorEnabled ? source.iterator : undefined;
      value = extractor.extract(it);
    }
    return value;
  }

  /**
   * 
   * @param {SetCookieConfig} config 
   * @param {string} value 
   */
  async setCookie(config, value) {
    let url;
    if (config.useRequestUrl) {
      url = this.request.url;
    } else {
      url = config.url;
    }
    const parser = new URL(url);
    const exp = new Date(config.expires);
    await SessionCookieEvents.update(this.eventTarget, {
      name: config.name,
      expires: exp.getTime(),
      hostOnly: config.hostOnly,
      httpOnly: config.httpOnly,
      session: config.session,
      secure: config.secure,
      value,
      domain: parser.hostname,
      path: parser.pathname,
    });
  }
}

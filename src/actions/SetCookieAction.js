/* eslint-disable class-methods-use-this */
import { SessionCookieEvents } from '@advanced-rest-client/arc-events';
import { RequestDataExtractor } from '../runner/RequestDataExtractor.js';
import { ArcExecutable } from './ArcExecutable.js';

/** @typedef {import('../ArcAction').ArcAction} ArcAction */
/** @typedef {import('../types').ArcExecutableInit} ArcExecutableInit */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.SetCookieConfig} SetCookieConfig */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.DataSourceConfiguration} DataSourceConfiguration */


/**
 * Executes the `set-cookie` action.
 */
export class SetCookieAction extends ArcExecutable {
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
      const iterator = source.iteratorEnabled ? source.iterator : undefined;
      const extractor = new RequestDataExtractor({
        request: this.init.request,
        response: this.init.response,
        path: source.path,
        iterator,
      });
      value = extractor.extract();
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
      url = this.init.request.url;
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

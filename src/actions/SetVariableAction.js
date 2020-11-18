/* eslint-disable class-methods-use-this */
import { ArcModelEvents } from '@advanced-rest-client/arc-models';
import { RequestDataExtractor } from '../runner/RequestDataExtractor.js';
import { ArcExecutable } from './ArcExecutable.js';

/** @typedef {import('../ArcAction').ArcAction} ArcAction */
/** @typedef {import('../types').ArcExecutableInit} ArcExecutableInit */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.SetVariableConfig} SetVariableConfig */
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
export class SetVariableAction extends ArcExecutable {
  async execute() {
    const cnf = /** @type SetVariableConfig */ (this.action.config);
    const value = this.readValue(cnf.source);
    await this.setVariable(cnf, String(value));
  }

  /**
   * @param {DataSourceConfiguration} source 
   * @returns {string | number | URLSearchParams | Headers | undefined}
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
   * @param {SetVariableConfig} config 
   * @param {string} value 
   */
  async setVariable(config, value) {
    const { name } = config;
    await ArcModelEvents.Variable.set(this.eventTarget, name, value);
  }
}

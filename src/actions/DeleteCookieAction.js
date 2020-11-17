/* eslint-disable class-methods-use-this */
import { SessionCookieEvents } from '@advanced-rest-client/arc-events';

/** @typedef {import('../ArcAction').ArcAction} ArcAction */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.DeleteCookieConfig} DeleteCookieConfig */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ArcBaseRequest} ArcBaseRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCSavedRequest} ARCSavedRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCHistoryRequest} ARCHistoryRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.TransportRequest} TransportRequest */

/**
 * Executes the `delete-cookie` action.
 */
export class DeleteCookieAction {
  /**
   * @param {ArcAction} action The action instance.
   * @param {ArcBaseRequest | ARCSavedRequest | ARCHistoryRequest | TransportRequest} request ARC request object
   * @param {EventTarget} eventTarget An target to use to dispatch DOM events.
   */
  constructor(action, request, eventTarget=window) {
    this.action = action;
    this.request = request;
    this.eventTarget = eventTarget;
  }

  async execute() {
    const cnf = /** @type DeleteCookieConfig */ (this.action.config);
    let url;
    if (cnf.useRequestUrl) {
      url = this.request.url;
    } else {
      url = cnf.url;
    }
    const name = cnf.removeAll ? undefined : cnf.name;
    await SessionCookieEvents.deleteUrl(this.eventTarget, url, name);
  }
}

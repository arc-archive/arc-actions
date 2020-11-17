import { DeleteCookieAction } from '../actions/DeleteCookieAction.js';
import { SetCookieAction } from '../actions/SetCookieAction.js';

/** @typedef {import('../ArcAction').ArcAction} ArcAction */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ArcBaseRequest} ArcBaseRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCSavedRequest} ARCSavedRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.ARCHistoryRequest} ARCHistoryRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcRequest.TransportRequest} TransportRequest */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.Response} Response */
/** @typedef {import('@advanced-rest-client/arc-types').ArcResponse.ErrorResponse} ErrorResponse */


/**
 * A class that is responsible for running a single action.
 */
export class ActionRunner {
  /**
   * @param {ArcAction} action The action configuration
   * @param {EventTarget} eventTarget An target to use to dispatch DOM events.
   */
  constructor(action, eventTarget) {
    this.action = action;
    this.eventTarget = eventTarget;
  }

  /**
   * Runs the request hook action.
   *
   * @param {ArcBaseRequest | ARCSavedRequest | ARCHistoryRequest | TransportRequest} request ARC request object
   * @param {Response|ErrorResponse=} response ARC response object
   * @return {Promise<void>} Promise resolved when the actions is executed.
   */
  async run(request, response) {
    const { name } = this.action;
    let instance;
    switch (name)  {
      case 'set-cookie': instance = new SetCookieAction(this.action, request, response, this.eventTarget); break;
      case 'delete-cookie': instance = new DeleteCookieAction(this.action, request, this.eventTarget); break;
      default: return;
    }
    await instance.execute();
  }
}

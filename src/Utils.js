import { ArcAction } from './ArcAction.js';

/* eslint-disable no-param-reassign */

/**
 * An enum with supported actions.
 * @readonly
 * @enum {string}
 * @property {string} SetVariable An action to set a variable.
 * @property {string} SetCookie An action to set a cookie.
 * @property {string} DeleteCookie An action to delete a cookie.
 */
export const SupportedActions = {
  SetVariable: 'set-variable',
  SetCookie: 'set-cookie',
  DeleteCookie: 'delete-cookie'
  // SupportedActions.RunRequest: 'run-request',
};

/**
 * Maps an action name to a coresponding label.
 * @param {String} input The action name
 * @return {String} Mapped action label.
 */
export const actionNamesMap = (input) => {
  switch (input) {
    case SupportedActions.SetVariable:
      return 'Set variable';
    case SupportedActions.SetCookie:
      return 'Set cookie';
    case SupportedActions.DeleteCookie:
      return 'Delete cookie';
    // case SupportedActions.RunRequest: return 'Run request';
    default:
      return input;
  }
};

/**
 * Maps actions list to a list of `ArcAction` instances.
 * If an item is not an instance of `ArcAction` then it creates an instance of it
 * by passing the map as an argument.
 *
 * @param {Object[]} value Passed list of actions.
 * @return {ArcAction[]} Mapped actions.
 */
export const mapActions = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => {
    if (!(item instanceof ArcAction)) {
      item = new ArcAction(item);
    }
    return item;
  });
};

/**
 * A list of actions names that are supported by this element.
 * @type {Array<String>}
 */
export const allowedActions = Object.values(SupportedActions);

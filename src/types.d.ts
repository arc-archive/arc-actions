import { ArcAction } from './ArcAction';

/**
 * Values for the condition source
 * @type string
 */
export enum ActionTypeEnum {
  /**
   * The action is relates to a request object
   */
  request = 'request',
  /**
   * The action is relates to a response object
   */
  response = 'response',
}

/**
 * Values for the condition source
 * @type string
 */
export enum ConditionSourceEnum {
  /**
   * The source is the URL.
   */
  url = 'url',
  /**
   * The source is the status code.
   * This should only be used when the source object is ARC Response
   */
  statuscode = 'statuscode',
  /**
   * The source is the headers.
   */
  headers = 'headers',
  /**
   * The source is the payload.
   */
  body = 'body',
  /**
   * The source is specified by the user value.
   */
  value = 'value',
}

/**
 * Possible value for an operator in an condition
 * @type string
 */
export enum OperatorEnum {
  equal = 'equal',
  notequal = 'not-equal',
  greaterthan = 'greater-than',
  greaterthanequal = 'greater-than-equal',
  lessthan = 'less-than',
  lessthanequal = 'less-than-equal',
  contains = 'contains',
  regex = 'regex',
}

export interface ActionConditionViewOptions {
  /**
   * Whether the condition editor is rendered in the "full" view
   * instead of the summary.
   */
  opened?: boolean;
}

/**
 * Definition for a condition that contains actions.
 */
export interface ActionsCondition {
  /**
   * The condition is either request or response related.
   */
  type: ActionTypeEnum;
  /**
   * The source of the data.
   * The type of the data source (request or response) depends on
   * the context at which the condition runs.
   */
  source?: ConditionSourceEnum;
  /**
   * The value to compare to.
   * Usually it is a string. For `statuscode` acceptible value is a number.
   */
  value?: string|number;
  /**
   * The comparison operator.
   */
  operator?: OperatorEnum;
  /**
   * Path to the data to extract the value to test the condition.
   * Only relevant for some `source` options.
   */
  path?: string;
  /**
   * Whether the condition always pass.
   * The condition is not really checked, values can be empty. The condition
   * check always returns `true`.
   */
  alwaysPass: boolean;
  /**
   * Options related to the UI state in the application.
   */
  view?: ActionConditionViewOptions;
}

/**
 * Definition of options for the `ArcActions` class.
 */
export interface ArcActionsOptions {
  /**
   * List of action added to the condition.
   */
  actions?: ArcAction[];
  /**
   * Whether the condition and therefore actions are enabled.
   */
  enabled?: boolean;
}

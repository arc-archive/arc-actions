import { ConditionSchema, ArcActionsOptions } from './types';
import { ARCHistoryRequest } from '@advanced-rest-client/arc-models';
import { ArcAction } from './ArcAction';

/**
 * A class that represents ARC actions that run after meeting a condition.
 */
export declare class ActionCondition {
  /**
   * Creates a default value for a condition.
   * @param defType The type of the condition.
   */
  static defaultCondition(defType?: string): ConditionSchema;

  /**
   * Creates a list of actions from an external source.
   */
  static importExternal(actions: any[]): ActionCondition[];

  /**
   * @return {ActionCondition} Instance of ActionCondition from passed values.
   */
  static importAction(item: any): ArcAction;
  
  condition: ConditionSchema;
  
  type: string;
  
  actions: ArcAction[];
  
  enabled: boolean;
  /**
   * @param condition The condition definition
   * @param type The type of actions held in the `actions`. Either `request` or `response`.
   * @param opts Optional parameters
   */
  constructor(condition: ConditionSchema, type: string, opts?: ArcActionsOptions);

  /**
   * Tests whether the condition is satisfied for request and/or response.
   *
   * @param request The ARC request object.
   * @param response The ARC response object, if available.
   * @returns True when the condition is satisfied.
   */
  satisfied(request: ARCHistoryRequest, response: Object): boolean;

  /**
   * Adds a new, empty action to the list of actions.
   * If actions list hasn't been initialized then it creates it.
   *
   * @param name The name of the action to add.
   */
  add(name: string): void;
  /**
   * Makes a clone of the condition with actions.
   * @returns A deep copy of this object.
   */
  clone(): ActionCondition;
}

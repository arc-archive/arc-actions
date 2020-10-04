import { ActionConfiguration, ArcActionViewConfiguration, ArcActionConfiguration } from './types';

/**
 * A class describing a runnable action in Advanced REST Client.
 *
 * The difference to using regular object is that it contains utility methods
 * for generating JSON and cloning the object.
 */
export declare class ArcAction {
  /**
   * Type of the action. Can be either `request` or `response`. Default to
   * request.
   */
  type: string;
  /**
   * Action name.
   */
  name: string;
  /**
   * Whether the action is enabled.
   */
  enabled: boolean;
  /**
   * Action priority
   */
  priority: number;
  /**
   * Action configuration
   */
  config: ActionConfiguration;
  /**
   * Whether or not the action is executed synchronously to request / response
   */
  sync: boolean;
  /**
   * Whether or not the request should fail when the action fails.
   */
  failOnError: boolean;
  /**
   * The view configuration
   */
  view: ArcActionViewConfiguration;
  /**
   * @param init The initialization object with predefined values
   */
  constructor(init: ArcActionConfiguration);

  /**
   * Returns a clone if this object.
   */
  clone(): ArcAction;
}

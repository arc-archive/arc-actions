export type OperatorEnum = "equal" | "not-equal" | "greater-than" | "greater-than-equal" | "less-than" | "less-than-equal" | "contains" | "regex";
export type RequestDataSourceEnum = "request.url" | "request.method" | "request.headers" | "request.body";
export type ResponseDataSourceEnum = "response.url" | "response.method" | "response.headers" | "response.body";

export declare interface IteratorConfiguration {
  /**
   * The path to the property to use in the comparison.
   */
  path: string;
  /**
   * The value of the condition.
   */
  condition: string;
  /**
   * The comparison operator.
   */
  operator: OperatorEnum;
}

export declare interface DataSourceConfiguration {
  /**
   * Source of the data.
   */
  source: RequestDataSourceEnum|ResponseDataSourceEnum;
  /**
   * When set the iterator configuration is enabled
   */
  iteratorEnabled?: boolean;
  /**
   * Array search configuration.
   */
  iterator?: IteratorConfiguration;
  /**
   * The path to the data. When `iteratorEnabled` is set then this
   * is a path counting from an array item. When not set an entire value of `source` is used.
   */
  path?: string;
}

export declare interface SetCookieConfig {
  /**
   * Name of the cookie
   */
  name: string;
  /**
   * Source of the cookie value
   */
  source: DataSourceConfiguration;
  /**
   * When set it uses request URL instead of defined URL in the action
   */
  useRequestUrl?: boolean;
  /**
   * An URL associated with the cookie
   */
  url?: string;
  /**
   * The cookie expiration time
   */
  expires?: string;
  /**
   * Whather the cookie is host only
   */
  hostOnly?: boolean;
  /**
   * Whather the cookie is HTTP only
   */
  httpOnly?: boolean;
  /**
   * Whather the cookie is HTTPS only
   */
  secure?: boolean;
  /**
   * Whather the cookie is a session cookie
   */
  session?: boolean;
}

export declare interface SetVariableConfig {
  /**
   * Name of the variable to set
   */
  name: string;
  /**
   * Source of the cookie value
   */
  source: DataSourceConfiguration;
}

export declare interface DeleteCookieConfig {
  /**
   * When set it uses request URL instead of defined URL in the action.
   */
  useRequestUrl?: boolean;
  /**
   * An URL associated with the cookie.
   * Only used when `useRequestUrl` is not `true`.
   */
  url?: string;
  /**
   * When set it removes all cookies associated wit the URL.
   */
  removeAll?: boolean;
  /**
   * Name of the cookie to remove.
   */
  name?: string;
}

/**
 * Convenience type that gathers all configurations in one type.
 */
export type ActionConfiguration = SetCookieConfig | SetVariableConfig | DeleteCookieConfig;

/**
 * An UI controlling configuration for an action.
 */
export declare interface ArcActionViewConfiguration {
  /**
   * Whether the action is "opened" in the editor UI.
   */
  opened?: boolean;
}

export type TypeEnum = "request" | "response";

/**
 * An enum representing a list of supported in this runner/editor actions.
 */
export type SupportedActions = "set-variable" | "set-cookie" | "delete-cookie";

/**
 * ARC Action configuration object.
 */
export declare interface ArcActionConfiguration {
  /**
   * Type of the action.
   * Can be either `request` or `response`. Default to request.
   */
  type: TypeEnum;
  /**
   * Action name. Default to `null` which is an unknown action.
   */
  name?: SupportedActions;
  /**
   * Whether the action is enabled. `false` by default.
   */
  enabled?: boolean;
  /**
   * Execution priority.
   */
  priority?: number;
  /**
   * Action configuration. Might be an empty object but it's required.
   */
  config: ActionConfiguration;
  /**
   * Whether or not the action is executed synchronously.
   */
  sync?: boolean;
  /**
   * Whether the request will fail when the action fails.
   */
  failOnError?: boolean;
  /**
   * View configuration unrelated to action logic.
   */
  view?: ArcActionViewConfiguration;
}

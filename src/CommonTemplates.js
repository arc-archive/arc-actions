import { html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { helpOutline } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.DataSourceConfiguration} DataSourceConfiguration */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.SetCookieConfig} SetCookieConfig */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.SetVariableConfig} SetVariableConfig */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.IteratorConfiguration} IteratorConfiguration */

/**
 * @param {Boolean} [compatibility=false] Compatibility mode flag.
 * @return {TemplateResult} Template for the condition's operator drop down options.
 */
export const operatorOptionsTemplate = (compatibility = false) => {
  return html`
    <anypoint-item data-value="equal" ?compatibility="${compatibility}">Equal</anypoint-item>
    <anypoint-item data-value="not-equal" ?compatibility="${compatibility}">Not equal</anypoint-item>
    <anypoint-item data-value="greater-than" ?compatibility="${compatibility}">Greater than</anypoint-item>
    <anypoint-item data-value="greater-than-equal" ?compatibility="${compatibility}">Greater than or equal</anypoint-item>
    <anypoint-item data-value="less-than" ?compatibility="${compatibility}">Less than</anypoint-item>
    <anypoint-item data-value="less-than-equal" ?compatibility="${compatibility}">Less than or equal</anypoint-item>
    <anypoint-item data-value="contains" ?compatibility="${compatibility}">Contains</anypoint-item>
    <anypoint-item data-value="regex" ?compatibility="${compatibility}">Regular expression</anypoint-item>
  `;
};

/**
 * @typedef {Object} OperatorConfiguration
 * @property {boolean=} outlined
 * @property {boolean=} compatibility
 * @property {boolean=} readOnly
 * @property {boolean=} disabled
 * @property {string=} [name='config.source.iterator.operator']
 */

/**
 * @param {Function} changeHandler A handler for the change event
 * @param {string=} operator Selected operator
 * @param {OperatorConfiguration=} [opts={}] Additional options
 * @return {TemplateResult} Template for the iterator operator drop down.
 */
export const operatorTemplate = (changeHandler, operator, opts = {}) => {
  const {
    name = 'config.source.iterator.operator',
    outlined,
    compatibility,
    disabled,
  } = opts;
  return html`
    <anypoint-dropdown-menu
      aria-label="Select data source"
      required
      autoValidate
      name="${name}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      ?disabled="${disabled}"
    >
      <label slot="label">Condition</label>
      <anypoint-listbox
        slot="dropdown-content"
        tabindex="-1"
        attrforselected="data-value"
        .selected="${operator}"
        ?compatibility="${compatibility}"
        @selected-changed="${changeHandler}"
        data-notify="config"
      >
        ${operatorOptionsTemplate(compatibility)}
      </anypoint-listbox>
    </anypoint-dropdown-menu>
  `;
};

/**
 * @typedef {Object} InputConfiguration
 * @property {any=} type Type of the control
 * @property {any=} autocomplete Whether `autocomplete` is on. Default to `on`.
 * @property {boolean=} outlined
 * @property {boolean=} compatibility
 * @property {boolean=} readOnly
 * @property {boolean=} disabled
 * @property {boolean=} required
 * @property {boolean=} autoValidate
 * @property {string=} notify When set it notifies given path.
 * @property {string=} invalidLabel Invalid message
 * @property {string=} infoLabel Info message
 * @property {object=} classes CSS class names
 */

/**
 * Renders an input element for the action configuration.
 *
 * @param {String} name Input name
 * @param {String} value Current input value
 * @param {String} label The label to render
 * @param {Function} inputHandler Handler for the input event.
 * @param {InputConfiguration=} [opts={}] Optional configuration options
 * @return {TemplateResult}
 */
export const inputTemplate = (name, value, label, inputHandler, opts = {}) => {
  const config = { ...opts };
  config.type = opts.type || 'text';
  if (opts.autocomplete === undefined) {
    config.autocomplete = 'on';
  }
  const { outlined, compatibility, readOnly, disabled } = config;
  return html`
    <anypoint-input
      .value="${value}"
      @input="${inputHandler}"
      name="${name}"
      type="${opts.type}"
      ?required="${opts.required}"
      ?autoValidate="${opts.autoValidate}"
      .autocomplete="${opts.autocomplete}"
      .outlined="${outlined}"
      .compatibility="${compatibility}"
      ?readOnly="${readOnly}"
      ?disabled="${disabled}"
      .invalidMessage="${opts.invalidLabel}"
      .infoMessage="${opts.infoLabel}"
      class="${classMap(opts.classes)}"
      data-notify="${opts.notify}"
    >
      <label slot="label">${label}</label>
    </anypoint-input>
  `;
};

/**
 * @param {Boolean} [compatibility=false] Compatibility mode flag.
 * @return {TemplateResult} Template for the request action's source options
 */
export const requestSourceOptions = (compatibility = false) => {
  return html`
    <anypoint-item data-value="request.url" ?compatibility="${compatibility}">URL</anypoint-item>
    <anypoint-item data-value="request.method" ?compatibility="${compatibility}">Method</anypoint-item>
    <anypoint-item data-value="request.headers" ?compatibility="${compatibility}">Headers</anypoint-item>
    <anypoint-item data-value="request.body" ?compatibility="${compatibility}">Body</anypoint-item>
  `;
};

/**
 * @param {Boolean} [compatibility=false] Compatibility mode flag.
 * @return {TemplateResult} Template for the response action's source options
 */
export const responseSourceOptions = (compatibility = false) => {
  return html`
    <anypoint-item data-value="response.url" ?compatibility="${compatibility}">URL</anypoint-item>
    <anypoint-item data-value="response.status" ?compatibility="${compatibility}">Status code</anypoint-item>
    <anypoint-item data-value="response.headers" ?compatibility="${compatibility}">Headers</anypoint-item>
    <anypoint-item data-value="response.body" ?compatibility="${compatibility}">Body</anypoint-item>
  `;
};

/**
 * @typedef {Object} SourceSelectorConfiguration
 * @property {string=} [name='config.source.source'] The name of the control
 * @property {boolean=} [requestOptions=false] Whether to render request source options
 * @property {boolean=} [responseOptions=false] Whether to render response source options
 * @property {boolean=} outlined
 * @property {boolean=} compatibility
 * @property {boolean=} readOnly
 * @property {boolean=} disabled
 */

/**
 * @param {string} selected Selected option
 * @param {Function} selectHandler Handler for the select event.
 * @param {SourceSelectorConfiguration=} opts Configuration options
 * @return {TemplateResult} Template for the data source selector
 */
export const dataSourceSelector = (selected, selectHandler, opts = {}) => {
  const {
    name = 'config.source.source',
    requestOptions = false,
    responseOptions = false,
    outlined,
    compatibility,
    disabled,
  } = opts;
  return html`
    <anypoint-dropdown-menu
      aria-label="Select data source"
      required
      autoValidate
      name="${name}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      ?disabled="${disabled}"
    >
      <label slot="label">Data source</label>
      <anypoint-listbox
        slot="dropdown-content"
        tabindex="-1"
        attrforselected="data-value"
        .selected="${selected}"
        ?compatibility="${compatibility}"
        @selected-changed="${selectHandler}"
        data-notify="config"
        data-render="true"
      >
        ${requestOptions ? requestSourceOptions(compatibility) : ''}
        ${responseOptions ? responseSourceOptions(compatibility) : ''}
      </anypoint-listbox>
    </anypoint-dropdown-menu>
  `;
};

/**
 * @param {SetCookieConfig|SetVariableConfig} config
 * @param {Function} inputHandler Handler for the input event.
 * @param {InputConfiguration=} inputConfig
 * @return {TemplateResult|string} Template for the data source's path input.
 */
export function dataSourcePathTemplate(config, inputHandler, inputConfig = {}) {
  const configSource = /** @type {DataSourceConfiguration} */ (config.source ||{});
  const { iteratorEnabled = false, path = '', source = '' } = configSource;
  if (['request.method'].indexOf(source) !== -1) {
    return '';
  }
  const label = iteratorEnabled
    ? "Array item's property for the value"
    : 'Path to the value';
  const help = iteratorEnabled
    ? 'Path to the property relative to the array item found in the search.'
    : 'Path to the property that contains the data to extract.';
  const cnf = {
    ...inputConfig,
    notify: 'config',
  };
  const input = inputTemplate(
    'config.source.path',
    path,
    label,
    inputHandler,
    cnf
  );
  return html`
    <div class="form-row">
      ${input}
      <div class="tooltip">
        <span class="icon help">${helpOutline}</span>
        <span class="tooltiptext">
          ${help} Example: "data.property.subproperty".
        </span>
      </div>
    </div>
  `;
}

/**
 * @param {boolean} enabled Whether the data source iterator is enabled
 * @param {Function} changeHandler Handler for the change event (this[configChangeHandlerSymbol])
 * @param {InputConfiguration=} inputConfig
 * @return {TemplateResult} A template for the data array search switch
 */
export function dataIteratorTemplate(enabled, changeHandler, inputConfig = {}) {
  const { compatibility } = inputConfig;
  return html`
    <div class="help-hint-block">
      <anypoint-switch
        ?compatibility="${compatibility}"
        .checked="${enabled}"
        name="config.source.iteratorEnabled"
        data-notify="config"
        data-render="true"
        @change="${changeHandler}"
      >Array search</anypoint-switch>
      <div class="tooltip">
        <span class="icon help">${helpOutline}</span>
        <span class="tooltiptext">
          Allows to search for an item in an array by checking each value
          against a configured condition.
        </span>
      </div>
    </div>
  `;
}

/**
 * @param {Function} inputHandler Handler for the input event.
 * @param {string=} path
 * @param {InputConfiguration=} inputConfig
 * @return {TemplateResult} Template for the iterator path input.
 */
function iteratorPathTemplate(inputHandler, path = '', inputConfig) {
  const cnf = {
    ...inputConfig,
    required: true,
    autoValidate: true,
    notify: 'config',
  };
  const input = inputTemplate(
    'config.source.iterator.path',
    path,
    'Path to the property (required)',
    inputHandler,
    cnf
  );
  return html`
    <div class="form-row">
      ${input}
      <div class="tooltip">
        <span class="icon help">${helpOutline}</span>
        <span class="tooltiptext">
          Path to the property that contains the value to compare. Use star "*"
          to tell where the array items are. Example: data.*.property.
        </span>
      </div>
    </div>
  `;
}

/**
 * @param {Function} inputHandler Handler for the input event.
 * @param {string=} condition
 * @param {InputConfiguration=} inputConfig
 * @return {TemplateResult} Template for the iterator condition input.
 */
export function iteratorConditionTemplate(
  inputHandler,
  condition = '',
  inputConfig
) {
  const cnf = {
    ...inputConfig,
    required: true,
    autoValidate: true,
    notify: 'config',
  };
  return inputTemplate(
    'config.source.iterator.condition',
    condition,
    'Condition value (required)',
    inputHandler,
    cnf
  );
}

/**
 * @return {IteratorConfiguration}
 */
function defaultItConfig() {
  return {
    path: '',
    condition: '',
    operator: 'equal',
  };
}

/**
 * @return {DataSourceConfiguration}
 */
export function defaultSourceConfig() {
  return {
    type: 'request',
    source: 'body',
    iteratorEnabled: false,
    path: '',
  };
}

/**
 * @param {Function} inputHandler Handler for the input event.
 * @param {Function} dataSourceHandler Handler for the data source change event (this[dataSourceHandlerSymbol]).
 * @param {IteratorConfiguration=} config
 * @param {InputConfiguration=} inputConfig
 * @return {TemplateResult|string} Template for the array search configuration view.
 */
export function iteratorTemplate(
  inputHandler,
  dataSourceHandler,
  config = defaultItConfig(),
  inputConfig = {}
) {
  const { path, operator, condition } = config;
  return html`
    <div class="iterator-block">
      ${iteratorPathTemplate(inputHandler, path, inputConfig)}
      ${operatorTemplate(dataSourceHandler, operator, inputConfig)}
      ${iteratorConditionTemplate(inputHandler, condition, inputConfig)}
    </div>
  `;
}

/**
 * @typedef {Object} CheckboxConfiguration
 * @property {boolean=} readOnly
 * @property {boolean=} disabled
 * @property {string=} notify When set it notifies given path.
 * @property {string=} render
 */

/**
 * Renders an input element for the action configuration.
 * @param {string} name
 * @param {boolean} checked
 * @param {string} label
 * @param {Function} changeHandler (this[configChangeHandlerSymbol])
 * @param {CheckboxConfiguration=} opts
 * @return {TemplateResult}
 */
export function configCheckbox(name, checked, label, changeHandler, opts = {}) {
  const { disabled, notify, render } = opts;
  return html`
    <div class="checkbox-container">
      <anypoint-checkbox
        name="${name}"
        ?disabled="${disabled}"
        ?checked="${checked}"
        @change="${changeHandler}"
        data-notify="${notify}"
        data-render="${render}"
        >${label}</anypoint-checkbox
      >
    </div>
  `;
}

/**
 * Renders a template for "fail" checkbox.
 * @param {Function} changeHandler (this[configChangeHandlerSymbol])
 * @param {boolean=} failOnError
 * @param {CheckboxConfiguration=} checkboxOptions
 * @return {TemplateResult}
 */
export function failTemplate(
  changeHandler,
  failOnError = false,
  checkboxOptions = {}
) {
  const cnf = {
    ...checkboxOptions,
    notify: 'config',
  };
  return configCheckbox(
    'failOnError',
    failOnError,
    'Fail when data cannot be set',
    changeHandler,
    cnf
  );
}

import { html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */

/**
 * @param {Boolean} [compatibility=false] Compatibility mode flag.
 * @return {TemplateResult} Template for the condition's operator drop down options.
 */
export const operatorOptionsTemplate = (compatibility=false) => {
  return html`
  <anypoint-item value="equal" ?compatibility="${compatibility}">Equal</anypoint-item>
  <anypoint-item value="not-equal" ?compatibility="${compatibility}">Not equal</anypoint-item>
  <anypoint-item value="greater-than" ?compatibility="${compatibility}">Greater than</anypoint-item>
  <anypoint-item value="greater-than-equal" ?compatibility="${compatibility}">Greater than or equal</anypoint-item>
  <anypoint-item value="less-than" ?compatibility="${compatibility}">Less than</anypoint-item>
  <anypoint-item value="less-than-equal" ?compatibility="${compatibility}">Less than or equal</anypoint-item>
  <anypoint-item value="contains" ?compatibility="${compatibility}">Contains</anypoint-item>
  <anypoint-item value="regex" ?compatibility="${compatibility}">Regular expression</anypoint-item>
  `;
}

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
 * @return {TemplateResult} Template for the iterator's operator drop down.
 */
export const operatorTemplate = (changeHandler, operator, opts={}) => {
  const {
    name='config.source.iterator.operator',
    outlined, compatibility, readOnly, disabled
  } = opts;
  return html`
    <anypoint-dropdown-menu
      aria-label="Select data source"
      required
      autovalidate
      name="${name}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      ?readOnly="${readOnly}"
      ?disabled="${disabled}"
    >
      <label slot="label">Condition</label>
      <anypoint-listbox
        slot="dropdown-content"
        tabindex="-1"
        attrforselected="value"
        .selected="${operator}"
        ?outlined="${outlined}"
        ?compatibility="${compatibility}"
        @selected-changed="${changeHandler}"
        data-notify="config"
      >
        ${operatorOptionsTemplate(compatibility)}
      </anypoint-listbox>
    </anypoint-dropdown-menu>
  `;
}

/**
 * @typedef {Object} InputConfiguration
 * @property {string=} type Type of the control
 * @property {boolean=} autocomplete Whether `autocomplete` is on. Default to `true`.
 * @property {boolean=} outlined
 * @property {boolean=} compatibility
 * @property {boolean=} readOnly
 * @property {boolean=} disabled
 * @property {boolean=} required
 * @property {boolean=} autoValidate
 * @property {boolean=} notify whether to notify the change to the input to the parent
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
    config.autocomplete = true;
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
      ?autocomplete="${opts.autocomplete}"
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
}

/**
 * @param {Boolean} [compatibility=false] Compatibility mode flag.
 * @return {TemplateResult} Template for the request action's source options
 */
export const requestSourceOptions = (compatibility=false) => {
  return html`
    <anypoint-item value="request.url" ?compatibility="${compatibility}">URL</anypoint-item>
    <anypoint-item value="request.method" ?compatibility="${compatibility}">Method</anypoint-item>
    <anypoint-item value="request.headers" ?compatibility="${compatibility}">Headers</anypoint-item>
    <anypoint-item value="request.body" ?compatibility="${compatibility}">Body</anypoint-item>
  `;
}

/**
 * @param {Boolean} [compatibility=false] Compatibility mode flag.
 * @return {TemplateResult} Template for the response action's source options
 */
export const responseSourceOptions = (compatibility=false) => {
  return html`
    <anypoint-item value="response.url" ?compatibility="${compatibility}">URL</anypoint-item>
    <anypoint-item value="response.status" ?compatibility="${compatibility}">Status code</anypoint-item>
    <anypoint-item value="response.headers" ?compatibility="${compatibility}">Headers</anypoint-item>
    <anypoint-item value="response.body" ?compatibility="${compatibility}">Body</anypoint-item>
  `;
}

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
export const dataSourceSelector = (selected, selectHandler, opts={}) => {
  const {
    name = 'config.source.source',
    requestOptions = false,
    responseOptions = false,
    outlined, compatibility, readOnly, disabled,
  } = opts;
  return html`
    <anypoint-dropdown-menu
      aria-label="Select data source"
      required
      autovalidate
      name="${name}"
      ?outlined="${outlined}"
      ?compatibility="${compatibility}"
      ?readOnly="${readOnly}"
      ?disabled="${disabled}"
    >
      <label slot="label">Data source</label>
      <anypoint-listbox
        slot="dropdown-content"
        tabindex="-1"
        attrforselected="value"
        .selected="${selected}"
        ?outlined="${outlined}"
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
}

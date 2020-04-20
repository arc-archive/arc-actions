import { html } from 'lit-element';
import {
  configInput,
  configCheckbox,
  dataSourceSelector,
  dataIteratorTplSymbol,
  iteratorTemplateSymbol,
  dataSourcePathTplSymbol
} from './Utils.js';

export const renderSetVariableEditor = Symbol();
const nameTplSymbol = Symbol();
const sourceTplSymbol = Symbol();
const arraySearchTplSymbol = Symbol();
const failTplSymbol = Symbol();

/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('../ActionEditor.js').DataSourceConfiguration} DataSourceConfiguration */

/**
 * @typedef {Object} SetVariableConfig
 * @property {String} name Name of the cookie to set
 * @property {DataSourceConfiguration} source Source of the cookie value
 */

/**
 * Mixin that adds support for set-variable type action editor.
 *
 * @param {*} superClass
 * @return {*}
 * @mixin
 */
export const SetVariableEditorMixin = (superClass) =>
  class extends superClass {
    [renderSetVariableEditor]() {
      const { config = {} } = this;
      // @ts-ignore
      const dataSourceTemplate = this[dataSourcePathTplSymbol](config);
      return html`
        ${this[nameTplSymbol](config)} ${this[sourceTplSymbol](config)} ${this[arraySearchTplSymbol](config)}
        ${dataSourceTemplate} ${this[failTplSymbol](this)}
      `;
    }
    /**
     * Renders a template for the variable's name input.
     *
     * @param {SetVariableConfig=} config
     * @return {TemplateResult}
     */
    [nameTplSymbol]({ name = '' }) {
      // @ts-ignore
      return this[configInput]('config.name', name, 'Variable name (required)', {
        required: true,
        autoValidate: true,
        notify: 'config'
      });
    }

    /**
     * Renders a template for the data source seelctor.
     * @param {SetVariableConfig} config
     * @return {TemplateResult}
     */
    [sourceTplSymbol](config) {
      const configSource = /** @type {DataSourceConfiguration} */ (config.source || {});
      const { source } = configSource;
      // @ts-ignore
      return this[dataSourceSelector](source);
    }

    /**
     * Renders a template for the array search editor
     * @param {SetVariableConfig} config
     * @return {TemplateResult|string}
     */
    [arraySearchTplSymbol](config) {
      const configSource = /** @type {DataSourceConfiguration} */ (config.source || {});
      const { iteratorEnabled = false, iterator, source = '' } = configSource;
      if (source !== 'request.body') {
        return '';
      }
      // @ts-ignore
      const itTpl = iteratorEnabled ? this[iteratorTemplateSymbol](iterator) : '';
      // @ts-ignore
      return html`
        ${this[dataIteratorTplSymbol](iteratorEnabled)} ${itTpl}
      `;
    }

    /**
     * Renders a template for "fail" checkbox.
     * @param {Object} config
     * @return {TemplateResult}
     */
    [failTplSymbol]({ failOnError = false }) {
      // @ts-ignore
      return this[configCheckbox]('failOnError', failOnError, 'Fail when data cannot be set', {
        notify: 'config'
      });
    }
  };

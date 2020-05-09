import { html } from 'lit-element';
import {
  configInput,
  configCheckbox,
  dataIteratorTplSymbol,
  iteratorTemplateSymbol,
  dataSourcePathTplSymbol,
  dataSourceHandlerSymbol,
} from './Utils.js';

import {
  dataSourceSelector,
} from '../CommonTemplates.js';

export const renderSetVariableEditor = Symbol('renderSetVariableEditor');
const nameTplSymbol = Symbol('nameTplSymbol');
const sourceTplSymbol = Symbol('sourceTplSymbol');
const arraySearchTplSymbol = Symbol('arraySearchTplSymbol');
const failTplSymbol = Symbol('failTplSymbol');

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
      const { type } = this;
      // @ts-ignore
      return dataSourceSelector(source, this[dataSourceHandlerSymbol], {
        requestOptions: type === 'request',
        responseOptions: type === 'response',
      });
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

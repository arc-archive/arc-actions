import { html } from 'lit-element';
import {
  configInput,
  configCheckbox,
  dataSourceSelector,
  dataIteratorTplSymbol,
  iteratorTemplateSymbol,
  dataSourcePathTplSymbol,
} from './Utils.js';

export const renderSetVariableEditor = Symbol();
const nameTplSymbol = Symbol();
const sourceTplSymbol = Symbol();
const arraySearchTplSymbol = Symbol();
const failTplSymbol = Symbol();
/**
 * Mixin that adds support for set-variable type action editor.
 *
 * @param {*} superClass
 * @return {*}
 * @mixin
 */
export const SetVariableEditorMixin = (superClass) => class extends superClass {
  [renderSetVariableEditor]() {
    const { config={} } = this;
    return html`
    ${this[nameTplSymbol](config)}
    ${this[sourceTplSymbol](config)}
    ${this[arraySearchTplSymbol](config)}
    ${this[dataSourcePathTplSymbol](config)}
    ${this[failTplSymbol](this)}
    `;
  }
  /**
   * Renders a template for the variable's name input.
   *
   * @param {Object} config
   * @return {Object}
   */
  [nameTplSymbol]({ name = '' }) {
    // @ts-ignore
    return this[configInput]('config.name', name, 'Variable name (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  /**
   * Renders a template for the data source seelctor.
   * @param {Object} config
   * @return {Object}
   */
  [sourceTplSymbol]({ source = {} }) {
    const { source: dataSource = '' } = source;
    // @ts-ignore
    return this[dataSourceSelector](dataSource);
  }

  /**
   * Renders a template for the array search editor
   * @param {Object} config
   * @return {Object}
   */
  [arraySearchTplSymbol]({ source = {} }) {
    const { iteratorEnabled = false, source: dataSource = '' } = source;
    if (dataSource !== 'request.body') {
      return '';
    }
    // @ts-ignore
    return html`${this[dataIteratorTplSymbol](iteratorEnabled)}
    ${iteratorEnabled ? this[iteratorTemplateSymbol](source.iterator) : ''}
    `;
  }

  /**
   * Renders a template for "fail" checkbox.
   * @param {Object} config
   * @return {Object}
   */
  [failTplSymbol]({ failOnError = false }) {
    // @ts-ignore
    return this[configCheckbox]('failOnError', failOnError, 'Fail when data cannot be set', {
      notify: 'config',
    });
  }
}

import { html } from 'lit-element';
import {
  configInput,
  configCheckbox,
  dataSourceSelector,
  dataIteratorTplSymbol,
  iteratorTemplateSymbol,
} from './Utils.js';

export const renderSetVariableEditor = Symbol();
const nameTplSymbol = Symbol();
const sourceTplSymbol = Symbol();
const arraySearchTplSymbol = Symbol();
const pathTplSymbol = Symbol();
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
    ${this[pathTplSymbol](config)}
    ${this[failTplSymbol](config)}
    `;
  }

  [nameTplSymbol]({ name = '' }) {
    return this[configInput]('config.name', name, 'Variable name (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  [sourceTplSymbol]({ source = {} }) {
    const { source: dataSource = '' } = source;
    return this[dataSourceSelector](dataSource);
  }

  [arraySearchTplSymbol]({ source = {} }) {
    const { iteratorEnabled = false, source: dataSource = '' } = source;
    if (dataSource !== 'request.body') {
      return '';
    }
    return html`
    ${this[dataIteratorTplSymbol](iteratorEnabled)}
    ${iteratorEnabled ? this[iteratorTemplateSymbol](source.iterator) : ''}
    `;
  }

  [pathTplSymbol]({ source = {} }) {
    const { iteratorEnabled = false, path = '', source: dataSource = '' } = source;
    if (['request.method'].indexOf(dataSource) !== -1) {
      return '';
    }
    const label = iteratorEnabled ? 'Array item\'s property for the value' : 'Path to the value';
    return this[configInput]('config.source.path', path, label, {
      notify: 'config',
    });
  }

  [failTplSymbol]({ silent = false }) {
    return this[configCheckbox]('silent', silent, 'Ignore when the property is not found', {
      notify: 'config',
    });
  }
}

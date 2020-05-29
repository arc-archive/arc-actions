import { html } from 'lit-element';

import {
  dataSourceSelector,
  dataSourcePathTemplate,
  inputTemplate,
  dataIteratorTemplate,
  iteratorTemplate,
  failTemplate,
  defaultSourceConfig,
} from '../CommonTemplates.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('../../types').SetVariableConfig} SetVariableConfig */
/** @typedef {import('../../types').DataSourceConfiguration} DataSourceConfiguration */
/** @typedef {import('../CommonTemplates').InputConfiguration} InputConfiguration */

/**
 * @param {string} name Current name value.
 * @param {Function} inputHandler
 * @param {InputConfiguration} inputConfig
 * @return {TemplateResult} The template for the name input.
 */
function nameTemplate(name, inputHandler, inputConfig) {
  const cnf = {
    ...inputConfig,
    required: true,
    autoValidate: true,
    notify: 'config',
  };
  return inputTemplate(
    'config.name',
    name,
    'Variable name (required)',
    inputHandler,
    cnf
  );
}

/**
 * Renders a template for the data source seelctor.
 * @param {string} type
 * @param {DataSourceConfiguration} configSource
 * @param {Function} dataSourceHandler
 * @return {TemplateResult}
 */
function sourceTpl(type, configSource, dataSourceHandler) {
  const { source } = configSource;
  return dataSourceSelector(source, dataSourceHandler, {
    requestOptions: type === 'request',
    responseOptions: type === 'response',
  });
}

/**
 * Renders a template for the array search editor
 * @param {DataSourceConfiguration} configSource
 * @param {Function} inputHandler Handler for the input event.
 * @param {Function} changeHandler Handler for the change event (this[configChangeHandlerSymbol])
 * @param {Function} dataSourceHandler Handler for the data source change event (this[dataSourceHandlerSymbol]).
 * @param {InputConfiguration=} inputConfig
 * @return {TemplateResult|string}
 */
function arraySearchTpl(
  configSource,
  inputHandler,
  changeHandler,
  dataSourceHandler,
  inputConfig
) {
  const { iteratorEnabled = false, iterator, source = '' } = configSource;
  if (source !== 'request.body') {
    return '';
  }
  const itTpl = iteratorEnabled
    ? iteratorTemplate(inputHandler, dataSourceHandler, iterator, inputConfig)
    : '';

  return html`
    ${dataIteratorTemplate(iteratorEnabled, changeHandler, inputConfig)}
    ${itTpl}
  `;
}

/**
 * @param {Boolean} failOnError
 * @param {SetVariableConfig} config
 * @param {string} type Editor type (request or response)
 * @param {Function} inputHandler (this[inputHandlerSymbol])
 * @param {Function} changeHandler (this[configChangeHandlerSymbol])
 * @param {Function} dataSourceHandler (this[dataSourceHandlerSymbol])
 * @param {InputConfiguration=} inputConfig
 * @return {Array<TemplateResult|string>} A template for the set variables editor.
 */
export default function render(
  failOnError,
  config,
  type,
  inputHandler,
  changeHandler,
  dataSourceHandler,
  inputConfig
) {
  const { name, source = defaultSourceConfig() } = config;
  return [
    nameTemplate(name, inputHandler, inputConfig),
    sourceTpl(type, source, dataSourceHandler),
    arraySearchTpl(
      source,
      inputHandler,
      changeHandler,
      dataSourceHandler,
      inputConfig
    ),
    dataSourcePathTemplate(config, inputHandler, inputConfig),
    failTemplate(changeHandler, failOnError, inputConfig),
  ];
}

import { html } from 'lit-element';

import {
  dataSourceSelector,
  dataSourcePathTemplate,
  inputTemplate,
  dataIteratorTemplate,
  iteratorTemplate,
  failTemplate,
  configCheckbox,
  defaultSourceConfig,
} from '../CommonTemplates.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.SetCookieConfig} SetCookieConfig */
/** @typedef {import('@advanced-rest-client/arc-types').Actions.DataSourceConfiguration} DataSourceConfiguration */
/** @typedef {import('../CommonTemplates').InputConfiguration} InputConfiguration */
/** @typedef {import('../CommonTemplates').CheckboxConfiguration} CheckboxConfiguration */

/**
 * Renders a template for the `useRequestUrl` config property.
 *
 * @param {string} type
 * @param {boolean} [useRequestUrl=false]
 * @param {Function} changeHandler (this[configChangeHandlerSymbol])
 * @param {CheckboxConfiguration} inputConfig
 * @return {TemplateResult}
 */
function useRequestUrlTemplate(
  type,
  useRequestUrl = false,
  changeHandler,
  inputConfig
) {
  const label =
    type === 'request' ? 'Use the request URL' : 'Use the final response URL';
  const cnf = {
    ...inputConfig,
    notify: 'config',
    render: 'true',
  };
  return configCheckbox(
    'config.useRequestUrl',
    useRequestUrl,
    label,
    changeHandler,
    cnf
  );
}

/**
 * Renders a template for the cookie's name input.
 *
 * @param {string} [name='']
 * @param {Function} inputHandler
 * @param {InputConfiguration} inputConfig
 * @return {TemplateResult}
 */
function cookieNameTemplate(name = '', inputHandler, inputConfig) {
  const cnf = {
    ...inputConfig,
    required: true,
    autoValidate: true,
    notify: 'config',
  };
  return inputTemplate(
    'config.name',
    name,
    'Cookie name (required)',
    inputHandler,
    cnf
  );
}

/**
 * Renders a template for the cookie's URL input.
 *
 * @param {SetCookieConfig} config
 * @param {Function} inputHandler
 * @param {InputConfiguration} inputConfig
 * @return {TemplateResult|String} Empty string when `useRequestUrl` is set on the config.
 */
function cookieUrlTemplate(
  { useRequestUrl = false, url = '' },
  inputHandler,
  inputConfig
) {
  if (useRequestUrl) {
    return '';
  }
  const cnf = {
    ...inputConfig,
    required: true,
    autoValidate: true,
    notify: 'config',
  };
  return inputTemplate(
    'config.url',
    url,
    'Cookie URL (required)',
    inputHandler,
    cnf
  );
}

/**
 * Renders a template for the "expires" input
 * @param {string} expires
 * @param {Function} inputHandler
 * @param {InputConfiguration} inputConfig
 * @return {TemplateResult}
 */
function cookieExpiresTemplate(expires = '', inputHandler, inputConfig) {
  const cnf = {
    ...inputConfig,
    type: 'datetime-local',
    notify: 'config',
  };
  return inputTemplate('config.expires', expires, 'Expires', inputHandler, cnf);
}

/**
 * Renders a template for the "hostOnly" checkbox
 * @param {boolean} [hostOnly=false]
 * @param {Function} changeHandler (this[configChangeHandlerSymbol])
 * @param {CheckboxConfiguration} inputConfig
 * @return {TemplateResult}
 */
function hostOnlyTemplate(hostOnly = false, changeHandler, inputConfig) {
  const cnf = {
    ...inputConfig,
    notify: 'config',
  };
  return configCheckbox(
    'config.hostOnly',
    hostOnly,
    'Host only',
    changeHandler,
    cnf
  );
}

/**
 * Renders a template for the "httpOnly" checkbox
 * @param {boolean} [httpOnly=false]
 * @param {Function} changeHandler (this[configChangeHandlerSymbol])
 * @param {CheckboxConfiguration} inputConfig
 * @return {TemplateResult}
 */
function httpOnlyTemplate(httpOnly = false, changeHandler, inputConfig) {
  const cnf = {
    ...inputConfig,
    notify: 'config',
  };
  return configCheckbox(
    'config.httpOnly',
    httpOnly,
    'HTTP only',
    changeHandler,
    cnf
  );
}

/**
 * Renders a template for the "secure" checkbox
 * @param {boolean} [secure=false]
 * @param {Function} changeHandler (this[configChangeHandlerSymbol])
 * @param {CheckboxConfiguration} inputConfig
 * @return {TemplateResult}
 */
function secureTemplate(secure = false, changeHandler, inputConfig) {
  const cnf = {
    ...inputConfig,
    notify: 'config',
  };
  return configCheckbox('config.secure', secure, 'Secure', changeHandler, cnf);
}
/**
 * Renders a template for the "secure" checkbox
 * @param {boolean} [session=false]
 * @param {Function} changeHandler (this[configChangeHandlerSymbol])
 * @param {CheckboxConfiguration} inputConfig
 * @return {TemplateResult}
 */
function sessionTemplate(session = false, changeHandler, inputConfig) {
  const cnf = {
    ...inputConfig,
    notify: 'config',
  };
  return configCheckbox(
    'config.session',
    session,
    'Session',
    changeHandler,
    cnf
  );
}

/**
 * Renders a template for the data source selector.
 * @param {string} type
 * @param {DataSourceConfiguration} configSource
 * @param {Function} dataSourceHandler
 * @return {TemplateResult}
 */
function sourceTemplate(type, configSource, dataSourceHandler) {
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
  if (source !== 'body') {
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
 * @param {SetCookieConfig} config
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
  const {
    name,
    useRequestUrl,
    expires,
    hostOnly,
    httpOnly,
    secure,
    session,
    source = defaultSourceConfig(),
  } = config;
  return [
    cookieNameTemplate(name, inputHandler, inputConfig),
    useRequestUrlTemplate(type, useRequestUrl, changeHandler, inputConfig),
    cookieUrlTemplate(config, changeHandler, inputConfig),
    cookieExpiresTemplate(expires, changeHandler, inputConfig),
    hostOnlyTemplate(hostOnly, changeHandler, inputConfig),
    httpOnlyTemplate(httpOnly, changeHandler, inputConfig),
    secureTemplate(secure, changeHandler, inputConfig),
    sessionTemplate(session, changeHandler, inputConfig),
    html`<div class="action-title">Value setting</div>`,
    sourceTemplate(type, source, dataSourceHandler),
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

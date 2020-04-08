import { html } from 'lit-element';
import {
  configInput,
  configCheckbox,
  dataSourceSelector,
  dataIteratorTplSymbol,
  iteratorTemplateSymbol,
} from './Utils.js';

export const renderSetCookieEditor = Symbol();

// Templates
const cnameTplSymbol = Symbol();
const cdomainTplSymbol = Symbol();
const cpathTplSymbol = Symbol();
const cexpiresTplSymbol = Symbol();
const chostOnlyTplSymbol = Symbol();
const chttpOnlyTplSymbol = Symbol();
const csecureTplSymbol = Symbol();
const csessionTplSymbol = Symbol();
const sourceTplSymbol = Symbol();
const arraySearchTplSymbol = Symbol();
const pathTplSymbol = Symbol();
const useRequestUrlTplSymbol = Symbol();
const failTplSymbol = Symbol();
/**
 * Mixin that adds support for set-cookie type action editor.
 *
 * @param {*} superClass
 * @return {*}
 * @mixin
 */
export const SetCookieEditorMixin = (superClass) => class extends superClass {
  [renderSetCookieEditor]() {
    const { config={} } = this;
    return html`
    ${this[cnameTplSymbol](config)}
    ${this[useRequestUrlTplSymbol](config)}
    ${this[cdomainTplSymbol](config)}
    ${this[cpathTplSymbol](config)}
    ${this[cexpiresTplSymbol](config)}
    ${this[chostOnlyTplSymbol](config)}
    ${this[chttpOnlyTplSymbol](config)}
    ${this[csecureTplSymbol](config)}
    ${this[csessionTplSymbol](config)}
    <div class="action-title">Value setting</div>
    ${this[sourceTplSymbol](config)}
    ${this[arraySearchTplSymbol](config)}
    ${this[pathTplSymbol](config)}
    ${this[failTplSymbol](this)}
    `;
  }

  [useRequestUrlTplSymbol]({ useRequestUrl = false }) {
    const label = this.type === 'request' ?
     'Use the request URL' :
     'Use the final response URL';
    return this[configCheckbox]('config.useRequestUrl', useRequestUrl, label, {
      notify: 'config',
      render: 'true',
    });
  }

  [cnameTplSymbol]({ useRequestUrl = false,name = '' }) {
    return this[configInput]('config.name', name, 'Cookie name (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  [cdomainTplSymbol]({ useRequestUrl = false, domain = '' }) {
    if (useRequestUrl) {
      return '';
    }
    return this[configInput]('config.domain', domain, 'Domain (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  [cpathTplSymbol]({ useRequestUrl = false, path = '/' }) {
    if (useRequestUrl) {
      return '';
    }
    return this[configInput]('config.path', path, 'Path (required)', {
      required: true,
      autoValidate: true,
      notify: 'config',
    });
  }

  [cexpiresTplSymbol]({ expires = '' }) {
    return this[configInput]('config.expires', expires, 'Expires', {
      type: 'datetime-local',
      notify: 'config',
    });
  }

  [chostOnlyTplSymbol]({ hostOnly = false }) {
    return this[configCheckbox]('config.hostOnly', hostOnly, 'Host only', {
      notify: 'config',
    });
  }

  [chttpOnlyTplSymbol]({ httpOnly = false }) {
    return this[configCheckbox]('config.httpOnly', httpOnly, 'HTTP only', {
      notify: 'config',
    });
  }

  [csecureTplSymbol]({ secure = false }) {
    return this[configCheckbox]('config.secure', secure, 'Secure', {
      notify: 'config',
    });
  }

  [csessionTplSymbol]({ session = false }) {
    return this[configCheckbox]('config.session', session, 'Session', {
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

  [failTplSymbol]({ failOnError = false }) {
    return this[configCheckbox]('failOnError', failOnError, 'Fail when data cannot be set', {
      notify: 'config',
    });
  }
}

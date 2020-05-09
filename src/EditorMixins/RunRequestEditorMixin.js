import { html } from 'lit-element';

export const renderRunRequestEditor = Symbol('renderRunRequestEditor');

/**
 * Mixin that adds support for run-request type action editor.
 *
 * @param {*} superClass
 * @return {*}
 * @mixin
 */
export const RunRequestEditorMixin = (superClass) => class extends superClass {
  [renderRunRequestEditor]() {
    return html``;
  }
}

import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

anypoint-input {
  display: inline-flex;
  width: auto;
  max-width: 700px;
  margin: 8px 8px 12px 8px;
}

anypoint-input[type=number] {
  width: auto;
  max-width: 200px;
}

.action-card {
  margin: 8px 12px;
}

.action-card.opened {
  box-shadow: var(--box-shadow-2dp);
  padding: 8px;
}

.action-card.closed {
  display: flex;
  align-items: center;
  background-color: #E0E0E0;
  padding-left: 8px;
}

.closed strong {
  margin: 0 4px;
}

.action-footer {
  display: flex;
  align-items: center;
  padding-top: 20px;
}

.action-delete,
.action-open,
.action-help {
  margin-left: auto;
}

.editor-contents {

}

anypoint-dropdown-menu {
  margin: 8px;
}

.form-row,
.help-hint-block {
  display: flex;
  align-items: center;
}

.form-row > anypoint-input {
  flex: 1;
}

.icon.help {
  color: var(--primary-color);
  cursor: help;
}
`;

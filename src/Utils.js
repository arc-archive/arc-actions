/**
 * Maps an action name to a coresponding label.
 * @param {String} input The action name
 * @return {String} Mapped action label.
 */
export const actionNamesMap = (input) => {
  switch (input) {
    case 'set-variable': return 'Set variable';
    case 'set-cookie': return 'Set cookie';
    case 'delete-cookie': return 'Delete cookie';
    case 'run-request': return 'Run request';
    default:
      return input;
  }
};

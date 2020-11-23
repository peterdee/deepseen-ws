import chalk from 'chalk';

/**
 * Show a custom console log
 * @param {string} string - data to show
 * @param {boolean} isError - if the shown message is an error
 * @returns {void}
 */
export default (string = '', isError = false) => console.log(
  isError
    ? chalk.black.bgRedBright(string)
    : chalk.black.bgGreenBright(string),
);

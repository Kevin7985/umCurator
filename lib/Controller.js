class Controller {
  constructor() { }

  getAction(actionName, actionArgs = []) {
    actionName = actionName.toLowerCase();
    const methodName = `${actionName}Action`;

    if (!this[methodName]) {
      throw `there is no such action method as: ${methodName}`;
    }

    this[methodName](actionArgs);
  }
}

module.exports = Controller;
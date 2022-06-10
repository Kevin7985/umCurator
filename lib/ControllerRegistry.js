class ControllerRegistry {
  static instance = null;

  #controllers = new Map();

  constructor() {
    if (ControllerRegistry.instance) {
      return ControllerRegistry.instance;
    }

    ControllerRegistry.instance = this;
  }

  getController(controllerName) {
    controllerName = controllerName.toLowerCase();
    controllerName = controllerName.charAt(0).toLowerCase() + controllerName.slice(1);

    if (!this.#controllers.has(controllerName)) {
      this.#controllers.set(controllerName, new (require(`../Controllers/${controllerName}Controller`))());
    }

    return this.#controllers.get(controllerName);
  }
}

module.exports = ControllerRegistry;
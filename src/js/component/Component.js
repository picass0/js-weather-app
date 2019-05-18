/**
 * abstract parent of all components, should not be instantiated
 */
class Component {

    constructor (domContainer) {
        if (!domContainer) {
            domContainer = document.createElement('div')
        }
        this.domContainer = domContainer;
    }

    clear (container = null) {
        if (!container) {
            container = this.domContainer
        }

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    getDomContainer() {
        return this.domContainer;
    }
}

export default Component;
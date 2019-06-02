/**
 * abstract parent of all components, should not be instantiated
 */
class Component {

    /**
     *
     * @param {HTMLElement|null} domContainer
     */
    constructor (domContainer) {
        if (!domContainer) {
            domContainer = document.createElement('div')
        }
        this.domContainer = domContainer;
    }

    /**
     *
     * @param {HTMLElement|null} container
     */
    clear (container = null) {
        if (!container) {
            container = this.domContainer
        }

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    /**
     * @returns {HTMLElement}
     */
    getDomContainer() {
        return this.domContainer;
    }
}

export default Component;
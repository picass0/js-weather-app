import CustomEvent from '../polyfill/CustomEvent';

/**
 * Simple wrapper around DOM element
 * allows firing events and subscribing to events
 */
class EventDispatcher {

    /**
     * @param {HTMLElement} domElement - dom element to which events are bound
     */
    constructor (domElement) {
        this.domElement = domElement;
    }

    /**
     * subscribe to event
     *
     * @param {string} eventType
     * @param {function(Object)} handler
     */
    subscribe(eventType, handler) {
        this.domElement.addEventListener(eventType, event => {
            handler(event.detail);
        });
    }

    /**
     * @param {string} eventType
     * @param {Object} data
     */
    publish (eventType, data) {
        const event = new CustomEvent(eventType, {detail: data});
        this.domElement.dispatchEvent(event);
    }
}

export default EventDispatcher;
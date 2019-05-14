if ( typeof window.CustomEvent === "function" ) {
    const CustomEvent = window.CustomEvent;
} else {
    const CustomEvent = function ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
}

export default CustomEvent;
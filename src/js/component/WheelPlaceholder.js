import Component from './Component';

class WheelPlaceholder extends Component{

    constructor () {
        super();
        this.domContainer.classList.add('loading-wheel__container');
    }

    render() {
        this.clear();

        const wheel = document.createElement('img');
        wheel.classList.add('loading-wheel');
        wheel.setAttribute('src', '/assets/loading-wheel.gif');

        this.domContainer.appendChild(wheel);
    }
}

export default WheelPlaceholder
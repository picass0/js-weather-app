import Component from './Component';
import wheelUrl from '../../assets/loading-wheel.gif';

class WheelPlaceholder extends Component{

    constructor () {
        super();
        this.domContainer.classList.add('loading-wheel__container');
    }

    render() {
        this.clear();

        const wheel = document.createElement('img');
        wheel.classList.add('loading-wheel');
        wheel.setAttribute('src', wheelUrl);

        this.domContainer.appendChild(wheel);
    }
}

export default WheelPlaceholder
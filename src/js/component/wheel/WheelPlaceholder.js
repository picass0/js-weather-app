import Component from '../Component';
import wheelUrl from '../../../assets/loading-wheel.gif';

import './WheelPlaceholder.scss';

class WheelPlaceholder extends Component{

    constructor () {
        super();
        this.domContainer.classList.add('wheel-placeholder__container');
    }

    render() {
        this.clear();

        const wheel = document.createElement('img');
        wheel.classList.add('wheel-placeholder');
        wheel.setAttribute('src', wheelUrl);

        this.domContainer.appendChild(wheel);
    }
}

export default WheelPlaceholder
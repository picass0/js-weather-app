import Component from './Component';

class WheelPlaceholder extends Component{
    render() {
        this.clear();

        const div = document.createElement('div');
        div.classList.add('card');

        const wheel = document.createElement('span');
        wheel.textContent = 'Wheel';

        div.appendChild(wheel);

        this.domContainer.appendChild(div);
    }
}

export default WheelPlaceholder
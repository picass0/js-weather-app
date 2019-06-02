import Component from '../Component';

import './Flash.scss';

class Flash extends Component{

    constructor () {
        super();
        this.domContainer.classList.add('flash');
    }

    render (messages) {
        this.clear();

        messages.forEach((message) => {
            const p = document.createElement('p');
            p.textContent = message;
            p.classList.add('flash__item');
            this.domContainer.appendChild(p);
        });

        this.domContainer.style.display = 'block';
        setTimeout(() => {
            this.domContainer.style.display = 'none';
        }, 3000)

    }
}

export default Flash;
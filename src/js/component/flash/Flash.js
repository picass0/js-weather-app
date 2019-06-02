import Component from '../Component';

import './Flash.scss';

class Flash extends Component{

    constructor () {
        super();
    }

    render (messages) {
        this.clear();

        const container = document.createElement('div');
        container.classList.add('flash');

        messages.forEach((message) => {
            const p = document.createElement('p');
            p.textContent = message;
            p.classList.add('flash__item');
            container.appendChild(p);
        });

        this.domContainer.appendChild(container);

        container.style.display = 'block';
        setTimeout(() => {
            container.style.display = 'none';
        }, 3000);



    }
}

export default Flash;
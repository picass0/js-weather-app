import Component from '../Component';

import './Flash.scss';

/**
 * Component for displaying flash messages
 * for now supports only errors
 */
class Flash extends Component{

    /**
     * @param {string[]} messages
     */
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
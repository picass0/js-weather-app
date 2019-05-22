import Component from './Component';

class FlashComponent extends Component{

    render (messages) {
        this.clear();

        messages.forEach((message) => {
            const p = document.createElement('p');
            p.textContent = message;
            p.style.color = 'red';
            this.domContainer.appendChild(p);
        });

        this.domContainer.style.display = 'block';
        setTimeout(() => {
            this.domContainer.style.display = 'none';
        }, 3000)

    }
}

export default FlashComponent;
import Component from './Component';

/**
 * component that renders add city form
 */
class AddCityForm extends Component {

    constructor () {
        const domContainer = document.createElement('form');
        super(domContainer);
    }

    render (addCityHanddler) {
        const textField = document.createElement('input');
        textField.setAttribute('type', 'text');
        this.domContainer.appendChild(textField);

        const addCityButton = document.createElement('button');
        addCityButton.textContent = 'Добавить город';
        this.domContainer.appendChild(addCityButton);

        const errorBox = document.createElement('ul');
        errorBox.style.display = 'none';
        this.domContainer.appendChild(errorBox);
        this.errorBox = errorBox;

        this.domContainer.addEventListener('submit', (e) => {
            e.preventDefault();
            addCityHanddler(textField.value);
        });

        textField.addEventListener('input', () => {
            if (this.errorBox.style.display === 'none') {
                return;
            }

            this.clear(this.errorBox);
            this.errorBox.style.display = 'none';
        })
    }

    /**
     * displays validation errors
     * @param {string[]} errors
     */
    displayValidationErrors(errors) {
        this.clear(this.errorBox);
        errors.forEach((error) => {
            const li = document.createElement('li');
            li.style.color = 'red';
            li.textContent = error;
            this.errorBox.appendChild(li);
        });

        this.errorBox.style.display = 'block';
    }
}

export default AddCityForm;
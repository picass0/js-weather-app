import Component from './Component';

/**
 * component that renders add city form
 */
class AddCityForm extends Component {

    constructor (eventDispatcher) {
        const domContainer = document.createElement('form');
        domContainer.classList.add('add-city-form');
        super(domContainer);
        this.eventDispatcher = eventDispatcher;
    }

    render (addCityHanddler) {

        const textField = document.createElement('input');
        textField.classList.add('form-text-field', 'add-city-form__item');
        textField.setAttribute('type', 'text');
        textField.setAttribute('placeholder', 'Название города');
        this.domContainer.appendChild(textField);
        this.textField = textField;

        const errorBox = document.createElement('ul');
        errorBox.style.display = 'none';
        errorBox.classList.add('add-city-form__error-box', 'add-city-form__item');
        this.domContainer.appendChild(errorBox);
        this.errorBox = errorBox;

        const addCityButton = document.createElement('button');
        addCityButton.classList.add('submit-button', 'add-city-form__item');
        addCityButton.textContent = 'Добавить';
        this.domContainer.appendChild(addCityButton);

        this.domContainer.addEventListener('submit', (e) => {
            e.preventDefault();
            addCityHanddler(textField.value);
        });

        textField.addEventListener('input', () => {
            this.eventDispatcher.publish('textChanged', this.textField.value);
            this.eventDispatcher.publish('clearValidationErrors', true);
            this.clearErrors();
        });

        this.eventDispatcher.subscribe('textChanged', (newValue) => {
            if (this.textField.value === newValue) {
                return;
            }

            this.textField.value = newValue;
            this.eventDispatcher.publish('clearValidationErrors', true);
            this.clearErrors();
        });

        this.eventDispatcher.subscribe('clearValidationErrors', () => {
            this.clearErrors();
        })
    }

    clearErrors () {
        if (this.errorBox.style.display === 'none') {
            return;
        }

        this.clear(this.errorBox);
        this.errorBox.style.display = 'none';
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
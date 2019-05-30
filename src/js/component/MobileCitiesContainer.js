import CitiesContainer from "./CitiesContainer";

class MobileCitiesContainer extends CitiesContainer {

    constructor(handlerFactories, eventDispatcher) {
        super(handlerFactories, eventDispatcher);
        this.domContainer.classList.add('mobile-cities__container')
    }

    render(newState) {
        this.clear();

        const backdrop = document.createElement('div');
        backdrop.classList.add('backdrop');
        this.domContainer.appendChild(backdrop);

        const visiblePartContainer = document.createElement('div');
        visiblePartContainer.classList.add('mobile-cities');

        const toggleButton = document.createElement('button');
        toggleButton.classList.add('toggle-button');

        for (let i = 0; i < 3; i++) {
            const bar = document.createElement('span');
            bar.classList.add('toggle-button__bar');
            toggleButton.appendChild(bar);
        }
        let div = document.createElement('div');
        div.classList.add('mobile-cities__item');
        div.appendChild(toggleButton);
        visiblePartContainer.appendChild(div);

        const activeCity = document.createElement('span');
        activeCity.classList.add('city--active-mobile-visible');
        activeCity.textContent = !!newState.getActiveCity() ? newState.getActiveCity().getNameOrStateIfNotExists() : 'Нет активного города';
        div = document.createElement('div');
        div.classList.add('mobile-cities__item');
        div.appendChild(activeCity);
        visiblePartContainer.appendChild(div);

        this.domContainer.appendChild(visiblePartContainer);

        const cityListContainer = document.createElement('div');
        cityListContainer.classList.add('mobile-city-list');
        this.domContainer.appendChild(cityListContainer);

        super.createContent(newState, cityListContainer);

        toggleButton.addEventListener('click', () => {
            backdrop.style.display = 'block';
            cityListContainer.style.display = 'flex';
        });


        backdrop.addEventListener('click', () => {
            cityListContainer.style.display = 'none';
            backdrop.style.display = 'none';
        })
    }
}

export default MobileCitiesContainer;
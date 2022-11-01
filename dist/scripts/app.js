const searchForm = document.querySelector('form');
const geolocateBtn = document.querySelector('input[type="button"]');
const exampleLocationBtn = document.querySelectorAll('.location-btn');

class Alert {
	static error(text) {
		const alertEl = document.createElement('p');
		alertEl.className = 'alert alert-danger my-2';
		alertEl.textContent = text;
		return alertEl;
	}

	static delete(alertNode) {
		setTimeout(() => {
			alertNode.remove();
		}, 4000);
	}
}

class WeatherHelper {
	static key = 'DXPVEQXAYELLSLDQKVAES7RFU';

	static createNextDayForecast(data) {
		const nextDaysCard = document.createElement('div');
		nextDaysCard.className =
			'd-flex justify-content-between p-3 next-days-card';

		const currentTemp = data.currentConditions.temp;

		currentTemp > 24
			? nextDaysCard.classList.add('bg-secondary-toned')
			: nextDaysCard.classList.add('bg-primary-toned');

		for (let i = 1; i < 6; i++) {
			const dayCard = document.createElement('div');
			dayCard.className = 'd-flex flex-column align-items-center mx-2';

			const dateEl = document.createElement('p');
			dateEl.className = 'text-black fs-6 m-0';
			dateEl.textContent = data.days[i].datetime.slice(5);

			const cardImg = document.createElement('img');
			cardImg.setAttribute(
				'src',
				`dist/img/weather-icons/${data.days[i].icon}.svg`
			);
			currentTemp > 24
				? (cardImg.className = 'little-card-img svg-secondary my-2')
				: (cardImg.className = 'little-card-img svg-primary my-2');

			const temperatureEl = document.createElement('p');
			temperatureEl.className = 'text-black fw-bold fs-6 m-0';
			temperatureEl.textContent = data.days[i].temp + 'ºC';

			dayCard.append(dateEl, cardImg, temperatureEl);
			nextDaysCard.append(dayCard);
		}

		return nextDaysCard;
	}

	static render(data, type) {
		const nextDaysCard = document.getElementById('next-days-forecast');
		nextDaysCard.innerHTML = '';
		const card = document.getElementById('weather-card');
		card.innerHTML = '';

		const imgEl = document.createElement('img');
		imgEl.setAttribute(
			'src',
			`dist/img/weather-icons/${data.currentConditions.icon}.svg`
		);
		imgEl.setAttribute('alt', 'Weather condition icon');
		imgEl.classList.add('weather-card-img');

		const conditionEl = document.createElement('p');
		conditionEl.innerText = data.currentConditions.conditions;
		conditionEl.className = 'text-black fw-bold fs-3 my-1';

		const temperatureEl = document.createElement('p');
		temperatureEl.innerText = data.currentConditions.temp + 'ºC';
		temperatureEl.className = 'text-black fs-4 my-1';

		const humidityEl = document.createElement('p');
		humidityEl.textContent = data.currentConditions.humidity + '%';
		humidityEl.className = 'text-black';

		if (data.currentConditions.temp > 24) {
			card.classList.remove('bg-primary-pastel');
			card.classList.add('bg-secondary-pastel');
			imgEl.classList.add('svg-secondary');
		} else {
			card.classList.remove('bg-secondary-pastel');
			card.classList.add('bg-primary-pastel');
			imgEl.classList.add('svg-primary');
		}

		card.classList.remove('justify-content-center');
		card.classList.add('flex-column', 'align-items-center');

		const nextDaysForecast = this.createNextDayForecast(data);

		if (type === 'place') {
			const addressEl = document.createElement('p');
			addressEl.textContent = data.address;
			addressEl.className = 'text-black text-capitalize fs-5 fw-semibold my-1';
			card.append(addressEl, imgEl, conditionEl, temperatureEl, humidityEl);
			nextDaysCard.append(nextDaysForecast);
		}

		if (type === 'coords') {
			const addressEl = document.createElement('p');
			addressEl.textContent = 'Your location';
			addressEl.className = 'text-black text-capitalize fs-5 fw-semibold my-1';
			card.append(addressEl, imgEl, conditionEl, temperatureEl, humidityEl);
			nextDaysCard.append(nextDaysForecast);
		}
	}

	static getWeather = async function (data, type) {
		if (type === 'coords') {
			const weatherResponse = await fetch(
				`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${data.lat}%2C${data.lon}?unitGroup=metric&elements=datetime%2Caddress%2Ctemp%2Chumidity%2Cconditions%2Cicon&include=days%2Cfcst%2Ccurrent&key=${this.key}&contentType=json`
			);
			const weatherData = await weatherResponse.json();
			this.render(weatherData, type);
		}

		if (type === 'place') {
			const weatherResponse = await fetch(
				`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${data}?unitGroup=metric&elements=datetime%2Caddress%2Ctemp%2Chumidity%2Cconditions%2Cicon&include=days%2Cfcst%2Ccurrent&key=${this.key}&contentType=json`
			);
			const weatherData = await weatherResponse.json();
			console.log(weatherData);
			this.render(weatherData, type);
		}
	};

	static getWeatherByCoords() {
		if (!navigator.geolocation) {
			alert(
				"This functions isn't avaliable in your browser, try with another one!"
			);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (successResult) => {
				const coords = {
					lat: successResult.coords.latitude,
					lon: successResult.coords.longitude,
				};
				this.getWeather(coords, 'coords');
			},
			(error) => {
				alert('Could not locate you. Please enter an address manually');
			}
		);
	}

	static getWeatherByPlace(ev) {
		ev.preventDefault();
		const inputEl = ev.target.querySelector('input');

		if (inputEl.value.trim() === '') {
			const alert = Alert.error('Type a city to see the weather!');
			ev.target.insertAdjacentElement('beforeend', alert);
			const createdAlert = ev.target.querySelector('p');
			Alert.delete(createdAlert);
			return;
		}

		const inputValue = inputEl.value;
		WeatherHelper.getWeather(inputValue, 'place');
	}
}

searchForm.addEventListener('submit', (ev) => {
	WeatherHelper.getWeatherByPlace(ev);
});

geolocateBtn.addEventListener('click', () => {
	WeatherHelper.getWeatherByCoords();
});

exampleLocationBtn.forEach((btn) => {
	btn.addEventListener('click', (ev) => {
		const location = ev.target.value;
		WeatherHelper.getWeather(location, 'place');
	});
});

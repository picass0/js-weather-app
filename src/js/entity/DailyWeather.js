class DailyWeather {
    constructor(data) {
        this.description = data.description;
        this.icon = data.icon;
        this.date = data.date;
        this.time = data.time;
        this.maxTemperature = data.maxTemperature;
        this.minTemperature = data.minTemperature;
        this.precipitation = data.precipitation;
        this.humidity = data.humidity;
        this.wind = data.wind
    }
}

export default DailyWeather;
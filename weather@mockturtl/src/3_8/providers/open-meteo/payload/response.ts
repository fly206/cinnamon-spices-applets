import { DateTime } from "luxon";
import { WeatherData } from "../../../types";
import { OpenMeteoCurrentWeather, OpenMeteoCurrentWeatherToData } from "./current";
import { OpenMeteoDailyWeather, OpenMeteoDailyWeatherToData } from "./daily";
import { OpenMeteoHourWeather, OpenMeteoHourWeatherToData } from "./hour";

export interface OpenMeteoWeatherResponse {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	/**
	 * meters
	 */
	elevation: number;
	/** Provided but not needed, we know */
	current_units: unknown;
	current: OpenMeteoCurrentWeather;
	/** Provided but not needed, we know */
	hourly_units: unknown;
	hourly: OpenMeteoHourWeather;
	/**
	 * Provided but not needed, we know
	 */
	daily_units: unknown;
	daily: OpenMeteoDailyWeather;
}

export function OpenMeteoResponseToData(payload: OpenMeteoWeatherResponse): WeatherData {
	return {
		date: DateTime.fromISO(payload.current.time, { zone: payload.timezone }),
		sunrise: DateTime.fromISO(payload.daily.sunrise[0], { zone: payload.timezone }),
		sunset: DateTime.fromISO(payload.daily.sunset[0], { zone: payload.timezone }),
		coord: {
			lat: payload.latitude,
			lon: payload.longitude,
		},
		location: {
			timeZone: payload.timezone,
			tzOffset: payload.utc_offset_seconds,
		},
		...OpenMeteoCurrentWeatherToData(payload.current),
		forecasts: OpenMeteoDailyWeatherToData(payload.daily, payload.timezone),
		hourlyForecasts: OpenMeteoHourWeatherToData(payload.hourly, payload.timezone),
	}
}
import { IDemoVideoValue, IDisplayedClass, IOutputType } from '../interfaces/upload-form-types';

export const DEMO_VIDEOS: IDemoVideoValue[] = [
	{ label: 'Ул. Кирова - Ул. Братьев Кашириных', videoPath: 'kirova.webm' },
	{ label: 'Ул. Чичерина - Ул. 250-летия Челябинска', videoPath: 'chicherina.webm' },
	{ label: 'Ул. Худякова - Ул. Энтузиастов', videoPath: 'hudyakova.webm' },
	{ label: 'Ул. Молодогвардейцев - Просп. Победы', videoPath: 'pobedy.webm' },
	{ label: 'Ост. "Поликлиника"', videoPath: 'poliklinika.webm' },
	{ label: 'Загрузите свое...', videoPath: 'downloaded' },
];

export const OUTPUT_TYPE: IOutputType[] = [
	{ label: 'Только видео (.webm)', type: 'video' },
	{ label: 'Json c результатами распознавания', type: 'json' },
	{ label: 'JSON + видео', type: 'all' },
];

export const DISPLAYED_CLASS: IDisplayedClass[] = [
	{ label: 'Автомобили', class: 'car' },
	{ label: 'Трамвай', class: 'tram' },
	{ label: 'Автобус', class: 'bus' },
	{ label: 'Пешеход', class: 'pedestrian' },
	{ label: 'Самокат', class: 'scooter' },
	{ label: 'Велосипед', class: 'bicycle' },
	{ label: 'Маршрутное такси', class: 'shuttle_taxi' },
	{ label: 'Троллейбус', class: 'trolleybus' },
	{ label: 'Грузовик', class: 'truck' },
	{ label: 'Мотоцикл', class: 'motorcycle' },
];

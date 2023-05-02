import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	BehaviorSubject,
	catchError,
	combineLatest,
	finalize,
	map,
	Observable,
	of,
	switchMap,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { UploadForm } from '../models/upload-form';

@Injectable()
export class VideoUploadService {
	public loading$: Observable<boolean>;
	private _loading$: BehaviorSubject<boolean>;

	public constructor(private http: HttpClient) {
		this._loading$ = new BehaviorSubject<boolean>(false);
		this.loading$ = this._loading$.asObservable();
	}

	public uploadUserInput(form: UploadForm): Observable<any> {
		const video$: Observable<File> =
			form.demoVideo.value === 'downloaded' && form.downloadVideo.value
				? of(form.downloadVideo.value)
				: this.getVideoFromAssets(form.demoVideo.value);

		return video$.pipe(
			switchMap((video: File) =>
				combineLatest([this.uploadFile(video), this.uploadOutputConfig(form)]),
			),
			catchError((e: any) => {
				console.error(e);

				return of({ success: false });
			}),
		);
	}

	public uploadOutputConfig(form: UploadForm): Observable<any> {
		const data = {
			outputType: form.outputType.value,
			classes: form.displayedClasses.value,
		};

		return this.http.post(`${environment.apiUrl}/output-configuration`, data);
	}

	public uploadFile(file: File): Observable<any> {
		this._loading$.next(true);

		const formData = new FormData();
		formData.append('user_video', file);

		return this.http
			.post(`${environment.apiUrl}/upload-user-video`, formData)
			.pipe(finalize(() => this._loading$.next(false)));
	}

	public getVideoFromAssets(fileName: string): Observable<File> {
		return this.http
			.get(`/assets/${fileName}`, { responseType: 'blob' })
			.pipe(map((blob: Blob) => new File([blob], fileName)));
	}
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, switchMap } from 'rxjs';
import { UploadForm } from '../models/upload-form';
import { IServerResponse } from '../interfaces/server-response';
import { AssetsConnector } from '../api/connectors/assets-connector';
import { VideoConnector } from '../api/connectors/video-connector';

interface IUpload {
	userVideo: File;
	outputType: string;
	classes: string;
}

@Injectable()
export class VideoUploadService {
	public loading$: Observable<boolean>;
	private _loading$: BehaviorSubject<boolean>;

	public constructor(
		private assetConnector: AssetsConnector,
		private videoConnector: VideoConnector,
	) {
		this._loading$ = new BehaviorSubject<boolean>(false);
		this.loading$ = this._loading$.asObservable();
	}

	public uploadUserInput(form: UploadForm): Observable<IServerResponse> {
		const video$: Observable<File> =
			form.demoVideo.value === 'downloaded' && form.downloadVideo.value
				? of(form.downloadVideo.value)
				: this.getVideoFromAssets(form.demoVideo.value);

		return video$.pipe(
			switchMap((video: File) =>
				this.upload({
					userVideo: video,
					outputType: form.outputType.value,
					classes: form.displayedClasses.value.join(' '),
				}),
			),
			catchError((e: any) => {
				console.error(e);

				return of({ success: false });
			}),
		);
	}

	public upload(userData: IUpload): Observable<IServerResponse> {
		this._loading$.next(true);

		const formData = new FormData();
		formData.append('user_video', userData.userVideo);
		formData.append('outputType', userData.outputType);
		formData.append('classes', userData.classes);

		return this.videoConnector
			.processUserVideo(formData)
			.pipe(finalize(() => this._loading$.next(false)));
	}

	public getVideoFromAssets(fileName: string): Observable<File> {
		return this.assetConnector
			.getAsset(fileName)
			.pipe(map((blob: Blob) => new File([blob], fileName)));
	}
}

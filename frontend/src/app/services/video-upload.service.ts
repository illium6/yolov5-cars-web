import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

@Injectable()
export class VideoUploadService {
	public loading$: Observable<boolean>;
	private _loading$: BehaviorSubject<boolean>;

	public constructor(private http: HttpClient) {
		this._loading$ = new BehaviorSubject<boolean>(false);
		this.loading$ = this._loading$.asObservable();
	}

	public uploadFile(fileName: string): Observable<any> {
		this._loading$.next(true);

		return this.http
			.post('/api/uploadVideo', {
				name: fileName,
			})
			.pipe(finalize(() => this._loading$.next(false)));
	}
}

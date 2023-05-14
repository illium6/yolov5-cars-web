import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IServerResponse } from '../../interfaces/server-response';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VideoConnector {
	public constructor(private http: HttpClient) {}

	public processUserVideo(formData: FormData): Observable<IServerResponse> {
		return this.http.post<IServerResponse>(
			`${environment.apiUrl}/process-user-video`,
			formData,
			{ withCredentials: true },
		);
	}

	public downloadProcessedVideo(): Observable<Blob> {
		return this.http.get(`${environment.apiUrl}/get-output-video`, {
			withCredentials: true,
			responseType: 'blob',
		});
	}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PredictionsConnector {
	public constructor(private http: HttpClient) {}

	public downloadPredictions(): Observable<Blob> {
		return this.http.get(`${environment.apiUrl}/get-predictions`, {
			withCredentials: true,
			responseType: 'blob',
			headers: {
				'Cache-Control': ['no-cache', 'no-store', 'must-revalidate'],
			},
		});
	}
}

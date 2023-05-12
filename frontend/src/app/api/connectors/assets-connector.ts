import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssetsConnector {
	public constructor(private http: HttpClient) {}

	public getAsset(fileName: string): Observable<Blob> {
		return this.http.get(`/assets/${fileName}`, { responseType: 'blob' });
	}
}

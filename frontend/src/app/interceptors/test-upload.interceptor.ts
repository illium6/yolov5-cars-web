import { Injectable } from '@angular/core';
import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

@Injectable()
export class TestUploadInterceptor implements HttpInterceptor {
	public intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		if (req.url === '/api/uploadVideo') {
			const res = new HttpResponse({
				status: 200,
			});

			return of(res).pipe(delay(2000));
		} else {
			return next.handle(req);
		}
	}
}

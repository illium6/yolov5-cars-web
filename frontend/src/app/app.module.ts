import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { TestUploadInterceptor } from './interceptors/test-upload.interceptor';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [AppComponent, FileUploadComponent, PreloaderComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatIconModule,
		HttpClientModule,
		MatProgressSpinnerModule,
		ReactiveFormsModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TestUploadInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

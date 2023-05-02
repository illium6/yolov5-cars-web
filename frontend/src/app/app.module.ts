import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadFormComponent } from './components/upload-form/upload-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [AppComponent, FileUploadComponent, PreloaderComponent, UploadFormComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatIconModule,
		HttpClientModule,
		MatProgressSpinnerModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatRadioModule,
		MatCheckboxModule,
		MatGridListModule,
		MatDividerModule,
		MatButtonModule,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}

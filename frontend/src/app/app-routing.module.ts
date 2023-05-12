import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './components/results/results.component';
import { UploadFormComponent } from './components/upload-form/upload-form.component';

const routes: Routes = [
	{
		path: 'results',
		component: ResultsComponent,
	},
	{
		path: '',
		component: UploadFormComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}

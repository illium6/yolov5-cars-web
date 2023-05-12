import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-preloader',
	templateUrl: './preloader.component.html',
	styleUrls: ['./preloader.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreloaderComponent {}

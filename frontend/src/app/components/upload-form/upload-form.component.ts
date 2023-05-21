import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { UploadForm } from '../../models/upload-form';
import { DEMO_VIDEOS, DISPLAYED_CLASS, OUTPUT_TYPE } from '../../models/form-fields-values';
import { BehaviorSubject, first, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { VideoUploadService } from '../../services/video-upload.service';
import { Router } from '@angular/router';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Component({
	selector: 'app-upload-form',
	templateUrl: './upload-form.component.html',
	styleUrls: ['./upload-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [VideoUploadService],
})
export class UploadFormComponent implements OnInit, OnDestroy {
	@HostListener('window:beforeunload', ['$event'])
	private unloadHandler(event: Event): void {
		const result =
			this.isUploading &&
			confirm(
				'Вы уверены что хотите уйти со страницы? Ваши данные и процесс обработки НЕ будут сохранены',
			);

		event.returnValue = result || false;
	}

	@ViewChild('demoVideoContainer')
	public videoContainer!: ElementRef;

	public form: UploadForm = new UploadForm();
	protected readonly DEMO_VIDEOS = DEMO_VIDEOS;

	public checkboxIndeterminate$: Observable<boolean>;
	public showUploadWindow$: Observable<boolean>;
	public disableButton$: Observable<boolean>;

	private _showUploadWindow$: BehaviorSubject<boolean>;
	private _checkboxIndeterminate$: BehaviorSubject<boolean>;
	private _disableButton$: BehaviorSubject<boolean>;
	private isUploading: boolean = false;

	public uploadWait$: Observable<boolean> = this.uploadService.loading$.pipe(
		tap((value) => (this.isUploading = value)),
	);
	public uploadError$: Observable<boolean> = this.uploadService.error$;

	private destroy$: Subject<void> = new Subject<void>();

	public constructor(private uploadService: VideoUploadService, private router: Router) {
		this._showUploadWindow$ = new BehaviorSubject<boolean>(false);
		this.showUploadWindow$ = this._showUploadWindow$.asObservable();

		this._checkboxIndeterminate$ = new BehaviorSubject<boolean>(false);
		this.checkboxIndeterminate$ = this._checkboxIndeterminate$.asObservable();

		this._disableButton$ = new BehaviorSubject(false);
		this.disableButton$ = this._disableButton$.asObservable();
	}

	public ngOnInit() {
		this.form.demoVideo.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe((videoPath: string) => {
				if (videoPath !== 'downloaded') {
					this.videoContainer?.nativeElement.load();
				}

				this._showUploadWindow$.next(videoPath === 'downloaded');
			});
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	public setClassesFullList(event: MatCheckboxChange): void {
		if (event.checked) {
			this.form.displayedClasses.setValue(
				DISPLAYED_CLASS.map((dispClass) => dispClass.class),
			);
		} else {
			this.form.displayedClasses.setValue([]);
		}
	}

	public setValueToForm(checked: boolean, value: string): void {
		const currentFormValue: string[] = this.form.displayedClasses.value;

		if (checked) {
			this.form.displayedClasses.setValue(currentFormValue.concat([value]));
		} else {
			const valueFormCurrent: number = currentFormValue.indexOf(value);
			const newValue: string[] = currentFormValue
				.slice(0, valueFormCurrent)
				.concat(currentFormValue.slice(valueFormCurrent + 1));

			this.form.displayedClasses.setValue(newValue);
		}

		const curValueLen: number = this.form.displayedClasses.value.length;

		this._checkboxIndeterminate$.next(
			curValueLen > 0 && curValueLen !== this.DISPLAYED_CLASS.length,
		);
	}

	public sendData(): void {
		this._disableButton$.next(true);
		const isValid = this.form.validateForm();

		if (isValid) {
			this.uploadService
				.uploadUserInput(this.form)
				.pipe(
					tap(() => this._disableButton$.next(false)),
					switchMap((uploadResult) => {
						if (uploadResult.success) {
							return fromPromise(this.router.navigate(['results']));
						}

						return of(null);
					}),
					first(),
				)
				.subscribe();
		}
	}

	protected readonly OUTPUT_TYPE = OUTPUT_TYPE;
	protected readonly DISPLAYED_CLASS = DISPLAYED_CLASS;
}

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UploadForm } from '../../models/upload-form';
import { DEMO_VIDEOS, DISPLAYED_CLASS, OUTPUT_TYPE } from '../../models/form-fields-values';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
	selector: 'app-upload-form',
	templateUrl: './upload-form.component.html',
	styleUrls: ['./upload-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFormComponent implements OnInit, OnDestroy {
	public form: UploadForm = new UploadForm();
	protected readonly DEMO_VIDEOS = DEMO_VIDEOS;

	public checkboxIndeterminate$: Observable<boolean>;
	public showUploadWindow$: Observable<boolean>;

	private _showUploadWindow$: BehaviorSubject<boolean>;
	private _checkboxIndeterminate$: BehaviorSubject<boolean>;

	private destroy$: Subject<void> = new Subject<void>();

	public constructor() {
		this._showUploadWindow$ = new BehaviorSubject<boolean>(false);
		this.showUploadWindow$ = this._showUploadWindow$.asObservable();

		this._checkboxIndeterminate$ = new BehaviorSubject<boolean>(false);
		this.checkboxIndeterminate$ = this._checkboxIndeterminate$.asObservable();
	}

	public ngOnInit() {
		this.form.video.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe((videoPath: string) =>
				this._showUploadWindow$.next(videoPath === 'downloaded'),
			);
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
		const isValid = this.form.validateForm();

		if (isValid) {
			console.log('Она сказала заебись');
		}
	}

	protected readonly OUTPUT_TYPE = OUTPUT_TYPE;
	protected readonly DISPLAYED_CLASS = DISPLAYED_CLASS;
}

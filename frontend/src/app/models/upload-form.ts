import {
	AbstractControl,
	FormControl,
	FormGroup,
	ValidationErrors,
	Validators,
} from '@angular/forms';

function arrayValidator(control: AbstractControl): ValidationErrors | null {
	const error: ValidationErrors = { required: true };

	if (control.value == null) {
		return error;
	}

	if (Array.isArray(control.value)) {
		if (!control.value.length) {
			return error;
		}
	}

	return null;
}

export class UploadForm extends FormGroup {
	public constructor() {
		super({
			demoVideo: new FormControl(undefined, Validators.required),
			downloadVideo: new FormControl(),
			outputType: new FormControl(undefined, Validators.required),
			displayedClasses: new FormControl<string[]>([], arrayValidator),
		});
	}

	public get demoVideo(): FormControl {
		return this.get('demoVideo') as FormControl;
	}

	public get outputType(): FormControl {
		return this.get('outputType') as FormControl;
	}

	public get displayedClasses(): FormControl<string[]> {
		return this.get('displayedClasses') as FormControl<string[]>;
	}

	public get downloadVideo(): FormControl {
		return this.get('downloadVideo') as FormControl;
	}

	public validateForm(): boolean {
		this.markAllAsTouched();

		const hasErrors: boolean = Object.keys(this.controls)
			.map((controlName: string) => this.get(controlName)?.invalid)
			.some(Boolean);

		return !hasErrors && !this.errors;
	}
}

import { FormControl, FormGroup, Validators } from '@angular/forms';

export class UploadForm extends FormGroup {
	public constructor() {
		super({
			video: new FormControl(null, Validators.required),
			outputType: new FormControl(null, Validators.required),
			displayedClasses: new FormControl<string[]>([]),
		});
	}

	public get video(): FormControl {
		return this.get('video') as FormControl;
	}

	public get outputType(): FormControl {
		return this.get('outputType') as FormControl;
	}

	public get displayedClasses(): FormControl<string[]> {
		return this.get('displayedClasses') as FormControl<string[]>;
	}

	public validateForm(): boolean {
		this.markAllAsTouched();
		return !this.errors;
	}
}

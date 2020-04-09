import { FormControl } from '@angular/forms';

export function ValidateSlug(control: FormControl) {
    if (!control.value) return null;

    if (/^[a-zA-Z0-9-_]+$/.test(control.value)) {
        return null;
    } else {
        return { ValidateSlug: true };
    }
}

export function ValidateNoSpace(control: FormControl) {
    if (!control.value) return null;

    if (/^[a-zA-Z0-9]+$/.test(control.value)) {
        return null;
    } else {
        return { ValidateNoSpace: true };
    }
}

export function ValidateNumber(control: FormControl) {
    if (!control.value) return null;

    if (/^[0-9]+$/.test(control.value)) {
        return null;
    } else {
        return { ValidateNumber: true };
    }
}

export function ValidateDecimal(control: FormControl) {
    if (!control.value) return null;

    if (/^\d+(\.\d{1,2})?$/.test(control.value) || /^[0-9]+$/.test(control.value)) {
        return null;
    } else {
        return { ValidateDecimal: true };
    }
}
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  public toastSetup = Swal.mixin({
    toast: true,
    position: 'top-end',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: false,
    showClass: {
      popup: 'swal2-noanimation'
      //icon: 'swal2-noanimation'
    }
  });
  constructor() {}

  toast(
    title: string,
    icon: 'warning' | 'success' | 'error' | 'info' | 'question' | undefined
  ): void {
    this.toastSetup.fire(title, '', icon);
  }

  fire(
    title: string,
    text: string,
    icon: 'warning' | 'success' | 'error' | 'info' | 'question' | undefined
  ): void {
    Swal.fire({
      title,
      text,
      icon
    });
  }

  async fireQuestion(
    title: string,
    text: string,
    icon: 'warning' | 'info' | 'question' | undefined,
    confirmButton: string,
    cancelButton: string
  ): Promise<boolean> {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmButton,
      cancelButtonText: cancelButton
    });

    if (result.value) {
      return true;
    }

    return false;
  }
}

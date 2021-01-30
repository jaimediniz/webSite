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

  async loginOrRegister(isRegister?: boolean): Promise<any> {
    let html = 'username: <input id="swal-input1" class="swal2-input">';
    html += 'password: <input id="swal-input2" class="swal2-input">';
    if (isRegister) {
      html += 'code: <input id="swal-input3" class="swal2-input">';
    }

    console.log(html);
    const { value: formValues } = await Swal.fire({
      html,
      focusConfirm: true,
      confirmButtonText: `${isRegister ? 'Register' : 'Login'}`,
      preConfirm: () => ({
        username: (document.getElementById('swal-input1') as any).value,
        password: (document.getElementById('swal-input2') as any).value,
        code: (document.getElementById('swal-input3') as any).value
      })
    });

    if (
      formValues &&
      formValues.username &&
      formValues.password &&
      formValues.code
    ) {
      return formValues;
    }
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

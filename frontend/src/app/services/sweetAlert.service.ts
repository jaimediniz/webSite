import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {
  constructor() {}

  toast(
    title: string,
    icon: 'warning' | 'success' | 'error' | 'info' | 'question' | undefined,
    footer: string
  ): void {
    Swal.fire({
      title,
      icon,
      footer,
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
      target: 'toast',
      showClass: {
        popup: 'swal2-noanimation'
        //icon: 'swal2-noanimation'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
      willClose: (toast) => {
        document.body.className =
          'swal2-toast-shown swal2-toast-column swal2-shown';
      }
    });
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

  async uploadPicture(): Promise<boolean> {
    const { value: file } = await Swal.fire({
      title: 'Select image',
      input: 'file',
      inputAttributes: {
        accept: 'image/*',
        'aria-label': 'Upload your profile picture'
      }
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        Swal.fire({
          title: 'Your uploaded picture',
          imageUrl: e.target.result,
          imageAlt: 'The uploaded picture'
        });
      };
      reader.readAsDataURL(file);
    }
    return true;
  }
}

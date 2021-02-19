import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Event, User } from '../../interfaces/database';

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
      timer: 1000,
      showConfirmButton: false,
      timerProgressBar: true,
      showClass: {
        popup: 'swal2-noanimation'
        //icon: 'swal2-noanimation'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
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
      icon,
      showClass: {
        popup: 'swal2-noanimation'
        //icon: 'swal2-noanimation'
      }
    });
  }

  async loginOrRegister(isRegister?: boolean): Promise<any> {
    let html =
      'username: <input id="swal-input1" class="swal2-input" autocomplete="off">';
    html +=
      'password: <input type="password" id="swal-input2" class="swal2-input" autocomplete="off">';
    if (isRegister) {
      html +=
        'code: <input id="swal-input3" class="swal2-input" autocomplete="off">';
    }

    const { value: formValues } = await Swal.fire({
      html,
      focusConfirm: true,
      allowEnterKey: true,
      allowEscapeKey: true,
      confirmButtonText: `${isRegister ? 'Register' : 'Login'}`,
      preConfirm: () => ({
        username: (document.getElementById('swal-input1') as any).value,
        password: (document.getElementById('swal-input2') as any).value,
        code: (document.getElementById('swal-input3') as any)?.value ?? ''
      }),
      showClass: {
        popup: 'swal2-noanimation'
        //icon: 'swal2-noanimation'
      }
    });

    return formValues;
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
      cancelButtonText: cancelButton,
      showClass: {
        popup: 'swal2-noanimation'
        //icon: 'swal2-noanimation'
      }
    });

    if (result.value) {
      return true;
    }

    return false;
  }

  displayEvent(event: Event): void {
    const url = event.url
      ? `<br><a href="${event.url}">Click here to see more.</a>`
      : '';
    const html = `<b>Description:</b> ${event.description}` + url;
    Swal.fire({
      title: event.name,
      html,
      imageUrl: event.imageUrl,
      showClass: {
        popup: 'swal2-noanimation'
        //icon: 'swal2-noanimation'
      }
    });
  }

  async displayDbElement(element: Event | User): Promise<any> {
    const html = Object.entries(element)
      .map((el, index) =>
        el[0] === '_id'
          ? ''
          : `${el[0]}: <input id="swal-input${index}" class="swal2-input" autocomplete="off" value="${el[1]}">`
      )
      .join('');
    const { value: formValues } = await Swal.fire({
      title: element.name,
      html,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Modify',
      showClass: {
        popup: 'swal2-noanimation'
        //icon: 'swal2-noanimation'
      },
      preConfirm: () => {
        const newValues = Object.keys(element).reduce(
          (acc: any, curr: string, index: number) => (
            (acc[curr] =
              (document.getElementById(`swal-input${index}`) as any)?.value ??
              ''),
            acc
          ),
          {}
        );
        // eslint-disable-next-line no-underscore-dangle
        newValues._id = element._id;
        return newValues;
      }
    });
    return formValues;
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

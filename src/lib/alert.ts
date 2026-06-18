import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const adminAlert = MySwal.mixin({
  customClass: {
    popup: 'rounded-2xl shadow-xl border border-slate-200 bg-white',
    title: 'text-xl font-bold text-slate-800 font-heading',
    htmlContainer: 'text-slate-600',
    confirmButton:
      'bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-semibold transition-colors mx-2',
    cancelButton:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg font-semibold transition-colors mx-2',
  },
  buttonsStyling: false,
});

export const showSuccessAlert = (title: string, text?: string) => {
  return adminAlert.fire({
    title,
    text,
    icon: 'success',
    iconColor: '#10b981', // Emerald 500
    confirmButtonText: 'Okay',
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return adminAlert.fire({
    title,
    text,
    icon: 'error',
    iconColor: '#ef4444', // Red 500
    confirmButtonText: 'Okay',
  });
};

export const showConfirmDeleteAlert = async (itemName: string = 'this item') => {
  return adminAlert.fire({
    title: 'Are you sure?',
    text: `You are about to delete ${itemName}. This action cannot be undone.`,
    icon: 'warning',
    iconColor: '#f59e0b', // Amber 500
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });
};

export const comicAlert = MySwal.mixin({
  customClass: {
    popup: 'bg-white border-[3px] border-black comic-shadow rounded-none',
    title: 'text-2xl font-bold text-black font-heading uppercase',
    htmlContainer: 'text-black font-medium',
    confirmButton:
      'bg-primary hover:bg-black text-white px-6 py-2.5 font-bold transition-all border-[3px] border-black comic-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none mx-2 uppercase',
    cancelButton:
      'bg-white hover:bg-slate-100 text-black px-6 py-2.5 font-bold transition-all border-[3px] border-black comic-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none mx-2 uppercase',
  },
  buttonsStyling: false,
});

export const showComicSuccessAlert = (title: string, text?: string) => {
  return comicAlert.fire({
    title,
    text,
    icon: 'success',
    iconColor: '#000000',
    confirmButtonText: 'Awesome!',
  });
};

export const showComicErrorAlert = (title: string, text?: string) => {
  return comicAlert.fire({
    title,
    text,
    icon: 'error',
    iconColor: '#ef4444',
    confirmButtonText: 'Got It',
  });
};

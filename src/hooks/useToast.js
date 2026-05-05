import { create } from 'zustand';

let nextId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  showToast: ({ message, type = 'info', duration = 4000 }) => {
    const id = ++nextId;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => get().dismissToast(id), duration);
    return id;
  },

  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export function useToast() {
  const { showToast, dismissToast } = useToastStore();
  return { showToast, dismissToast };
}

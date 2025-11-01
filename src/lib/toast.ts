import { reactive } from 'vue';

export type ToastKind = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  kind: ToastKind;
}

const state = reactive<{ items: ToastItem[] }>({ items: [] });

export function useToast() {
  function show(message: string, kind: ToastKind = 'info', timeoutMs = 2500) {
    const id = crypto.randomUUID();
    state.items.push({ id, message, kind });
    window.setTimeout(() => dismiss(id), timeoutMs);
  }
  function dismiss(id: string) {
    const idx = state.items.findIndex(t => t.id === id);
    if (idx >= 0) state.items.splice(idx, 1);
  }
  return { state, show, dismiss };
}



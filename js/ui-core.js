// CardFlow Toast & Shared Modal Infrastructure

import { t } from './i18n.js';

let toastTimer = null;

export function showToast(message, durationMs = 2500) {
  const toast = document.getElementById('toast-message');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.remove('opacity-0');
  if (typeof setTimeout === 'function') {
    if (typeof clearTimeout === 'function' && toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      toast.classList.add('opacity-0');
      toastTimer = null;
    }, durationMs);
  }
}


// Shared Modal Focus & Open-State Helpers
export const MODAL_IDS = [
  'confirm-modal',
  'perk-action-modal',
  'card-date-modal',
  'gdrive-help-modal',
  'annual-breakdown-modal',
  'manage-cards-modal',
  'fnc-modal',
  'settings-modal'
];
const modalFocusStack = [];
let pendingConfirmHandler = null;

export function closeConfirmDialog() {
  pendingConfirmHandler = null;
  const modal = document.getElementById('confirm-modal');
  closeModalEl(modal);
}

export function showConfirmDialog({ title, message, confirmLabel, dangerous = false, onConfirm }) {
  const modal = document.getElementById('confirm-modal');
  const titleEl = document.getElementById('confirm-modal-title');
  const descEl = document.getElementById('confirm-modal-desc');
  const cancelBtn = document.getElementById('confirm-modal-cancel-btn');
  const okBtn = document.getElementById('confirm-modal-ok-btn');
  if (!modal || !okBtn) {
    if (typeof onConfirm === 'function') onConfirm();
    return;
  }

  if (titleEl) titleEl.innerText = title || t('confirmTitleDefault');
  if (descEl) descEl.innerText = message || '';
  if (cancelBtn) cancelBtn.innerText = t('btnCancel');
  okBtn.innerText = confirmLabel || t('confirmBtnProceed');
  okBtn.className = dangerous
    ? 'px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition cursor-pointer'
    : 'px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition cursor-pointer';

  pendingConfirmHandler = typeof onConfirm === 'function' ? onConfirm : null;
  okBtn.onclick = () => {
    const handler = pendingConfirmHandler;
    closeConfirmDialog();
    if (handler) handler();
  };

  openModalEl(modal);
}

export function hasOpenModal() {
  return MODAL_IDS.some(id => {
    const m = document.getElementById(id);
    return Boolean(m && !m.classList.contains('hidden'));
  });
}

export function openModalEl(modalEl) {
  if (!modalEl) return;
  const triggerEl = (typeof document !== 'undefined' && document.activeElement) ? document.activeElement : null;
  if (modalEl.classList.contains('hidden')) {
    modalFocusStack.push({ modalEl, triggerEl });
  }
  modalEl.classList.remove('hidden');
  if (typeof modalEl.querySelector === 'function') {
    const firstFocusable = modalEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable && typeof firstFocusable.focus === 'function') {
      firstFocusable.focus();
    }
  }
}

export function closeModalEl(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('hidden');
  for (let i = modalFocusStack.length - 1; i >= 0; i--) {
    if (modalFocusStack[i].modalEl === modalEl) {
      const [{ triggerEl }] = modalFocusStack.splice(i, 1);
      if (triggerEl && typeof triggerEl.focus === 'function') {
        triggerEl.focus();
      }
      break;
    }
  }
}

// Card Date Modal Logic

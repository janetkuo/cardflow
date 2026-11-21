// CardFlow Entry Point, Event Bindings, Window Bridge & PWA Registration

import { currentLang, t } from './i18n.js';
import {
  STATE_KEY, BANNER_KEY, VALID_SUBVIEWS,
  currentTheme, currentPalette, appState,
  setAppState, normalizeAppState, loadState, saveState, getLocalDateStr, registerAutoSyncHandler
} from './state.js';
import { showToast, hasOpenModal, openModalEl, closeModalEl, showConfirmDialog, closeConfirmDialog } from './ui-core.js';
import {
  GDRIVE_CLIENT_ID_KEY, GDRIVE_AUTO_SYNC_KEY,
  updateDriveUI, backupToGoogleDrive, restoreFromGoogleDrive, handleDriveAutoSync,
  signOutGoogleDrive, registerDriveRestoreCallback
} from './drive.js';
import {
  applyTheme, applyPalette, applyLanguage, renderAllViews, renderCards, renderFncs,
  selectAllCards, loadDemoStarterPack,
  openCardDateModal, closeCardDateModal, saveCardDate, clearCardDate,
  openManageCardsModal, closeManageCardsModal,
  openAnnualBreakdownModal, closeAnnualBreakdownModal, switchPeriodFromModal,
  setCreditsViewMode, setPeriodFilter, toggleMutedCreditsSection,
  openPerkActionModal, closePerkActionModal, skipActivePerk, muteActivePerk,
  toggleCreditSkip, muteCredit, unmuteCredit, toggleCreditClaim,
  setOwnershipFilter, setCardsViewMode, toggleCardDetailExpand, toggleCardOwnership,
  jumpToCredit, jumpToLoyalty, toggleFncStatus,
  setAdvisorMode, selectAdvisorCategory, getActiveTab, switchSubView, initFoldScreenObserver,
  resetCurrentMonth, setCurrentIssuerFilter
} from './views.js';

registerAutoSyncHandler(handleDriveAutoSync);
registerDriveRestoreCallback(() => applyLanguage(currentLang));

// --- 19. MODAL & BACKUP LOGIC ---
export function setupModals() {
  const fncModal = document.getElementById('fnc-modal');
  const openFncBtn = document.getElementById('open-add-fnc-btn');
  const closeFncBtn = document.getElementById('close-fnc-modal-btn');
  const cancelFncBtn = document.getElementById('cancel-fnc-btn');
  const fncForm = document.getElementById('fnc-form');

  if (openFncBtn && fncModal) openFncBtn.onclick = () => openModalEl(fncModal);
  if (closeFncBtn && fncModal) closeFncBtn.onclick = () => closeModalEl(fncModal);
  if (cancelFncBtn && fncModal) cancelFncBtn.onclick = () => closeModalEl(fncModal);
  if (fncModal) {
    fncModal.addEventListener('click', (e) => {
      if (e.target === fncModal) closeModalEl(fncModal);
    });
  }

  const fab = document.getElementById('floating-add-btn');
  if (fab && fncModal) fab.onclick = () => openModalEl(fncModal);

  if (fncForm) {
    fncForm.onsubmit = e => {
      e.preventDefault();
      const name = document.getElementById('fnc-name-input').value.trim();
      const issuer = document.getElementById('fnc-issuer-input').value;
      const points = document.getElementById('fnc-points-input').value.trim();
      const expire = document.getElementById('fnc-expire-input').value;

      appState.fncs.push({
        id: 'fnc-' + Date.now(),
        name: name,
        issuer: issuer,
        points: points,
        expireDate: expire,
        used: false
      });
      saveState();
      renderFncs();
      if (fncModal) closeModalEl(fncModal);
      fncForm.reset();
    };
  }

  const settingsModal = document.getElementById('settings-modal');
  const openSettingsBtn = document.getElementById('open-settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');

  if (openSettingsBtn && settingsModal) openSettingsBtn.onclick = () => openModalEl(settingsModal);
  if (closeSettingsBtn && settingsModal) closeSettingsBtn.onclick = () => closeModalEl(settingsModal);
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) closeModalEl(settingsModal);
    });
  }

  const exportBtn = document.getElementById('export-json-btn');
  if (exportBtn) {
    exportBtn.onclick = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', `cardflow_backup_${getLocalDateStr(new Date())}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
  }

  const importBtn = document.getElementById('import-json-btn');
  const fileInput = document.getElementById('import-file-input');
  if (importBtn && fileInput) {
    importBtn.onclick = () => fileInput.click();
    fileInput.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target.result);
          setAppState(normalizeAppState(parsed, true));
          saveState();
          applyLanguage(currentLang);
          showToast(currentLang === 'zh-TW' ? '備份資料還原成功！' : 'Data restored successfully!');
          if (settingsModal) closeModalEl(settingsModal);
        } catch (err) {
          showToast(t('invalidBackupFile'), 3500);
        } finally {
          fileInput.value = '';
        }
      };
      reader.readAsText(file);
    };
  }

  const resetBtn = document.getElementById('reset-factory-btn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      const confirmMsg = currentLang === 'zh-TW'
        ? '確定要清除所有本機資料（已選卡片、折抵進度與房券），重設為初始狀態嗎？此動作無法復原。'
        : 'Are you sure you want to clear all data (cards, claimed credits, and awards) and reset to initial state? This cannot be undone.';
      showConfirmDialog({
        title: t('confirmFactoryResetTitle'),
        message: confirmMsg,
        confirmLabel: t('confirmBtnProceed'),
        dangerous: true,
        onConfirm: () => {
          localStorage.removeItem(STATE_KEY);
          setAppState(normalizeAppState(null, false));
          saveState();
          renderAllViews();
          closeModalEl(settingsModal);
          showToast(currentLang === 'zh-TW' ? '已成功清除資料並恢復初始狀態' : 'All data reset to initial state');
        }
      });
    };
  }

  // Manage Owned Cards Modal Bindings
  const manageCardsModal = document.getElementById('manage-cards-modal');
  const openManageCardsBtn = document.getElementById('open-manage-cards-btn');
  const closeManageCardsBtn = document.getElementById('close-manage-cards-btn');
  const saveManageCardsBtn = document.getElementById('save-manage-cards-btn');
  const selectAllCardsBtn = document.getElementById('select-all-cards-btn');
  const deselectAllCardsBtn = document.getElementById('deselect-all-cards-btn');
  const manageCardsDemoBtn = document.getElementById('manage-cards-demo-btn');
  const donutBadge = document.getElementById('donut-cards-count-badge');

  if (openManageCardsBtn) openManageCardsBtn.onclick = openManageCardsModal;
  if (donutBadge) donutBadge.onclick = openManageCardsModal;
  if (closeManageCardsBtn) closeManageCardsBtn.onclick = closeManageCardsModal;
  if (saveManageCardsBtn) saveManageCardsBtn.onclick = closeManageCardsModal;
  if (manageCardsModal) {
    manageCardsModal.addEventListener('click', (e) => {
      if (e.target === manageCardsModal) closeManageCardsModal();
    });
  }
  if (selectAllCardsBtn) selectAllCardsBtn.onclick = () => selectAllCards(true);
  if (deselectAllCardsBtn) deselectAllCardsBtn.onclick = () => selectAllCards(false);
  if (manageCardsDemoBtn) {
    manageCardsDemoBtn.onclick = () => {
      loadDemoStarterPack();
      closeManageCardsModal();
    };
  }

  // Annual Value Breakdown Modal Bindings
  const annualModal = document.getElementById('annual-breakdown-modal');
  const openAnnualBtn = document.getElementById('open-annual-breakdown-btn');
  const closeAnnualBtn = document.getElementById('close-annual-modal-btn');
  const confirmAnnualBtn = document.getElementById('confirm-annual-modal-btn');

  if (openAnnualBtn) openAnnualBtn.onclick = openAnnualBreakdownModal;
  if (closeAnnualBtn) closeAnnualBtn.onclick = closeAnnualBreakdownModal;
  if (confirmAnnualBtn) confirmAnnualBtn.onclick = closeAnnualBreakdownModal;
  if (annualModal) {
    annualModal.addEventListener('click', (e) => {
      if (e.target === annualModal) closeAnnualBreakdownModal();
    });
  }

  // Card Date Modal Bindings
  const cardDateModal = document.getElementById('card-date-modal');
  const closeCardDateBtn = document.getElementById('close-card-date-btn');
  const cancelCardDateBtn = document.getElementById('cancel-card-date-btn');
  const clearCardDateBtn = document.getElementById('clear-card-date-btn');
  const saveCardDateBtn = document.getElementById('save-card-date-btn');

  if (closeCardDateBtn) closeCardDateBtn.onclick = closeCardDateModal;
  if (cancelCardDateBtn) cancelCardDateBtn.onclick = closeCardDateModal;
  if (clearCardDateBtn) clearCardDateBtn.onclick = clearCardDate;
  if (saveCardDateBtn) saveCardDateBtn.onclick = saveCardDate;
  if (cardDateModal) {
    cardDateModal.addEventListener('click', (e) => {
      if (e.target === cardDateModal) closeCardDateModal();
    });
  }

  // Perk Action Modal Bindings
  const perkActionModal = document.getElementById('perk-action-modal');
  const closePerkActionBtn = document.getElementById('close-perk-action-modal-btn');
  const cancelPerkActionBtn = document.getElementById('cancel-perk-action-btn');
  const perkActionSkipBtn = document.getElementById('perk-action-skip-btn');
  const perkActionMuteBtn = document.getElementById('perk-action-mute-btn');

  if (closePerkActionBtn) closePerkActionBtn.onclick = closePerkActionModal;
  if (cancelPerkActionBtn) cancelPerkActionBtn.onclick = closePerkActionModal;
  if (perkActionSkipBtn) {
    perkActionSkipBtn.onclick = skipActivePerk;
  }
  if (perkActionMuteBtn) {
    perkActionMuteBtn.onclick = muteActivePerk;
  }
  if (perkActionModal) {
    perkActionModal.addEventListener('click', (e) => {
      if (e.target === perkActionModal) closePerkActionModal();
    });
  }

  // Muted Section Toggle Button
  const toggleMutedBtn = document.getElementById('toggle-muted-section-btn');
  if (toggleMutedBtn) {
    toggleMutedBtn.onclick = toggleMutedCreditsSection;
  }

  // Card ownership filter buttons
  ['all', 'owned', 'unowned'].forEach(mode => {
    const btn = document.getElementById(`card-filter-${mode}-btn`);
    if (btn) {
      btn.onclick = () => {
        setOwnershipFilter(mode);
      };
    }
  });

  // Google Drive Cloud Sync Bindings
  const gdriveHelpModal = document.getElementById('gdrive-help-modal');
  const gdriveHelpBtn = document.getElementById('gdrive-help-btn');
  const closeGdriveHelpBtn = document.getElementById('close-gdrive-help-btn');
  const confirmGdriveHelpBtn = document.getElementById('confirm-gdrive-help-btn');

  if (gdriveHelpBtn && gdriveHelpModal) gdriveHelpBtn.onclick = () => openModalEl(gdriveHelpModal);
  if (closeGdriveHelpBtn && gdriveHelpModal) closeGdriveHelpBtn.onclick = () => closeModalEl(gdriveHelpModal);
  if (confirmGdriveHelpBtn && gdriveHelpModal) confirmGdriveHelpBtn.onclick = () => closeModalEl(gdriveHelpModal);
  if (gdriveHelpModal) {
    gdriveHelpModal.addEventListener('click', (e) => {
      if (e.target === gdriveHelpModal) closeModalEl(gdriveHelpModal);
    });
  }

  // Confirm Dialog Bindings
  const confirmModal = document.getElementById('confirm-modal');
  const closeConfirmBtn = document.getElementById('close-confirm-modal-btn');
  const cancelConfirmBtn = document.getElementById('confirm-modal-cancel-btn');
  if (closeConfirmBtn) closeConfirmBtn.onclick = closeConfirmDialog;
  if (cancelConfirmBtn) cancelConfirmBtn.onclick = closeConfirmDialog;
  if (confirmModal) {
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) closeConfirmDialog();
    });
  }

  // Global Escape key to close topmost open modal
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const modalClosers = [
      ['confirm-modal', closeConfirmDialog],
      ['perk-action-modal', closePerkActionModal],
      ['card-date-modal', closeCardDateModal],
      ['gdrive-help-modal', () => closeModalEl(gdriveHelpModal)],
      ['annual-breakdown-modal', closeAnnualBreakdownModal],
      ['manage-cards-modal', closeManageCardsModal],
      ['fnc-modal', () => closeModalEl(fncModal)],
      ['settings-modal', () => closeModalEl(settingsModal)]
    ];
    for (const [id, closeFn] of modalClosers) {
      const m = document.getElementById(id);
      if (m && !m.classList.contains('hidden')) {
        closeFn();
        break;
      }
    }
  });

  const toggleConfigBtn = document.getElementById('gdrive-toggle-config-btn');
  const configBox = document.getElementById('gdrive-client-id-box');
  if (toggleConfigBtn && configBox) {
    toggleConfigBtn.onclick = () => configBox.classList.toggle('hidden');
  }

  const saveClientIdBtn = document.getElementById('gdrive-save-client-id-btn');
  const clientIdInput = document.getElementById('gdrive-client-id-input');
  if (saveClientIdBtn && clientIdInput) {
    saveClientIdBtn.onclick = () => {
      const val = clientIdInput.value.trim();
      localStorage.setItem(GDRIVE_CLIENT_ID_KEY, val);
      showToast(currentLang === 'zh-TW' ? 'Google OAuth Client ID 已儲存！' : 'Google OAuth Client ID saved!');
      updateDriveUI();
    };
  }

  const backupDriveBtn = document.getElementById('gdrive-backup-btn');
  if (backupDriveBtn) backupDriveBtn.onclick = () => backupToGoogleDrive(false);

  const restoreDriveBtn = document.getElementById('gdrive-restore-btn');
  if (restoreDriveBtn) restoreDriveBtn.onclick = () => restoreFromGoogleDrive();

  const autoSyncCheck = document.getElementById('gdrive-auto-sync-check');
  if (autoSyncCheck) {
    autoSyncCheck.onchange = (e) => {
      localStorage.setItem(GDRIVE_AUTO_SYNC_KEY, e.target.checked ? 'true' : 'false');
      if (e.target.checked) {
        backupToGoogleDrive(true);
      }
    };
  }

  const signoutDriveBtn = document.getElementById('gdrive-signout-btn');
  if (signoutDriveBtn) {
    signoutDriveBtn.onclick = signOutGoogleDrive;
  }
}

// --- 20. INITIALIZATION & BINDINGS ---
export function init() {
  loadState();
  applyTheme(currentTheme);
  applyPalette(currentPalette);

  document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
    applyLanguage(currentLang === 'zh-TW' ? 'en' : 'zh-TW');
  });

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  // Top Notification Banner State & Controls
  const bannerEl = document.getElementById('demo-mode-banner');
  if (localStorage.getItem(BANNER_KEY) === 'true' && bannerEl) {
    bannerEl.classList.add('hidden');
  }

  document.getElementById('close-banner-btn')?.addEventListener('click', () => {
    if (bannerEl) bannerEl.classList.add('hidden');
    localStorage.setItem(BANNER_KEY, 'true');
  });

  document.getElementById('restore-banner-btn')?.addEventListener('click', () => {
    if (bannerEl) bannerEl.classList.remove('hidden');
    localStorage.removeItem(BANNER_KEY);
    showToast(currentLang === 'zh-TW' ? '已恢復顯示頂部提醒橫條。' : 'Top notification banner restored.');
  });

  document.getElementById('banner-reset-month-btn')?.addEventListener('click', resetCurrentMonth);
  document.getElementById('settings-reset-month-btn')?.addEventListener('click', resetCurrentMonth);

  document.getElementById('nav-btn-credits')?.addEventListener('click', () => switchSubView('credits'));
  document.getElementById('nav-btn-cards')?.addEventListener('click', () => switchSubView('cards'));
  document.getElementById('nav-btn-loyalty')?.addEventListener('click', () => switchSubView('loyalty'));
  document.getElementById('nav-btn-advisor')?.addEventListener('click', () => switchSubView('advisor'));

  document.getElementById('mob-nav-credits')?.addEventListener('click', () => switchSubView('credits'));
  document.getElementById('mob-nav-cards')?.addEventListener('click', () => switchSubView('cards'));
  document.getElementById('mob-nav-loyalty')?.addEventListener('click', () => switchSubView('loyalty'));
  document.getElementById('mob-nav-advisor')?.addEventListener('click', () => switchSubView('advisor'));

  ['all', 'monthly', 'quarterly', 'semiannual', 'annual'].forEach(p => {
    const btn = document.getElementById(`period-${p}-btn`);
    if (btn) {
      btn.addEventListener('click', () => setPeriodFilter(p));
    }
  });

  ['all', 'amex', 'chase', 'c1'].forEach(iss => {
    const btn = document.getElementById(`issuer-${iss}-btn`);
    if (btn) {
      btn.addEventListener('click', () => {
        setCurrentIssuerFilter(iss === 'all' ? 'all' : iss === 'amex' ? 'Amex' : iss === 'chase' ? 'Chase' : 'CapitalOne');
        document.querySelectorAll('.issuer-filter-btn').forEach(b => {
          b.className = 'issuer-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0';
        });
        btn.className = 'issuer-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shrink-0';
        renderCards();
      });
    }
  });

  document.getElementById('cards-search-input')?.addEventListener('input', renderCards);
  document.getElementById('cards-view-compact-btn')?.addEventListener('click', () => setCardsViewMode('compact'));
  document.getElementById('cards-view-detailed-btn')?.addEventListener('click', () => setCardsViewMode('detailed'));

  initFoldScreenObserver();
  setupModals();
  applyLanguage(currentLang);

  // Restore active subview from URL hash or session
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('hashchange', () => {
      const hash = (window.location && window.location.hash) ? window.location.hash.slice(1) : '';
      if (VALID_SUBVIEWS.includes(hash)) {
        switchSubView(hash, false);
      }
    });
  }

  const initialHash = (typeof window !== 'undefined' && window.location && window.location.hash)
    ? window.location.hash.slice(1)
    : '';
  const initialTab = getActiveTab();
  const shouldUpdateHash = !initialHash && initialTab !== 'credits';
  switchSubView(initialTab, shouldUpdateHash);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// --- 21. SERVICE WORKER & PWA AUTO-UPDATE (POCKETFLOW PARITY) ---
if ('serviceWorker' in navigator) {
  let hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;

  function triggerPwaReload() {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  }

  function showPwaUpdateBanner() {
    const banner = document.getElementById('pwa-update-banner');
    if (banner) {
      banner.classList.remove('hidden');
    }
  }

  // When SW claims control, reload immediately if idle, or prompt user
  if (typeof navigator.serviceWorker.addEventListener === 'function') {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) {
        hadController = true;
        return;
      }
      // Defer reload with update banner whenever any modal is open
      if (hasOpenModal()) {
        showPwaUpdateBanner();
      } else {
        triggerPwaReload();
      }
    });
  }

  const registerPwaServiceWorker = () => {
    // updateViaCache: 'none' bypasses HTTP caching for sw.js byte checks
    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then((reg) => {
      // Actively check for SW updates when page loads
      reg.update().catch(() => {});

      // If an update is downloaded & ready
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showPwaUpdateBanner();
            }
          });
        }
      });

      // Re-check for updates whenever user returns to the app tab or focuses window
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          reg.update().catch(() => {});
        }
      });
      window.addEventListener('focus', () => {
        reg.update().catch(() => {});
      });
    }).catch(err => {
      console.log('SW registration note:', err);
    });
  };

  if (document.readyState === 'complete') {
    registerPwaServiceWorker();
  } else {
    window.addEventListener('load', registerPwaServiceWorker);
  }

  // Bind update button immediately if DOM is ready, or on DOMContentLoaded
  const bindPwaUpdateBtn = () => {
    const updateBtn = document.getElementById('pwa-update-btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', triggerPwaReload);
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindPwaUpdateBtn);
  } else {
    bindPwaUpdateBtn();
  }
}

// Expose inline event handler functions on window for HTML onclick bindings
if (typeof window !== 'undefined') {
  Object.assign(window, {
    closeAnnualBreakdownModal,
    jumpToCredit,
    jumpToLoyalty,
    loadDemoStarterPack,
    openAnnualBreakdownModal,
    openCardDateModal,
    openManageCardsModal,
    openPerkActionModal,
    selectAdvisorCategory,
    setAdvisorMode,
    setCreditsViewMode,
    setOwnershipFilter,
    setPeriodFilter,
    switchPeriodFromModal,
    switchSubView,
    toggleCardDetailExpand,
    toggleCardOwnership,
    toggleCreditClaim,
    toggleCreditSkip,
    toggleFncStatus,
    unmuteCredit
  });
}

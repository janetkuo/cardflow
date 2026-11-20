// CardFlow Google Drive Cloud Sync Module

import { currentLang, t } from './i18n.js';
import { appState, setAppState, normalizeAppState, saveState } from './state.js';
import { showToast, showConfirmDialog, closeModalEl } from './ui-core.js';

let driveRestoreCallback = null;
export function registerDriveRestoreCallback(fn) {
  driveRestoreCallback = typeof fn === 'function' ? fn : null;
}

// --- 18. GOOGLE DRIVE CLOUD SYNC MODULE ---
// Out-of-the-box Default Client ID (same authorized origin as PocketFlow)
export const DEFAULT_GDRIVE_CLIENT_ID = '592001205133-6f41prs5p41s92e61pae5eb34rs05as2.apps.googleusercontent.com';
export const GDRIVE_FILE_NAME = 'cardflow_backup.json';
export const GDRIVE_CLIENT_ID_KEY = 'cardflow_gdrive_client_id_v1';
export const GDRIVE_TOKEN_KEY = 'cardflow_gdrive_token_v1';
export const GDRIVE_TOKEN_EXPIRES_KEY = 'cardflow_gdrive_token_expires_v1';
export const GDRIVE_USER_EMAIL_KEY = 'cardflow_gdrive_user_email_v1';
export const GDRIVE_CONNECTED_KEY = 'cardflow_gdrive_connected_v1';
export const GDRIVE_AUTO_SYNC_KEY = 'cardflow_gdrive_auto_sync_v1';
export const GDRIVE_LAST_SYNC_KEY = 'cardflow_gdrive_last_sync_v1';

export let gdriveToken = null;
export let gdriveTokenExpiresAt = 0;
let gdriveTokenClient = null;

// Clean up any legacy OAuth tokens previously persisted in localStorage
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(GDRIVE_TOKEN_KEY);
    localStorage.removeItem(GDRIVE_TOKEN_EXPIRES_KEY);
  }
} catch (_) {}

export function getGoogleClientId() {
  const custom = (localStorage.getItem(GDRIVE_CLIENT_ID_KEY) || '').trim();
  return custom || DEFAULT_GDRIVE_CLIENT_ID;
}

export async function fetchGoogleDriveUserInfo(token) {
  try {
    const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress)', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user && data.user.emailAddress) {
        localStorage.setItem(GDRIVE_USER_EMAIL_KEY, data.user.emailAddress);
        updateDriveUI();
      }
    }
  } catch (e) {
    console.log('Failed to fetch Drive user info:', e);
  }
}

export function updateDriveUI() {
  const badge = document.getElementById('gdrive-status-badge');
  const lastSyncEl = document.getElementById('gdrive-last-sync-label');
  const inputEl = document.getElementById('gdrive-client-id-input');
  const autoSyncCheck = document.getElementById('gdrive-auto-sync-check');
  const signoutRow = document.getElementById('gdrive-signout-row');

  if (inputEl && document.activeElement !== inputEl) {
    inputEl.value = localStorage.getItem(GDRIVE_CLIENT_ID_KEY) || '';
    inputEl.placeholder = DEFAULT_GDRIVE_CLIENT_ID;
  }

  const isConnected = localStorage.getItem(GDRIVE_CONNECTED_KEY) === 'true';
  const userEmail = localStorage.getItem(GDRIVE_USER_EMAIL_KEY);
  const hasActiveToken = Boolean(gdriveToken && Date.now() < gdriveTokenExpiresAt - 10000);

  if (badge) {
    if (hasActiveToken || isConnected) {
      const emailDisplay = userEmail ? ` (${userEmail})` : '';
      badge.innerText = `${t('gdriveStatusConnected')}${emailDisplay}`;
      badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
    } else {
      badge.innerText = t('gdriveStatusDisconnected');
      badge.className = 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700';
    }
  }

  if (signoutRow) {
    if (hasActiveToken || isConnected) signoutRow.classList.remove('hidden');
    else signoutRow.classList.add('hidden');
  }

  const lastSync = localStorage.getItem(GDRIVE_LAST_SYNC_KEY);
  if (lastSyncEl) {
    if (lastSync) {
      lastSyncEl.innerText = `${currentLang === 'zh-TW' ? '最後同步' : 'Last sync'}: ${lastSync}`;
    } else {
      lastSyncEl.innerText = t('gdriveLastSyncLabel');
    }
  }

  if (autoSyncCheck) {
    autoSyncCheck.checked = localStorage.getItem(GDRIVE_AUTO_SYNC_KEY) === 'true';
  }
}

let isDriveBackupInFlight = false;
let driveAutoSyncTimer = null;

export function clearStaleDriveToken() {
  gdriveToken = null;
  gdriveTokenExpiresAt = 0;
  localStorage.removeItem(GDRIVE_TOKEN_KEY);
  localStorage.removeItem(GDRIVE_TOKEN_EXPIRES_KEY);
  updateDriveUI();
}

export function requestGoogleDriveToken(onSuccess, onError) {
  const notifyError = (err) => {
    if (typeof onError === 'function') onError(err);
  };

  const clientId = getGoogleClientId();
  if (!clientId) {
    showToast(t('gdriveNoClientIdPrompt'), 3500);
    const input = document.getElementById('gdrive-client-id-input');
    if (input) input.focus();
    notifyError(new Error('Missing Client ID'));
    return;
  }

  if (gdriveToken && Date.now() < gdriveTokenExpiresAt - 30000) {
    onSuccess(gdriveToken);
    return;
  }

  if (typeof window === 'undefined' || typeof window.google === 'undefined' || !window.google.accounts || !window.google.accounts.oauth2) {
    showToast(currentLang === 'zh-TW' ? 'Google 服務腳本尚未載入完成，請檢查網路連線或重新整理頁面。' : 'Google Identity Services library not yet loaded. Please check your internet connection.', 3500);
    notifyError(new Error('GIS not loaded'));
    return;
  }

  try {
    gdriveTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.file',
      callback: (resp) => {
        if (resp && resp.access_token) {
          gdriveToken = resp.access_token;
          const expiresInSec = parseInt(resp.expires_in, 10) || 3599;
          gdriveTokenExpiresAt = Date.now() + expiresInSec * 1000;
          localStorage.setItem(GDRIVE_CONNECTED_KEY, 'true');
          fetchGoogleDriveUserInfo(gdriveToken);
          updateDriveUI();
          onSuccess(gdriveToken);
        } else {
          const errCode = resp?.error || 'oauth_cancelled';
          console.error('Google OAuth error:', resp);
          if (resp && resp.error && resp.error !== 'popup_closed_by_user') {
            showToast((currentLang === 'zh-TW' ? 'Google 登入失敗: ' : 'Google Sign-in failed: ') + (resp.error_description || resp.error), 3500);
          }
          notifyError(new Error(errCode));
        }
      },
      error_callback: (err) => {
        console.error('Google OAuth popup error:', err);
        notifyError(err instanceof Error ? err : new Error(err?.type || 'oauth_popup_error'));
      }
    });

    gdriveTokenClient.requestAccessToken({ prompt: '' });
  } catch (err) {
    console.error('Token Client init failed:', err);
    showToast((currentLang === 'zh-TW' ? '初始化 Google 登入失敗: ' : 'Failed to init Google Sign-in: ') + err.message, 3500);
    notifyError(err);
  }
}

export async function assertDriveResponseOk(res) {
  if (res.ok) return res;
  if (res.status === 401 || res.status === 403) {
    clearStaleDriveToken();
  }
  let detail = `HTTP ${res.status}`;
  try {
    const errBody = await res.json();
    if (errBody?.error?.message) detail = `${detail}: ${errBody.error.message}`;
  } catch (_) {}
  throw new Error(detail);
}

export async function backupToGoogleDrive(isSilent = false) {
  if (isDriveBackupInFlight) return;
  const backupBtn = document.getElementById('gdrive-backup-btn');
  if (backupBtn && !isSilent) backupBtn.disabled = true;

  requestGoogleDriveToken(
    async (token) => {
      if (isDriveBackupInFlight) {
        if (backupBtn && !isSilent) backupBtn.disabled = false;
        return;
      }
      isDriveBackupInFlight = true;
      try {
        const searchRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${GDRIVE_FILE_NAME}' and trashed=false&orderBy=modifiedTime%20desc&fields=files(id,name,modifiedTime)`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await assertDriveResponseOk(searchRes);
        const searchData = await searchRes.json();
        const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

        const fileData = JSON.stringify(appState, null, 2);

        if (existingFile) {
          const patchRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: fileData
          });
          await assertDriveResponseOk(patchRes);
        } else {
          const metadata = {
            name: GDRIVE_FILE_NAME,
            mimeType: 'application/json',
            description: 'CardFlow Credit Card & Loyalty Tracker Backup'
          };
          const boundary = '-------cardflow_boundary_' + Date.now();
          const delimiter = "\r\n--" + boundary + "\r\n";
          const close_delim = "\r\n--" + boundary + "--";

          const multipartRequestBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            fileData +
            close_delim;

          const postRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartRequestBody
          });
          await assertDriveResponseOk(postRes);
        }

        const now = new Date();
        const nowStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        localStorage.setItem(GDRIVE_LAST_SYNC_KEY, nowStr);
        updateDriveUI();

        if (!isSilent) {
          showToast(t('gdriveBackupSuccess'));
        }
      } catch (err) {
        console.error('Drive backup error:', err);
        if (!isSilent) {
          showToast((currentLang === 'zh-TW' ? '備份至 Google Drive 失敗: ' : 'Backup to Google Drive failed: ') + err.message, 3500);
        }
      } finally {
        isDriveBackupInFlight = false;
        if (backupBtn && !isSilent) backupBtn.disabled = false;
      }
    },
    () => {
      if (backupBtn && !isSilent) backupBtn.disabled = false;
    }
  );
}

export async function restoreFromGoogleDrive() {
  const restoreBtn = document.getElementById('gdrive-restore-btn');
  if (restoreBtn) restoreBtn.disabled = true;

  requestGoogleDriveToken(
    async (token) => {
      try {
        const searchRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${GDRIVE_FILE_NAME}' and trashed=false&orderBy=modifiedTime%20desc&fields=files(id,name,modifiedTime)`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await assertDriveResponseOk(searchRes);
        const searchData = await searchRes.json();
        const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

        if (!existingFile) {
          showToast(t('gdriveNoBackupFound'), 3500);
          return;
        }

        const downloadRes = await fetch(
          `https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await assertDriveResponseOk(downloadRes);
        const parsed = await downloadRes.json();
        const normalized = normalizeAppState(parsed, true);

        const modTimeStr = existingFile.modifiedTime ? new Date(existingFile.modifiedTime).toLocaleString() : '未知';
        const confirmMsg = currentLang === 'zh-TW'
          ? `找到雲端備份（更新時間: ${modTimeStr}），確定要還原覆蓋目前資料嗎？`
          : `Found cloud backup (modified: ${modTimeStr}). Restore and overwrite current state?`;

        showConfirmDialog({
          title: t('confirmDriveRestoreTitle'),
          message: confirmMsg,
          confirmLabel: t('confirmBtnProceed'),
          dangerous: false,
          onConfirm: () => {
            setAppState(normalized);
            saveState(true);
            if (driveRestoreCallback) driveRestoreCallback();
            showToast(t('gdriveRestoreSuccess'));
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) closeModalEl(settingsModal);
          }
        });
      } catch (err) {
        console.error('Drive restore error:', err);
        showToast((currentLang === 'zh-TW' ? '從 Google Drive 還原失敗: ' : 'Restore from Google Drive failed: ') + err.message, 3500);
      } finally {
        if (restoreBtn) restoreBtn.disabled = false;
      }
    },
    () => {
      if (restoreBtn) restoreBtn.disabled = false;
    }
  );
}

export function handleDriveAutoSync() {
  if (localStorage.getItem(GDRIVE_AUTO_SYNC_KEY) === 'true' && gdriveToken && Date.now() < gdriveTokenExpiresAt - 30000) {
    if (typeof setTimeout === 'function') {
      if (typeof clearTimeout === 'function' && driveAutoSyncTimer) {
        clearTimeout(driveAutoSyncTimer);
      }
      driveAutoSyncTimer = setTimeout(() => {
        driveAutoSyncTimer = null;
        backupToGoogleDrive(true);
      }, 1500);
    } else {
      backupToGoogleDrive(true);
    }
  }
}


export function setDriveTokenState(token, expiresAt = 0) {
  gdriveToken = token;
  gdriveTokenExpiresAt = expiresAt;
}

export function signOutGoogleDrive() {
  if (gdriveToken && typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.oauth2) {
    try { window.google.accounts.oauth2.revoke(gdriveToken, () => {}); } catch (e) {}
  }
  gdriveToken = null;
  gdriveTokenExpiresAt = 0;
  localStorage.removeItem(GDRIVE_TOKEN_KEY);
  localStorage.removeItem(GDRIVE_TOKEN_EXPIRES_KEY);
  localStorage.removeItem(GDRIVE_USER_EMAIL_KEY);
  localStorage.removeItem(GDRIVE_CONNECTED_KEY);
  updateDriveUI();
  showToast(currentLang === 'zh-TW' ? '已登出 Google 帳號' : 'Signed out of Google account');
}

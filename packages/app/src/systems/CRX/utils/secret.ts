import dayjs from 'dayjs';
import { decrypt, encrypt } from 'fuels';
import { AUTO_LOCK_IN_MINUTES } from '~/config';

const SALT_KEY = 'salt';

async function createSalt() {
  const salt = crypto.randomUUID();
  await chrome.storage.local.set({ salt });
  return salt;
}

async function getSalt(): Promise<string> {
  const data = await chrome.storage.local.get(SALT_KEY);
  return data.salt;
}

export async function clearSession() {
  chrome.storage.local.remove('salt');
  chrome.storage.session.clear();
}

export async function getTimer(): Promise<number> {
  const { timer } = await chrome.storage.session.get('timer');
  return timer || 0;
}

export async function resetTimer() {
  const { lockTime } = await chrome.storage.session.get('lockTime');
  chrome.storage.session.set({
    timer: dayjs().add(lockTime, 'minute').valueOf(),
  });
}

export async function saveLockTimeSetting(minutes: number) {
  await chrome.storage.local.set({ userLockTime: minutes });
}

export async function saveSecret(secret: string, autoLockInMinutes: number) {
  const salt = await createSalt();
  try {
    const { userLockTime } = await chrome.storage.local.get('userLockTime');
    const effectiveLockTime = userLockTime || autoLockInMinutes;

    const encrypted = await encrypt(salt, secret);
    chrome.storage.session.set({
      data: encrypted,
      lockTime: effectiveLockTime,
      timer: dayjs().add(effectiveLockTime, 'minute').valueOf(),
    });
  } catch {
    clearSession();
  }
}

export async function loadSecret() {
  const salt = await getSalt();
  const { data: encrypted, timer } = await chrome.storage.session.get([
    'data',
    'timer',
  ]);

  if (salt && timer > Date.now()) {
    try {
      const secret = await decrypt<string>(salt, encrypted);
      return secret;
    } catch {
      // ignore error
    }
  }

  clearSession();
  return null;
}

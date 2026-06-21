import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  formatDuration,
  formatDate,
  clampProgress,
  resolveStatus,
  BooksStore,
  MAX_PROGRESS,
} from './store.js';

// --- formatDuration ---

describe('formatDuration()', () => {
  test('0分はハイフンを返す', () => {
    expect(formatDuration(0)).toBe('-');
  });

  test('60分未満は「X分」形式で返す', () => {
    expect(formatDuration(30)).toBe('30分');
  });

  test('ちょうど60分は「1時間」形式で返す', () => {
    expect(formatDuration(60)).toBe('1時間');
  });

  test('60分超は「X時間Y分」形式で返す', () => {
    expect(formatDuration(90)).toBe('1時間30分');
  });

  test('nullはハイフンを返す', () => {
    expect(formatDuration(null)).toBe('-');
  });
});

// --- formatDate ---

describe('formatDate()', () => {
  test('YYYY-MM-DD形式をYYYY/MM/DDに変換する', () => {
    expect(formatDate('2026-06-21')).toBe('2026/06/21');
  });

  test('月・日が1桁の場合もゼロ埋めのまま返す', () => {
    expect(formatDate('2026-01-05')).toBe('2026/01/05');
  });

  test('空文字はハイフンを返す', () => {
    expect(formatDate('')).toBe('-');
  });

  test('nullはハイフンを返す', () => {
    expect(formatDate(null)).toBe('-');
  });
});

// --- clampProgress ---

describe('clampProgress()', () => {
  test('0〜100の範囲内の値はそのまま返す', () => {
    expect(clampProgress(50)).toBe(50);
  });

  test('0は0を返す（境界値）', () => {
    expect(clampProgress(0)).toBe(0);
  });

  test('100は100を返す（境界値）', () => {
    expect(clampProgress(100)).toBe(100);
  });

  test('0未満は0に切り上げる', () => {
    expect(clampProgress(-1)).toBe(0);
  });

  test('100超は100に切り捨てる', () => {
    expect(clampProgress(150)).toBe(MAX_PROGRESS);
  });

  test('数値に変換できない文字列は0を返す', () => {
    expect(clampProgress('abc')).toBe(0);
  });
});

// --- resolveStatus ---

describe('resolveStatus()', () => {
  test('読了率100%なら選択に関わらず done を返す', () => {
    expect(resolveStatus(100, 'reading')).toBe('done');
  });

  test('読了率100%で want を選択していても done を返す', () => {
    expect(resolveStatus(100, 'want')).toBe('done');
  });

  test('読了率99%なら選択したステータスをそのまま返す', () => {
    expect(resolveStatus(99, 'reading')).toBe('reading');
  });

  test('読了率0%なら選択したステータスをそのまま返す', () => {
    expect(resolveStatus(0, 'want')).toBe('want');
  });
});

// --- BooksStore ---

describe('BooksStore', () => {
  let store;

  beforeEach(() => {
    const storage = {};
    const localStorageMock = {
      getItem: key => storage[key] ?? null,
      setItem: (key, value) => { storage[key] = value; },
    };
    store = new BooksStore({ localStorage: localStorageMock });
  });

  test('初期状態は空の配列を返す', () => {
    expect(store.getAll()).toEqual([]);
  });

  test('add() で本を追加すると getAll() に反映される', () => {
    store.add({ id: 1, title: '坊っちゃん', progress: 0, status: 'want' });

    expect(store.getAll()).toHaveLength(1);
    expect(store.getAll()[0].title).toBe('坊っちゃん');
  });

  test('add() は先頭に追加される', () => {
    store.add({ id: 1, title: '坊っちゃん', progress: 0, status: 'want' });
    store.add({ id: 2, title: '吾輩は猫である', progress: 0, status: 'want' });

    expect(store.getAll()[0].title).toBe('吾輩は猫である');
  });

  test('update() で指定IDのフィールドを更新できる', () => {
    store.add({ id: 1, title: '坊っちゃん', progress: 0, status: 'want' });
    store.update(1, { progress: 50, status: 'reading' });

    expect(store.getAll()[0].progress).toBe(50);
    expect(store.getAll()[0].status).toBe('reading');
  });

  test('update() は他のフィールドを保持する', () => {
    store.add({ id: 1, title: '坊っちゃん', progress: 0, status: 'want' });
    store.update(1, { progress: 100 });

    expect(store.getAll()[0].title).toBe('坊っちゃん');
  });

  test('remove() で指定IDの本を削除できる', () => {
    store.add({ id: 1, title: '坊っちゃん', progress: 0, status: 'want' });
    store.add({ id: 2, title: '吾輩は猫である', progress: 0, status: 'want' });
    store.remove(1);

    expect(store.getAll()).toHaveLength(1);
    expect(store.getAll()[0].id).toBe(2);
  });

  test('remove() で存在しないIDを指定しても他のデータは保持される', () => {
    store.add({ id: 1, title: '坊っちゃん', progress: 0, status: 'want' });
    store.remove(999);

    expect(store.getAll()).toHaveLength(1);
  });

  test('getAll() は内部配列のコピーを返す（直接操作不可）', () => {
    store.add({ id: 1, title: '坊っちゃん', progress: 0, status: 'want' });
    const books = store.getAll();
    books.push({ id: 2, title: '改ざん' });

    expect(store.getAll()).toHaveLength(1);
  });
});

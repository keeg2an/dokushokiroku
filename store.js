export const STORAGE_KEY = 'dokusho_books';
export const MAX_PROGRESS = 100;

export const STATUS_LABELS = { want: '読みたい', reading: '読書中', done: '読了' };
export const STATUS_CLASSES = { want: 'badge-want', reading: 'badge-reading', done: 'badge-done' };

export function formatDuration(totalMinutes) {
  if (!totalMinutes || totalMinutes <= 0) return '-';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}分`;
  if (minutes === 0) return `${hours}時間`;
  return `${hours}時間${minutes}分`;
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${year}/${month}/${day}`;
}

export function clampProgress(value) {
  return Math.min(MAX_PROGRESS, Math.max(0, Number(value) || 0));
}

export function resolveStatus(progress, selectedStatus) {
  return progress === MAX_PROGRESS ? 'done' : selectedStatus;
}

export class BooksStore {
  #books = [];
  #onSaveError;
  #storage;

  constructor({ onSaveError = () => {}, localStorage: storage = globalThis.localStorage } = {}) {
    this.#onSaveError = onSaveError;
    this.#storage = storage;
  }

  load() {
    try {
      this.#books = JSON.parse(this.#storage.getItem(STORAGE_KEY) || '[]');
    } catch {
      this.#books = [];
    }
  }

  save() {
    try {
      this.#storage.setItem(STORAGE_KEY, JSON.stringify(this.#books));
    } catch (error) {
      this.#onSaveError(error);
    }
  }

  getAll() {
    return [...this.#books];
  }

  add(book) {
    this.#books.unshift(book);
    this.save();
  }

  update(id, fields) {
    const idx = this.#books.findIndex(book => book.id === id);
    if (idx === -1) return;
    this.#books[idx] = { ...this.#books[idx], ...fields };
    this.save();
  }

  remove(id) {
    this.#books = this.#books.filter(book => book.id !== id);
    this.save();
  }
}

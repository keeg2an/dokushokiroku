import { BooksStore, clampProgress, resolveStatus } from './store.js';
import { render, renderEditRow } from './ui.js';

const tbody = document.getElementById('books-list');
const emptyState = document.getElementById('empty-state');
const saveErrorMessage = document.getElementById('save-error');

const store = new BooksStore({
  onSaveError: () => {
    saveErrorMessage.style.display = 'block';
  },
});

store.load();

function refresh() {
  render(store.getAll(), tbody, emptyState, {
    onUpdate: startEdit,
    onDelete: deleteBook,
  });
}

function startEdit(id) {
  const book = store.getAll().find(book => book.id === id);
  if (!book) return;
  document.getElementById(`row-${id}`).replaceWith(
    renderEditRow(book, { onSave: commitEdit, onCancel: refresh })
  );
}

function commitEdit(id) {
  const titleInput = document.getElementById(`e-title-${id}`);
  if (!titleInput.value.trim()) {
    titleInput.focus();
    return;
  }

  const progress = clampProgress(document.getElementById(`e-progress-${id}`).value);
  store.update(id, {
    title: titleInput.value.trim(),
    date: document.getElementById(`e-date-${id}`).value,
    duration: Number(document.getElementById(`e-duration-${id}`).value) || 0,
    progress,
    status: resolveStatus(progress, document.getElementById(`e-status-${id}`).value),
  });

  refresh();
}

function deleteBook(id) {
  if (!confirm('この記録を削除しますか？')) return;
  store.remove(id);
  refresh();
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

document.getElementById('register-form').addEventListener('submit', event => {
  event.preventDefault();

  const title = document.getElementById('title').value.trim();
  if (!title) return;

  const progress = clampProgress(document.getElementById('progress').value);
  store.add({
    id: Date.now(),
    title,
    date: document.getElementById('date').value,
    duration: Number(document.getElementById('duration').value) || 0,
    progress,
    status: resolveStatus(progress, document.getElementById('status').value),
  });

  event.target.reset();
  document.getElementById('date').value = todayString();
  refresh();
});

document.getElementById('date').value = todayString();
refresh();

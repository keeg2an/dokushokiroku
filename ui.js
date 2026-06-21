import { STATUS_LABELS, STATUS_CLASSES, MAX_PROGRESS, formatDate, formatDuration } from './store.js';

export function createProgressCell(progress) {
  const cell = document.createElement('td');
  const container = document.createElement('div');
  container.className = 'progress-cell';

  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-valuenow', progress);
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', String(MAX_PROGRESS));

  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  fill.style.width = `${progress}%`;
  bar.appendChild(fill);

  const text = document.createElement('span');
  text.className = 'progress-text';
  text.textContent = `${progress}%`;

  container.append(bar, text);
  cell.appendChild(container);
  return cell;
}

function createStatusOption(value, label, selectedValue) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  option.selected = value === selectedValue;
  return option;
}

export function renderRow(book, { onUpdate, onDelete }) {
  const progress = book.progress ?? 0;
  const tr = document.createElement('tr');
  tr.id = `row-${book.id}`;

  const titleCell = document.createElement('td');
  titleCell.textContent = book.title;

  const dateCell = document.createElement('td');
  dateCell.textContent = formatDate(book.date);

  const durationCell = document.createElement('td');
  durationCell.textContent = formatDuration(book.duration);

  const statusCell = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = `badge ${STATUS_CLASSES[book.status]}`;
  badge.textContent = STATUS_LABELS[book.status];
  statusCell.appendChild(badge);

  const updateButton = document.createElement('button');
  updateButton.className = 'btn btn-update';
  updateButton.textContent = '更新';
  updateButton.setAttribute('aria-label', `${book.title} を更新`);
  updateButton.addEventListener('click', () => onUpdate(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.className = 'btn btn-delete';
  deleteButton.textContent = '削除';
  deleteButton.setAttribute('aria-label', `${book.title} を削除`);
  deleteButton.addEventListener('click', () => onDelete(book.id));

  const actionWrapper = document.createElement('div');
  actionWrapper.className = 'action-buttons';
  actionWrapper.append(updateButton, deleteButton);

  const actionCell = document.createElement('td');
  actionCell.appendChild(actionWrapper);

  tr.append(titleCell, dateCell, durationCell, createProgressCell(progress), statusCell, actionCell);
  return tr;
}

export function renderEditRow(book, { onSave, onCancel }) {
  const tr = document.createElement('tr');
  tr.id = `row-${book.id}`;
  tr.classList.add('editing');

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = `e-title-${book.id}`;
  titleInput.value = book.title;
  titleInput.required = true;

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = `e-date-${book.id}`;
  dateInput.value = book.date || '';

  const durationInput = document.createElement('input');
  durationInput.type = 'number';
  durationInput.id = `e-duration-${book.id}`;
  durationInput.value = book.duration || '';
  durationInput.min = '0';
  durationInput.placeholder = '分';

  const progressInput = document.createElement('input');
  progressInput.type = 'number';
  progressInput.id = `e-progress-${book.id}`;
  progressInput.value = book.progress ?? 0;
  progressInput.min = '0';
  progressInput.max = String(MAX_PROGRESS);

  const statusSelect = document.createElement('select');
  statusSelect.id = `e-status-${book.id}`;
  Object.entries(STATUS_LABELS).forEach(([value, label]) => {
    statusSelect.appendChild(createStatusOption(value, label, book.status));
  });

  const saveButton = document.createElement('button');
  saveButton.className = 'btn btn-save';
  saveButton.textContent = '保存';
  saveButton.addEventListener('click', () => onSave(book.id));

  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn btn-cancel';
  cancelButton.textContent = 'キャンセル';
  cancelButton.addEventListener('click', onCancel);

  const actionWrapper = document.createElement('div');
  actionWrapper.className = 'action-buttons';
  actionWrapper.append(saveButton, cancelButton);

  const cells = [titleInput, dateInput, durationInput, progressInput, statusSelect, actionWrapper].map(element => {
    const cell = document.createElement('td');
    cell.appendChild(element);
    return cell;
  });

  tr.append(...cells);
  return tr;
}

export function render(books, tbody, emptyState, callbacks) {
  tbody.innerHTML = '';

  if (books.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  books.forEach(book => tbody.appendChild(renderRow(book, callbacks)));
}

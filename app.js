const STATUS_LABELS = { want: '読みたい', reading: '読書中', done: '読了' };
const STATUS_CLASSES = { want: 'badge-want', reading: 'badge-reading', done: 'badge-done' };

let books = JSON.parse(localStorage.getItem('dokusho_books') || '[]');

function save() {
  localStorage.setItem('dokusho_books', JSON.stringify(books));
}

function formatDuration(min) {
  if (!min || min <= 0) return '-';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const [y, mo, d] = dateStr.split('-');
  return `${y}/${mo}/${d}`;
}

function renderRow(book) {
  const progress = book.progress ?? 0;
  const tr = document.createElement('tr');
  tr.id = `row-${book.id}`;
  tr.innerHTML = `
    <td>${escHtml(book.title)}</td>
    <td>${formatDate(book.date)}</td>
    <td>${formatDuration(book.duration)}</td>
    <td>
      <div class="progress-cell">
        <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
        <span class="progress-text">${progress}%</span>
      </div>
    </td>
    <td><span class="badge ${STATUS_CLASSES[book.status]}">${STATUS_LABELS[book.status]}</span></td>
    <td>
      <div class="action-buttons">
        <button class="btn btn-update" onclick="startEdit(${book.id})">更新</button>
        <button class="btn btn-delete" onclick="deleteBook(${book.id})">削除</button>
      </div>
    </td>
  `;
  return tr;
}

function renderEditRow(book) {
  const tr = document.createElement('tr');
  tr.id = `row-${book.id}`;
  tr.classList.add('editing');
  tr.innerHTML = `
    <td><input type="text" id="e-title-${book.id}" value="${escAttr(book.title)}" required></td>
    <td><input type="date" id="e-date-${book.id}" value="${book.date || ''}"></td>
    <td><input type="number" id="e-duration-${book.id}" value="${book.duration || ''}" min="0" placeholder="分"></td>
    <td><input type="number" id="e-progress-${book.id}" value="${book.progress ?? 0}" min="0" max="100"></td>
    <td>
      <select id="e-status-${book.id}">
        <option value="want" ${book.status === 'want' ? 'selected' : ''}>読みたい</option>
        <option value="reading" ${book.status === 'reading' ? 'selected' : ''}>読書中</option>
        <option value="done" ${book.status === 'done' ? 'selected' : ''}>読了</option>
      </select>
    </td>
    <td>
      <div class="action-buttons">
        <button class="btn btn-save" onclick="commitEdit(${book.id})">保存</button>
        <button class="btn btn-cancel" onclick="render()">キャンセル</button>
      </div>
    </td>
  `;
  return tr;
}

function render() {
  const tbody = document.getElementById('books-list');
  const empty = document.getElementById('empty-state');
  tbody.innerHTML = '';

  if (books.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  books.forEach(book => tbody.appendChild(renderRow(book)));
}

function startEdit(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  const existing = document.getElementById(`row-${id}`);
  existing.replaceWith(renderEditRow(book));
}

function commitEdit(id) {
  const titleEl = document.getElementById(`e-title-${id}`);
  if (!titleEl.value.trim()) {
    titleEl.focus();
    return;
  }

  const idx = books.findIndex(b => b.id === id);
  books[idx] = {
    ...books[idx],
    title: titleEl.value.trim(),
    date: document.getElementById(`e-date-${id}`).value,
    duration: Number(document.getElementById(`e-duration-${id}`).value) || 0,
    progress: Math.min(100, Math.max(0, Number(document.getElementById(`e-progress-${id}`).value) || 0)),
    status: document.getElementById(`e-status-${id}`).value,
  };

  save();
  render();
}

function deleteBook(id) {
  if (!confirm('この記録を削除しますか？')) return;
  books = books.filter(b => b.id !== id);
  save();
  render();
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escAttr(str) {
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  if (!title) return;

  const book = {
    id: Date.now(),
    title,
    date: document.getElementById('date').value,
    duration: Number(document.getElementById('duration').value) || 0,
    progress: Math.min(100, Math.max(0, Number(document.getElementById('progress').value) || 0)),
    status: document.getElementById('status').value,
  };

  books.unshift(book);
  save();
  render();

  e.target.reset();
  document.getElementById('date').value = todayStr();
});

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

document.getElementById('date').value = todayStr();
render();

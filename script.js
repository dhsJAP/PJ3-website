const gallery = document.getElementById('gallery');
const timeline = document.getElementById('timeline');
const form = document.getElementById('memoryForm');
const imgFileInput = document.getElementById('imgFile');
const dateInput = document.getElementById('date');

function createMemoryCard(memory, index) {
  const card = document.createElement('div');
  card.className = 'memory-card';
  card.style.animationDelay = `${index * 0.1}s`; // Tạo hiệu ứng đổ lần lượt

  // Ảnh
  const img = document.createElement('img');
  img.src = memory.imgUrl;
  img.alt = 'Ảnh kỷ niệm';

  // Mô tả
  const desc = document.createElement('div');
  desc.className = 'memory-desc';
  desc.textContent = memory.description;

  // Nút xoá
  const btnDelete = document.createElement('button');
  btnDelete.className = 'delete-btn';
  btnDelete.textContent = 'Xoá';
  btnDelete.title = 'Xoá kỷ niệm này';
  btnDelete.addEventListener('click', () => {
    removeMemory(index);
  });

  card.appendChild(img);
  card.appendChild(desc);
  card.appendChild(btnDelete);

  return card;
}

function createTimelineItem(memory) {
  const li = document.createElement('li');

  const dateSpan = document.createElement('div');
  dateSpan.className = 'timeline-date';
  dateSpan.textContent = new Date(memory.date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const descSpan = document.createElement('div');
  descSpan.className = 'timeline-desc';
  descSpan.textContent = memory.description;

  li.appendChild(dateSpan);
  li.appendChild(descSpan);

  return li;
}

function loadMemories() {
  const memories = JSON.parse(localStorage.getItem('memories')) || [];
  return memories;
}

function saveMemories(memories) {
  localStorage.setItem('memories', JSON.stringify(memories));
}

function render() {
  const memories = loadMemories();

  // Sắp xếp theo ngày tăng dần
  memories.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Xóa hết hiện tại
  gallery.innerHTML = '';
  timeline.innerHTML = '';

  memories.forEach((memory, idx) => {
    // Tạo card ảnh
    const card = createMemoryCard(memory, idx);
    gallery.appendChild(card);

    // Tạo timeline
    const timelineItem = createTimelineItem(memory);
    timeline.appendChild(timelineItem);
  });
}

function removeMemory(index) {
  let memories = loadMemories();
  memories.splice(index, 1);
  saveMemories(memories);
  render();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const file = imgFileInput.files[0];
  const description = form.description.value.trim();
  const date = form.date.value;

  if (!file) {
    alert('Bạn cần chọn 1 ảnh!');
    return;
  }
  if (!description) {
    alert('Bạn cần nhập kỷ niệm!');
    return;
  }
  if (!date) {
    alert('Bạn cần chọn ngày kỷ niệm!');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const base64img = event.target.result;

    const memories = loadMemories();
    memories.push({ imgUrl: base64img, description, date });
    saveMemories(memories);
    render();
    form.reset();
  };
  reader.readAsDataURL(file);
});

// Khởi động
render();

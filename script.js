const catCursor = document.getElementById('cat-cursor');

if (catCursor) {
  document.addEventListener('mousemove', (e) => {
    catCursor.style.left = e.clientX + 'px';
    catCursor.style.top = e.clientY + 'px';
  });
}
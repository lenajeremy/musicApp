const you = document.getElementById('syu');
you.addEventListener('touchcancel', (e) => {
  console.log(e.touches[0].clientX)
})
// JavaScript for the menubar of the homepage
const menuBarBtn = document.querySelector('.menu-bar');
const menuContent = document.querySelector('.menubarContent ');
const menuContentOverlay = document.querySelector('.menubarContentOverlay');

menuBarBtn.addEventListener('click', () => {
  menuContent.style.transform = 'translateX(0%)';
  makeActive(menuContentOverlay);
  menuContentOverlay.addEventListener('click', function you() {
    menuContentOverlay.removeEventListener('click', you)
    menuContent.style.transform = 'translateX(-100%)';
    makeActive(menuContentOverlay)
  });


  menuContent.addEventListener('touchstart', (e) => {
    let array = [];
    array.push(e.touches[0].clientX);
    menuContent.addEventListener('touchmove', doSomeStuff);

    function doSomeStuff(e) {
      menuContent.addEventListener('touchend', touchUpHandler);
      menuContent.removeEventListener('touchmove', doSomeStuff);
      array.push(e.touches[0].clientX);

      function touchUpHandler(e) {
        console.log(array)
        menuContent.removeEventListener('touchmove', doSomeStuff);
        if (array[array.length - 1] - array[0] < 0) {
          handleDirection('left');
        } else {
          handleDirection('right')
        };
      }
    }
  })
})

function handleDirection(direction) {
  console.log('handle direction')
  if (direction == 'left') {
    menuContent.style.transform = 'translateX(-100%)';
  }
  makeActive(menuContentOverlay);

}

// PlUS BUTTON
const plusButton = document.querySelector('.extras');
const plusButtonValue = document.querySelector('.extrasValue');
plusButton.addEventListener('click', () => {
  // plusButtonValue.classList.toggle('active');
  makeActive(plusButtonValue);
});

// Create a song section
function songCreator(object) {
  const songDiv = document.createElement('div');
  songDiv.className = 'song'
  const container = document.createElement('div');
  container.className = 'container';
  const thumbnail = document.createElement('div');
  thumbnail.className = 'thumbnail';
  const imageThumbnail = document.createElement('img');
  imageThumbnail.src = object.thumbnail;
  const title = document.createElement('div');
  title.className = 'title';
  const songTitle = document.createElement('h5');
  songTitle.className = 'songTitle';
  songTitle.textContent = object.title;
  const small = document.createElement('small');
  const singer = document.createElement('p');
  singer.textContent = object.singer.length === 1 ? object.singer[0] : `${object.singer[0]} Ft ${object.singer[1]}`;
  singer.className = 'singer';
  const audio = document.createElement('audio');
  const pause = document.createElement('div');
  pause.className = 'pause';
  const fontAwesome = document.createElement('i');
  fontAwesome.className = 'fa fa-pause';
  pause.appendChild(fontAwesome)
  audio.src = object.src;
  small.appendChild(singer);
  title.appendChild(songTitle);
  title.appendChild(small);
  thumbnail.appendChild(imageThumbnail);
  container.appendChild(thumbnail);
  container.appendChild(title);
  container.appendChild(audio);
  container.appendChild(pause)
  songDiv.appendChild(container);
  document.querySelector('.songArea').appendChild(songDiv);
}

// Getting Data from the API
fetch('database/songs.json')
  .then(result => result.json().then(doStuffWithData))
  .catch((err) => {
    console.error(error)
  });

function makeActive(object) {
  if (object.classList.contains('active')) {
    object.classList.remove('active');
  } else {
    object.classList.add('active');
  }
}

// Song playing Functionality

function doStuffWithData(data) {
  const {
    songs
  } = data;
  for (let song of songs) {
    songCreator(song)
  }
  setSongFunctionality();
}

function setSongFunctionality() {
  const songDiv = document.querySelectorAll('.song');
  songDiv.forEach(song => {
    console.log(song)
    song.addEventListener('click', () => {
      stopActiveSongs()
      song.classList.toggle('active');
      audio = song.querySelector('audio');
      audio.play()
        .then(() => {
          loopFunctionality(audio);
        });
    })
  });
}

function stopActiveSongs() {
  const songDiv = document.querySelectorAll('.song');
  songDiv.forEach(song => {
    song.classList.remove('active');
    audio = song.querySelector('audio');
    song.querySelector('svg').classList.remove('fa-play')
    song.querySelector('svg').classList.add('fa-pause');
    audio.pause();
    audio.currentTime = 0;
  })
}

function pauseFunctionality(song) {
  const pauseBtn = song.querySelector('.pause')
  pauseBtn.addEventListener('click', function pauseHandler(e) {
    e.stopPropagation()
    // pauseBtn.removeEventListener('click', pauseHandler);
    console.log('pause button')
    const audio = song.querySelector('audio');
    console.log(audio.paused, 'before')
    if (audio.paused) {
      audio.play();
      pauseBtn.querySelector('svg').classList.remove('fa-play');
      pauseBtn.querySelector('svg').classList.add('fa-pause');
    } else {
      audio.pause()
      pauseBtn.querySelector('svg').classList.remove('fa-pause');
      pauseBtn.querySelector('svg').classList.add('fa-play');
    }
    console.log(audio.paused, 'after')
  })
}

function loopFunctionality(audio) {
  pauseFunctionality(audio.parentElement);
  const songDiv = document.querySelectorAll('.song');
  audio.addEventListener('ended', () => {
    console.log('song has ended');
  songDiv[Array.from(songDiv).indexOf(audio.parentElement.parentElement) + 1].click();
  })
}

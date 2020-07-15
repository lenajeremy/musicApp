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
  singer.textContent = singers(object.singer);

  function singers(singers) {
    let string = '';
    for (let singer of singers) {
      if (singer == singers[singers.length - 1]) {
        string += singer;
      } else string += singer + ' Ft ';
    }
    return string;
  }

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
    console.error(err)
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
  console.log('original songs:', songs)
  function sortData(songs, value) {
    if (value === 'toSortAsc') {
      document.querySelectorAll('.song').forEach(song => song.remove())
      for (let song of songs.sort((a, b) => a.index - b.index)) {
        songCreator(song);
      }
      console.log('songs was sorted ascending')
    } else {
      document.querySelectorAll('.song').forEach(song => song.remove())
      for (let song of songs.sort((a, b) => b.index - a.index)) {
        songCreator(song);
      }
      console.log('songs was sorted descending')
    }
    howToSort();
  }
  sortData(songs, 'toSortAsc')

  function howToSort() {
    const sortBtn = document.querySelector('.sortBtn');
    sortBtn.addEventListener('click', function sortBtnFunct() {
      sortBtn.removeEventListener('click', sortBtnFunct);
      // console.log(`before ${sortBtn.classList}`);
      if (sortBtn.classList.contains('asc')) {
        sortBtn.classList.replace('asc', 'desc');
        console.log('to sort Descending');
        sortData(songs, 'toSortDesc');
      } else {
        sortBtn.classList.replace('desc', 'asc');
        console.log('to sort asc');
        sortData(songs, 'toSortAsc');
      }
      console.log(sortBtn.classList);
      // console.log(`after ${sortBtn.classList}`);
      setSongFunctionality();
    })
  }
  setSongFunctionality()
}

function setSongFunctionality() {
  const songDiv = document.querySelectorAll('.song');
  songDiv.forEach(song => {
    song.addEventListener('click', () => {
      stopActiveSongs()
      song.classList.toggle('active');
      audio = song.querySelector('audio');
      audio.play()
        .then(() => {
          loopFunctionality(audio);
        });
    });
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
    const audio = song.querySelector('audio');
    if (audio.paused) {
      audio.play();
      pauseBtn.querySelector('svg').classList.remove('fa-play');
      pauseBtn.querySelector('svg').classList.add('fa-pause');
    } else {
      audio.pause()
      pauseBtn.querySelector('svg').classList.remove('fa-pause');
      pauseBtn.querySelector('svg').classList.add('fa-play');
    }
  })
}

function loopFunctionality(audio) {
  pauseFunctionality(audio.parentElement);
  const songDiv = document.querySelectorAll('.song');
  audio.addEventListener('ended', () => {
    songDiv[Array.from(songDiv).indexOf(audio.parentElement.parentElement) + 1].click();
  })
}

function generalPlayButton() {
  const allSongs = document.querySelectorAll('.song');
  const generalPlay = document.querySelector('.play');
  const isInPlay = document.querySelector('.song.active');
  generalPlay.addEventListener('click', function toBeNamedLater() {
    const svg = generalPlay.querySelector('svg')
    if (svg.classList.contains('fa-play')) {
      svg.classList.replace('fa-play', 'fa-pause');
      if (!isInPlay) {
        allSongs[3].click();
      } else isInPlay.click();
    } else {
      svg.classList.replace('fa-pause', 'fa-play');
    }
  })
}
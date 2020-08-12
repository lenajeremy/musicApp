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
  makeActive(plusButtonValue);
});

// Create a song section
function songCreator(object) {
  const songDiv = document.createElement('div');
  songDiv.className = 'song'
  songDiv.setAttribute('data-short', object.shortTitle);
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
fromLocal();

function fromLocal() {
  fetch('database/songs.json')
    .then(result => result.json().then(doStuffWithData))
    .catch((err) => {
      console.log(err)
    });
}

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

  function sortData(songs, value) {
    if (value === 'toSortAsc') {
      document.querySelectorAll('.song').forEach(song => song.remove())
      for (let song of songs.sort((a, b) => a.index - b.index)) {
        songCreator(song);
      }

    } else {
      document.querySelectorAll('.song').forEach(song => song.remove())
      for (let song of songs.sort((a, b) => b.index - a.index)) {
        songCreator(song);
      }
    }
    howToSort();
  }
  sortData(songs, 'toSortAsc')

  function howToSort() {
    const sortBtn = document.querySelector('.sortBtn');
    sortBtn.addEventListener('click', function sortBtnFunct() {
      sortBtn.removeEventListener('click', sortBtnFunct);
      if (sortBtn.classList.contains('asc')) {
        sortBtn.classList.replace('asc', 'desc');
        sortData(songs, 'toSortDesc');
      } else {
        sortBtn.classList.replace('desc', 'asc');
        sortData(songs, 'toSortAsc');
      }
      setSongFunctionality();
    })
  }
  setSongFunctionality()
}

function setSongFunctionality() {
  const songDiv = document.querySelectorAll('.song');
  songDiv.forEach(song => {
    song.addEventListener('click', () => {
      titleViewer(song);
      stopActiveSongs()
      document.querySelector('.btn-pause').querySelector('svg').classList.replace('fa-play', 'fa-pause')
      song.classList.toggle('active');
      audio = song.querySelector('audio');
      audio.play()
        .then(() => {
          loopFunctionality(audio);
        });
    });
  });
  bottomPauseButton()
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
  const pauseBtn = song.querySelector('.pause');
  const pauseBottomBtn = document.querySelector('.btn-pause');
  pauseBtn.addEventListener('click', function pauseHandler(e) {
    e.stopPropagation()
    const audio = song.querySelector('audio');
    if (audio.paused) {
      audio.play();
      pauseBtn.querySelector('svg').classList.replace('fa-play', 'fa-pause');
      pauseBottomBtn.querySelector('svg').classList.replace('fa-play', 'fa-pause');
    } else {
      audio.pause()
      pauseBtn.querySelector('svg').classList.replace('fa-pause', 'fa-play');
      pauseBottomBtn.querySelector('svg').classList.replace('fa-pause', 'fa-play');
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

function bottomPauseButton() {
  const pauseBtn = document.querySelector('.btn-pause');
  const prevBtn = document.querySelector('.btn-prev');
  const nextBtn = document.querySelector('.btn-next');
  pauseBtn.addEventListener('click', function doStuff() {
    let currentSong = document.querySelector('.song.active');
    if (currentSong === null) {
      currentSong = document.querySelectorAll('.song')[0]
      currentSong.click();
    } else {
      currentSong.querySelector('.pause').click();
    }
    console.log(currentSong);
    const audio = currentSong.querySelector('audio');
    if (audio.paused) {
      pauseBtn.querySelector('svg').classList.replace('fa-pause', 'fa-play');
    } else {
      pauseBtn.querySelector('svg').classList.replace('fa-play', 'fa-pause');
    }
  })
  prevBtn.addEventListener('click', () => moveSongPrev('-'));
  nextBtn.addEventListener('click', () => moveSongPrev('+'));

  function moveSongPrev(operation) {
    const currentSong = document.querySelector('.song.active');
    const allSongs = document.querySelectorAll('.song');
    let indexCurrent = Array.from(allSongs).indexOf(currentSong);
    console.log(operation);
    switch (indexCurrent) {
      case 0:
        currentSong.click()
        break;
      default:
        if (operation == '-') {
          Array.from(allSongs)[indexCurrent - 1].click()
        } else {
          if (indexCurrent + 1 === allSongs.length) {
            currentSong.click();
          } else {
            Array.from(allSongs)[indexCurrent + 1].click()
          }
          break;
        }
    }
  }
}

function titleViewer(song) {
  const songTitle = document.querySelector('.aboutSong .songTitle');
  const singer = document.querySelector('.aboutSong .singer');
  const image = document.querySelector('.songViewer img');
  let singerToBe = song.querySelector('.singer').textContent;
  if (singerToBe.indexOf('Ft') == -1) {
    singer.textContent = singerToBe;
  } else singer.textContent = getUsefulString(singerToBe);

  function getUsefulString(string) {
    string = string.split('').slice(0, string.indexOf('Ft')).join('').trim();
    return string;
  }
  songTitle.textContent = song.getAttribute('data-short');
  image.src = song.querySelector('img').src;
}

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  if (e.currentTarget.querySelector('input').value != '') {
    fetch('https://api.deezer.com/search?q=' + e.currentTarget.querySelector('input').value)
      .then(data => data.json())
      .then(data => recreateData(data))
      .catch(err => console.log(err))
  }
})


function recreateData(gotten) {
  let {
    data
  } = gotten;
  data = data.sort(a => a.title)
  console.log(data)

  function sortData(data, value) {
    if (value === 'toSortAsc') {
      document.querySelectorAll('.song').forEach(song => song.remove())
      for (let song of data.sort((a, b) => a.index - b.index)) {
        songRecreator(song);
      }

    } else {
      document.querySelectorAll('.song').forEach(song => song.remove())
      for (let song of data.sort((a, b) => b.index - a.index)) {
        songRecreator(song);
      }
    }
    howToSort();
  }
  sortData(data, 'toSortAsc')

  function howToSort() {
    const sortBtn = document.querySelector('.sortBtn');
    sortBtn.addEventListener('click', function sortBtnFunct() {
      sortBtn.removeEventListener('click', sortBtnFunct);
      if (sortBtn.classList.contains('asc')) {
        sortBtn.classList.replace('asc', 'desc');
        sortData(data, 'toSortDesc');
      } else {
        sortBtn.classList.replace('desc', 'asc');
        sortData(data, 'toSortAsc');
      }
      setSongFunctionality();
    })
  }
  setSongFunctionality()
}

function songRecreator(object) {
  const songDiv = document.createElement('div');
  songDiv.className = 'song'
  songDiv.setAttribute('data-short', object.title_short);
  const container = document.createElement('div');
  container.className = 'container';
  const thumbnail = document.createElement('div');
  thumbnail.className = 'thumbnail';
  const imageThumbnail = document.createElement('img');
  imageThumbnail.src = object.album.cover_small;
  const title = document.createElement('div');
  title.className = 'title';
  const songTitle = document.createElement('h5');
  songTitle.className = 'songTitle';
  songTitle.textContent = object.title;
  const small = document.createElement('small');
  const singer = document.createElement('p');
  singer.textContent = object.artist.name;

  singer.className = 'singer';
  const audio = document.createElement('audio');
  const pause = document.createElement('div');
  pause.className = 'pause';
  const fontAwesome = document.createElement('i');
  fontAwesome.className = 'fa fa-pause';
  pause.appendChild(fontAwesome)
  audio.src = object.preview;
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
const tabLinks = document.querySelectorAll('.tabLinks');
tabLinks.forEach(link => link.addEventListener('click', () => {
  tabLinks.forEach(tabLink => tabLink.classList.remove('active'))
  link.classList.add('active')
}))
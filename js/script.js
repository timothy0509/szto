const API_URL = 'https://api.lanyard.rest/v1/users/511031197455876128';
const elements = {
  musicDisplayBox: document.getElementById('music-display-box'),
  musicContent: document.getElementById('music-content'),
  loadingSpinner: document.getElementById('loading-spinner'),
  albumArt: document.getElementById('album-art'),
  songTitle: document.getElementById('song-title'),
  artistName: document.getElementById('artist-name'),
  albumName: document.getElementById('album-name'),
  statusMessage: document.getElementById('status-message'),
  textContent: document.getElementById('text-content'),
  profilePic: document.getElementById('profile-pic'),
  statusTag: document.querySelector('.status-tag'),
  logo: document.querySelector('.logo'),
  themeToggle: document.getElementById('theme-toggle'),
  body: document.body,
  navLinks: document.querySelectorAll('.nav-link'),
  sections: document.querySelectorAll('.content-section'),
  loader: document.getElementById('loader'),
  timezoneInfo: document.getElementById('timezone-info'),
  birthdayCountdown: document.getElementById('birthday-countdown')
};
let currentTrackId = null;

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  elements.body.classList.add(savedTheme);
  elements.themeToggle.checked = savedTheme === 'dark';
  elements.themeToggle.addEventListener('change', () => {
    elements.body.classList.toggle('dark');
    elements.body.classList.toggle('light');
    localStorage.setItem('theme', elements.body.classList.contains('dark') ? 'dark' : 'light');
  });
}

function showSection(sectionId, isInitialLoad = false) {
  const currentSection = document.querySelector('.content-section.active');
  const targetSection = document.getElementById(sectionId);

  elements.navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
  });

  elements.sections.forEach(section => {
    section.querySelectorAll('.fade-item').forEach(item => item.classList.remove('visible'));
  });

  if (currentSection && currentSection.id !== sectionId) {
    currentSection.classList.add('fading-out');
    setTimeout(() => {
      currentSection.classList.remove('active', 'fading-out');
      targetSection.classList.add('active');
      targetSection.querySelectorAll('.fade-item').forEach((item, index) => {
        setTimeout(() => item.classList.add('visible'), index * 50);
      });
    }, 300);
  } else {
    targetSection.classList.add('active');
    targetSection.querySelectorAll('.fade-item').forEach((item, index) => {
      setTimeout(() => item.classList.add('visible'), index * 50);
    });
  }
}

function initializeNavigation() {
  elements.navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showSection(link.getAttribute('data-section'));
    });
  });
}

function initializeLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      elements.loader.classList.add('hidden');
      showSection('about', true);
    }, 300);
  });
}

function updateTimezone() {
  const update = () => {
    const date = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Hong_Kong',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    elements.timezoneInfo.textContent = `My time is now ${date} (GMT + 8)`;
  };
  setInterval(update, 1000);
  update();
}

function updateBirthdayCountdown() {
  const currentDate = new Date();
  let birthdayDate = new Date(`January 20, ${currentDate.getFullYear()} 00:00:00 GMT+0800`);
  const oneDay = 24 * 60 * 60 * 1000;

  if (currentDate.toDateString() === birthdayDate.toDateString()) {
    elements.birthdayCountdown.textContent = 'Right Now!';
  } else {
    if (currentDate > birthdayDate) {
      birthdayDate.setFullYear(currentDate.getFullYear() + 1);
    }
    const diff = birthdayDate - currentDate;
    const days = Math.round(diff / oneDay);
    const hours = Math.floor((diff % oneDay) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    elements.birthdayCountdown.textContent = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }
}

function adjustFontSize(element, threshold, defaultClass, smallClass) {
  element.classList.remove(defaultClass, smallClass);
  element.classList.add(element.textContent.length > threshold ? smallClass : defaultClass);
}

function updateMusicDisplay(musicData, discordStatus, avatarUrl, musicSource) {
  elements.profilePic.src = avatarUrl || 'https://via.placeholder.com/200';
  elements.statusTag.classList.toggle('online', discordStatus && discordStatus !== 'offline');
  elements.statusTag.textContent = discordStatus && discordStatus !== 'offline' ? 'Online' : 'Offline';

  if (musicSource === 'Spotify') {
    elements.logo.src = 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg';
    elements.logo.alt = 'Spotify Logo';
    elements.logo.classList.remove('hidden');
  } else if (musicSource === 'Tidal') {
    elements.logo.src = 'https://w7.pngwing.com/pngs/973/746/png-transparent-tidal-round-logo-tech-companies-thumbnail.png';
    elements.logo.alt = 'Tidal Logo';
    elements.logo.classList.remove('hidden');
  } else {
    elements.logo.classList.add('hidden');
    elements.logo.src = '';
    elements.logo.alt = '';
  }

  if (musicData) {
    elements.albumArt.src = musicData.album_art_url || 'https://via.placeholder.com/100';
    elements.albumArt.alt = musicData.album || 'Album Art';
    elements.songTitle.textContent = musicData.song || 'Unknown Song';
    elements.artistName.textContent = `by ${musicData.artist || 'Unknown Artist'}`;
    elements.albumName.textContent = `on ${musicData.album || 'Unknown Album'}`;
    elements.statusMessage.textContent = musicSource ? `Listening on ${musicSource}` : '';

    adjustFontSize(elements.songTitle, 30, 'text-2xl', 'text-xl');
    adjustFontSize(elements.artistName, 40, 'text-base', 'text-sm');
    adjustFontSize(elements.albumName, 40, 'text-base', 'text-sm');

    elements.textContent.classList.remove('text-center');
    elements.textContent.classList.add('md:items-start', 'text-left');
    elements.albumArt.classList.remove('hidden');
  } else {
    elements.albumArt.classList.add('hidden');
    elements.songTitle.textContent = '';
    elements.artistName.textContent = '';
    elements.albumName.textContent = '';
    elements.statusMessage.textContent = 'Not currently listening to Spotify or Tidal.';
    elements.songTitle.classList.remove('text-xl');
    elements.songTitle.classList.add('text-2xl');
    elements.artistName.classList.remove('text-sm');
    elements.artistName.classList.add('text-base');
    elements.albumName.classList.remove('text-sm');
    elements.albumName.classList.add('text-base');
    elements.textContent.classList.add('text-center');
    elements.textContent.classList.remove('md:items-start', 'text-left');
  }
  elements.musicContent.classList.remove('hidden');
}

async function fetchMusicData() {
  try {
    if (elements.musicContent.classList.contains('hidden')) {
      elements.loadingSpinner.classList.remove('hidden');
    }
    elements.musicContent.classList.add('hidden');

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const { success, data } = await response.json();

    if (success && data) {
      const { spotify, activities = [], discord_status, discord_user } = data;
      const avatarUrl = discord_user ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png` : null;

      let tidal = null;
      for (const activity of activities) {
        if (activity.name === 'TIDAL' && activity.details && activity.state) {
          let albumArtUrl = null;
          if (activity.assets?.large_image) {
            if (activity.assets.large_image.startsWith('mp:external/')) {
              albumArtUrl = `https://media.discordapp.net/${activity.assets.large_image.replace('mp:', '')}`;
            } else if (activity.assets.large_image.startsWith('https://')) {
              albumArtUrl = activity.assets.large_image;
            } else {
              albumArtUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
            }
          }
          tidal = {
            track_id: activity.id || null,
            song: activity.details,
            artist: activity.state,
            album: activity.assets?.large_text || 'Unknown Album',
            album_art_url: albumArtUrl
          };
          break;
        }
      }

      const musicData = spotify || tidal;
      const musicSource = spotify ? 'Spotify' : tidal ? 'Tidal' : null;
      const newTrackId = musicData ? musicData.track_id : null;

      if (newTrackId !== currentTrackId || elements.musicContent.classList.contains('hidden')) {
        currentTrackId = newTrackId;
        updateMusicDisplay(musicData, discord_status, avatarUrl, musicSource);
      }
    } else {
      if (currentTrackId !== null || elements.musicContent.classList.contains('hidden')) {
        currentTrackId = null;
        updateMusicDisplay(null, null, null, null);
      }
    }
  } catch (error) {
    console.error('Error fetching music data:', error);
    if (elements.statusMessage.textContent !== 'Failed to load music data. Please try again later.' || elements.musicContent.classList.contains('hidden')) {
      elements.albumArt.classList.add('hidden');
      elements.songTitle.textContent = '';
      elements.artistName.textContent = '';
      elements.albumName.textContent = '';
      elements.statusMessage.textContent = 'Failed to load music data. Please try again later.';
      elements.textContent.classList.add('text-center');
      elements.textContent.classList.remove('md:items-start', 'text-left');
      elements.profilePic.src = 'https://via.placeholder.com/200';
      elements.musicContent.classList.remove('hidden');
    }
  } finally {
    elements.loadingSpinner.classList.add('hidden');
  }
}

function initialize() {
  initializeTheme();
  initializeNavigation();
  initializeLoader();
  updateTimezone();
  setInterval(updateBirthdayCountdown, 1000);
  setInterval(fetchMusicData, 10000);
  document.addEventListener('DOMContentLoaded', () => {
    fetchMusicData();
    updateBirthdayCountdown();
  });
}

initialize();

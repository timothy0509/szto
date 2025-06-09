        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;
        themeToggle.addEventListener('change', () => {
        	body.classList.toggle('dark');
        	body.classList.toggle('light');
        	localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
        });
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.classList.add(savedTheme);
        themeToggle.checked = savedTheme === 'dark';

        // Handle page switching with fade-in and fade-out animations
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.content-section');

        function showSection(sectionId, isInitialLoad = false) {
        	const currentSection = document.querySelector('.content-section.active');
        	const targetSection = document.getElementById(sectionId);

        	// Update active navigation link
        	navLinks.forEach(link => {
        		link.classList.remove('active');
        		if (link.getAttribute('data-section') === sectionId) {
        			link.classList.add('active');
        		}
        	});

        	// Reset fade items in all sections to ensure animations replay
        	sections.forEach(section => {
        		const items = section.querySelectorAll('.fade-item');
        		items.forEach(item => item.classList.remove('visible'));
        	});

        	if (currentSection && currentSection.id !== sectionId) {
        		// Fade out current section
        		currentSection.classList.add('fading-out');
        		setTimeout(() => {
        			currentSection.classList.remove('active', 'fading-out');
        			// Fade in target section
        			targetSection.classList.add('active');
        			// Trigger item animations
        			const items = targetSection.querySelectorAll('.fade-item');
        			items.forEach((item, index) => {
        				setTimeout(() => {
        					item.classList.add('visible');
        				}, index * 100);
        			});
        		}, 500); // Match the transition duration
        	} else {
        		// No current section or same section, directly fade in the target
        		targetSection.classList.add('active');
        		// Trigger item animations (with delay for initial load to sync with loader)
        		const items = targetSection.querySelectorAll('.fade-item');
        		items.forEach((item, index) => {
        			setTimeout(() => {
        				item.classList.add('visible');
        			}, (isInitialLoad ? 1000 : 0) + index * 100);
        		});
        	}
        }

        navLinks.forEach(link => {
        	link.addEventListener('click', (e) => {
        		e.preventDefault();
        		const sectionId = link.getAttribute('data-section');
        		showSection(sectionId);
        	});
        });

        // Hide loader and trigger initial animations after page load
        window.addEventListener('load', () => {
        	const loader = document.getElementById('loader');
        	setTimeout(() => {
        		loader.classList.add('hidden');
        		// Trigger About section animations automatically
        		showSection('about', true);
        	}, 1000); // 1-second delay for loader
        });

        // Timezone Update
        window.addEventListener('DOMContentLoaded', () => {
        	const locationTimeElement = document.getElementById('timezone-info');

        	function updateLocationTime() {
        		const date = new Date().toLocaleString('en-US', {
        			timeZone: 'Asia/Hong_Kong',
        			hour: 'numeric',
        			minute: 'numeric',
        			second: 'numeric'
        		});
        		locationTimeElement.textContent = 'My time is now ' + date + ' (GMT + 8)';
        	}

        	setInterval(updateLocationTime, 1000);
        	updateLocationTime();
        });

        // Birthday Countdown
        function calculateCountdown() {
        	var currentDate = new Date();
        	var birthdayDate = new Date("January 20, " + currentDate.getFullYear() + " 00:00:00 GMT+0800");
        	var oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

        	if (currentDate.toDateString() === birthdayDate.toDateString()) {
        		document.getElementById("birthday-countdown").textContent = "Right Now!";
        	} else {
        		if (currentDate > birthdayDate) {
        			birthdayDate.setFullYear(currentDate.getFullYear() + 1); // Set next year's birthday
        		}

        		var daysRemaining = Math.round((birthdayDate - currentDate) / oneDay);
        		var hours = Math.floor((birthdayDate - currentDate) % oneDay / (1000 * 60 * 60));
        		var minutes = Math.floor((birthdayDate - currentDate) % (1000 * 60 * 60) / (1000 * 60));
        		var seconds = Math.floor((birthdayDate - currentDate) % (1000 * 60) / 1000);

        		document.getElementById("birthday-countdown").textContent = daysRemaining + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
        	}
        }

        setInterval(calculateCountdown, 1000);

        // Music Display Box and Profile Picture Script
        const API_URL = 'https://api.lanyard.rest/v1/users/511031197455876128';
        const musicDisplayBox = document.getElementById('music-display-box');
        const musicContentDiv = document.getElementById('music-content');
        const loadingSpinner = document.getElementById('loading-spinner');
        const albumArtImg = document.getElementById('album-art');
        const songTitleP = document.getElementById('song-title');
        const artistNameP = document.getElementById('artist-name');
        const albumNameP = document.getElementById('album-name');
        const statusMessageP = document.getElementById('status-message');
        const textContentDiv = document.getElementById('text-content');
        const discordStatusDiv = document.getElementById('discord-status');
        const profilePicImg = document.getElementById('profile-pic');
        const stat = document.getElementById('discord-activity-text');
        let currentTrackId = null;

        function adjustFontSize(element, threshold, defaultClass, smallClass) {
        	element.classList.remove(defaultClass, smallClass);
        	if (element.textContent.length > threshold) {
        		element.classList.add(smallClass);
        	} else {
        		element.classList.add(defaultClass);
        	}
        }

        function updateMusicDisplay(spotifyData, discordStatus, avatarUrl) {
        	// Update profile picture
        	if (avatarUrl) {
        		profilePicImg.src = avatarUrl;
        	} else {
        		profilePicImg.src = 'path/to/default-profile-pic.jpg'; // Fallback if no avatar
        	}

        	// Update Discord status
        	const statusTag = document.querySelector('.status-tag');

        	if (discordStatus) {
        		statusTag.classList.add('online');
        		statusTag.textContent = 'Online';
        	} else {
        		statusTag.classList.remove('online');
        		statusTag.textContent = 'Offline';
        	}

        	// Update music display
        	if (spotifyData) {
        		albumArtImg.src = spotifyData.album_art_url;
        		albumArtImg.alt = spotifyData.album;
        		songTitleP.textContent = spotifyData.song;
        		artistNameP.textContent = `by ${spotifyData.artist}`;
        		albumNameP.textContent = `on ${spotifyData.album}`;
        		statusMessageP.textContent = '';

        		adjustFontSize(songTitleP, 30, 'text-2xl', 'text-xl');
        		adjustFontSize(artistNameP, 40, 'text-base', 'text-sm');
        		adjustFontSize(albumNameP, 40, 'text-base', 'text-sm');

        		textContentDiv.classList.remove('text-center');
        		textContentDiv.classList.add('md:items-start', 'text-left');

        		albumArtImg.classList.remove('hidden');
        	} else {
        		albumArtImg.classList.add('hidden');
        		songTitleP.textContent = '';
        		artistNameP.textContent = '';
        		albumNameP.textContent = '';
        		statusMessageP.textContent = 'Not currently listening to Spotify.';

        		songTitleP.classList.remove('text-xl');
        		songTitleP.classList.add('text-2xl');
        		artistNameP.classList.remove('text-sm');
        		artistNameP.classList.add('text-base');
        		albumNameP.classList.remove('text-sm');
        		albumNameP.classList.add('text-base');

        		textContentDiv.classList.add('text-center');
        		textContentDiv.classList.remove('md:items-start', 'text-left');
        	}
        	musicContentDiv.classList.remove('hidden');
        }

        async function fetchMusicData() {
        	try {
        		if (musicContentDiv.classList.contains('hidden')) {
        			loadingSpinner.classList.remove('hidden');
        		}
        		musicContentDiv.classList.add('hidden');

        		const response = await fetch(API_URL);
        		if (!response.ok) {
        			throw new Error(`HTTP error! status: ${response.status}`);
        		}
        		const data = await response.json();

        		if (data.success && data.data) {
        			const spotify = data.data.spotify;
        			const newTrackId = spotify ? spotify.track_id : null;
        			const discordStatus = data.data.discord_status;
        			const avatarUrl = data.data.discord_user ? `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${data.data.discord_user.avatar}.png` : null;

        			if (newTrackId !== currentTrackId) {
        				currentTrackId = newTrackId;
        				updateMusicDisplay(spotify, discordStatus, avatarUrl);
        			} else if (musicContentDiv.classList.contains('hidden')) {
        				updateMusicDisplay(spotify, discordStatus, avatarUrl);
        			}
        		} else {
        			if (currentTrackId !== null) {
        				currentTrackId = null;
        				updateMusicDisplay(null, null, null);
        			} else if (musicContentDiv.classList.contains('hidden')) {
        				updateMusicDisplay(null, null, null);
        			}
        		}
        	} catch (error) {
        		console.error('Error fetching music data:', error);
        		if (statusMessageP.textContent !== 'Failed to load music data. Please try again later.' || musicContentDiv.classList.contains('hidden')) {
        			albumArtImg.classList.add('hidden');
        			songTitleP.textContent = '';
        			artistNameP.textContent = '';
        			albumNameP.textContent = '';
        			statusMessageP.textContent = 'Failed to load music data. Please try again later.';
        			textContentDiv.classList.add('text-center');
        			textContentDiv.classList.remove('md:items-start', 'text-left');
        			discordStatusDiv.classList.remove('online');
        			discordStatusDiv.classList.add('offline');
        			profilePicImg.src = 'path/to/default-profile-pic.jpg';
        			musicContentDiv.classList.remove('hidden');
        		}
        	} finally {
        		loadingSpinner.classList.add('hidden');
        	}
        }

        setInterval(fetchMusicData, 10000);
        document.addEventListener('DOMContentLoaded', fetchMusicData);
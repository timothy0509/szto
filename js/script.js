        document.addEventListener('DOMContentLoaded', () => {
            // Lanyard API Integration
            const lanyardApiUrl = 'https://api.lanyard.rest/v1/users/511031197455876128';
            const userNameElement = document.getElementById('userName');
            const userTagElement = document.getElementById('textToCopy');
            const discordProfileLink = document.getElementById('discordProfileLink');
            const deviceStatusContent = document.getElementById('device-status-content');
            const activitiesContent = document.getElementById('activities-content');

            // Function to fetch and display Lanyard data
            const fetchLanyardData = async () => {
                try {
                    const response = await fetch(lanyardApiUrl);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const { data } = await response.json();
                    
                    if (!data) {
                        throw new Error('No data found in Lanyard response.');
                    }

                    // Update User Info
                    if (userNameElement) userNameElement.textContent = data.global_name || data.discord_user.username;
                    if (userTagElement) userTagElement.textContent = data.discord_user.username;
                    if (discordProfileLink) discordProfileLink.href = `https://discord.com/users/${data.discord_user.id}`;
                    
                    // Update Device Status
                    let statusColor = '';
                    let statusText = '';
                    switch (data.discord_status) {
                        case 'online':
                            statusColor = 'text-green-500';
                            statusText = 'Active';
                            break;
                        case 'idle':
                            statusColor = 'text-yellow-500';
                            statusText = 'Active';
                            break;
                        case 'dnd':
                            statusColor = 'text-red-500';
                            statusText = 'Active';
                            break;
                        case 'offline':
                            statusColor = 'text-gray-500';
                            statusText = 'Offline';
                            break;
                        default:
                            statusColor = 'text-gray-500';
                            statusText = 'Offline';
                    }
                    
                    // Check for active clients
                    const isPcActive = data.active_on_discord_desktop;
                    const isWebActive = data.active_on_discord_web;
                    const isMobileConnected = data.active_on_discord_mobile;

                    deviceStatusContent.innerHTML = `
                        <div class="status-item">
                            <span>PC</span>
                            <span class="flex items-center gap-2">
                                <i class="fas fa-circle ${isPcActive ? statusColor : 'text-gray-500'}"></i> ${isPcActive ? statusText : 'Offline'}
                            </span>
                        </div>
                        <div class="status-item">
                            <span>Web</span>
                            <span class="flex items-center gap-2">
                                <i class="fas fa-circle ${isWebActive ? statusColor : 'text-gray-500'}"></i> ${isWebActive ? statusText : 'Offline'}
                            </span>
                        </div>
                        <div class="status-item">
                            <span>Mobile</span>
                            <span class="flex items-center gap-2">
                                <i class="fas fa-circle ${isMobileConnected ? statusColor : 'text-gray-500'}"></i> ${isMobileConnected ? 'Connected' : 'Offline'}
                            </span>
                        </div>
                    `;

                    // Update Activities
                    if (data.activities.length > 0) {
                        activitiesContent.innerHTML = ''; // Clear previous content
                        data.activities.forEach(activity => {
                            // NEW AND IMPROVED LOGIC FOR ACTIVITIES
                            // Listening to music
                            if (activity.type === 2) {
                                // Use Spotify icon if the name is 'Spotify', otherwise use a generic music icon
                                const iconClass = activity.name === 'Spotify' ? 'fab fa-spotify text-green-400' : 'fas fa-music text-purple-400';
                                const title = `Listening to ${activity.name}`;
                                const details = activity.details && activity.state ? `${activity.details} by ${activity.state}` : 'On Discord';

                                activitiesContent.innerHTML += `
                                    <div class="flex items-center gap-3">
                                        <i class="${iconClass} text-2xl"></i>
                                        <div class="flex flex-col">
                                            <p class="font-bold">${title}</p>
                                            <p class="text-sm opacity-70">${details}</p>
                                        </div>
                                    </div>
                                `;
                            // Playing a game
                            } else if (activity.type === 0 && activity.assets) {
                                activitiesContent.innerHTML += `
                                    <div class="flex items-center gap-3">
                                        <i class="fas fa-gamepad text-purple-400 text-2xl"></i>
                                        <div class="flex flex-col">
                                            <p class="font-bold">Playing ${activity.name}</p>
                                            <p class="text-sm opacity-70">${activity.state || 'In-game'}</p>
                                        </div>
                                    </div>
                                `;
                            }
                        });

                        // If no activities were parsed (e.g., custom status), show a default message.
                        if(activitiesContent.innerHTML === '') {
                             activitiesContent.innerHTML = `<p>No recent activity detected.</p>`;
                        }
                    } else {
                        activitiesContent.innerHTML = `<p>No recent activity detected.</p>`;
                    }

                } catch (error) {
                    console.error('Failed to fetch Lanyard data:', error);
                    deviceStatusContent.innerHTML = `<p class="text-red-400">Error fetching data.</p>`;
                    activitiesContent.innerHTML = `<p class="text-red-400">Error fetching data.</p>`;
                }
            };

            // Call the function initially and then set an interval for real-time updates
            fetchLanyardData();
            setInterval(fetchLanyardData, 1000); // Refresh every 10 seconds

            // Copy button functionality
            const copyButton = document.getElementById('copyButton');
            const textToCopy = document.getElementById('textToCopy');
            const copyMessage = document.getElementById('copyMessage');

            if (copyButton && textToCopy && copyMessage) {
                copyButton.addEventListener('click', () => {
                    const text = textToCopy.textContent;
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        // Use the older document.execCommand for wider compatibility in iFrames
                        document.execCommand('copy');
                        copyMessage.classList.add('show');
                        setTimeout(() => {
                            copyMessage.classList.remove('show');
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy text: ', err);
                    } finally {
                        document.body.removeChild(textarea);
                    }
                });
            }

            // Navbar scroll animation
            const mainNavbar = document.getElementById('mainNavbar');
            if (mainNavbar) {
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) {
                        mainNavbar.classList.add('scrolled');
                    } else {
                        mainNavbar.classList.remove('scrolled');
                    }
                });
            }

            // Title fade-in on scroll (Intersection Observer)
            const titles = document.querySelectorAll('.welcome-title');
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            titles.forEach(title => {
                observer.observe(title);
            });
            
            // Smooth scrolling for navigation links
            const navLinks = document.querySelectorAll('.navbar a');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent default anchor click behavior
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Active nav link on scroll
            // The sections we want to observe are now only the welcome-title elements
            const sections = document.querySelectorAll('.welcome-title');
            const navAnchors = document.querySelectorAll('.navbar a');

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Get the ID of the intersecting section
                        let id = entry.target.getAttribute('id');
                        // Get the corresponding navigation link
                        let navLink = document.querySelector(`.navbar a[href="#${id}"]`);

                        // Remove active class from all links
                        navAnchors.forEach(link => link.classList.remove('active-link'));
                        
                        // Add active class to the current link
                        if (navLink) {
                            navLink.classList.add('active-link');
                        }
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.5 // Adjust this value to trigger when half the section is visible
            });

            sections.forEach(section => {
                sectionObserver.observe(section);
            });

            // Set initial active link on page load
            const firstLink = document.querySelector('.navbar a[href="#home"]');
            if (firstLink) {
                firstLink.classList.add('active-link');
            }


            // Projects Carousel functionality
            const carousel = document.getElementById('projects-carousel');
            const leftBtn = document.getElementById('carousel-left');
            const rightBtn = document.getElementById('carousel-right');
            const cards = document.querySelectorAll('.projects-carousel .project-card-wrapper');
            const dotsContainer = document.getElementById('carousel-dots');

            let currentIndex = 0;
            const cardCount = cards.length;
            
            // Function to get the number of visible cards based on screen width
            const getVisibleCards = () => window.innerWidth >= 640 ? 2 : 1;
            
            let visibleCards = getVisibleCards();
            let maxIndex = cardCount - visibleCards;

            // Function to create navigation dots
            const createDots = () => {
                dotsContainer.innerHTML = '';
                const numDots = maxIndex + 1;
                for (let i = 0; i < numDots; i++) {
                    const dot = document.createElement('button');
                    dot.classList.add('carousel-dot');
                    dot.setAttribute('data-index', i);
                    dot.addEventListener('click', () => {
                        currentIndex = i;
                        updateCarousel();
                        updateDots();
                    });
                    dotsContainer.appendChild(dot);
                }
            };
            
            // Function to update the active dot
            const updateDots = () => {
                const dots = document.querySelectorAll('.carousel-dot');
                dots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            };

            // Function to update the carousel's position
            const updateCarousel = () => {
                const cardWidth = cards[0].offsetWidth;
                const gap = window.innerWidth >= 640 ? 16 : 0; // 1rem in px
                const slideDistance = (cardWidth + gap) * currentIndex;
                
                carousel.style.transform = `translateX(-${slideDistance}px)`;
                updateDots();
            };

            // Event listener for right button (with cycling logic)
            rightBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % (maxIndex + 1);
                updateCarousel();
            });

            // Event listener for left button (with cycling logic)
            leftBtn.addEventListener('click', () => {
                if (currentIndex === 0) {
                    currentIndex = maxIndex;
                } else {
                    currentIndex--;
                }
                updateCarousel();
            });

            // Update the carousel and dots on window resize
            window.addEventListener('resize', () => {
                currentIndex = 0; // Reset index on resize to prevent visual bugs
                visibleCards = getVisibleCards();
                maxIndex = cardCount - visibleCards;
                if (cardCount > visibleCards) {
                    createDots();
                    leftBtn.disabled = false;
                    rightBtn.disabled = false;
                } else {
                    dotsContainer.innerHTML = '';
                    leftBtn.disabled = true;
                    rightBtn.disabled = true;
                }
                updateCarousel();
            });

            // Initial call to set up the carousel and dots
            if (cardCount > visibleCards) {
                createDots();
            } else {
                leftBtn.disabled = true;
                rightBtn.disabled = true;
            }
            updateCarousel();
        });
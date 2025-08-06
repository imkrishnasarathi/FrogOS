document.addEventListener('DOMContentLoaded', function() {
    const savedWallpaper = localStorage.getItem('frogos-wallpaper');
    const savedCroakEnabled = localStorage.getItem('frogos-croak-enabled');
    
    if (savedWallpaper) {
        document.body.style.background = savedWallpaper;
    }
    
    if (savedCroakEnabled === null || savedCroakEnabled === 'true') {
        setTimeout(() => {
            playBootCroakSound();
        }, 1000);
    }
    
    function playBootCroakSound() {
        const croakAudio = new Audio();
        croakAudio.volume = 0.3;
        
        croakAudio.src = 'startup.mp3';
        croakAudio.play().catch(() => {
            console.log('🐸 Ribbit! Welcome to FrogOS!');
            
            const croakNotification = document.createElement('div');
            croakNotification.innerHTML = '🐸 Ribbit! Welcome to FrogOS!';
            croakNotification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(76, 175, 80, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-weight: bold;
                z-index: 10000;
                animation: fadeInOut 3s ease-in-out;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-20px); }
                    20% { opacity: 1; transform: translateY(0); }
                    80% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(croakNotification);
            
            setTimeout(() => {
                document.body.removeChild(croakNotification);
                document.head.removeChild(style);
            }, 3000);
        });
    }

    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);

    let currentWindow = null;
    let openWindows = [];
    let nextZIndex = 1000;
    let windowOffset = 0;

    function closeCurrentWindow() {
        if (currentWindow) {
            currentWindow.remove();
            openWindows = openWindows.filter(w => w !== currentWindow);
            currentWindow = null;
        }
    }

    function closeWindow(windowElement) {
        if (windowElement) {
            windowElement.remove();
            openWindows = openWindows.filter(w => w !== windowElement);
            if (currentWindow === windowElement) {
                currentWindow = null;
            }
        }
    }

    function createWindow(title, content, width = '500px', height = '400px', showCloseButton = true, isStartMenu = false) {
        if (isStartMenu) {
            closeCurrentWindow();
        }
        
        if (!isStartMenu) {
            const existingWindow = openWindows.find(w => w.querySelector('.window-title').textContent === title);
            if (existingWindow) {
                existingWindow.style.zIndex = nextZIndex++;
                return existingWindow;
            }
        }
        
        const window = document.createElement('div');
        window.className = 'window';
        
        if (window.innerWidth <= 768) {
            window.style.width = '95vw';
            window.style.height = Math.min(parseInt(height), window.innerHeight * 0.8) + 'px';
        } else {
            window.style.width = width;
            window.style.height = height;
        }
        
        window.style.zIndex = nextZIndex++;
        
        const closeButtonHtml = showCloseButton ? '<button class="window-close">×</button>' : '';
        
        window.innerHTML = `
            <div class="window-header">
                <span class="window-title">${title}</span>
                ${closeButtonHtml}
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;
        
        document.body.appendChild(window);
        
        openWindows.push(window);
        
        if (!isStartMenu) {
            if (window.innerWidth <= 768) {
                window.style.top = '10vh';
                window.style.left = '50%';
                window.style.transform = 'translateX(-50%)';
            } else {
                windowOffset += 30;
                if (windowOffset > 150) windowOffset = 0; 
                
                window.style.top = `calc(50% + ${windowOffset}px)`;
                window.style.left = `calc(50% + ${windowOffset}px)`;
            }
        }
        
        if (isStartMenu) {
            currentWindow = window;
        }
        
        const closeBtn = window.querySelector('.window-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (window.querySelector('.music-player')) {
                    const audioElements = window.querySelectorAll('audio');
                    audioElements.forEach(audio => {
                        audio.pause();
                        audio.currentTime = 0;
                    });
                    
                    const intervals = window.musicIntervals || [];
                    intervals.forEach(interval => clearInterval(interval));
                    window.musicIntervals = [];
                }
                
                // Cleanup games
                if (window.gameCleanup) {
                    window.gameCleanup();
                }
                
                closeWindow(window);
            });
        }
        
        if (showCloseButton) {
            makeDraggable(window);
        }
        
        window.addEventListener('mousedown', () => {
            window.style.zIndex = nextZIndex++;
        });
        
        return window;
    }

    function makeDraggable(windowElement) {
        const header = windowElement.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const rect = windowElement.getBoundingClientRect();
        const initialLeft = rect.left;
        const initialTop = rect.top;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.classList.contains('window-close')) return;
            
            const rect = windowElement.getBoundingClientRect();
            
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;

            if (e.target === header || e.target.classList.contains('window-title')) {
                isDragging = true;
                header.style.cursor = 'grabbing';
                
                windowElement.style.transform = 'none';
                windowElement.style.position = 'absolute';
                windowElement.style.left = rect.left + 'px';
                windowElement.style.top = rect.top + 'px';
                windowElement.style.margin = '0';
            }
        }

        function dragMove(e) {
            if (isDragging) {
                e.preventDefault();
                
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                const maxX = window.innerWidth - windowElement.offsetWidth;
                const maxY = window.innerHeight - windowElement.offsetHeight;
                
                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                windowElement.style.left = currentX + 'px';
                windowElement.style.top = currentY + 'px';
            }
        }

        function dragEnd() {
            isDragging = false;
            header.style.cursor = 'grab';
        }

        header.style.cursor = 'grab';
        header.style.userSelect = 'none';
    }

    document.getElementById('start').addEventListener('click', function() {
        const existingStartMenu = openWindows.find(w => w.classList.contains('start-menu-window'));
        
        if (existingStartMenu) {
            closeWindow(existingStartMenu);
            return;
        }
        
        const startMenuContent = `
            <div class="start-menu">
                <div class="start-menu-item" data-app="froggle">
                    <span class="start-icon">🌐</span>
                    <span>Froggle Browser</span>
                </div>
                <div class="start-menu-item" data-app="calculator">
                    <span class="start-icon">🔢</span>
                    <span>Frog Calculator</span>
                </div>
                <div class="start-menu-item" data-app="notes">
                    <span class="start-icon">📝</span>
                    <span>Lily Pad Notes</span>
                </div>
                <div class="start-menu-item" data-app="about">
                    <span class="start-icon">🐸</span>
                    <span>About FrogOS</span>
                </div>
                <hr style="margin: 10px 0; border: 1px solid rgba(255,255,255,0.2);">
                <div class="start-menu-item" data-app="lock">
                    <span class="start-icon">🔒</span>
                    <span>Lock Screen</span>
                </div>
            </div>
        `;
        
        const startWindow = createWindow('🐸 FrogOS Start Menu', startMenuContent, '350px', '320px', false, true);
        
        startWindow.style.bottom = '80px';
        startWindow.style.left = '20px';
        startWindow.style.top = 'auto';
        startWindow.style.transform = 'none';
        
        startWindow.classList.add('start-menu-window');
        
        startWindow.querySelectorAll('.start-menu-item').forEach(item => {
            item.addEventListener('click', function() {
                const app = this.getAttribute('data-app');
                openStartApp(app);
            });
        });
    });

    function openStartApp(app) {
        switch(app) {
            case 'froggle':
                openFroggleBrowser();
                break;
            case 'calculator':
                openCalculator();
                break;
            case 'notes':
                openNotes();
                break;
            case 'about':
                openAbout();
                break;
            case 'lock':
                window.location.href = 'index.html';
                break;
        }
    }

    function openFroggleBrowser() {
        const browserContent = `
            <div class="froggle-logo">
                <h1>🐸 Froggle</h1>
                <p>The Web, But Froggier!</p>
            </div>
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search the pond...">
                <button class="search-button">Ribbit Search</button>
            </div>
            <div class="search-results" id="froggle-results"></div>
        `;
        
        const window = createWindow('🌐 Froggle Browser', browserContent, '600px', '500px');
        
        const searchBtn = window.querySelector('.search-button');
        const searchInput = window.querySelector('.search-input');
        const results = window.querySelector('#froggle-results');
        
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value;
            if (query) {
                results.innerHTML = `
                    <div class="result-item">
                        <h3>🐸 Best Lily Pads for "${query}"</h3>
                        <p>Find the perfect lily pad spots for ${query} activities...</p>
                    </div>
                    <div class="result-item">
                        <h3>🪰 Fly Hunting Guide: ${query}</h3>
                        <p>Learn advanced techniques for catching flies while ${query}...</p>
                    </div>
                    <div class="result-item">
                        <h3>🎵 Croaking Songs About ${query}</h3>
                        <p>Top 10 frog songs featuring ${query} themes...</p>
                    </div>
                `;
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }

    function openCalculator() {
        const calcContent = `
            <div class="calculator">
                <div class="calc-display" id="calc-display">0</div>
                <div class="calc-buttons">
                    <button class="calc-btn" onclick="clearCalc()">C</button>
                    <button class="calc-btn" onclick="deleteLast()">⌫</button>
                    <button class="calc-btn operator" onclick="appendToCalc('/')">/</button>
                    <button class="calc-btn operator" onclick="appendToCalc('*')">×</button>
                    <button class="calc-btn" onclick="appendToCalc('7')">7</button>
                    <button class="calc-btn" onclick="appendToCalc('8')">8</button>
                    <button class="calc-btn" onclick="appendToCalc('9')">9</button>
                    <button class="calc-btn operator" onclick="appendToCalc('-')">-</button>
                    <button class="calc-btn" onclick="appendToCalc('4')">4</button>
                    <button class="calc-btn" onclick="appendToCalc('5')">5</button>
                    <button class="calc-btn" onclick="appendToCalc('6')">6</button>
                    <button class="calc-btn operator" onclick="appendToCalc('+')">+</button>
                    <button class="calc-btn" onclick="appendToCalc('1')">1</button>
                    <button class="calc-btn" onclick="appendToCalc('2')">2</button>
                    <button class="calc-btn" onclick="appendToCalc('3')">3</button>
                    <button class="calc-btn operator" onclick="calculate()" rowspan="2">=</button>
                    <button class="calc-btn zero" onclick="appendToCalc('0')">0</button>
                    <button class="calc-btn" onclick="appendToCalc('.')">.</button>
                </div>
            </div>
        `;
        
        createWindow('🔢 Frog Calculator', calcContent, '400px', '500px');
    }

    function openNotes() {
        const notesContent = `
            <textarea class="notepad-area" placeholder="Write your froggy thoughts here...
            
🐸 Remember to:
- Practice croaking daily
- Find the best lily pads
- Catch more flies
- Enjoy pond life!"></textarea>
        `;
        
        createWindow('📝 Lily Pad Notes', notesContent, '500px', '450px');
    }

    function openAbout() {
        const aboutContent = `
            <div class="about-content">
                <h2>🐸 FrogOS</h2>
                <p><strong>Version:</strong> 1.0 Ribbit</p>
                <p><strong>Build:</strong> Lily Pad Edition</p>
                <p><strong>Developer:</strong> Pond Technologies</p>
                <br>
                <p>Welcome to FrogOS - The most amphibious operating system!</p>
                <p>🌊 Perfect for pond life</p>
                <p>🪰 Optimized for fly catching</p>
                <p>🎵 Enhanced croaking capabilities</p>
            </div>
        `;
        
        createWindow('🐸 About FrogOS', aboutContent, '450px', '400px');
    }

    document.getElementById('music').addEventListener('click', function() {
        const musicContent = `
            <div class="music-player">
                <div class="now-playing">
                    <img src="frog.png" alt="Album Art" class="album-art">
                    <div class="track-info">
                        <h3>Now Playing</h3>
                        <p class="track-title">Midnight Pond Chorus</p>
                        <p class="artist">The Swamp Singers</p>
                    </div>
                </div>
                <div class="progress-section">
                    <div class="time-display">
                        <span class="current-time">0:00</span>
                        <span class="total-time">3:24</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                        <div class="progress-handle"></div>
                    </div>
                </div>
                <div class="player-controls">
                    <button class="control-btn" id="prev">⏮</button>
                    <button class="control-btn play-pause" id="play-pause">▶</button>
                    <button class="control-btn" id="next">⏭</button>
                </div>
                <div class="playlist">
                    <h4>🐸 Croaking Hits</h4>
                    <div class="playlist-item active" data-track="0">1. Midnight Pond Chorus - The Swamp Singers</div>
                    <div class="playlist-item" data-track="1">2. Ribbit Rhapsody - Lily Pad Orchestra</div>
                </div>
            </div>
        `;
        
        const musicWindow = createWindow('🎵 FrogBeats Music', musicContent, '500px', '480px');
        
        window.musicIntervals = window.musicIntervals || [];
        
        const playBtn = musicWindow.querySelector('#play-pause');
        const prevBtn = musicWindow.querySelector('#prev');
        const nextBtn = musicWindow.querySelector('#next');
        const trackTitle = musicWindow.querySelector('.track-title');
        const artist = musicWindow.querySelector('.artist');
        const playlistItems = musicWindow.querySelectorAll('.playlist-item');
        const progressBar = musicWindow.querySelector('.progress-bar');
        const progressFill = musicWindow.querySelector('.progress-fill');
        const progressHandle = musicWindow.querySelector('.progress-handle');
        const currentTimeEl = musicWindow.querySelector('.current-time');
        const totalTimeEl = musicWindow.querySelector('.total-time');
        
        let isPlaying = false;
        let currentTrack = 0;
        let audioElement = null;
        let progressInterval = null;
        
        const tracks = [
            {
                title: "Midnight Pond Chorus",
                artist: "The Swamp Singers",
                file: "song1.mp3",
                duration: "3:24"
            },
            {
                title: "Ribbit Rhapsody", 
                artist: "Lily Pad Orchestra",
                file: "song2.mp3",
                duration: "2:47"
            }
        ];
        
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        function updateProgress() {
            if (audioElement && !isNaN(audioElement.duration)) {
                const progress = (audioElement.currentTime / audioElement.duration) * 100;
                progressFill.style.width = progress + '%';
                progressHandle.style.left = progress + '%';
                currentTimeEl.textContent = formatTime(audioElement.currentTime);
                totalTimeEl.textContent = formatTime(audioElement.duration);
            }
        }
        
        function updateTrackInfo() {
            trackTitle.textContent = tracks[currentTrack].title;
            artist.textContent = tracks[currentTrack].artist;
            totalTimeEl.textContent = tracks[currentTrack].duration;
            currentTimeEl.textContent = "0:00";
            progressFill.style.width = '0%';
            progressHandle.style.left = '0%';
            
            playlistItems.forEach((item, index) => {
                item.classList.toggle('active', index === currentTrack);
            });
        }
        
        function playCurrentTrack() {
            if (audioElement) {
                audioElement.pause();
            }
            
            audioElement = new Audio(tracks[currentTrack].file);
            audioElement.play().catch(e => {
                console.log('Audio play failed:', e);
                simulateProgress();
            });
            
            isPlaying = true;
            playBtn.textContent = '⏸';
            
            progressInterval = setInterval(updateProgress, 100);
            window.musicIntervals.push(progressInterval);
            
            audioElement.addEventListener('ended', () => {
                nextTrack();
            });
            
            audioElement.addEventListener('loadedmetadata', () => {
                totalTimeEl.textContent = formatTime(audioElement.duration);
            });
        }
        
        function simulateProgress() {
            let simulatedTime = 0;
            const trackDuration = currentTrack === 0 ? 204 : 167;
            
            progressInterval = setInterval(() => {
                simulatedTime += 0.1;
                const progress = (simulatedTime / trackDuration) * 100;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    nextTrack();
                    return;
                }
                
                progressFill.style.width = progress + '%';
                progressHandle.style.left = progress + '%';
                currentTimeEl.textContent = formatTime(simulatedTime);
            }, 100);
            
            window.musicIntervals.push(progressInterval);
        }
        
        function pauseTrack() {
            if (audioElement) {
                audioElement.pause();
            }
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            isPlaying = false;
            playBtn.textContent = '▶';
        }
        
        function nextTrack() {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            currentTrack = (currentTrack + 1) % tracks.length;
            updateTrackInfo();
            if (isPlaying) {
                playCurrentTrack();
            }
        }
        
        function prevTrack() {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
            updateTrackInfo();
            if (isPlaying) {
                playCurrentTrack();
            }
        }
        
        playBtn.addEventListener('click', function() {
            if (isPlaying) {
                pauseTrack();
            } else {
                playCurrentTrack();
            }
        });
        
        nextBtn.addEventListener('click', nextTrack);
        prevBtn.addEventListener('click', prevTrack);
        
        progressBar.addEventListener('click', function(e) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = (clickX / rect.width) * 100;
            
            progressFill.style.width = percentage + '%';
            progressHandle.style.left = percentage + '%';
            
            if (audioElement && !isNaN(audioElement.duration)) {
                audioElement.currentTime = (percentage / 100) * audioElement.duration;
            }
        });
        
        playlistItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                if (progressInterval) {
                    clearInterval(progressInterval);
                }
                currentTrack = index;
                updateTrackInfo();
                if (isPlaying) {
                    playCurrentTrack();
                }
            });
        });
        
        updateTrackInfo();
        
        const musicCloseBtn = musicWindow.querySelector('.window-close');
        if (musicCloseBtn) {
            musicCloseBtn.addEventListener('click', () => {
                if (audioElement) {
                    audioElement.pause();
                    audioElement.currentTime = 0;
                }
                if (progressInterval) {
                    clearInterval(progressInterval);
                }
                window.musicIntervals.forEach(interval => clearInterval(interval));
                window.musicIntervals = [];
                closeWindow(musicWindow);
            });
        }
    });

    // ====== GAMING SUITE ======
    function createGamesWindow() {
        const gamesContent = `
            <div class="games-container">
                <div class="games-header">
                    <h2>🎮 FrogOS Gaming Suite</h2>
                    <p>Choose your adventure in the pond!</p>
                </div>
                <div class="games-grid">
                    <div class="game-card" data-game="frogger">
                        <div class="game-icon">🐸</div>
                        <h3>Frogger Classic</h3>
                        <p>Cross the busy pond!</p>
                    </div>
                    <div class="game-card" data-game="lilypad">
                        <div class="game-icon">🪷</div>
                        <h3>Lily Pad Jump</h3>
                        <p>Jump from pad to pad!</p>
                    </div>
                    <div class="game-card" data-game="memory">
                        <div class="game-icon">🧠</div>
                        <h3>Pond Memory</h3>
                        <p>Match the lily pads!</p>
                    </div>
                    <div class="game-card" data-game="tetris">
                        <div class="game-icon">🧩</div>
                        <h3>Swamp Blocks</h3>
                        <p>Tetris in the swamp!</p>
                    </div>
                </div>
            </div>
        `;
        const gameWindow = createWindow('🎮 FrogOS Games', gamesContent, '550px', '450px');
        
        const gameCards = gameWindow.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            card.addEventListener('click', function() {
                const gameType = this.dataset.game;
                startGame(gameType);
            });
        });
    }

    function startGame(gameType) {
        switch(gameType) {
            case 'frogger':
                createFroggerGame();
                break;
            case 'lilypad':
                createLilyPadGame();
                break;
            case 'memory':
                createMemoryGame();
                break;
            case 'tetris':
                createTetrisGame();
                break;
        }
    }

    window.startGame = startGame;

    function createFroggerGame() {
        const froggerContent = `
            <div class="game-container">
                <div class="game-header">
                    <h3>🐸 Frogger Classic</h3>
                    <div class="game-stats">
                        <span>Score: <span id="frogger-score">0</span></span>
                        <span>Lives: <span id="frogger-lives">3</span></span>
                        <button id="frogger-reset" class="game-btn">Reset</button>
                    </div>
                </div>
                <canvas id="frogger-canvas" width="400" height="300"></canvas>
                <div class="game-controls">
                    <p>Use WASD or Arrow Keys to move</p>
                    <p>Cross the road without getting hit by cars!</p>
                </div>
            </div>
        `;
        const gameWindow = createWindow('🐸 Frogger Game', froggerContent, '450px', '480px');
        
        const resetBtn = gameWindow.querySelector('#frogger-reset');
        resetBtn.addEventListener('click', () => {
            if (window.resetFrogger) {
                window.resetFrogger();
            }
        });
        
        gameWindow.gameCleanup = function() {
            if (window.froggerGameLoop) {
                window.froggerGameLoop = false;
            }
        };
        
        initFroggerGame();
    }

    function initFroggerGame() {
        const canvas = document.getElementById('frogger-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        let gameState = {
            frog: { x: 200, y: 280, size: 20 },
            cars: [],
            score: 0,
            lives: 3,
            gameRunning: true
        };

        function spawnCar() {
            const lanes = [50, 100, 150, 200];
            const lane = lanes[Math.floor(Math.random() * lanes.length)];
            const speed = 2 + Math.random() * 3;
            const direction = Math.random() > 0.5 ? 1 : -1;
            const startX = direction > 0 ? -30 : canvas.width + 30;
            
            gameState.cars.push({
                x: startX,
                y: lane,
                width: 40,
                height: 20,
                speed: speed * direction,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            });
        }

        function updateGame() {
            if (!gameState.gameRunning) return;
            
            gameState.cars.forEach(car => car.x += car.speed);
            
            gameState.cars = gameState.cars.filter(car => 
                car.x > -50 && car.x < canvas.width + 50
            );
            
            gameState.cars.forEach(car => {
                if (gameState.frog.x < car.x + car.width &&
                    gameState.frog.x + gameState.frog.size > car.x &&
                    gameState.frog.y < car.y + car.height &&
                    gameState.frog.y + gameState.frog.size > car.y) {
                    
                    gameState.lives--;
                    gameState.frog = { x: 200, y: 280, size: 20 };
                    
                    if (gameState.lives <= 0) {
                        gameState.gameRunning = false;
                        alert('Game Over! Final Score: ' + gameState.score);
                    }
                }
            });
            
            if (gameState.frog.y < 30) {
                gameState.score += 100;
                gameState.frog = { x: 200, y: 280, size: 20 };
            }
            
            if (Math.random() < 0.02) {
                spawnCar();
            }
        }

        function drawGame() {
            ctx.fillStyle = '#2d5016';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 40, canvas.width, 180);
            
            ctx.strokeStyle = '#fff';
            ctx.setLineDash([10, 10]);
            for (let i = 90; i <= 170; i += 40) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }
            ctx.setLineDash([]);
            
            gameState.cars.forEach(car => {
                ctx.fillStyle = car.color;
                ctx.fillRect(car.x, car.y, car.width, car.height);
                
                ctx.fillStyle = '#000';
                ctx.fillRect(car.x + 5, car.y + 15, 8, 8);
                ctx.fillRect(car.x + 27, car.y + 15, 8, 8);
            });
            
            ctx.fillStyle = '#0f7b0f';
            ctx.fillRect(gameState.frog.x, gameState.frog.y, gameState.frog.size, gameState.frog.size);
            
            ctx.fillStyle = '#fff';
            ctx.fillRect(gameState.frog.x + 3, gameState.frog.y + 3, 4, 4);
            ctx.fillRect(gameState.frog.x + 13, gameState.frog.y + 3, 4, 4);
            ctx.fillStyle = '#000';
            ctx.fillRect(gameState.frog.x + 4, gameState.frog.y + 4, 2, 2);
            ctx.fillRect(gameState.frog.x + 14, gameState.frog.y + 4, 2, 2);
            
            const scoreEl = document.getElementById('frogger-score');
            const livesEl = document.getElementById('frogger-lives');
            if (scoreEl) scoreEl.textContent = gameState.score;
            if (livesEl) livesEl.textContent = gameState.lives;
        }

        function handleKeyPress(e) {
            if (!gameState.gameRunning) return;
            
            const step = 20;
            switch(e.key.toLowerCase()) {
                case 'w':
                case 'arrowup':
                    if (gameState.frog.y > 0) gameState.frog.y -= step;
                    break;
                case 's':
                case 'arrowdown':
                    if (gameState.frog.y < canvas.height - gameState.frog.size) gameState.frog.y += step;
                    break;
                case 'a':
                case 'arrowleft':
                    if (gameState.frog.x > 0) gameState.frog.x -= step;
                    break;
                case 'd':
                case 'arrowright':
                    if (gameState.frog.x < canvas.width - gameState.frog.size) gameState.frog.x += step;
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyPress);
        
        window.resetFrogger = function() {
            gameState = {
                frog: { x: 200, y: 280, size: 20 },
                cars: [],
                score: 0,
                lives: 3,
                gameRunning: true
            };
        };

        // Game loop
        window.froggerGameLoop = true;
        function gameLoop() {
            if (!window.froggerGameLoop) return;
            updateGame();
            drawGame();
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }

    function createLilyPadGame() {
        const lilypadContent = `
            <div class="game-container">
                <div class="game-header">
                    <h3>🪷 Lily Pad Jump</h3>
                    <div class="game-stats">
                        <span>Score: <span id="lilypad-score">0</span></span>
                        <span>Time: <span id="lilypad-time">60</span>s</span>
                        <button id="lilypad-reset" class="game-btn">Reset</button>
                    </div>
                </div>
                <canvas id="lilypad-canvas" width="400" height="300"></canvas>
                <div class="game-controls">
                    <p>Click lily pads to jump! Avoid the water!</p>
                </div>
            </div>
        `;
        const gameWindow = createWindow('🪷 Lily Pad Jump', lilypadContent, '450px', '480px');
        
        const resetBtn = gameWindow.querySelector('#lilypad-reset');
        resetBtn.addEventListener('click', () => {
            if (window.resetLilyPad) {
                window.resetLilyPad();
            }
        });
        
        gameWindow.gameCleanup = function() {
            if (window.lilypadTimer) {
                clearInterval(window.lilypadTimer);
                window.lilypadTimer = null;
            }
            if (window.lilypadGameLoop) {
                window.lilypadGameLoop = false;
            }
        };
        
        initLilyPadGame();
    }

    function initLilyPadGame() {
        const canvas = document.getElementById('lilypad-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        let gameState = {
            frog: { x: 200, y: 250, size: 25, jumping: false },
            lilypads: [],
            score: 0,
            timeLeft: 60,
            gameRunning: true
        };

        function generateLilyPads() {
            gameState.lilypads = [];
            for (let i = 0; i < 8; i++) {
                gameState.lilypads.push({
                    x: 50 + Math.random() * 300,
                    y: 50 + Math.random() * 200,
                    size: 30 + Math.random() * 20,
                    clicked: false
                });
            }
        }

        function drawGame() {
            ctx.fillStyle = '#4a90e2';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            gameState.lilypads.forEach(pad => {
                ctx.fillStyle = pad.clicked ? '#8b4513' : '#228b22';
                ctx.beginPath();
                ctx.arc(pad.x, pad.y, pad.size, 0, Math.PI * 2);
                ctx.fill();
                
                if (!pad.clicked) {
                    ctx.fillStyle = '#32cd32';
                    ctx.beginPath();
                    ctx.arc(pad.x, pad.y, pad.size * 0.7, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            
            ctx.fillStyle = '#0f7b0f';
            ctx.beginPath();
            ctx.arc(gameState.frog.x, gameState.frog.y, gameState.frog.size, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(gameState.frog.x - 8, gameState.frog.y - 8, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(gameState.frog.x + 8, gameState.frog.y - 8, 5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(gameState.frog.x - 8, gameState.frog.y - 8, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(gameState.frog.x + 8, gameState.frog.y - 8, 2, 0, Math.PI * 2);
            ctx.fill();
            
            const scoreEl = document.getElementById('lilypad-score');
            const timeEl = document.getElementById('lilypad-time');
            if (scoreEl) scoreEl.textContent = gameState.score;
            if (timeEl) timeEl.textContent = gameState.timeLeft;
        }

        function handleClick(e) {
            if (!gameState.gameRunning) return;
            
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            gameState.lilypads.forEach(pad => {
                const distance = Math.sqrt((clickX - pad.x) ** 2 + (clickY - pad.y) ** 2);
                if (distance <= pad.size && !pad.clicked) {
                    pad.clicked = true;
                    gameState.frog.x = pad.x;
                    gameState.frog.y = pad.y;
                    gameState.score += 10;
                    
                    if (gameState.lilypads.every(p => p.clicked)) {
                        gameState.score += 50;
                        generateLilyPads();
                    }
                }
            });
        }

        canvas.addEventListener('click', handleClick);
        
        window.resetLilyPad = function() {
            if (window.lilypadTimer) {
                clearInterval(window.lilypadTimer);
                window.lilypadTimer = null;
            }
            gameState = {
                frog: { x: 200, y: 250, size: 25, jumping: false },
                lilypads: [],
                score: 0,
                timeLeft: 60,
                gameRunning: true
            };
            generateLilyPads();
            window.lilypadTimer = setInterval(() => {
                if (gameState.gameRunning) {
                    gameState.timeLeft--;
                    if (gameState.timeLeft <= 0) {
                        gameState.gameRunning = false;
                        clearInterval(window.lilypadTimer);
                        window.lilypadTimer = null;
                        alert('Time\'s up! Final Score: ' + gameState.score);
                    }
                }
            }, 1000);
        };

        generateLilyPads();
        
        window.lilypadTimer = setInterval(() => {
            if (gameState.gameRunning) {
                gameState.timeLeft--;
                if (gameState.timeLeft <= 0) {
                    gameState.gameRunning = false;
                    clearInterval(window.lilypadTimer);
                    window.lilypadTimer = null;
                    alert('Time\'s up! Final Score: ' + gameState.score);
                }
            }
        }, 1000);

        window.lilypadGameLoop = true;
        function gameLoop() {
            if (!window.lilypadGameLoop) return;
            drawGame();
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }

    function createMemoryGame() {
        const memoryContent = `
            <div class="game-container">
                <div class="game-header">
                    <h3>🧠 Pond Memory</h3>
                    <div class="game-stats">
                        <span>Matches: <span id="memory-matches">0</span>/8</span>
                        <span>Moves: <span id="memory-moves">0</span></span>
                        <button id="memory-reset" class="game-btn">Reset</button>
                    </div>
                </div>
                <div id="memory-board" class="memory-board"></div>
                <div class="game-controls">
                    <p>Match all the lily pad pairs!</p>
                </div>
            </div>
        `;
        const gameWindow = createWindow('🧠 Pond Memory', memoryContent, '450px', '550px');
        
        const resetBtn = gameWindow.querySelector('#memory-reset');
        resetBtn.addEventListener('click', () => {
            if (window.resetMemory) {
                window.resetMemory();
            }
        });
        
        initMemoryGame();
    }

    function initMemoryGame() {
        const board = document.getElementById('memory-board');
        if (!board) return;
        
        let gameState = {
            cards: [],
            flippedCards: [],
            matches: 0,
            moves: 0,
            gameRunning: true
        };

        const symbols = ['🐸', '🪷', '🪰', '🐍', '🦆', '🐢', '🐛', '🌿'];
        
        function createCards() {
            const cardPairs = [...symbols, ...symbols];
            cardPairs.sort(() => Math.random() - 0.5);
            
            board.innerHTML = '';
            board.style.display = 'grid';
            board.style.gridTemplateColumns = 'repeat(4, 1fr)';
            board.style.gap = '10px';
            board.style.padding = '20px';
            
            cardPairs.forEach((symbol, index) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.style.cssText = `
                    width: 60px;
                    height: 60px;
                    background: #228b22;
                    border: 2px solid #0f7b0f;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.3s ease;
                `;
                card.dataset.symbol = symbol;
                card.dataset.index = index;
                card.textContent = '?';
                
                card.addEventListener('click', () => flipCard(card, index));
                board.appendChild(card);
                gameState.cards.push(card);
            });
        }

        function flipCard(card, index) {
            if (!gameState.gameRunning || 
                gameState.flippedCards.length >= 2 || 
                gameState.flippedCards.includes(index) ||
                card.classList.contains('matched')) {
                return;
            }
            
            card.textContent = card.dataset.symbol;
            card.style.background = '#90EE90';
            gameState.flippedCards.push(index);
            
            if (gameState.flippedCards.length === 2) {
                gameState.moves++;
                updateUI();
                
                setTimeout(() => {
                    checkMatch();
                }, 1000);
            }
        }

        function checkMatch() {
            const [index1, index2] = gameState.flippedCards;
            const card1 = gameState.cards[index1];
            const card2 = gameState.cards[index2];
            
            if (card1.dataset.symbol === card2.dataset.symbol) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                card1.style.background = '#FFD700';
                card2.style.background = '#FFD700';
                gameState.matches++;
                
                if (gameState.matches === 8) {
                    setTimeout(() => {
                        alert(`Congratulations! You won in ${gameState.moves} moves!`);
                    }, 500);
                }
            } else {
                card1.textContent = '?';
                card2.textContent = '?';
                card1.style.background = '#228b22';
                card2.style.background = '#228b22';
            }
            
            gameState.flippedCards = [];
            updateUI();
        }

        function updateUI() {
            const matchesEl = document.getElementById('memory-matches');
            const movesEl = document.getElementById('memory-moves');
            if (matchesEl) matchesEl.textContent = gameState.matches;
            if (movesEl) movesEl.textContent = gameState.moves;
        }
        
        window.resetMemory = function() {
            gameState = {
                cards: [],
                flippedCards: [],
                matches: 0,
                moves: 0,
                gameRunning: true
            };
            createCards();
            updateUI();
        };

        createCards();
        updateUI();
    }

    function createTetrisGame() {
        const tetrisContent = `
            <div class="game-container">
                <div class="game-header">
                    <h3>🧩 Swamp Blocks</h3>
                    <div class="game-stats">
                        <span>Score: <span id="tetris-score">0</span></span>
                        <span>Lines: <span id="tetris-lines">0</span></span>
                        <button id="tetris-reset" class="game-btn">Reset</button>
                    </div>
                </div>
                <canvas id="tetris-canvas" width="300" height="400"></canvas>
                <div class="game-controls">
                    <p>A/D: Move, S: Drop, W: Rotate</p>
                </div>
            </div>
        `;
        const gameWindow = createWindow('🧩 Swamp Blocks', tetrisContent, '350px', '580px');
        
        const resetBtn = gameWindow.querySelector('#tetris-reset');
        resetBtn.addEventListener('click', () => {
            if (window.resetTetris) {
                window.resetTetris();
            }
        });
        
        gameWindow.gameCleanup = function() {
            if (window.tetrisInterval) {
                clearInterval(window.tetrisInterval);
                window.tetrisInterval = null;
            }
            if (window.tetrisGameLoop) {
                window.tetrisGameLoop = false;
            }
        };
        
        initTetrisGame();
    }

    function initTetrisGame() {
        const canvas = document.getElementById('tetris-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const BLOCK_SIZE = 30;
        const BOARD_WIDTH = 10;
        const BOARD_HEIGHT = 14;
        
        let gameState = {
            board: Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)),
            currentPiece: null,
            currentX: 4,
            currentY: 0,
            score: 0,
            lines: 0,
            gameRunning: true,
            dropCounter: 0,
            dropInterval: 1000
        };

        const PIECES = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[0,1,0],[1,1,1]], // T
            [[0,1,1],[1,1,0]], // S
            [[1,1,0],[0,1,1]], // Z
            [[1,0,0],[1,1,1]], // J
            [[0,0,1],[1,1,1]]  // L
        ];

        const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];

        function createPiece() {
            const pieceIndex = Math.floor(Math.random() * PIECES.length);
            return {
                shape: PIECES[pieceIndex],
                color: COLORS[pieceIndex]
            };
        }

        function drawBlock(x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }

        function drawBoard() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    if (gameState.board[y][x]) {
                        drawBlock(x, y, gameState.board[y][x]);
                    }
                }
            }
            
            if (gameState.currentPiece) {
                gameState.currentPiece.shape.forEach((row, dy) => {
                    row.forEach((cell, dx) => {
                        if (cell) {
                            drawBlock(
                                gameState.currentX + dx,
                                gameState.currentY + dy,
                                gameState.currentPiece.color
                            );
                        }
                    });
                });
            }
        }

        function canMove(piece, x, y) {
            return piece.shape.every((row, dy) =>
                row.every((cell, dx) => {
                    if (!cell) return true;
                    const newX = x + dx;
                    const newY = y + dy;
                    return newX >= 0 && newX < BOARD_WIDTH && 
                           newY >= 0 && newY < BOARD_HEIGHT &&
                           !gameState.board[newY][newX];
                })
            );
        }

        function placePiece() {
            gameState.currentPiece.shape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell) {
                        gameState.board[gameState.currentY + dy][gameState.currentX + dx] = gameState.currentPiece.color;
                    }
                });
            });
            
            // Check for completed lines
            let linesCleared = 0;
            for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
                if (gameState.board[y].every(cell => cell !== 0)) {
                    gameState.board.splice(y, 1);
                    gameState.board.unshift(Array(BOARD_WIDTH).fill(0));
                    linesCleared++;
                    y++;
                }
            }
            
            if (linesCleared > 0) {
                gameState.lines += linesCleared;
                gameState.score += linesCleared * 100 * linesCleared;
            }
            
            // Spawn new piece
            gameState.currentPiece = createPiece();
            gameState.currentX = 4;
            gameState.currentY = 0;
            
            if (!canMove(gameState.currentPiece, gameState.currentX, gameState.currentY)) {
                gameState.gameRunning = false;
                alert('Game Over! Final Score: ' + gameState.score);
            }
        }

        function rotatePiece(piece) {
            const rotated = piece.shape[0].map((_, index) =>
                piece.shape.map(row => row[index]).reverse()
            );
            return { ...piece, shape: rotated };
        }

        function handleKeyPress(e) {
            if (!gameState.gameRunning) return;
            
            switch(e.key.toLowerCase()) {
                case 'a':
                case 'arrowleft':
                    if (canMove(gameState.currentPiece, gameState.currentX - 1, gameState.currentY)) {
                        gameState.currentX--;
                    }
                    break;
                case 'd':
                case 'arrowright':
                    if (canMove(gameState.currentPiece, gameState.currentX + 1, gameState.currentY)) {
                        gameState.currentX++;
                    }
                    break;
                case 's':
                case 'arrowdown':
                    if (canMove(gameState.currentPiece, gameState.currentX, gameState.currentY + 1)) {
                        gameState.currentY++;
                        gameState.score++;
                    }
                    break;
                case 'w':
                case 'arrowup':
                    const rotated = rotatePiece(gameState.currentPiece);
                    if (canMove(rotated, gameState.currentX, gameState.currentY)) {
                        gameState.currentPiece = rotated;
                    }
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyPress);
        
        window.resetTetris = function() {
            gameState = {
                board: Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)),
                currentPiece: createPiece(),
                currentX: 4,
                currentY: 0,
                score: 0,
                lines: 0,
                gameRunning: true,
                dropCounter: 0,
                dropInterval: 1000
            };
        };

        gameState.currentPiece = createPiece();
        
        window.tetrisGameLoop = true;
        let lastTime = 0;
        function gameLoop(time = 0) {
            if (!window.tetrisGameLoop) return;
            
            const deltaTime = time - lastTime;
            lastTime = time;
            
            if (gameState.gameRunning) {
                gameState.dropCounter += deltaTime;
                if (gameState.dropCounter > gameState.dropInterval) {
                    if (canMove(gameState.currentPiece, gameState.currentX, gameState.currentY + 1)) {
                        gameState.currentY++;
                    } else {
                        placePiece();
                    }
                    gameState.dropCounter = 0;
                }
            }
            
            drawBoard();
            
            const scoreEl = document.getElementById('tetris-score');
            const linesEl = document.getElementById('tetris-lines');
            if (scoreEl) scoreEl.textContent = gameState.score;
            if (linesEl) linesEl.textContent = gameState.lines;
            
            requestAnimationFrame(gameLoop);
        }
        gameLoop();
    }

    document.getElementById('settings').addEventListener('click', function() {
        const settingsContent = `
            <div class="settings-container">
                <div class="settings-section">
                    <h3>🖼️ Wallpaper</h3>
                    <div class="wallpaper-options">
                        <div class="wallpaper-option active" data-bg="linear-gradient(54deg,rgb(82, 142, 86) 0%, rgb(106, 156, 87) 55%, rgb(104, 149, 78) 100%)">
                            <div class="wallpaper-preview swamp-green"></div>
                            <span>Swamp Green</span>
                        </div>
                        <div class="wallpaper-option" data-bg="linear-gradient(54deg,rgb(34, 139, 34) 0%, rgb(50, 205, 50) 55%, rgb(144, 238, 144) 100%)">
                            <div class="wallpaper-preview pond-blue"></div>
                            <span>Pond Blue</span>
                        </div>
                        <div class="wallpaper-option" data-bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                            <div class="wallpaper-preview twilight-pond"></div>
                            <span>Twilight Pond</span>
                        </div>
                        <div class="wallpaper-option" data-bg="linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)">
                            <div class="wallpaper-preview lily-blossom"></div>
                            <span>Lily Blossom</span>
                        </div>
                        <div class="wallpaper-option" data-bg="linear-gradient(45deg, #fa709a 0%, #fee140 100%)">
                            <div class="wallpaper-preview sunset-marsh"></div>
                            <span>Sunset Marsh</span>
                        </div>
                        <div class="wallpaper-option" data-bg="linear-gradient(160deg, #0093e9 0%, #80d0c7 100%)">
                            <div class="wallpaper-preview crystal-lake"></div>
                            <span>Crystal Lake</span>
                        </div>
                        <div class="wallpaper-option" data-bg="linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)">
                            <div class="wallpaper-preview morning-mist"></div>
                            <span>Morning Mist</span>
                        </div>
                        <div class="wallpaper-option" data-bg="linear-gradient(90deg, #74b9ff 0%, #0984e3 50%, #00b894 100%)">
                            <div class="wallpaper-preview ocean-breeze"></div>
                            <span>Ocean Breeze</span>
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>🔊 Sound</h3>
                    <label>
                        <input type="checkbox" id="croak-checkbox" ${savedCroakEnabled === null || savedCroakEnabled === 'true' ? 'checked' : ''}> Enable Croaking Sound on Bootup
                    </label>
                </div>
            </div>
        `;
        
        const settingsWindow = createWindow('⚙️ Pond Settings', settingsContent, '600px', '340px');
        
        const currentWallpaper = localStorage.getItem('frogos-wallpaper') || 'linear-gradient(54deg,rgb(82, 142, 86) 0%, rgb(106, 156, 87) 55%, rgb(104, 149, 78) 100%)';
        
        const wallpaperOptions = settingsWindow.querySelectorAll('.wallpaper-option');
        wallpaperOptions.forEach(option => {
            if (option.dataset.bg === currentWallpaper) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
            
            option.addEventListener('click', function() {
                wallpaperOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                const newBg = this.dataset.bg;
                document.body.style.background = newBg;
                
                localStorage.setItem('frogos-wallpaper', newBg);
            });
        });
        
        const croakCheckbox = settingsWindow.querySelector('#croak-checkbox');
        croakCheckbox.addEventListener('change', function() {
            localStorage.setItem('frogos-croak-enabled', this.checked.toString());
        });
    });

    document.getElementById('games').addEventListener('click', function() {
        createGamesWindow();
    });

    document.getElementById('files').addEventListener('click', function() {
        const filesContent = `
            <div class="file-explorer">
                <div class="file-header">
                    <div class="file-path">📁 /home/frog/Documents</div>
                </div>
                <div class="file-list">
                    <div class="file-item folder" data-action="open-folder">
                        <span class="file-icon">📁</span>
                        <span class="file-name">Lily Pad Photos</span>
                    </div>
                    <div class="file-item" data-action="play-audio">
                        <span class="file-icon">🎵</span>
                        <span class="file-name">best_ribbit_ever.wav</span>
                    </div>
                    <div class="file-item" data-action="open-text">
                        <span class="file-icon">📝</span>
                        <span class="file-name">fly_hunting_tips.txt</span>
                    </div>
                    <div class="file-item" data-action="view-image">
                        <span class="file-icon">🖼️</span>
                        <span class="file-name">pond_sunset.jpg</span>
                    </div>
                </div>
            </div>
        `;
        
        const fileWindow = createWindow('📁 Swamp Explorer', filesContent, '500px', '400px');
        
        fileWindow.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const fileName = this.querySelector('.file-name').textContent;
                
                switch(action) {
                    case 'open-folder':
                        openFolder(fileName);
                        break;
                    case 'play-audio':
                        playAudioFile(fileName);
                        break;
                    case 'open-text':
                        openTextFile(fileName);
                        break;
                    case 'view-image':
                        viewImage(fileName);
                        break;
                }
            });
        });
    });

    function openFolder(folderName) {
        const folderContent = `
            <div class="file-explorer">
                <div class="file-header">
                    <div class="file-path">📁 /home/frog/Documents/${folderName}</div>
                </div>
                <div class="file-list">
                    <div class="file-item" data-action="view-image">
                        <span class="file-icon">📸</span>
                        <span class="file-name">lily_pad_morning.jpg</span>
                    </div>
                    <div class="file-item" data-action="view-image">
                        <span class="file-icon">📸</span>
                        <span class="file-name">frog_family.jpg</span>
                    </div>
                    <div class="file-item" data-action="view-image">
                        <span class="file-icon">📸</span>
                        <span class="file-name">pond_reflection.jpg</span>
                    </div>
                </div>
            </div>
        `;
        createWindow(`📁 ${folderName}`, folderContent, '500px', '400px');
    }

    function playAudioFile(fileName) {
        const audioContent = `
            <div class="audio-player">
                <h3>🎵 Now Playing</h3>
                <p class="audio-title">${fileName}</p>
                <div class="audio-controls">
                    <button class="audio-btn" onclick="playSound()">▶️ Play</button>
                    <button class="audio-btn" onclick="pauseSound()">⏸️ Pause</button>
                    <button class="audio-btn" onclick="stopSound()">⏹️ Stop</button>
                </div>
                <p class="audio-info">🐸 A beautiful ribbit melody from the pond</p>
            </div>
        `;
        createWindow('🎵 Audio Player', audioContent, '400px', '300px');
    }

    function openTextFile(fileName) {
        let fileContent = '';
        if (fileName === 'fly_hunting_tips.txt') {
            fileContent = `🐸 Fly Hunting Tips for Frogs 🪰

1. Best hunting times:
   - Early morning (5-7 AM)
   - Late evening (6-8 PM)
   - After rain showers

2. Positioning tips:
   - Stay perfectly still on lily pad
   - Keep eyes focused on flight patterns
   - Tongue ready at all times

3. Advanced techniques:
   - The Lightning Strike: Quick tongue extension
   - The Patience Method: Wait for perfect moment
   - The Group Hunt: Coordinate with other frogs

4. Seasonal advice:
   - Spring: Flies are slower, easier targets
   - Summer: Peak fly season, competition high
   - Fall: Prepare for winter storage

Happy hunting! 🐸`;
        }
        
        const textContent = `
            <div class="text-viewer">
                <div class="text-header">📝 ${fileName}</div>
                <div class="text-content">${fileContent}</div>
            </div>
        `;
        createWindow(`📝 ${fileName}`, textContent, '600px', '500px');
    }

    function viewImage(fileName) {
        const imageContent = `
            <div class="image-viewer">
                <div class="image-header">🖼️ ${fileName}</div>
                <div class="image-container">
                    <div class="image-placeholder">
                        <span class="placeholder-icon">🖼️</span>
                        <p>Image: ${fileName}</p>
                        <p class="image-description">A beautiful view from the pond</p>
                    </div>
                </div>
            </div>
        `;
        createWindow(`🖼️ ${fileName}`, imageContent, '500px', '400px');
    }

    document.addEventListener('click', function(e) {
        const startMenuWindow = openWindows.find(w => w.classList.contains('start-menu-window'));
        
        if (startMenuWindow) {
            if (!e.target.closest('.start-menu-window') && !e.target.closest('#start')) {
                closeWindow(startMenuWindow);
            }
        }
    });
});

let calcDisplay = '0';

function appendToCalc(value) {
    const display = document.getElementById('calc-display');
    if (calcDisplay === '0' && value !== '.') {
        calcDisplay = value;
    } else {
        calcDisplay += value;
    }
    display.textContent = calcDisplay;
}

function clearCalc() {
    calcDisplay = '0';
    document.getElementById('calc-display').textContent = calcDisplay;
}

function deleteLast() {
    calcDisplay = calcDisplay.slice(0, -1) || '0';
    document.getElementById('calc-display').textContent = calcDisplay;
}

function calculate() {
    try {
        const result = eval(calcDisplay.replace('×', '*'));
        calcDisplay = result.toString();
        document.getElementById('calc-display').textContent = calcDisplay;
    } catch (error) {
        calcDisplay = 'Error';
        document.getElementById('calc-display').textContent = calcDisplay;
        setTimeout(() => {
            calcDisplay = '0';
            document.getElementById('calc-display').textContent = calcDisplay;
        }, 2000);
    }
}

function playSound() {
    console.log('Playing audio file...');
}

function pauseSound() {
    console.log('Pausing audio file...');
}

function stopSound() {
    console.log('Stopping audio file...');
}

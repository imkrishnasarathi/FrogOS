document.addEventListener('DOMContentLoaded', function() {
    // Update time every second
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);

    let currentWindow = null;

    // Function to close current window
    function closeCurrentWindow() {
        if (currentWindow) {
            currentWindow.remove();
            currentWindow = null;
        }
    }

    // Function to create window
    function createWindow(title, content, width = '400px', height = '300px') {
        closeCurrentWindow();
        
        const window = document.createElement('div');
        window.className = 'window';
        window.style.width = width;
        window.style.height = height;
        
        window.innerHTML = `
            <div class="window-header">
                <span class="window-title">${title}</span>
                <button class="window-close">×</button>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;
        
        document.body.appendChild(window);
        currentWindow = window;
        
        // Close button functionality
        window.querySelector('.window-close').addEventListener('click', closeCurrentWindow);
        
        return window;
    }

    // Start Menu functionality
    document.getElementById('start').addEventListener('click', function() {
    const startMenuContent = `
        <div class="start-menu-item" id="internet-app">
            <img src="wifi.png" alt="Internet" class="start-icon">
            <span>Froggle Browser</span>
        </div>
        <div class="start-menu-item" id="calculator-app">
            <img src="settings.png" alt="Calculator" class="start-icon">
            <span>Frog Calculator</span>
        </div>
        <div class="start-menu-item" id="notepad-app">
            <img src="files.png" alt="Notepad" class="start-icon">
            <span>Lily Pad Notes</span>
        </div>
        <div class="start-menu-item" id="about-app">
            <img src="frog.png" alt="About" class="start-icon">
            <span>About FrogOS</span>
        </div>
    `;
    
    const startMenu = createWindow('Start Menu', startMenuContent, '300px', '250px');
    
    document.getElementById('internet-app').addEventListener('click', () => {
        closeWindow(startMenu);
        const browserContent = `
            <div class="browser-header">
                <input type="text" class="address-bar" value="https://froggle.com" readonly>
                <button class="go-button">Go</button>
            </div>
            <div class="browser-content">
                <div class="froggle-logo">
                    <h1>🐸 Froggle</h1>
                    <p>The Amphibian Search Engine</p>
                </div>
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search the swamp...">
                    <button class="search-button">Ribbit Search</button>
                </div>
                <div class="search-results">
                    <div class="result-item">
                        <h3>🪷 Best Lily Pads in Your Area</h3>
                        <p>Find the most comfortable lily pads for your next hop...</p>
                    </div>
                    <div class="result-item">
                        <h3>🦟 Bug Hunting Tips for Beginners</h3>
                        <p>Learn how to catch flies like a pro frog...</p>
                    </div>
                    <div class="result-item">
                        <h3>🌿 Swamp Weather Today</h3>
                        <p>Partly muddy with a chance of flies...</p>
                    </div>
                </div>
            </div>
        `;
        createWindow('Froggle Browser', browserContent, '800px', '600px');
    });
    
    document.getElementById('calculator-app').addEventListener('click', () => {
        closeWindow(startMenu);
        const calcContent = `
            <div class="calculator">
                <div class="calc-display">0</div>
                <div class="calc-buttons">
                    <button class="calc-btn">C</button>
                    <button class="calc-btn">±</button>
                    <button class="calc-btn">%</button>
                    <button class="calc-btn operator">÷</button>
                    <button class="calc-btn">7</button>
                    <button class="calc-btn">8</button>
                    <button class="calc-btn">9</button>
                    <button class="calc-btn operator">×</button>
                    <button class="calc-btn">4</button>
                    <button class="calc-btn">5</button>
                    <button class="calc-btn">6</button>
                    <button class="calc-btn operator">-</button>
                    <button class="calc-btn">1</button>
                    <button class="calc-btn">2</button>
                    <button class="calc-btn">3</button>
                    <button class="calc-btn operator">+</button>
                    <button class="calc-btn zero">0</button>
                    <button class="calc-btn">.</button>
                    <button class="calc-btn operator">=</button>
                </div>
            </div>
        `;
        createWindow('Frog Calculator', calcContent, '350px', '450px');
    });
    
    document.getElementById('notepad-app').addEventListener('click', () => {
        closeWindow(startMenu);
        const notepadContent = `
            <textarea class="notepad-area" placeholder="Write your frog thoughts here...

Some ideas:
- Shopping list: flies, crickets, worms
- Remind myself to clean the lily pad
- Practice my best 'ribbit' for tomorrow's pond concert
- Call cousin Kermit"></textarea>
        `;
        createWindow('Lily Pad Notes', notepadContent, '600px', '400px');
    });
    
    document.getElementById('about-app').addEventListener('click', () => {
        closeWindow(startMenu);
        const aboutContent = `
            <div class="about-content">
                <img src="frog.png" alt="FrogOS" class="about-logo">
                <h2>FrogOS v1.0</h2>
                <p>The most ribbiting operating system in the pond!</p>
                <p><strong>Features:</strong></p>
                <ul>
                    <li>🐸 100% Amphibian Compatible</li>
                    <li>🪷 Lily Pad Optimized</li>
                    <li>🦟 Built-in Bug Tracker</li>
                    <li>🌊 Splash Resistant</li>
                </ul>
                <p><em>"Hop into the future with FrogOS!"</em></p>
            </div>
        `;
        createWindow('About FrogOS', aboutContent, '400px', '350px');
    });
});

document.getElementById('music').addEventListener('click', () => {
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
            <div class="player-controls">
                <button class="control-btn" id="prev">⏮</button>
                <button class="control-btn play-pause" id="play-pause">▶</button>
                <button class="control-btn" id="next">⏭</button>
            </div>
            <div class="progress-container">
                <span class="time">0:00</span>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
                <span class="time">2:34</span>
            </div>
            <div class="volume-container">
                <span>🔊</span>
                <input type="range" class="volume-slider" min="0" max="100" value="75">
            </div>
            <div class="playlist">
                <h4>Croaking Hits</h4>
                <div class="playlist-item active">1. Midnight Pond Chorus</div>
                <div class="playlist-item">2. Ribbit Rhapsody</div>
                <div class="playlist-item">3. Lily Pad Lullaby</div>
                <div class="playlist-item">4. Swamp Serenade</div>
                <div class="playlist-item">5. Tadpole Tango</div>
            </div>
        </div>
    `;
    const musicWindow = createWindow('FrogBeats Music Player', musicContent, '500px', '600px');
    
    let isPlaying = false;
    const playPauseBtn = musicWindow.querySelector('#play-pause');
    
    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
        
        if (isPlaying) {
            const audio = new Audio();
            audio.volume = 0.1;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.1);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
            
            setTimeout(() => {
                if (isPlaying) {
                    playPauseBtn.click();
                }
            }, 2000);
        }
    });
});

document.getElementById('settings').addEventListener('click', () => {
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
                    <div class="wallpaper-option" data-bg="linear-gradient(54deg,rgb(85, 107, 47) 0%, rgb(107, 142, 35) 55%, rgb(154, 205, 50) 100%)">
                        <div class="wallpaper-preview lily-pad"></div>
                        <span>Lily Pad</span>
                    </div>
                    <div class="wallpaper-option" data-bg="linear-gradient(54deg,rgb(46, 125, 50) 0%, rgb(76, 175, 80) 55%, rgb(129, 199, 132) 100%)">
                        <div class="wallpaper-preview moss-green"></div>
                        <span>Moss Green</span>
                    </div>
                </div>
            </div>
            <div class="settings-section">
                <h3>🔊 Sound</h3>
                <label>
                    <input type="checkbox" checked> Enable Croaking Sounds
                </label>
                <label>
                    <input type="range" min="0" max="100" value="75"> Volume: 75%
                </label>
            </div>
            <div class="settings-section">
                <h3>🐸 Frog Profile</h3>
                <label>
                    Frog Name: <input type="text" value="Mr. Frog">
                </label>
                <label>
                    Favorite Food: 
                    <select>
                        <option>Flies</option>
                        <option>Crickets</option>
                        <option>Worms</option>
                        <option>Beetles</option>
                    </select>
                </label>
            </div>
        </div>
    `;
    const settingsWindow = createWindow('FrogOS Settings', settingsContent, '600px', '500px');
    
    const wallpaperOptions = settingsWindow.querySelectorAll('.wallpaper-option');
    wallpaperOptions.forEach(option => {
        option.addEventListener('click', () => {
            wallpaperOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            const newBg = option.dataset.bg;
            document.body.style.background = newBg;
        });
    });
});

document.getElementById('files').addEventListener('click', () => {
    const filesContent = `
        <div class="file-explorer">
            <div class="file-header">
                <div class="file-path">📁 /home/frog/Documents</div>
                <div class="file-actions">
                    <button class="file-btn">🔙</button>
                    <button class="file-btn">🔄</button>
                    <button class="file-btn">📁+</button>
                </div>
            </div>
            <div class="file-list">
                <div class="file-item folder">
                    <span class="file-icon">📁</span>
                    <span class="file-name">Lily Pad Photos</span>
                    <span class="file-size">--</span>
                    <span class="file-date">Today</span>
                </div>
                <div class="file-item folder">
                    <span class="file-icon">📁</span>
                    <span class="file-name">Croaking Recordings</span>
                    <span class="file-size">--</span>
                    <span class="file-date">Yesterday</span>
                </div>
                <div class="file-item">
                    <span class="file-icon">🎵</span>
                    <span class="file-name">best_ribbit_ever.wav</span>
                    <span class="file-size">2.4 MB</span>
                    <span class="file-date">2 days ago</span>
                </div>
                <div class="file-item">
                    <span class="file-icon">📝</span>
                    <span class="file-name">fly_hunting_tips.txt</span>
                    <span class="file-size">1.2 KB</span>
                    <span class="file-date">1 week ago</span>
                </div>
                <div class="file-item">
                    <span class="file-icon">🖼️</span>
                    <span class="file-name">pond_sunset.jpg</span>
                    <span class="file-size">856 KB</span>
                    <span class="file-date">2 weeks ago</span>
                </div>
                <div class="file-item">
                    <span class="file-icon">📊</span>
                    <span class="file-name">bug_collection_stats.xlsx</span>
                    <span class="file-size">45 KB</span>
                    <span class="file-date">1 month ago</span>
                </div>
                <div class="file-item">
                    <span class="file-icon">🎮</span>
                    <span class="file-name">frogger_highscore.save</span>
                    <span class="file-size">2 KB</span>
                    <span class="file-date">2 months ago</span>
                </div>
                <div class="file-item">
                    <span class="file-icon">📋</span>
                    <span class="file-name">todo_list.md</span>
                    <span class="file-size">789 B</span>
                    <span class="file-date">3 months ago</span>
                </div>
                <div class="file-item">
                    <span class="file-icon">🐸</span>
                    <span class="file-name">frog_family_tree.png</span>
                    <span class="file-size">1.8 MB</span>
                    <span class="file-date">6 months ago</span>
                </div>
            </div>
        </div>
    `;
    createWindow('Swamp File Explorer', filesContent, '700px', '500px');
});

document.getElementById('games').addEventListener('click', () => {
    const gamesContent = `
        <div class="games-container">
            <h3>🎮 Frog Games Collection</h3>
            <div class="game-grid">
                <div class="game-item" data-game="frogger">
                    <div class="game-icon">🐸</div>
                    <h4>Frogger Classic</h4>
                    <p>Help the frog cross the road!</p>
                </div>
                <div class="game-item" data-game="snake">
                    <div class="game-icon">🐍</div>
                    <h4>Pond Snake</h4>
                    <p>Eat flies and grow longer!</p>
                </div>
                <div class="game-item" data-game="memory">
                    <div class="game-icon">🧠</div>
                    <h4>Lily Pad Memory</h4>
                    <p>Match the lily pad patterns!</p>
                </div>
                <div class="game-item" data-game="coming-soon">
                    <div class="game-icon">🚧</div>
                    <h4>More Games</h4>
                    <p>Coming Soon...</p>
                </div>
            </div>
        </div>
    `;
    const gamesWindow = createWindow('FrogOS Games', gamesContent, '600px', '400px');
    
    const gameItems = gamesWindow.querySelectorAll('.game-item');
    gameItems.forEach(item => {
        item.addEventListener('click', () => {
            const game = item.dataset.game;
            if (game === 'coming-soon') return;
            
            closeWindow(gamesWindow);
            
            let gameContent = '';
            if (game === 'frogger') {
                gameContent = `
                    <div class="game-frame">
                        <p style="text-align: center; padding: 20px;">
                            🐸 Classic Frogger Game 🐸<br><br>
                            <em>Game will be embedded here...</em><br><br>
                            For now, imagine you're helping a brave frog<br>
                            cross busy roads and rivers!<br><br>
                            <strong>Controls:</strong><br>
                            ↑ ↓ ← → Arrow Keys<br><br>
                            <button onclick="alert('Ribbit! High Score: 12,450')">View High Scores</button>
                        </p>
                    </div>
                `;
            } else if (game === 'snake') {
                gameContent = `
                    <div class="snake-game">
                        <div class="snake-score">Score: <span id="snake-score">0</span></div>
                        <canvas id="snake-canvas" width="400" height="300"></canvas>
                        <div class="snake-controls">
                            <p>Use arrow keys to move the snake and eat flies!</p>
                            <button onclick="location.reload()">Restart Game</button>
                        </div>
                    </div>
                `;
            } else if (game === 'memory') {
                gameContent = `
                    <div class="memory-game">
                        <div class="memory-grid" id="memory-grid"></div>
                        <div class="memory-info">
                            <p>Moves: <span id="moves">0</span> | Matches: <span id="matches">0</span>/8</p>
                            <button onclick="initMemoryGame()">New Game</button>
                        </div>
                    </div>
                `;
            }
            
            createWindow(`${item.querySelector('h4').textContent}`, gameContent, '500px', '450px');
        });
    });
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('window') || e.target.closest('.window')) {
        return;
    }
    
    const startMenu = document.querySelector('.window');
    if (startMenu && startMenu.querySelector('.start-menu-item')) {
        closeWindow(startMenu);
    }
});

});

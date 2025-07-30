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
            </div>
        `;
        
        const startWindow = createWindow('🐸 FrogOS Start Menu', startMenuContent, '250px', '200px');
        
        // Position start menu near start button
        startWindow.style.bottom = '80px';
        startWindow.style.left = '20px';
        startWindow.style.top = 'auto';
        startWindow.style.transform = 'none';
        
        // Add click handlers for start menu items
        startWindow.querySelectorAll('.start-menu-item').forEach(item => {
            item.addEventListener('click', function() {
                const app = this.getAttribute('data-app');
                openStartApp(app);
            });
        });
    });

    // Function to open start menu applications
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
        }
    }

    // Froggle Browser
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
        
        const window = createWindow('🌐 Froggle Browser', browserContent, '500px', '400px');
        
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

    // Calculator
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
        
        createWindow('🔢 Frog Calculator', calcContent, '300px', '400px');
    }

    // Notes
    function openNotes() {
        const notesContent = `
            <textarea class="notepad-area" placeholder="Write your froggy thoughts here...
            
🐸 Remember to:
- Practice croaking daily
- Find the best lily pads
- Catch more flies
- Enjoy pond life!"></textarea>
        `;
        
        createWindow('📝 Lily Pad Notes', notesContent, '400px', '350px');
    }

    // About
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
        
        createWindow('🐸 About FrogOS', aboutContent, '350px', '300px');
    }

    // Desktop icon functionality
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
                <div class="player-controls">
                    <button class="control-btn" id="prev">⏮</button>
                    <button class="control-btn play-pause" id="play-pause">▶</button>
                    <button class="control-btn" id="next">⏭</button>
                </div>
                <div class="playlist">
                    <h4>🐸 Croaking Hits</h4>
                    <div class="playlist-item active">1. Midnight Pond Chorus</div>
                    <div class="playlist-item">2. Ribbit Rhapsody</div>
                    <div class="playlist-item">3. Lily Pad Lullaby</div>
                    <div class="playlist-item">4. Swamp Serenade</div>
                </div>
            </div>
        `;
        
        const musicWindow = createWindow('🎵 FrogBeats Music', musicContent, '400px', '450px');
        
        const playBtn = musicWindow.querySelector('#play-pause');
        let isPlaying = false;
        
        playBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            this.textContent = isPlaying ? '⏸' : '▶';
            
            if (isPlaying) {
                // Simple croaking sound simulation
                setTimeout(() => {
                    if (isPlaying) {
                        playBtn.click();
                    }
                }, 3000);
            }
        });
    });

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
                    </div>
                </div>
                <div class="settings-section">
                    <h3>🔊 Sound</h3>
                    <label>
                        <input type="checkbox" checked> Enable Croaking Sounds
                    </label>
                </div>
            </div>
        `;
        
        const settingsWindow = createWindow('⚙️ Pond Settings', settingsContent, '400px', '300px');
        
        const wallpaperOptions = settingsWindow.querySelectorAll('.wallpaper-option');
        wallpaperOptions.forEach(option => {
            option.addEventListener('click', function() {
                wallpaperOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                const newBg = this.dataset.bg;
                document.body.style.background = newBg;
            });
        });
    });

    document.getElementById('games').addEventListener('click', function() {
        createWindow('🎮 Frog Games', '<p style="text-align: center; padding: 20px;">🐸 Games collection coming soon! 🎮<br><br>Future games:<br>• Frogger Classic<br>• Lily Pad Jump<br>• Fly Catcher</p>', '300px', '200px');
    });

    document.getElementById('files').addEventListener('click', function() {
        const filesContent = `
            <div class="file-explorer">
                <div class="file-header">
                    <div class="file-path">📁 /home/frog/Documents</div>
                </div>
                <div class="file-list">
                    <div class="file-item folder">
                        <span class="file-icon">📁</span>
                        <span class="file-name">Lily Pad Photos</span>
                    </div>
                    <div class="file-item">
                        <span class="file-icon">🎵</span>
                        <span class="file-name">best_ribbit_ever.wav</span>
                    </div>
                    <div class="file-item">
                        <span class="file-icon">📝</span>
                        <span class="file-name">fly_hunting_tips.txt</span>
                    </div>
                    <div class="file-item">
                        <span class="file-icon">🖼️</span>
                        <span class="file-name">pond_sunset.jpg</span>
                    </div>
                </div>
            </div>
        `;
        
        createWindow('📁 Swamp Explorer', filesContent, '400px', '300px');
    });

    // Click outside to close start menu
    document.addEventListener('click', function(e) {
        if (currentWindow && 
            currentWindow.querySelector('.start-menu') && 
            !e.target.closest('.window') && 
            !e.target.closest('#start')) {
            closeCurrentWindow();
        }
    });
});

// Calculator functions (global scope for onclick handlers)
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

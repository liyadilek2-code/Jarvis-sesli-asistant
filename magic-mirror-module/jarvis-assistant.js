/**
 * Jarvis Assistant Module for MagicMirror²
 * Displays an Iron Man-style voice assistant UI
 */

Module.register('jarvis-assistant', {
  defaults: {
    position: 'top_right',
    header: '🤖 Jarvis AI Assistant',
    theme: 'dark', // dark or light
    size: 'medium', // small, medium, large
    updateInterval: 100,
    animationSpeed: 'normal', // slow, normal, fast
    showStatistics: true,
    showCommandHistory: true,
    commandHistoryLimit: 5,
    microphoneThreshold: 0.5,
  },

  getStyles: function() {
    return ['jarvis-assistant.css'];
  },

  start: function() {
    Log.log('🤖 Jarvis Assistant module started');
    this.isListening = false;
    this.isSpeaking = false;
    this.lastCommand = '';
    this.currentResponse = '';
    this.commandHistory = [];
    this.statistics = {
      totalCommands: 0,
      successfulCommands: 0,
      failedCommands: 0,
    };

    this.sendSocketNotification('JARVIS_REQUEST_STATE', {});
    setInterval(() => this.updateListeningState(), this.config.updateInterval);
  },

  socketNotificationReceived: function(notification, payload) {
    switch (notification) {
      case 'JARVIS_LISTENING':
        this.isListening = true;
        this.updateDOM();
        break;

      case 'JARVIS_STOPPED_LISTENING':
        this.isListening = false;
        this.updateDOM();
        break;

      case 'JARVIS_COMMAND':
        this.lastCommand = payload.command;
        this.addCommandToHistory(payload);
        this.updateDOM();
        break;

      case 'JARVIS_RESPONSE':
        this.currentResponse = payload.response;
        this.isSpeaking = true;
        this.updateDOM();
        setTimeout(() => {
          this.isSpeaking = false;
          this.updateDOM();
        }, payload.duration || 3000);
        break;

      case 'JARVIS_ERROR':
        this.statistics.failedCommands++;
        this.updateDOM();
        break;

      case 'JARVIS_STATE':
        this.statistics = payload.statistics;
        this.commandHistory = payload.commandHistory || [];
        this.updateDOM();
        break;
    }
  },

  addCommandToHistory: function(command) {
    this.commandHistory.unshift({
      command: command.command,
      response: command.response || 'Processing...',
      timestamp: new Date(),
      type: command.type || 'ai',
    });

    if (this.commandHistory.length > this.config.commandHistoryLimit) {
      this.commandHistory.pop();
    }

    this.statistics.totalCommands++;
    this.statistics.successfulCommands++;
  },

  updateListeningState: function() {
    // Animate listening indicator
    const waveElement = document.querySelector('.jarvis-wave');
    if (waveElement && this.isListening) {
      waveElement.classList.add('animate');
    } else if (waveElement) {
      waveElement.classList.remove('animate');
    }
  },

  getDom: function() {
    const wrapper = document.createElement('div');
    wrapper.className = `jarvis-container jarvis-${this.config.size} jarvis-${this.config.theme}`;

    // Header
    const header = document.createElement('div');
    header.className = 'jarvis-header';
    header.innerHTML = `
      <div class="jarvis-logo">◆ JARVIS ◆</div>
      <div class="jarvis-status ${this.isListening ? 'listening' : ''} ${this.isSpeaking ? 'speaking' : ''}"></div>
    `;
    wrapper.appendChild(header);

    // Microphone Animation
    const micSection = document.createElement('div');
    micSection.className = 'jarvis-mic-section';
    micSection.innerHTML = `
      <div class="jarvis-microphone ${this.isListening ? 'active' : ''}">
        <svg viewBox="0 0 100 100" class="jarvis-mic-icon">
          <circle cx="50" cy="50" r="45" class="jarvis-mic-circle" />
          <path d="M 50 30 L 35 50 L 45 50 L 45 70 L 55 70 L 55 50 L 65 50 Z" class="jarvis-mic-shape" />
        </svg>
        <div class="jarvis-wave">
          <span style="--wave-delay: 0s"></span>
          <span style="--wave-delay: 0.1s"></span>
          <span style="--wave-delay: 0.2s"></span>
          <span style="--wave-delay: 0.3s"></span>
        </div>
      </div>
      <div class="jarvis-status-text">${this.isListening ? '🎤 Listening...' : this.isSpeaking ? '🔊 Speaking...' : '💤 Ready'}</div>
    `;
    wrapper.appendChild(micSection);

    // Command Display
    if (this.lastCommand) {
      const commandDisplay = document.createElement('div');
      commandDisplay.className = 'jarvis-command-display';
      commandDisplay.innerHTML = `
        <div class="jarvis-label">📋 Your Command:</div>
        <div class="jarvis-command-text">${this.escapeHtml(this.lastCommand)}</div>
      `;
      wrapper.appendChild(commandDisplay);
    }

    // Response Display
    if (this.currentResponse) {
      const responseDisplay = document.createElement('div');
      responseDisplay.className = 'jarvis-response-display';
      responseDisplay.innerHTML = `
        <div class="jarvis-label">🤖 Jarvis Response:</div>
        <div class="jarvis-response-text">${this.escapeHtml(this.currentResponse.substring(0, 200))}</div>
      `;
      wrapper.appendChild(responseDisplay);
    }

    // Command History
    if (this.config.showCommandHistory && this.commandHistory.length > 0) {
      const historySection = document.createElement('div');
      historySection.className = 'jarvis-history-section';
      historySection.innerHTML = '<div class="jarvis-label">📜 History:</div>';

      const historyList = document.createElement('div');
      historyList.className = 'jarvis-history-list';

      this.commandHistory.slice(0, this.config.commandHistoryLimit).forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'jarvis-history-item';
        historyItem.innerHTML = `
          <span class="jarvis-history-number">${index + 1}.</span>
          <span class="jarvis-history-command">${this.escapeHtml(item.command)}</span>
        `;
        historyList.appendChild(historyItem);
      });

      historySection.appendChild(historyList);
      wrapper.appendChild(historySection);
    }

    // Statistics
    if (this.config.showStatistics) {
      const statsSection = document.createElement('div');
      statsSection.className = 'jarvis-stats-section';
      statsSection.innerHTML = `
        <div class="jarvis-stat-item">
          <span class="jarvis-stat-label">Commands:</span>
          <span class="jarvis-stat-value">${this.statistics.totalCommands}</span>
        </div>
        <div class="jarvis-stat-item">
          <span class="jarvis-stat-label">Success:</span>
          <span class="jarvis-stat-value">${this.statistics.successfulCommands}</span>
        </div>
        <div class="jarvis-stat-item">
          <span class="jarvis-stat-label">Errors:</span>
          <span class="jarvis-stat-value">${this.statistics.failedCommands}</span>
        </div>
      `;
      wrapper.appendChild(statsSection);
    }

    // Control Buttons
    const controlSection = document.createElement('div');
    controlSection.className = 'jarvis-controls';
    controlSection.innerHTML = `
      <button class="jarvis-btn" onclick="document.querySelector('.jarvis-container').classList.toggle('muted')" title="Toggle Mute">
        🔇
      </button>
      <button class="jarvis-btn" onclick="location.reload()" title="Refresh">
        🔄
      </button>
      <button class="jarvis-btn" onclick="alert('Jarvis Settings')" title="Settings">
        ⚙️
      </button>
    `;
    wrapper.appendChild(controlSection);

    return wrapper;
  },

  escapeHtml: function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  notificationReceived: function(notification, payload) {
    if (notification === 'JARVIS_COMMAND_PROCESSED') {
      this.socketNotificationReceived('JARVIS_RESPONSE', payload);
    }
  },
});

/**
 * CropNex - Direct Messaging & Farmer-Buyer Chat Engine
 * Smart India Hackathon 2026 - PS ID 26033
 */

const ChatSystem = {
  activeConvId: 'conv-farmer-1',

  init() {
    this.bindEvents();
    this.renderConversationList();
    this.renderActiveChat();
  },

  bindEvents() {
    const form = document.getElementById('chatMessageForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSendMessage();
      });
    }

    window.addEventListener('cropnex:messagesChanged', (e) => {
      if (e.detail?.convId === this.activeConvId) {
        this.renderActiveChat();
      }
      this.renderConversationList();
    });
  },

  renderConversationList() {
    const container = document.getElementById('chatConversationList');
    if (!container) return;

    const convs = StorageService.getConversations();
    const list = Object.values(convs);

    if (list.length === 0) {
      container.innerHTML = `<div class="p-4 text-xs text-muted">No active conversations.</div>`;
      return;
    }

    container.innerHTML = list.map(c => {
      const lastMsg = c.messages[c.messages.length - 1];
      const isActive = c.id === this.activeConvId;
      return `
        <div class="chat-conv-item ${isActive ? 'active' : ''}" onclick="ChatSystem.selectConversation('${c.id}')">
          <div class="conv-avatar-wrap">
            <span class="conv-avatar">${c.avatar || '👨‍🌾'}</span>
            ${c.online ? '<span class="online-dot"></span>' : ''}
          </div>
          <div class="conv-info">
            <div class="conv-header-row">
              <span class="conv-name">${c.participantName}</span>
              <span class="conv-time">${c.lastUpdated}</span>
            </div>
            <div class="conv-role text-xs text-muted">${c.participantRole}</div>
            <div class="conv-preview text-xs">${lastMsg ? lastMsg.text : 'Start conversation...'}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  selectConversation(convId) {
    this.activeConvId = convId;
    this.renderConversationList();
    this.renderActiveChat();
  },

  renderActiveChat() {
    const convs = StorageService.getConversations();
    const conv = convs[this.activeConvId];
    if (!conv) return;

    // Header info
    document.getElementById('chatHeaderName').textContent = conv.participantName;
    document.getElementById('chatHeaderRole').textContent = conv.participantRole;
    document.getElementById('chatHeaderStatus').textContent = conv.online ? 'Online now • Verified Producer' : 'Offline';

    // Message bubbles
    const container = document.getElementById('chatMessagesContainer');
    if (!container) return;

    const currentRole = StorageService.getCurrentRole();

    container.innerHTML = conv.messages.map(m => {
      // Determine if message is from "me" or "them"
      const isMe = (currentRole === 'buyer' && m.sender === 'buyer') ||
                   (currentRole === 'farmer' && m.sender === 'farmer') ||
                   (m.sender === currentRole);

      return `
        <div class="message-row ${isMe ? 'me' : 'them'}">
          <div class="message-bubble ${isMe ? 'bubble-me' : 'bubble-them'}">
            <div class="message-text">${m.text}</div>
            <div class="message-meta">${m.time}</div>
          </div>
        </div>
      `;
    }).join('');

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  },

  handleSendMessage() {
    const input = document.getElementById('chatMessageInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const currentRole = StorageService.getCurrentRole();
    const sender = currentRole === 'farmer' ? 'farmer' : 'buyer';

    StorageService.sendMessage(this.activeConvId, text, sender);
    input.value = '';

    // Simulate realistic farmer reply after 1.5s if buyer sends
    if (sender === 'buyer') {
      setTimeout(() => {
        const replies = [
          "Thank you for reaching out. We will ensure the finest grade harvest for your delivery.",
          "Confirmed! The batch is sorted and packed in standardized crates for safe transit.",
          "Received with thanks. I've updated the tracking status in CropNex.",
          "Namaskar! You can also check our updated live price intelligence before bulk dispatch."
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        StorageService.sendMessage(this.activeConvId, randomReply, 'farmer');
      }, 1500);
    }
  }
};

window.ChatSystem = ChatSystem;


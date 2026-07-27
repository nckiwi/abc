import React from 'react';

function ChatsPage({ chats, users, currentUserId, activeChatId, onSelectChat, onSendMessage, chatMessage, onChatMessageChange }) {
  const activeChat = chats.find((chat) => chat.id === activeChatId) || chats[0];
  const chatPartner = activeChat
    ? users.find((user) => user.id === activeChat.participants.find((id) => id !== currentUserId))
    : null;

  return (
    <div className="chats-page">
      <div className="chats-shell">
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div>
              <h2>Mensajes</h2>
              <p>{chats.length} conversaciones</p>
            </div>
            <button className="chat-icon-btn" type="button">✦</button>
          </div>

          <label className="chat-search">
            <span aria-hidden="true">🔎</span>
            <input type="search" placeholder="Buscar conversación" />
          </label>

          <div className="chat-list">
            {chats.length === 0 ? (
              <p className="chat-empty">No tienes conversaciones aún.</p>
            ) : (
              chats.map((chat) => {
                const partnerId = chat.participants.find((id) => id !== currentUserId);
                const partner = users.find((user) => user.id === partnerId) || { name: 'Usuario' };
                const lastMessage = chat.messages[chat.messages.length - 1];
                const isActive = activeChatId === chat.id;

                return (
                  <button
                    key={chat.id}
                    className={`chat-list-item ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="chat-list-avatar">{(partner.name || 'U').charAt(0).toUpperCase()}</div>
                    <div className="chat-list-content">
                      <div className="chat-list-meta">
                        <strong>{partner.name}</strong>
                        <span>{lastMessage?.time || ''}</span>
                      </div>
                      <p>{lastMessage?.text || 'Sin mensajes aún'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="chat-view">
          {activeChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-user">
                  <div className="chat-header-avatar">{(chatPartner?.name || 'U').charAt(0).toUpperCase()}</div>
                  <div>
                    <h3>{chatPartner?.name || 'Desconocido'}</h3>
                    <p>En línea · última conexión hoy</p>
                  </div>
                </div>
                <div className="chat-header-actions">
                  <div className="chat-product-pill">
                    <span className="chat-product-thumb" />
                    <div>
                      <strong>{activeChat.title || 'Producto'}</strong>
                      <p>Intercambio activo</p>
                    </div>
                  </div>
                  <button className="btn btn-primary" type="button">Ver publicación</button>
                </div>
              </div>

              <div className="chat-messages">
                {activeChat.messages.map((message, index) => {
                  const isSent = message.sender === currentUserId;
                  const isGrouped = index > 0 && activeChat.messages[index - 1].sender === message.sender;

                  return (
                    <div key={index} className={`chat-message-group ${isSent ? 'sent' : 'received'} ${isGrouped ? 'grouped' : ''}`}>
                      <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`}>
                        <p>{message.text}</p>
                        <span>{message.time || message.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="chat-input-row">
                <textarea
                  value={chatMessage}
                  onChange={(event) => onChatMessageChange(event.target.value)}
                  placeholder="Escribe tu mensaje..."
                  rows={1}
                />
                <div className="chat-input-actions">
                  <button className="chat-icon-btn" type="button">📎</button>
                  <button className="chat-icon-btn" type="button">😊</button>
                  <button className="btn btn-primary" onClick={() => onSendMessage(activeChat.id)} type="button">Enviar</button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-chat-view">
              <p>Selecciona un chat para comenzar a conversar.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ChatsPage;

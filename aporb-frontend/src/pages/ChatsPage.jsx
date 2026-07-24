import React from 'react';

function ChatsPage({ chats, users, currentUserId, activeChatId, onSelectChat, onSendMessage, chatMessage, onChatMessageChange }) {
  const activeChat = chats.find((chat) => chat.id === activeChatId) || chats[0];
  const chatPartner = activeChat
    ? users.find((user) => user.id === activeChat.participants.find((id) => id !== currentUserId))
    : null;

  return (
    <div className="chats-page">
      <div className="section-header">
        <div>
          <h2>Chats</h2>
          <p>Gestiona tus conversaciones y coordina trueques.</p>
        </div>
      </div>

      <div className="chats-layout">
        <aside className="chat-list">
          {chats.length === 0 ? (
            <p>No tienes conversaciones aún.</p>
          ) : (
            chats.map((chat) => {
              const partnerId = chat.participants.find((id) => id !== currentUserId);
              const partner = users.find((user) => user.id === partnerId) || { name: 'Usuario' };
              return (
                <button
                  key={chat.id}
                  className={`chat-list-item ${activeChatId === chat.id ? 'active' : ''}`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <strong>{partner.name}</strong>
                  <span>{chat.messages[chat.messages.length - 1]?.text || 'Sin mensajes aún'}</span>
                </button>
              );
            })
          )}
        </aside>

        <section className="chat-view">
          {activeChat ? (
            <>
              <div className="chat-header">
                <h3>Conversación con {chatPartner?.name || 'Desconocido'}</h3>
              </div>
              <div className="chat-messages">
                {activeChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message ${message.sender === currentUserId ? 'sent' : 'received'}`}
                  >
                    <p>{message.text}</p>
                    <span>{message.time || message.timestamp}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input
                  value={chatMessage}
                  onChange={(event) => onChatMessageChange(event.target.value)}
                  placeholder="Escribe un mensaje..."
                />
                <button className="btn btn-primary" onClick={() => onSendMessage(activeChat.id)}>
                  Enviar
                </button>
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

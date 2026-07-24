import React, { useEffect, useMemo, useState } from 'react';
import logoPrimary from './assets/Captura de pantalla 2026-01-26 164435.png';
import logoSecondary from './assets/Captura de pantalla 2026-01-26 165228.png';
import logoColor from './assets/Captura de pantalla 2026-07-22 145020.png';
import heroImage from './assets/d1cdba8f-d250-41c0-a06b-a9f8d2294db8.jpg';
import './App.css';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PublishPage from './pages/PublishPage.jsx';
import ChatsPage from './pages/ChatsPage.jsx';
import {
  STORAGE_KEYS,
  categories,
  defaultUsers,
  defaultPosts,
  defaultChats,
  defaultNotifications,
  readStorage,
  writeStorage,
} from './services/storage.js';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [publishData, setPublishData] = useState({ title: '', category: 'libros', condition: 'bueno', location: '', description: '', details: '', media: [] });
  const [profileData, setProfileData] = useState({ name: '', password: '', description: '', interests: '', avatar: '' });
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [authMessage, setAuthMessage] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [profileTab, setProfileTab] = useState('configuracion');
  const [theme, setTheme] = useState('day');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const usersFromStorage = readStorage(STORAGE_KEYS.users, defaultUsers);
    const postsFromStorage = readStorage(STORAGE_KEYS.posts, defaultPosts);
    const chatsFromStorage = readStorage(STORAGE_KEYS.chats, defaultChats);
    const notificationsFromStorage = readStorage(STORAGE_KEYS.notifications, defaultNotifications);

    setUsers(usersFromStorage);
    setPosts(postsFromStorage);
    setChats(chatsFromStorage);
    setNotifications(notificationsFromStorage);

    const session = readStorage(STORAGE_KEYS.session, null);
    if (session) {
      const user = usersFromStorage.find((storedUser) => storedUser.id === session.userId);
      if (user) {
        setCurrentUser(user);
        setProfileData(user);
        setPage('home');
      }
    }
  }, []);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.users, users);
  }, [users]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.posts, posts);
  }, [posts]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.chats, chats);
  }, [chats]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
      writeStorage(STORAGE_KEYS.session, { userId: currentUser.id });
    } else {
      localStorage.removeItem(STORAGE_KEYS.session);
    }
  }, [currentUser]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return posts
      .filter((post) => {
        const matchesQuery =
          query.length === 0 ||
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.details.toLowerCase().includes(query);
        const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
        return matchesQuery && matchesCategory;
      })
      .sort((a, b) => (a.created < b.created ? 1 : -1));
  }, [posts, searchQuery, filterCategory]);

  const currentUserChats = useMemo(
    () => (currentUser ? chats.filter((chat) => chat.participants.includes(currentUser.id)) : []),
    [chats, currentUser],
  );

  useEffect(() => {
    if (!selectedChatId && currentUserChats.length > 0) {
      setSelectedChatId(currentUserChats[0].id);
    }
  }, [currentUserChats, selectedChatId]);

  const authUser = users.find((user) => user.email === authForm.email.trim().toLowerCase());

  const handleLogin = () => {
    setAuthMessage('');
    if (!authForm.email || !authForm.password) {
      setAuthMessage('Completa correo y contraseña.');
      return;
    }

    const user = users.find(
      (item) => item.email === authForm.email.trim().toLowerCase() && item.password === authForm.password,
    );

    if (!user) {
      setAuthMessage('Correo o contraseña incorrectos.');
      return;
    }

    setCurrentUser(user);
    setPage('home');
    setAuthForm({ email: '', password: '', name: '' });
    setAuthMessage('');
  };

  const handleRegister = () => {
    setAuthMessage('');
    if (!authForm.name || !authForm.email || !authForm.password) {
      setAuthMessage('Completa todos los campos para registrarte.');
      return;
    }

    if (authUser) {
      setAuthMessage('Ya existe un usuario con ese correo.');
      return;
    }

    const newUser = {
      id: `u${Date.now()}`,
      name: authForm.name.trim(),
      email: authForm.email.trim().toLowerCase(),
      password: authForm.password,
      description: 'Escribe algo sobre tus intereses.',
      interests: 'Trueque, comunidad, ahorro',
      avatar: '',
    };

    setUsers([newUser, ...users]);
    setCurrentUser(newUser);
    setPage('home');
    setAuthForm({ email: '', password: '', name: '' });
    setNotifications([
      { id: `n-${Date.now()}`, text: 'Ya eres parte de AporB. ¡Bienvenido!', read: false },
      ...notifications,
    ]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('landing');
    setSelectedChatId(null);
  };

  const handlePublishChange = (field, value) => {
    setPublishData({ ...publishData, [field]: value });
  };

  const handleMediaUpload = async (files) => {
    const fileList = Array.from(files || []);
    const mediaItems = await Promise.all(
      fileList.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ name: file.name, type: file.type, src: reader.result });
            };
            reader.readAsDataURL(file);
          }),
      ),
    );
    setPublishData({ ...publishData, media: mediaItems });
  };

  const handlePublish = () => {
    if (!publishData.title || !publishData.description) return;

    const newPost = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      title: publishData.title,
      category: publishData.category,
      condition: publishData.condition,
      location: publishData.location,
      description: publishData.description,
      details: publishData.details,
      media: publishData.media || [],
      created: 'Hace unos minutos',
    };

    setPosts([newPost, ...posts]);
    setPublishData({ title: '', category: 'libros', condition: 'bueno', location: '', description: '', details: '', media: [] });
    setPage('home');
    setNotifications([
      { id: `n-${Date.now()}`, text: 'Tu publicación fue creada exitosamente.', read: false },
      ...notifications,
    ]);
  };

  const handleProfileSave = () => {
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? { ...user, ...profileData, email: user.email, id: user.id } : user,
    );
    const updatedCurrent = { ...currentUser, ...profileData };

    setUsers(updatedUsers);
    setCurrentUser(updatedCurrent);
    setNotifications([
      { id: `n-${Date.now()}`, text: 'Perfil actualizado con éxito.', read: false },
      ...notifications,
    ]);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfileData({ ...profileData, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleStartChat = (userId, authorName) => {
    if (!currentUser || currentUser.id === userId) return;

    const existingChat = chats.find(
      (chat) => chat.participants.includes(currentUser.id) && chat.participants.includes(userId),
    );

    if (existingChat) {
      setSelectedChatId(existingChat.id);
      setPage('chats');
      return;
    }

    const newChat = {
      id: `c${Date.now()}`,
      participants: [currentUser.id, userId],
      withUserId: userId,
      title: `Chat con ${authorName}`,
      messages: [
        {
          sender: currentUser.id,
          text: 'Hola, estoy interesado en tu publicación.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
    setPage('chats');
  };

  const handleSendMessage = (chatId) => {
    if (!newMessage.trim() || !chatId) return;

    const updatedChats = chats.map((chat) => {
      if (chat.id !== chatId) return chat;
      return {
        ...chat,
        messages: [
          ...chat.messages,
          {
            sender: currentUser.id,
            text: newMessage.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
    });

    setChats(updatedChats);
    setNewMessage('');
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
  };

  const handleToggleTheme = () => {
    setTheme((current) => (current === 'day' ? 'night' : 'day'));
  };

  const handleUserMenuSelect = (option) => {
    if (option === 'configuracion') {
      setPage('profile');
      setProfileTab('configuracion');
      return;
    }
    if (option === 'cuenta') {
      setPage('profile');
      setProfileTab('cuenta');
      return;
    }
    if (option === 'aspecto') {
      handleToggleTheme();
      return;
    }
    if (option === 'logout') {
      handleLogout();
      return;
    }
  };

  const profileOwner = users.find((user) => user.id === currentUser?.id) || currentUser;
  const profilePosts = posts.filter((post) => post.userId === currentUser?.id);

  return (
    <div className={`app-shell theme-${theme}`}>
      <Header
        currentUser={currentUser}
        page={page}
        logoSecondary={logoSecondary}
        unreadCount={unreadCount}
        onNavigate={setPage}
        onUserMenuSelect={handleUserMenuSelect}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onOpenPublish={() => setPage('publish')}
        theme={theme}
      />

      {!currentUser && page === 'landing' && (
        <LandingPage
          logoPrimary={logoPrimary}
          heroImage={heroImage}
          onLoginClick={() => {
            setAuthMode('login');
            setPage('login');
            setAuthMessage('');
          }}
          onRegisterClick={() => {
            setAuthMode('register');
            setPage('register');
            setAuthMessage('');
          }}
        />
      )}

      {!currentUser && (page === 'login' || page === 'register') && (
        <AuthPage
          authMode={authMode}
          authForm={authForm}
          onFormChange={setAuthForm}
          onSubmit={authMode === 'login' ? handleLogin : handleRegister}
          onToggleMode={() => {
            const nextMode = authMode === 'login' ? 'register' : 'login';
            setAuthMode(nextMode);
            setPage(nextMode);
            setAuthMessage('');
          }}
          authMessage={authMessage}
        />
      )}

      {currentUser && (
        <main className="dashboard-page">
          <Sidebar profileOwner={profileOwner} notifications={notifications} />

          <section className="dashboard-content">
            {page === 'home' && (
              <HomePage
                posts={filteredPosts}
                users={users}
                searchQuery={searchQuery}
                filterCategory={filterCategory}
                categories={categories}
                onSearchChange={setSearchQuery}
                onFilterChange={setFilterCategory}
                onOpenPublish={() => setPage('publish')}
                onStartChat={handleStartChat}
              />
            )}

            {page === 'profile' && (
              <ProfilePage
                currentUser={currentUser}
                profileTab={profileTab}
                onTabChange={setProfileTab}
                profileData={profileData}
                onProfileChange={setProfileData}
                onAvatarChange={handleAvatarChange}
                onSave={handleProfileSave}
                profilePosts={profilePosts}
              />
            )}

            {page === 'publish' && (
              <PublishPage
                publishData={publishData}
                categories={categories}
                onChange={handlePublishChange}
                onMediaChange={handleMediaUpload}
                onPublish={handlePublish}
                onClose={() => setPage('home')}
              />
            )}

            {page === 'chats' && (
              <ChatsPage
                chats={currentUserChats}
                users={users}
                currentUserId={currentUser.id}
                activeChatId={selectedChatId}
                onSelectChat={(chatId) => {
                  setSelectedChatId(chatId);
                  setPage('chats');
                }}
                onSendMessage={handleSendMessage}
                chatMessage={newMessage}
                onChatMessageChange={setNewMessage}
              />
            )}
          </section>
        </main>
      )}

    </div>
  );
}

export default App;

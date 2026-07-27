import React, { useEffect, useMemo, useState } from 'react';
import logoPrimary from './assets/nombredelapag.png';
import logoSecondary from './assets/logooriginal.png';
import heroImage from './assets/image-removebg-preview.png';
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
  clearAuthToken,
  createPost,
  getCategories,
  getCurrentUser,
  getPosts,
  getMyPosts,
  loginUser,
  registerUser,
  setAuthToken,
  updateCurrentUser,
} from './services/api.js';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);
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
    const loadInitialData = async () => {
      try {
        const token = window.localStorage.getItem('aporb_token');
        if (token) {
          setAuthToken(token);
          const currentUserResponse = await getCurrentUser();
          const user = currentUserResponse.user;
          if (user) {
            setCurrentUser(user);
            setProfileData({
              name: user.name || '',
              email: user.email || '',
              description: user.description || '',
              interests: user.interests || '',
              avatar: user.avatar || '',
            });
            setPage('home');
          }
        }

        const [postsResponse, categoriesResponse] = await Promise.all([getPosts(), getCategories()]);
        setPosts(postsResponse.posts || []);
        setCategories(categoriesResponse || []);

        const myPostsResponse = await getMyPosts().catch(() => ({ posts: [] }));
        if (myPostsResponse.posts?.length) {
          setPosts((prev) => {
            const merged = [...prev];
            const existingIds = new Set(merged.map((post) => post.id));
            myPostsResponse.posts.forEach((post) => {
              if (!existingIds.has(post.id)) {
                merged.push(post);
              }
            });
            return merged;
          });
        }
      } catch (error) {
        console.error('Failed to load initial data', error);
      }
    };

    loadInitialData();
  }, []);

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

  const handleLogin = async () => {
    setAuthMessage('');
    if (!authForm.email || !authForm.password) {
      setAuthMessage('Completa correo y contraseña.');
      return;
    }

    try {
      const response = await loginUser({
        email: authForm.email.trim().toLowerCase(),
        password: authForm.password,
      });

      const user = response.user;
      setCurrentUser(user);
      setUsers((prev) => (prev.some((item) => item.id === user.id) ? prev : [user, ...prev]));
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        description: user.description || '',
        interests: user.interests || '',
        avatar: user.avatar || '',
      });
      setPage('home');
      setAuthForm({ email: '', password: '', name: '' });
      setAuthMessage('');
    } catch (error) {
      setAuthMessage(error.message || 'Correo o contraseña incorrectos.');
    }
  };

  const handleRegister = async () => {
    setAuthMessage('');
    if (!authForm.name || !authForm.email || !authForm.password) {
      setAuthMessage('Completa todos los campos para registrarte.');
      return;
    }

    try {
      const response = await registerUser({
        username: authForm.name.trim(),
        email: authForm.email.trim().toLowerCase(),
        password: authForm.password,
      });

      const user = response.user;
      setCurrentUser(user);
      setUsers((prev) => (prev.some((item) => item.id === user.id) ? prev : [user, ...prev]));
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        description: user.description || '',
        interests: user.interests || '',
        avatar: user.avatar || '',
      });
      setPage('home');
      setAuthForm({ email: '', password: '', name: '' });
      setNotifications([
        { id: `n-${Date.now()}`, text: 'Ya eres parte de AporB. ¡Bienvenido!', read: false },
        ...notifications,
      ]);
    } catch (error) {
      setAuthMessage(error.message || 'No se pudo completar el registro.');
    }
  };

  const handleLogout = () => {
    clearAuthToken();
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

  const handlePublish = async () => {
    if (!publishData.title || !publishData.description) return;

    try {
      const response = await createPost({
        title: publishData.title,
        description: publishData.description,
        category_id: publishData.category,
        condition: publishData.condition,
        location: publishData.location,
        details: publishData.details,
        media: (publishData.media || []).map((item) => ({
          file_url: item.src,
          file_type: item.type,
          file_name: item.name,
        })),
      });

      const newPost = response.post;
      setPosts((prev) => [newPost, ...prev]);
      setPublishData({ title: '', category: 'libros', condition: 'bueno', location: '', description: '', details: '', media: [] });
      setPage('home');
      setNotifications([
        { id: `n-${Date.now()}`, text: 'Tu publicación fue creada exitosamente.', read: false },
        ...notifications,
      ]);
    } catch (error) {
      setNotifications([
        { id: `n-${Date.now()}`, text: error.message || 'No se pudo crear la publicación.', read: false },
        ...notifications,
      ]);
    }
  };

  const handleProfileSave = async () => {
    try {
      const response = await updateCurrentUser({
        username: profileData.name,
        first_name: profileData.name,
        last_name: '',
        bio: profileData.description,
        location: profileData.interests,
        avatar_url: profileData.avatar,
      });

      const updatedUser = response.user;
      setUsers((prev) => prev.map((user) => (user.id === currentUser.id ? updatedUser : user)));
      setCurrentUser(updatedUser);
      setNotifications([
        { id: `n-${Date.now()}`, text: 'Perfil actualizado con éxito.', read: false },
        ...notifications,
      ]);
    } catch (error) {
      setNotifications([
        { id: `n-${Date.now()}`, text: error.message || 'No se pudo actualizar el perfil.', read: false },
        ...notifications,
      ]);
    }
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
                searchQuery={searchQuery}
                filterCategory={filterCategory}
                categories={['all', ...categories.map((category) => category.name)]}
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
                categories={categories.map((category) => category.name)}
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

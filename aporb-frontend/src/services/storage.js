export const STORAGE_KEYS = {
  users: 'aporb_users',
  session: 'aporb_session',
  posts: 'aporb_posts',
  chats: 'aporb_chats',
  notifications: 'aporb_notifications',
};

export const categories = ['all', 'libros', 'hogar', 'ropa', 'electronica', 'juegos'];

export const defaultUsers = [
  {
    id: 'u1',
    name: 'AporB Demo',
    email: 'demo@aporb.com',
    password: 'demo123',
    description: 'Me encanta intercambiar libros, ropa y gadgets con mi comunidad.',
    interests: 'libros, tecnología, moda',
    avatar: '',
  },
  {
    id: 'u2',
    name: 'María Trueque',
    email: 'maria@aporb.com',
    password: 'trueque',
    description: 'Busco nuevos amigos para intercambiar cosas útiles.',
    interests: 'hogar, decoración, arte',
    avatar: '',
  },
];

export const defaultPosts = [
  {
    id: 'p1',
    userId: 'u2',
    title: 'Maceta artesanal + planta',
    category: 'hogar',
    description: 'Maceta pintada a mano con su planta verde. Busco herramientas o material de arte.',
    details: 'Perfecta para decorar tu sala o escritorio. Trueque ideal por kit de pintura o piezas de bricolaje.',
    created: 'Hace 2 horas',
  },
  {
    id: 'p2',
    userId: 'u1',
    title: 'Colección de libros juveniles',
    category: 'libros',
    description: 'Serie completa en buen estado. Intercambio por ropa, juegos o accesorios.',
    details: 'Incluye aventura, misterio y fantasía. Me interesa encontrar objetos para hogar o tecnología sencilla.',
    created: 'Hace 1 día',
  },
  {
    id: 'p3',
    userId: 'u2',
    title: 'Sudadera color azul',
    category: 'ropa',
    description: 'Sudadera cómoda talla M. Busco algo similar en talla L o artículos para hobbies.',
    details: 'Aún casi nueva. Cambiaría por juguetes, colección o accesorios de deporte.',
    created: 'Hace 3 días',
  },
];

export const defaultChats = [
  {
    id: 'c1',
    participants: ['u1', 'u2'],
    title: 'Chat con María Trueque',
    messages: [
      { sender: 'u2', text: 'Hola, ¿aún tienes los libros?', time: '12:10' },
      { sender: 'u1', text: 'Sí, están disponibles. ¿Qué tienes para ofrecer?', time: '12:14' },
    ],
  },
];

export const defaultNotifications = [
  { id: 'n1', text: 'Bienvenido a AporB. Empieza creando tu publicación.', read: false },
  { id: 'n2', text: 'Tu perfil está listo para recibir trueques.', read: false },
];

export function readStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

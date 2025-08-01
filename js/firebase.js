// Importa las funciones principales de Firebase desde el CDN (v11.9.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Configuración de Firebase usando variables de entorno de Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa la app de Firebase con la configuración proporcionada
const app = initializeApp(firebaseConfig);

// Obtiene la referencia a la base de datos en tiempo real de Firebase
const db = getDatabase(app);

/**
 * Guarda un voto en la base de datos.
 * @param {Object} data - Datos del voto (usuario, email, mensaje).
 * @returns {Promise<Object>} Resultado de la operación.
 */
function saveVote(data) {
  const votesCollectionRef = ref(db, 'votes');
  const newUserRef = push(votesCollectionRef);
  return set(newUserRef, {
    user: data.userInput,
    email: data.email,
    message: data.message,
    date: new Date().toISOString()
  })
    .then(() => {
      return { success: true, message: 'Voto guardado correctamente.' };
    })
    .catch((error) => {
      return { success: false, message: 'Error al guardar el voto.', error };
    });
}

/**
 * Guarda una reseña en la base de datos.
 * @param {Object} data - Datos de la reseña (calificación, comentario).
 * @returns {Promise<Object>} Resultado de la operación.
 */
function saveReview(data) {
  const reviewsCollectionRef = ref(db, 'reviews');
  const newUserRef = push(reviewsCollectionRef);
  return set(newUserRef, {
    rating: data.rating,
    review: data.review,
    date: new Date().toISOString()
  })
    .then(() => {
      return { success: true, message: 'Reseña guardada correctamente.' };
    })
    .catch((error) => {
      return { success: false, message: 'Error al guardar la reseña.', error };
    });
}

/**
 * Obtiene todas las reseñas almacenadas en la base de datos.
 * @returns {Promise<Object>} Objeto con las reseñas o un objeto vacío.
 */
async function getReviews() {
  const reviewsRef = ref(db, 'reviews');
  try {
    const snapshot = await get(reviewsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    return { error: true, message: `Error al obtener las reseñas: ${error.message}` };
  }
}

// Exporta las funciones para su uso en otros módulos
export { saveVote, saveReview, getReviews };
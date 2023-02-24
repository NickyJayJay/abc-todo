import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyBWkUuWVJz8s8OoDLoQ8tFGaGXmPzbWqYo',
	authDomain: 'benny-32eaa.firebaseapp.com',
	databaseURL: 'https://benny-32eaa-default-rtdb.firebaseio.com',
	projectId: 'benny-32eaa',
	storageBucket: 'benny-32eaa.appspot.com',
	messagingSenderId: '288472064831',
	appId: '1:288472064831:web:bddc99af1a228a5071e98a',
};

// Initialize Firebase and set bindings
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// const auth = getAuth();
export const url = app.options.databaseURL;

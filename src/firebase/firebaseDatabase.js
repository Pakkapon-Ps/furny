import { getDatabase, ref, set, onValue } from "firebase/database";
import app from "./firebaseConfig";

const database = getDatabase(app);

export function writeUserData(userId, name, email) {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email
  });
}

export function readUserData(userId, callback) {
  const userRef = ref(database, 'users/' + userId);
  onValue(userRef, (snapshot) => {
    callback(snapshot.val());
  });
}
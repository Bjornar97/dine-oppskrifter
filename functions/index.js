const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.addFavourite = functions
  .region("europe-west2")
  .firestore.document("favourites/{favouriteId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();

    // access a particular field as you would any JS property
    const recipeId = newValue.recipeId;

    // perform desired operations ...
    db.collection("recipes")
      .doc(recipeId)
      .update({ favourites: admin.firestore.FieldValue.increment(1) });
  });

exports.removeFavourite = functions
  .region("europe-west2")
  .firestore.document("favourites/{favouriteID}")
  .onDelete((snap, context) => {
    const deletedValue = snap.data();
    const recipeId = deletedValue.recipeId;

    // perform desired operations ...
    db.collection("recipes")
      .doc(recipeId)
      .update({
        favourites: admin.firestore.FieldValue.increment(-1)
      });
  });

exports.deleteAccount = functions
  .region("europe-west2")
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
      );
    }
    try {
      console.log("Deleting account " + context.auth.uid);
      let batch = db.batch();
      let done = false;
      let lastDoc = null;
      const limit = 50;

      console.log("Starting loop");

      while (!done) {
        let recipesRef = db
          .collection("recipes")
          .where("author.id", "==", context.auth.uid)
          .limit(limit);

        console.log("Made ref");
        if (lastDoc != null) {
          console.log("Last doc was not null");
          recipesRef.startAfter(lastDoc);
        }

        await recipesRef.get().then(snapshot => {
          console.log("Got batch");
          snapshot.forEach(doc => {
            console.log(doc.id);
            batch.delete(doc);
          });

          lastDoc = snapshot.docs[snapshot.docs.length - 1];

          if (snapshot.docs.length < limit) {
            console.log("Done");
            done = true;
          } else {
            console.log("Not done");
            done = false;
          }
        });
      }

      done = false;
      lastDoc = null;
      while (!done) {
        let favRef = db
          .collection("favourites")
          .where("user.id", "==", context.auth.uid)
          .limit(limit);

        if (lastDoc != null) {
          favRef.startAfter(lastDoc);
        }

        await favRef.get().then(snapshot => {
          console.log("Got batch fav");
          snapshot.forEach(doc => {
            console.log(doc.id);
            batch.delete(doc);
          });
          lastDoc = snapshot.docs[snapshot.docs.length - 1];

          if (snapshot.docs.length < limit) {
            console.log("fav done");
            done = true;
          } else {
            console.log("fav not done");
            done = false;
          }
        });

        console.log("Commiting batch");
        batch
          .commit()
          .then(() => {
            console.log("Batch complete");
          })
          .catch(error => {
            console.log("An error occured");
            console.dir(error);
            throw new functions.https.HttpsError("internal", {
              error: error,
              stage: "Batch Commit"
            });
          });

        await admin
          .auth()
          .deleteUser(context.auth.uid)
          .catch(error => {
            console.log("An error occured");
            console.dir(error);
            throw new functions.https.HttpsError("internal", {
              error: error,
              stage: "accountDeletion"
            });
          });
      }
      return true;
    } catch (error) {
      console.log("An error occured");
      console.dir(error);
      throw new functions.https.HttpsError("internal", {
        error: error,
        stage: "tryCatch"
      });
    }
  });

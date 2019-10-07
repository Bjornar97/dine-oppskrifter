const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("./adminKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "dine-oppskrifter.appspot.com"
});

const fs = require("fs");

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

exports.onRecipeDelete = functions
  .region("europe-west2")
  .firestore.document("recipes/{recipeId}")
  .onDelete((snap, context) => {
    const id = snap.id;
    db.collection("favourites")
      .where("recipeId", "==", id)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          doc.ref.delete();
        });
      });
  });

exports.app = functions
  .region("europe-west2")
  .https.onRequest(async (req, res) => {
    console.log("Path: " + req.path);

    // Checks if facebook crawler is getting here
    if (
      req.headers["user-agent"].split(" ").includes("facebookexternalhit/1.1")
    ) {
      // Adds all the meta tags and stuff and sends it back to facebook crawler
      let path = req.path.split("/");
      console.log("pathArray: " + path);
      let firstPart = path[1];
      console.log(firstPart);

      let responseText = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <meta property="og:locale" content="nb_NO" />
              <meta property="fb:app_id" content="2303461373305622" />
              <meta property="og:site_name" content="Dine Oppskrifter" />
          `;

      if (firstPart == "oppskrift") {
        let recipeId = path[2];

        if (recipeId != "") {
          let recipe = await db
            .collection("recipes")
            .doc(recipeId)
            .get();

          const recipeData = recipe.data();

          if (
            recipeData.status != "draft" &&
            recipeData.visibility != "Private"
          ) {
            const imagePath = recipeData.imagePath;
            console.log("ImagePath: " + imagePath);

            responseText += `
            <meta property="og:url" content="${req.protocol}://${
              req.hostname
            }/oppskrift/${recipeId}" />
            <meta property="og:type" content="article" />
            <meta property="og:title" content="${
              recipeData.title
            } - Dine Oppskrifter" />
            <meta property="og:description" content="${
              recipeData.description
            }" />
            <meta property="article:published_time" content="${new Date(
              recipeData.dateCreated
            ).toISOString()}" /> 
            <meta property="article:author" content="${
              recipeData.author.name
            }" />
            <meta property="article:section" content="${recipeData.category}" />
            <meta property="article:tag" content="Matoppskrift" />
            <meta property="article:tag" content="Mat" />
          `;

            if (recipeData.dateUpdated) {
              responseText += `<meta property="article:modified_time" content="${new Date(
                recipeData.dateUpdated
              ).toISOString()}" />`;
            }

            if (imagePath) {
              if (imagePath != "") {
                try {
                  const imageRef = admin
                    .storage()
                    .bucket()
                    .file(imagePath);

                  const imageURL =
                    "http://storage.googleapis.com/dine-oppskrifter/" +
                    imagePath;
                  console.log("imageUrl: " + imageURL);

                  let sizeOf = require("image-size");

                  let image = await imageRef.download();
                  const dimensions = sizeOf(image[0]);
                  const imageWidth = dimensions.width;
                  const imageHeight = dimensions.height;

                  responseText += `<meta property="og:image" content="${imageURL}" />
                             <meta property="og:image:width" content="${imageWidth}" />
                             <meta property="og:image:height" content="${imageHeight}" />
                             <meta property="og:image:alt" content="Bilde av ${recipeData.title}" />`;
                } catch (error) {
                  console.error("An error occured while getting image!");
                  console.dir(error);
                }
              }
            }
          } else {
            res.sendStatus(403);
          }
        }

        responseText += `</head>
            <body>
              
            </body>
          </html>`;

        res.send(responseText);
      } else {
        // TODO: Implement for the other pages
      }
    } else {
      console.log("Sending request");
      try {
        fs.readFile("./dist/index.html", function(err, data) {
          if (err) {
            throw err;
          }
          res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-Length": data.length
          });
          res.write(data);
          res.end();
        });
      } catch (error) {
        console.log("Error occured:");
        console.dir(error);
      }
    }
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

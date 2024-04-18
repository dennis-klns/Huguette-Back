

# Readme ![language](https://img.shields.io/badge/language-javascript-blue.svg)


## :package: Installation


### Étape 1: Installer Node.js


Avant d'installer ce projet, vous devez vérifier si Node.js est installé sur votre ordinateur.

Pour vérifier si Node.js est installé, exécutez cette commande dans votre terminal :


```sh
node -v
```

Si vous obtenez une réponse comme v14.17.0, cela signifie que Node.js est installé et vous pouvez passer à la section suivante.

Sinon vous pouvez télécharger et installer Node.js depuis le site officiel de Node.js.

## Étape 2: Installer les dépendances du projet

Tout d'abord, clonez le dépôt de votre projet en utilisant la commande suivante :

```sh
git clone git@github.com:yourusername/yourprojectname.git
cd yourprojectname
```

Installer Express.js et autres dépendances

Dans le répertoire de votre projet, installez Express.js et les autres dépendances nécessaires en utilisant npm (le gestionnaire de paquets de Node.js) :

```sh
npm install
```

Si votre projet utilise Yarn comme gestionnaire de paquets, vous pouvez exécuter :

```sh
yarn install
```

## Étape 3: Démarrer l'application

Pour démarrer votre application Express.js, utilisez la commande suivante dans le répertoire du projet :

```sh
npm app.js
```

Ou, si vous avez un script défini dans votre fichier package.json pour démarrer le serveur, vous pouvez simplement exécuter :

```sh
npm start
```

Ou avec Yarn :

```sh
yarn start
```


## 🚀 Usage

Cette application utilise Mongo Db pour gérer la base de donnée. 

## Configuration de la base de données

Créer un fichier .env

Avant de démarrer votre application, vous devez configurer votre chaîne de connexion MongoDB. Créez un fichier .env dans la racine de votre projet et ajoutez la chaîne de connexion comme suit :

```sh
CONNECTION_STRING='votre_chaine_de_connexion_mongodb'
```

Remplacez votre_chaine_de_connexion_mongodb par votre propre URI de connexion MongoDB. Vous pouvez obtenir cette URI depuis votre compte MongoDB Atlas ou votre installation locale de MongoDB.

Ajouter également une clé pour la gestion des photos avec Cloudinary. 
Vous pouvez récuper la clé sur le lien suivant : https://cloudinary.com/ 
Pui l'ajouter en dessous de votre connection string : 

```sh
CLOUDINARY_URL='votre_cléf_api_cloudinary'
```

Démarrer l'application

Assurez-vous que toutes les dépendances sont installées (voir les instructions d'installation ci-dessus) et démarrez votre serveur avec :

```sh
npm start
```

ou 

```sh
yarn start
```

## Tester les routes avec Thunder Client

Installer Thunder Client

Thunder Client est une extension légère pour tester les API, disponible sur VS Code. Installez Thunder Client depuis le marketplace de VS Code ou suivez ce lien :

Installer Thunder Client : https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client

Configurer et utiliser Thunder Client

Ouvrez Thunder Client dans VS Code en cliquant sur l'icône de Thunder Client dans la barre latérale.

Créez un nouveau projet dans Thunder Client pour organiser vos requêtes.

Ajoutez des requêtes pour tester les différentes routes de votre API. Pour chaque route, vous pouvez configurer la méthode HTTP (GET, POST, DELETE, etc.), l'URL (par exemple http://localhost:3000/api/route), et les corps de requête ou les paramètres si nécessaire.

Envoyez des requêtes pour voir les réponses directement dans Thunder Client. Utilisez les réponses pour valider le comportement de votre API et pour déboguer si nécessaire.

## Maintenant vous pouvez tester les routes ! 





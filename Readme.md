# Node

## Installation
Windows/Mac : Téléchargez l'instaleur sur [Nodejs.org](https://nodejs.org)   

Linux : lancez les commandes suivantes:
```sh
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt-get install -y nodejs
```

## Fonctionnalités

- [File system](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html) => Gestion du système de fichiers
- [Buffer](https://nodejs.org/dist/latest-v18.x/docs/api/buffer.html) => Lecture de données (réseau/fichier)
- [Path](https://nodejs.org/dist/latest-v18.x/docs/api/path.html) => Gestion des chemins (concaténation/absolute_path/...)
- [Child process](https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html) => Création de sous-process (node/shell/...) ("multi-threading")
- [HTTP/HTTPS](https://nodejs.org/dist/latest-v18.x/docs/api/http.html) => Gestion des calls HTTP/S (client/serveur)
- [Socket](https://nodejs.org/dist/latest-v18.x/docs/api/net.html#class-netsocket) => Sous-objet permettant de lire la data des calls réseaux (client/serveur)
- [JSDOM](https://github.com/jsdom/jsdom) => Parsing d'un contenu HTML pour utiliser l'API DOM

- [ExpressJS](https://expressjs.com/) (Server Web/Routing)
- [Sequelize](https://sequelize.org/docs/v6/) (ORM => BDD) / Postgresql
- [JWT](https://jwt.io/) (Authentification)
- OAUTH2 (Authentification)

## Autres infos
[Netflix Architecture](https://dev.to/gbengelebs/netflix-system-design-how-netflix-onboards-new-content-2dlb)

Grosses failles Web:
- Failles XSS => sanitizer le code produit
- Failles Injection SQL => Utiliser des requêtes préparées

## Exemples

**BIN1**: 
- Lecture d'un CSV et Ajout en BDD du non-existant
- *fileSearch*: Recherche de fichiers par nom/type/date + recherche de duplicas
  
**BIN2**:
- Lecture d'un CSV et Ajout en BDD du non-existant
- *markdownParser*: Parsing basique d'un fichier markdow + conversion en fichier HTML

# RESTFULL

## Format d'échange
**JSON**   
Headers:
- Content-Type: application/json
- Authorization: Bearer \<token\>

## Paths
**Collection**: /<resource_name>s
**Item**: /<resource_name>s/:id
**SubCollection**: /<resource_name>s/:id/<subresource_name>s

Exemple: User
**Collection**: /users => [{id:1},{id:3}]
**Item**: /users/3 => User 3
**SubCollection**: /users/3/comments <=> /comments?user_id=3

## HTTP Verbs
#### Collection
**GET** : Récupérer la collection d'items
**POST** : Créer un item dans la collection

#### Item
**GET** : Récupérer un item
**PUT** : Remplacer un item (= update)
**DELETE** : Supprimer un item

#### SubCollection
**GET** : Récupère un collection d'items associé à une ressource

## Http Codes
#### Collection
**GET** : Récupérer la collection d'items
- 200 : OK

**POST** : Créer un item dans la collection
- 201 : CREATED
- 400 : Bad Request => Le format attendu n'est pas correct (xml à la place de json)
- 422 : Unprocessable Entity => Format OK, data corrompu (ex. number dans un champs email)

#### Item
**GET** : Récupérer un item
- 200 : OK
- 404 : Not Found
  
**PUT** : Remplacer un item (= update)
- 200 : OK
- 400 : Bad Request => Le format attendu n'est pas correct (xml à la place de json)
- 422 : Unprocessable Entity => Format OK, data corrompu (ex. number dans un champs email)
- 404 : Not Found

**DELETE** : Supprimer un item
- 204 : No Content
- 404 : Not Found
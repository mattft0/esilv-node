# Node

## Installation
Windows/Mac : Téléchargez l'instaleur sur [Nodejs.org](https://nodejs.org)   

Linux : lancez les commandes suivantes:
```sh
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt-get install -y nodejs
```

## Fonctionnalités

- [File system](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html)
- [Buffer](https://nodejs.org/dist/latest-v18.x/docs/api/buffer.html)  
- [HTTP/HTTPS](https://nodejs.org/dist/latest-v18.x/docs/api/http.html)
- [Socket](https://nodejs.org/dist/latest-v18.x/docs/api/net.html#class-netsocket)


## Autres infos
[Netflix Architecture](https://dev.to/gbengelebs/netflix-system-design-how-netflix-onboards-new-content-2dlb)

Grosses failles Web:
- Failles XSS => sanitizer le code produit
- Failles Injection SQL => Utiliser des requêtes préparées
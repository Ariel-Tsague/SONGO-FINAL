# 🎮 SONGO P2P & IA

Bienvenue dans cette version numérique du **Songo**, le jeu de société traditionnel d'Afrique Centrale (très populaire au Cameroun). Cette application vous permet de jouer seul face à une Intelligence Artificielle ou de défier un ami à distance en mode Peer-to-Peer (P2P), sans aucun serveur intermédiaire.

---

## 📜 Règles du Songo

Le Songo est un jeu de stratégie qui se joue à deux. Le but est de capturer un maximum de pions (ou "graines") appartenant à l'adversaire.

### 1. Le Plateau de jeu

- Le plateau est composé de **14 cases** réparties sur 2 rangées :
  - La rangée du bas appartient au **Joueur 1**.
  - La rangée du haut appartient au **Joueur 2** (ou à l'IA).
- Au début de la partie, chaque case contient exactement **5 pions**.

### 2. Comment jouer un coup

- À votre tour, vous choisissez une case de **votre camp** qui contient des pions.
- Vous ramassez tous les pions de cette case et vous les distribuez **un par un** dans les cases suivantes, en tournant dans le **sens inverse des aiguilles d'une montre** (sens anti-horaire global sur le plateau).
- **Règle des grands coups :** Si vous distribuez plus de 13 pions, vous faites un tour complet. Vous devez alors **sauter** la case de départ sans déposer de pion dedans.

### 3. Comment capturer des pions

La capture se produit là où vous déposez votre **tout dernier pion** de votre distribution :

- **La condition :** Si ce dernier pion tombe dans le **camp adverse** et que la case ciblée contient désormais **1, 2 ou 3 pions** (après dépôt), vous capturez tous les pions de cette case.
- **La prise en chaîne :** Si la case précédente (toujours dans le camp adverse) contient elle aussi 1, 2 ou 3 pions, vous la capturez aussi, et ainsi de suite en revenant en arrière.
- **Règle de l'affamement :** Vous n'avez pas le droit de capturer tous les pions du camp adverse si cela le laisse totalement vide (sans aucun pion pour jouer au coup suivant). Si cela arrive, la capture est annulée.

### 4. Fin de la partie

La partie s'arrête immédiatement si :

- Un joueur atteint ou dépasse **36 pions** capturés (il gagne haut la main).
- Les deux joueurs se retrouvent bloqués sans pouvoir jouer aucun coup (le joueur avec le plus haut score gène).

---

## 💻 Comment utiliser l'application

L'interface dispose d'un menu latéral.

### Mode 1 : Jouer contre l'Ordinateur (J1 VS IA)

1. Cliquez sur le bouton **J1 VS IA** dans le menu de gauche.
2. Cliquez sur **Nouvelle partie IA**.
3. Entrez votre pseudonyme dans la zone centrale puis validez.
4. Le plateau s'affiche : vous jouez dans le camp du bas, l'ordinateur joue automatiquement ses coups dans le camp du haut.

### Mode 2 : Jouer contre un ami à distance (J1 VS J2)

Cette application utilise la technologie P2P (PeerJS). Vous vous connectez directement au PC de votre ami.

#### Si vous créez la partie (Hôte - J1) :

1. Cliquez sur **J1 VS J2**, puis sur **Créer une partie (Hôte)**.
2. Un code unique s'affiche à l'écran (ex: `a1b2c3d4-...`). **Copiez-le** et envoyez-le à votre ami (via WhatsApp, Telegram, Discord...).
3. Attendez que votre ami se connecte. Dès qu'il rejoint, entrez vos pseudonymes et lancez !

#### Si vous rejoignez un ami (Invité - J2) :

1. Cliquez sur **J1 VS J2**, puis sur **Rejoindre une partie**.
2. **Collez le code** que votre ami (l'Hôte) vous a envoyé dans le champ de saisie.
3. Cliquez sur **Se connecter**. L'écran de saisie des noms apparaîtra dès la liaison établie.

---

## 🛠️ Technologies utilisées

- **HTML5 / CSS3** .
- **JavaScript (Vanilla)**
- **PeerJS (WebRTC)**

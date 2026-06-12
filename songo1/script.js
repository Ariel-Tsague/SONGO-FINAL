class Songo {
    // Initialise les deux camps à 5 pions par case, les scores à 0 et configure les pseudos par défaut.
    constructor() {
        this.coteJoueur2 = [5, 5, 5, 5, 5, 5, 5];
        this.coteJoueur1 = [5, 5, 5, 5, 5, 5, 5];
        this.pointJoueur1 = 0;
        this.pointJoueur2 = 0;
        this.tour = 1;
        this.statutJeu = 0;
        this.pseudoJ1 = "ARCHICAD1";
        this.pseudoJ2 = "ARCHICAD2";
    }

    // Calcule la somme des pions d'un joueur pour savoir si son côté est totalement vide.
    estBloque(idJ) {
        const cote = (idJ === 1) ? this.coteJoueur1 : this.coteJoueur2;
        return cote.reduce((acc, val) => acc + val, 0) === 0 ? 1 : 0;
    }

    // Gère le retrait des graines d'une fosse et leur distribution une à une dans le sens anti-horaire.
    distribution(idJ, indexChoisi) {
        if (idJ !== this.tour || this.statutJeu !== 0) return null;
        let coteActuel = (idJ === 1) ? this.coteJoueur1 : this.coteJoueur2;
        if (idJ === 1 && this.coteJoueur1[indexChoisi] === 0) return null;
        if (idJ === 2 && this.coteJoueur2[indexChoisi] === 0) return null;

        let pions = (idJ === 1) ? this.coteJoueur1[indexChoisi] : this.coteJoueur2[indexChoisi];
        if (idJ === 1) this.coteJoueur1[indexChoisi] = 0;
        else this.coteJoueur2[indexChoisi] = 0;

        let indiceActuel = indexChoisi;
        let campActuel = idJ;
        let indexOrigine = indexChoisi;
        let campOrigine = idJ;

        while (pions > 0) {
            if (campActuel === 1) {
                indiceActuel++;
                if (indiceActuel > 6) {
                    indiceActuel = 6;
                    campActuel = 2;
                }
            } else {
                indiceActuel--;
                if (indiceActuel < 0) {
                    indiceActuel = 0;
                    campActuel = 1;
                }
            }

            if (campActuel === campOrigine && indiceActuel === indexOrigine) {
                continue;
            }

            if (campActuel === 1) {
                this.coteJoueur1[indiceActuel]++;
            } else {
                this.coteJoueur2[indiceActuel]++;
            }
            pions--;
        }
        return { campFinal: campActuel, indexFinal: indiceActuel };
    }

    // Inspecte la case d'arrivée et rafle les pions adverses si leur nombre est compris entre 1 et 3.
    priseEnChaine(idJ, infoFin) {
        if (!infoFin) return;
        let camp = infoFin.campFinal;
        let index = infoFin.indexFinal;

        if (camp === idJ) {
            this.tour = (this.tour === 1) ? 2 : 1;
            return;
        }

        let pointsGagnes = 0;
        let casesACompleter = [];

        if (camp === 1 && idJ === 2) {
            while (index >= 0 && this.coteJoueur1[index] > 0 && this.coteJoueur1[index] < 4) {
                pointsGagnes += this.coteJoueur1[index];
                casesACompleter.push({ camp: 1, idx: index });
                index--;
            }
        } else if (camp === 2 && idJ === 1) {
            while (index <= 6 && this.coteJoueur2[index] > 0 && this.coteJoueur2[index] < 4) {
                pointsGagnes += this.coteJoueur2[index];
                casesACompleter.push({ camp: 2, idx: index });
                index++;
            }
        }

        if (casesACompleter.length > 0) {
            let totalAdversaire = 0;
            if (idJ === 1) {
                totalAdversaire = this.coteJoueur2.reduce((acc, val) => acc + val, 0);
            } else {
                totalAdversaire = this.coteJoueur1.reduce((acc, val) => acc + val, 0);
            }

            if (pointsGagnes < totalAdversaire) {
                casesACompleter.forEach(c => {
                    if (c.camp === 1) this.coteJoueur1[c.idx] = 0;
                    else this.coteJoueur2[c.idx] = 0;
                });
                if (idJ === 1) this.pointJoueur1 += pointsGagnes;
                else this.pointJoueur2 += pointsGagnes;
            }
        }

        this.tour = (this.tour === 1) ? 2 : 1;
        this.verifierFin();
    }

    // Compare les scores et déclare un vainqueur dès que le seuil de 35 points est franchi ou en cas de blocage mutuel.
    verifierFin() {
        if (this.pointJoueur1 > 35) this.statutJeu = 1;
        else if (this.pointJoueur2 > 35) this.statutJeu = 2;
        else if (this.estBloque(1) && this.estBloque(2)) {
            this.statutJeu = this.pointJoueur1 > this.pointJoueur2 ? 1 : 2;
        }
    }

    // Nettoie le plateau et remet les compteurs à zéro pour relancer une nouvelle partie.
    reset() {
        this.coteJoueur1 = [5, 5, 5, 5, 5, 5, 5];
        this.coteJoueur2 = [5, 5, 5, 5, 5, 5, 5];
        this.pointJoueur1 = 0;
        this.pointJoueur2 = 0;
        this.tour = 1;
        this.statutJeu = 0;
    }

    // Remplace instantanément les données locales de l'instance par un nouvel objet d'état.
    importState(state) {
        this.coteJoueur1 = state.coteJoueur1;
        this.coteJoueur2 = state.coteJoueur2;
        this.pointJoueur1 = state.pointJoueur1;
        this.pointJoueur2 = state.pointJoueur2;
        this.tour = state.tour;
        this.statutJeu = state.statutJeu;
        this.pseudoJ1 = state.pseudoJ1;
        this.pseudoJ2 = state.pseudoJ2;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const jeu = new Songo();

    const sonClic = new Audio('sounds/click.mp3');
    const sonScore = new Audio('sounds/score.mp3');
    const sonVictoire = new Audio('sounds/victory.mp3');

    // Cible toutes les fosses circulaires du joueur 1 situés sur la rangée inférieure.
    const cases1 = document.querySelectorAll('.caseJ1');
    // Cible toutes les fosses circulaires du joueur 2 situés sur la rangée supérieure.
    const cases2 = document.querySelectorAll('.caseJ2');
    // Capture l'élément de texte destiné à guider l'utilisateur sur les actions en cours.
    const infos = document.getElementById('infos');
    // Sélectionne l'emplacement d'affichage de la note chiffrée du premier joueur.
    const scoreJ1 = document.getElementById('score1');
    // Sélectionne l'emplacement d'affichage de la note chiffrée du second joueur.
    const scoreJ2 = document.getElementById('score2');
    // Cible l'encadré de notification qui annonce le gagnant en fin de compte.
    const res = document.getElementById('res');
    // Intercepte le bouton de soumission finale du panneau de configuration des noms.
    const btnValider = document.getElementById('valider');
    // Localise le champ de saisie de texte dédié au nom du joueur 1.
    const nomInput = document.getElementById('champNom');
    // Localise le champ de saisie de texte dédié au nom du joueur 2.
    const nomInput2 = document.getElementById('champNom2');
    // Récupère l'élément cliquable affecté au redémarrage complet du plateau.
    const restart = document.getElementById('restart');
    // Saisit le bloc de l'interface qui enveloppe les formulaires de saisie de texte.
    const champs = document.getElementById('champsPseudos');
    // Repère le conteneur du formulaire du second joueur pour pouvoir l'isoler si besoin.
    const grpJ2 = document.getElementById('grpJ2');

    // Récupère l'option du menu d'accueil servant à activer le mode versus ordinateur.
    const btnIa = document.getElementById('btnIa');
    // Récupère l'option du menu d'accueil servant à ouvrir le panneau du mode réseau PeerJS.
    const btnP2p = document.getElementById('btnP2p');
    // Sélectionne l'écran d'accueil racine hébergeant les deux boutons cardinaux de sélection.
    const modesPrinci = document.getElementById('modesPrinci');
    // Saisit le panneau d'options réseau qui s'ouvre suite au choix du mode P2P.
    const sousMenuP2p = document.getElementById('sousMenuP2p');
    // Saisit le panneau d'options de difficulté qui s'ouvre suite au choix du mode IA.
    const sousMenuIa = document.getElementById('sousMenuIa');
    // Cible la commande de retour en arrière logée dans l'arborescence du menu réseau.
    const retModes = document.querySelector('.retModes');
    // Cible la commande de retour en arrière logée dans l'arborescence du menu de l'ordinateur.
    const retModesIa = document.getElementById('retModesIa');

    // Localise le bouton d'action par lequel un joueur se déclare comme créateur de salon.
    const btnCreer = document.getElementById('creerPartie');
    // Localise le bouton d'action par lequel un joueur décide de rejoindre un salon hébergé.
    const btnRejoindre = document.getElementById('rejoindrePartie');
    // Récupère la commande interne qui valide l'entrée en jeu contre l'intelligence artificielle.
    const btnCfgIa = document.getElementById('cfgIa');
    // Cible la zone masquable destinée à exposer le code unique généré pour l'hôte.
    const zoneId = document.getElementById('zoneId');
    // Cible la zone masquable affichant le volet de saisie du code pour l'invité.
    const zoneRejoindre = document.getElementById('zoneRej');
    // Isole la balise textuelle interne chargée de recevoir l'identifiant PeerJS brut à communiquer.
    const partageId = document.getElementById('partageId');
    // Repère le champ de formulaire où l'invité doit retranscrire le code de son partenaire.
    const codeHote = document.getElementById('codeHote');
    // Intercepte le bouton de validation qui déclenche l'impulsion de connexion vers l'ID saisi.
    const btnValiderConnexion = document.getElementById('validerConnexion');
    // Saisit l'étiquette d'affichage du rôle système pour informer le joueur de sa nature technique.
    const roleAffiche = document.getElementById('roleAffiche');

    let monPeer = null;
    let connexionP2P = null;
    let monRole = 0;
    let modeActuel = "";

    let ancienScoreJ1 = 0;
    let ancienScoreJ2 = 0;

    btnIa.addEventListener('click', () => {
        modesPrinci.style.display = 'none';
        sousMenuIa.style.display = 'flex';
    });

    btnP2p.addEventListener('click', () => {
        modesPrinci.style.display = 'none';
        sousMenuP2p.style.display = 'flex';
    });

    retModes.addEventListener('click', () => {
        sousMenuP2p.style.display = 'none';
        modesPrinci.style.display = 'flex';
    });

    retModesIa.addEventListener('click', () => {
        sousMenuIa.style.display = 'none';
        modesPrinci.style.display = 'flex';
    });

    btnCfgIa.addEventListener('click', () => {
        sousMenuIa.style.display = 'none';
        champs.style.display = 'block';
        grpJ2.style.display = 'none';
        monRole = 1;
        modeActuel = "IA";
        roleAffiche.innerText = "1 (Local VS IA)";
    });

    btnCreer.addEventListener('click', () => {
        sousMenuP2p.style.display = 'none';
        zoneId.style.display = 'block';
        monRole = 1;
        modeActuel = "P2P";
        roleAffiche.innerText = "1 (Hôte)";

        // Instancie un nouveau nœud PeerJS pour initialiser l'écoute sur le réseau.
        monPeer = new Peer();
        // Attribue et affiche l'identifiant unique récupéré depuis l'aiguilleur PeerJS dès sa confirmation.
        monPeer.on('open', (id) => {
            partageId.innerText = id;
        });

        // Intercepte l'appel réseau d'un hôte externe qui tente de s'ancrer à cette machine.
        monPeer.on('connection', (conn) => {
            // Verrouille la ligne de transmission réseau établie à l'intérieur de notre variable de session.
            connexionP2P = conn;
            // Démarre l'écoute active des messages et des paquets de données sur le canal ouvert.
            initialiserCanalP2P();
            zoneId.style.display = 'none';
            champs.style.display = 'block';
            grpJ2.style.display = 'block';
        });
    });

    btnRejoindre.addEventListener('click', () => {
        sousMenuP2p.style.display = 'none';
        zoneRejoindre.style.display = 'block';
        monRole = 2;
        modeActuel = "P2P";
        roleAffiche.innerText = "2 (Invité)";
    });

    btnValiderConnexion.addEventListener('click', () => {
        const targetId = codeHote.value.trim();
        if (!targetId) return;

        // Instancie le terminal PeerJS local de l'invité pour l'autoriser à émettre sur le réseau.
        monPeer = new Peer();
        // Force le déclenchement de la requête de liaison dès que la structure de l'antenne locale est opérationnelle.
        monPeer.on('open', () => {
            // Établit la connexion avec la machine distante en ciblant son code d'hôte unique.
            connexionP2P = monPeer.connect(targetId);
            // Arme instantanément le système d'écoute des données pour capter les réponses de l'hôte.
            initialiserCanalP2P();
            zoneRejoindre.style.display = 'none';
            champs.style.display = 'block';
            grpJ2.style.display = 'block';
        });
    });

    function initialiserCanalP2P() {
        // Ouvre le décodeur interne de la liaison P2P pour intercepter chaque flux de données entrant.
        connexionP2P.on('data', (data) => {
            // Filtre le signal reçu pour identifier s'il s'agit d'une instruction d'alignement de l'état du jeu.
            if (data.type === 'SYNC') {
                // Écrase les configurations et tableaux du jeu local par l'état exact transféré à travers le réseau.
                jeu.importState(data.game);
                document.getElementById('pseudoAffiche').innerText = jeu.pseudoJ1;
                document.getElementById('pseudoAffiche2').innerText = jeu.pseudoJ2;
                document.getElementById('statutLat').style.display = "flex";
                document.getElementById('jeuCont').style.display = "flex";
                majInterface();
            }
        });
    }

    btnValider.addEventListener('click', () => {
        if (modeActuel === "IA") {
            jeu.pseudoJ1 = nomInput.value.trim() !== "" ? nomInput.value : "Joueur 1";
            jeu.pseudoJ2 = "Ordinateur";
        } else {
            jeu.pseudoJ1 = nomInput.value.trim() !== "" ? nomInput.value : "ARCHICAD1";
            jeu.pseudoJ2 = nomInput2.value.trim() !== "" ? nomInput2.value : "ARCHICAD2";
        }

        document.getElementById('pseudoAffiche').innerText = jeu.pseudoJ1;
        document.getElementById('pseudoAffiche2').innerText = jeu.pseudoJ2;

        champs.style.display = "none";
        document.getElementById('statutLat').style.display = "flex";
        document.getElementById('jeuCont').style.display = "flex";

        syncData();
        majInterface();
    });

    function syncData() {
        // Valide la présence d'un canal P2P actif avant d'autoriser l'envoi de données réseaux.
        if (modeActuel === "P2P" && connexionP2P) {
            // Sérialise et propulse le snapshot instantané de l'arborescence logique du jeu vers la machine distante.
            connexionP2P.send({
                type: 'SYNC',
                game: {
                    coteJoueur1: jeu.coteJoueur1,
                    coteJoueur2: jeu.coteJoueur2,
                    pointJoueur1: jeu.pointJoueur1,
                    pointJoueur2: jeu.pointJoueur2,
                    tour: jeu.tour,
                    statutJeu: jeu.statutJeu,
                    pseudoJ1: jeu.pseudoJ1,
                    pseudoJ2: jeu.pseudoJ2
                }
            });
        }
    }

    // Filtre les cases éligibles du camp supérieur et déclenche un choix aléatoire après un délai d'attente automatique.
    function coupIA() {
        if (jeu.statutJeu !== 0 || jeu.tour !== 2) return;
        let indicesValides = [];
        jeu.coteJoueur2.forEach((pions, idx) => {
            if (pions > 0) indicesValides.push(idx);
        });
        if (indicesValides.length === 0) {
            jeu.tour = 1;
            jeu.verifierFin();
            majInterface();
            return;
        }
        setTimeout(() => {
            let indexChoisi = indicesValides[Math.floor(Math.random() * indicesValides.length)];
            sonClic.play().catch(e => {});
            const infoFin = jeu.distribution(2, indexChoisi);
            jeu.priseEnChaine(2, infoFin);
            majInterface();
        }, 1200);
    }

    // Réinjecte les nouvelles valeurs numériques des tableaux dans les éléments HTML correspondants et gère les signaux sonores.
    function majInterface() {
        scoreJ1.innerText = jeu.pointJoueur1;
        scoreJ2.innerText = jeu.pointJoueur2;

        jeu.coteJoueur1.forEach((p, i) => { if (cases1[i]) cases1[i].innerText = p; });
        jeu.coteJoueur2.forEach((p, i) => { if (cases2[i]) cases2[i].innerText = p; });

        if (jeu.pointJoueur1 > ancienScoreJ1 || jeu.pointJoueur2 > ancienScoreJ2) {
            sonScore.play().catch(e => {});
        }
        ancienScoreJ1 = jeu.pointJoueur1;
        ancienScoreJ2 = jeu.pointJoueur2;

        if (jeu.statutJeu !== 0) {
            res.style.display = "block";
            sonVictoire.play().catch(e => {});
            res.innerHTML = jeu.statutJeu === 1 ? `🏆 ${jeu.pseudoJ1} Gagne !` : `🏆 ${jeu.pseudoJ2} Gagne !`;
            infos.innerText = "Partie terminée !";
        } else {
            res.style.display = "none";
            const actuelPseudo = jeu.tour === 1 ? jeu.pseudoJ1 : jeu.pseudoJ2;
            if (jeu.tour === monRole) {
                infos.innerText = `🟢 C'est votre tour de jouer (${actuelPseudo})`;
            } else {
                infos.innerText = `🔴 Attente du coup (${actuelPseudo})`;
            }

            if (modeActuel === "IA" && jeu.tour === 2) {
                coupIA();
            }
        }
    }

    cases1.forEach((e, i) => {
        e.addEventListener('click', () => {
            if (monRole !== 1) {
                infos.innerText = "❌ Vous contrôlez le camp du haut.";
                return;
            }
            if (jeu.tour !== 1) {
                infos.innerText = `❌ Tour de ${jeu.pseudoJ2}`;
                return;
            }
            sonClic.play().catch(e => {});
            const infoFin = jeu.distribution(1, i);
            if (infoFin === null) {
                infos.innerText = "❌ Case vide !";
                return;
            }
            jeu.priseEnChaine(1, infoFin);
            syncData();
            majInterface();
        });
    });

    cases2.forEach((e, i) => {
        e.addEventListener('click', () => {
            if (modeActuel === "IA") return;
            if (monRole !== 2) {
                infos.innerText = "❌ Vous contrôlez le camp du bas.";
                return;
            }
            if (jeu.tour !== 2) {
                infos.innerText = `❌ Tour de ${jeu.pseudoJ1}`;
                return;
            }
            sonClic.play().catch(e => {});
            const infoFin = jeu.distribution(2, i);
            if (infoFin === null) {
                infos.innerText = "❌ Case vide !";
                return;
            }
            jeu.priseEnChaine(2, infoFin);
            syncData();
            majInterface();
        });
    });

    restart.addEventListener('click', () => {
        if (confirm('Recommencer la partie?')) {
            jeu.reset();
            ancienScoreJ1 = 0;
            ancienScoreJ2 = 0;
            syncData();
            majInterface();
        }
    });
});
import Bitboard from "./Bitboard";
import Logger from "./Logger";

export default class AI {
    board = new Bitboard(); // Contient le board actuel
    max_depth = 7; // Paramètre pour changer la profondeur de recherche maximale
    node_map = new Map(); // Stoque les coups en fonction de leur score
    count = 0; // Compte le nombre positions évaluées
    time: number; // Compte le temps pris pour l'évaluation de toutes les positions

    /**
     * Evalue la position de manière récursive et retourne le meilleur coups
     * (ou un coups aléatoire dans le cas de positions équivalentes)
     * @param board Le board à évaluer
     * @param depth La profondeur actuelle
     * @param maxing Si on max ou on min (d'où le minimax)
     * @return number Le meilleur coup
     */
    minimax(board, depth, maxing) {
        if (this.count === 0) { // Lors du premier appel de la fontion on prépare le timer et on nettoie la node_map
            this.time = Date.now();
            this.node_map.clear();
        }
        this.count++; // On incrémente le compteur
        if (depth !== 0 && (board.isWin(0) || board.isWin(1) || depth === this.max_depth)) {
            if (board.isWin(1)) return -42 + depth; // S'il y a une victoire du joueur
            else if (board.isWin(0)) return 42 - depth; // S'il y a une victoire de l'ordinateur
            return 0; // Si on a atteint la profondeur max
        }

        let best = maxing ? -42 : 42; // On initialize la valeur au plus bas (si on max) ou au plus haut (si on min)
        let availableMoves = board.listMoves(); // On récupère les coups possibles
        for (let i = 0; i < availableMoves.length; i++) {
            let child = board.copy(); // Pour chaque coups, on crée un copie du board actuel
            child.move(availableMoves[i]); // On joue le coup
            let value = this.minimax(child, depth + 1, !maxing); // On évalue cette position
            best = maxing ? Math.max(best, value) : Math.min(best, value); // Si on max on récupère le max entre le score actuel
            // et la dernière évaluation, sinon le minimum
            if (depth === 0) { // Si on est à la profondeur zéro, on stoque le coups en fonction de son score
                if (this.node_map.get(value)) this.node_map.set(value, [...this.node_map.get(value), availableMoves[i]]);
                else this.node_map.set(value, [availableMoves[i]]);
            }
        }
        if (depth === 0) { // Si on est à la pronfondeur 0, c'est qu'on a fini l'évaluation donc on retourne le meilleur coups
            // et on affiche le temps
            Logger.debug(`Minimax solution found: ${Date.now() - this.time}ms || Depth: ${this.max_depth} || Coups évalués: ${this.count}`);
            console.log(this.node_map);
            this.count = 0;
            return this.node_map.get(best)[Math.floor(Math.random() * this.node_map.get(best).length)]; // On retoure un coups aléatoire
            // parmis ceux qui ont le meilleur score.
        }
        return best; // Si on est pas a la profondeur 0, on retourne le meilleur score actuel.
    }

    alphaBetaPruning(board: Bitboard, depth: number, alpha: number, beta: number, maxing: boolean): number {
        if (this.count === 0) { // Lors du premier appel de la fontion on prépare le timer et on nettoie la node_map
            this.time = Date.now();
            this.node_map.clear();
        }
        this.count++; // On incrémente le compteur
        if (board.isWin(0) || board.isWin(1) || depth === this.max_depth) {
            if (board.isWin(1)) return -42 + depth; // S'il y a une victoire du joueur
            else if (board.isWin(0)) return 42 - depth; // S'il y a une victoire de l'ordinateur
            return 0; // Si on a atteint la profondeur max
        }
        let value;
        let availableMoves = board.listMoves(); // On récupère les coups possibles
        if (maxing) {
            value = -99;
            for (let i = 0; i < availableMoves.length; i++) {
                let child = board.copy();
                child.move(availableMoves[i]);
                let v = this.alphaBetaPruning(child, depth + 1, alpha, beta, false);
                if (depth == 0 && v != alpha) {
                    if (this.node_map.get(v)) this.node_map.set(v, [...this.node_map.get(v), availableMoves[i]]);
                    else this.node_map.set(v, [availableMoves[i]]);
                }
                value = Math.max(value, v);
                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
        } else {
            value = 99;
            for (let i = 0; i < availableMoves.length; i++) {
                let child = board.copy();
                child.move(availableMoves[i]);
                let v = this.alphaBetaPruning(child, depth + 1, alpha, beta, true);
                if (depth == 0 && v!= beta) {
                    if (this.node_map.get(v)) this.node_map.set(v, [...this.node_map.get(v), availableMoves[i]]);
                    else this.node_map.set(v, [availableMoves[i]]);
                }
                value = Math.min(value, v);
                beta = Math.min(beta, value);
                if (beta <= alpha) break;
            }
        }
        if (depth === 0) { // Si on est à la pronfondeur 0, c'est qu'on a fini l'évaluation donc on retourne le meilleur coups
            // et on affiche le temps
            Logger.debug(`AlphaBeta solution found: ${Date.now() - this.time}ms || Depth: ${this.max_depth} || Coups évalués: ${this.count}`);
            console.log(this.node_map, alpha, beta);
            this.count = 0;
            return this.node_map.get(alpha)[Math.floor(Math.random() * this.node_map.get(alpha).length)]; // On retoure un coups aléatoire
            // parmis ceux qui ont le meilleur score.
        }
        return value;
    }
}
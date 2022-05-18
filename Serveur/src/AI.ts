import Bitboard from "./Bitboard";
import Logger from "./Logger";

export default class AI {
    board = new Bitboard(); // Contient le board actuel
    max_depth = 12; // Paramètre pour changer la profondeur de recherche maximale
    node_map = new Map(); // Stoque les coups en fonction de leur score
    count = 0; // Compte le nombre positions évaluées
    time: number; // Compte le temps pris pour l'évaluation de toutes les positions

    static evaluate(position, index): number {
        if (position.isWin(index)) return Infinity;
        if (position.isWin(index == 1 ? 0 : 1)) return -Infinity;
        let score = (100 * position.countXInARow(3, index) + 3 * position.countXInARow(2, index)) -
            (100 * position.countXInARow(3, index == 1 ? 0 : 1) + 3 * position.countXInARow(2, index == 1 ? 0 : 1));

        return score;
    }

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
        if (depth !== 0 && (board.isWin(0) || board.isWin(1) || depth === this.max_depth)) {
            if (board.isWin(1)) return -42 + depth; // S'il y a une victoire du joueur
            else if (board.isWin(0)) return 42 - depth; // S'il y a une victoire de l'ordinateur
            return 0; // Si on a atteint la profondeur max
        }

        let best = maxing ? -42 : 42; // On initialize la valeur au plus bas (si on max) ou au plus haut (si on min)
        let availableMoves = board.listMoves(); // On récupère les coups possibles
        for (let i = 0; i < availableMoves.length; i++) {
            this.count++; // On incrémente le compteur
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
            Logger.debug(`Minimax solution found: ${Date.now() - this.time}ms || Depth: ${this.max_depth} || Coups évalués: ${this.count} || Score: ${best}`);
            this.count = 0;
            return this.node_map.get(best)[Math.floor(Math.random() * this.node_map.get(best).length)]; // On retoure un coups aléatoire
            // parmis ceux qui ont le meilleur score.
        }
        return best; // Si on est pas a la profondeur 0, on retourne le meilleur score actuel.
    }

    /**
     * Evalue une position avec l'algorithme minimax, mais en coupant les branches inutiles de l'arbre de possibilités
     * Pour gagner du temps
     * @param position Le board
     * @param depth La profondeur
     * @param alpha L'alpha
     * @param beta Le beta
     * @param maximizingPlayer Si on max ou on min
     */
    alphaBeta(position: Bitboard, index, depth = this.max_depth, alpha = -Infinity, beta = Infinity, maximizingPlayer = true): number {
        // Si la position est une victoire ou si on est à la profondeur max, on évalue la position
        if (depth == 0 || position.isWin(0) || position.isWin(1)) return AI.evaluate(position, index);
        let children = position.listChildren(); // On récupère toutes les positions enfants de celle-ci
        let val = maximizingPlayer ? -Infinity : Infinity; // On initialize notre valeur en fonction de si on min ou on max
        for (let child of children) { // On boucle sur chaque enfant de la position
            let e = this.alphaBeta(child, index, depth - 1, alpha, beta, !maximizingPlayer); // On évalue l'enfant
            val = maximizingPlayer ? Math.max(val, e) : Math.min(val, e); // On min ou on max
            if (depth === this.max_depth && !this.node_map.get(val)) this.node_map.set(val, child.lastMove()); // Si on est sur la première profonfeur, on stoque la valeur
            alpha = maximizingPlayer ? Math.max(alpha, e) : alpha;
            beta = maximizingPlayer ? beta : Math.min(beta, e);
            if (beta <= alpha) break;
        }
        if (depth === this.max_depth) {
            let bestMove = this.node_map.get(maximizingPlayer ? alpha : beta);
            console.log(`Alpha: ${alpha}, Beta: ${beta}, bestMove: ${bestMove}, NodeMap:`, this.node_map);
            return bestMove;
        }
        return val;
    }
}
module rex_chess::chess {
    use std::string::{String, utf8};
    use std::signer;
    use std::vector;
    use initia_std::table::{Self, Table};
    use initia_std::object;

    // ==================== Errors ====================
    const E_NOT_YOUR_TURN: u64 = 1;
    const E_GAME_NOT_FOUND: u64 = 2;
    const E_INVALID_MOVE: u64 = 3;
    const E_GAME_OVER: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;
    const E_INSUFFICIENT_FUNDS: u64 = 6;
    const E_TOURNAMENT_FULL: u64 = 7;
    const E_INVALID_POSITION: u64 = 8;

    // ==================== Constants ====================
    const STARTING_FEN: vector<u8> = b"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    
    // Piece values for evaluation
    const PAWN_VALUE: u64 = 1;
    const KNIGHT_VALUE: u64 = 3;
    const BISHOP_VALUE: u64 = 3;
    const ROOK_VALUE: u64 = 5;
    const QUEEN_VALUE: u64 = 9;
    const KING_VALUE: u64 = 1000;

    // ELO K-factor for rating updates
    const K_FACTOR: u64 = 32;

    // ==================== Structs ====================
    struct Game has store, drop {
        game_id: u64,
        white: address,
        black: address,
        white_elo: u64,
        black_elo: u64,
        fen: String,
        moves: vector<String>,
        status: String, // "active" | "white_won" | "black_won" | "draw"
        white_time_ms: u64,
        black_time_ms: u64,
        is_white_turn: bool,
        wager_amount: u64,
        last_move_time: u64,
        halfmove_clock: u64,
        fullmove_number: u64,
    }

    struct Player has store, drop {
        addr: address,
        rating: u64,
        wins: u64,
        losses: u64,
        draws: u64,
        username: String,
    }

    struct Tournament has store, drop {
        tournament_id: u64,
        name: String,
        creator: address,
        participants: vector<address>,
        entry_fee: u64,
        prize_pool: u64,
        max_players: u64,
        status: String, // "open" | "in_progress" | "completed"
        bracket: vector<u64>, // game_ids in tournament order
    }

    struct Registry has key {
        games: Table<u64, Game>,
        players: Table<address, Player>,
        tournaments: Table<u64, Tournament>,
        game_counter: u64,
        tournament_counter: u64,
    }

    // ==================== Initialization ====================
    public entry fun initialize(account: &signer) {
        let registry = Registry {
            games: table::new(),
            players: table::new(),
            tournaments: table::new(),
            game_counter: 0,
            tournament_counter: 0,
        };
        move_to(account, registry);
    }

    public entry fun register_player(
        account: &signer,
        username: String,
    ) acquires Registry {
        let player_addr = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@rex_chess);

        let player = Player {
            addr: player_addr,
            rating: 1200, // Default starting rating
            wins: 0,
            losses: 0,
            draws: 0,
            username,
        };

        table::add(&mut registry.players, player_addr, player);
    }

    // ==================== Game Creation ====================
    public entry fun create_game(
        account: &signer,
        opponent: address,
        initial_fen: String,
        wager_amount: u64,
        time_milliseconds: u64,
    ) acquires Registry {
        let white = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@rex_chess);

        let game_id = registry.game_counter;
        
        // Get player ratings
        let white_elo = if (table::contains(&registry.players, white)) {
            table::borrow(&registry.players, white).rating
        } else {
            1200
        };

        let black_elo = if (table::contains(&registry.players, opponent)) {
            table::borrow(&registry.players, opponent).rating
        } else {
            1200
        };

        let new_game = Game {
            game_id,
            white,
            black: opponent,
            white_elo,
            black_elo,
            fen: initial_fen,
            moves: vector::empty(),
            status: utf8(b"active"),
            white_time_ms: time_milliseconds,
            black_time_ms: time_milliseconds,
            is_white_turn: true,
            wager_amount,
            last_move_time: 0,
            halfmove_clock: 0,
            fullmove_number: 1,
        };

        table::add(&mut registry.games, game_id, new_game);
        registry.game_counter = game_id + 1;
    }

    // ==================== Move Logic ====================
    public entry fun make_move(
        account: &signer,
        game_id: u64,
        move_notation: String,
        new_fen: String,
        time_spent_ms: u64,
    ) acquires Registry {
        let player = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@rex_chess);
        
        assert!(table::contains(&registry.games, game_id), E_GAME_NOT_FOUND);
        let game = table::borrow_mut(&mut registry.games, game_id);

        // Verify it's player's turn
        if (game.is_white_turn) {
            assert!(player == game.white, E_NOT_YOUR_TURN);
            assert!(game.white_time_ms > time_spent_ms, E_INSUFFICIENT_FUNDS);
            game.white_time_ms = game.white_time_ms - time_spent_ms;
        } else {
            assert!(player == game.black, E_NOT_YOUR_TURN);
            assert!(game.black_time_ms > time_spent_ms, E_INSUFFICIENT_FUNDS);
            game.black_time_ms = game.black_time_ms - time_spent_ms;
        };

        // Check game status
        assert_active_game(game);

        // Validate move is legal (done client-side, verified by FEN change)
        assert!(is_valid_fen(&new_fen), E_INVALID_MOVE);

        // Record move
        vector::push_back(&mut game.moves, move_notation);
        game.fen = new_fen;
        
        // Update halfmove and fullmove clocks
        game.halfmove_clock = game.halfmove_clock + 1;
        if (!game.is_white_turn) {
            game.fullmove_number = game.fullmove_number + 1;
        };

        game.is_white_turn = !game.is_white_turn;
    }

    public entry fun resign_game(
        account: &signer,
        game_id: u64,
    ) acquires Registry {
        let player = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@rex_chess);
        
        assert!(table::contains(&registry.games, game_id), E_GAME_NOT_FOUND);
        let game = table::borrow_mut(&mut registry.games, game_id);

        let is_white = player == game.white;
        assert!(is_white || player == game.black, E_UNAUTHORIZED);

        if (is_white) {
            game.status = utf8(b"black_won");
            update_player_rating(&mut registry.players, game.black, game.white_elo, true);
            update_player_rating(&mut registry.players, game.white, game.black_elo, false);
        } else {
            game.status = utf8(b"white_won");
            update_player_rating(&mut registry.players, game.white, game.black_elo, true);
            update_player_rating(&mut registry.players, game.black, game.white_elo, false);
        };
    }

    public entry fun draw_game(
        account: &signer,
        game_id: u64,
    ) acquires Registry {
        let player = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@rex_chess);
        
        assert!(table::contains(&registry.games, game_id), E_GAME_NOT_FOUND);
        let game = table::borrow_mut(&mut registry.games, game_id);

        assert!(player == game.white || player == game.black, E_UNAUTHORIZED);
        assert_active_game(game);

        game.status = utf8(b"draw");
        
        // Both players get rating adjustment for draw
        let white_new_rating = calculate_elo_change(game.white_elo, game.black_elo, 0);
        let black_new_rating = calculate_elo_change(game.black_elo, game.white_elo, 0);

        if (table::contains(&registry.players, game.white)) {
            let white_player = table::borrow_mut(&mut registry.players, game.white);
            white_player.rating = white_new_rating;
            white_player.draws = white_player.draws + 1;
        };

        if (table::contains(&registry.players, game.black)) {
            let black_player = table::borrow_mut(&mut registry.players, game.black);
            black_player.rating = black_new_rating;
            black_player.draws = black_player.draws + 1;
        };
    }

    // ==================== Tournament Logic ====================
    public entry fun create_tournament(
        account: &signer,
        name: String,
        entry_fee: u64,
        max_players: u64,
    ) acquires Registry {
        let creator = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@rex_chess);

        let tournament_id = registry.tournament_counter;

        let tournament = Tournament {
            tournament_id,
            name,
            creator,
            participants: vector::empty(),
            entry_fee,
            prize_pool: entry_fee * max_players,
            max_players,
            status: utf8(b"open"),
            bracket: vector::empty(),
        };

        table::add(&mut registry.tournaments, tournament_id, tournament);
        registry.tournament_counter = tournament_id + 1;
    }

    public entry fun join_tournament(
        account: &signer,
        tournament_id: u64,
    ) acquires Registry {
        let player = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@rex_chess);

        assert!(table::contains(&registry.tournaments, tournament_id), E_GAME_NOT_FOUND);
        let tournament = table::borrow_mut(&mut registry.tournaments, tournament_id);

        assert!(vector::length(&tournament.participants) < tournament.max_players, E_TOURNAMENT_FULL);
        vector::push_back(&mut tournament.participants, player);
    }

    // ==================== View Functions ====================
    public fun get_game(registry_addr: address, game_id: u64): (address, address, String, vector<String>, String) acquires Registry {
        let registry = borrow_global<Registry>(registry_addr);
        assert!(table::contains(&registry.games, game_id), E_GAME_NOT_FOUND);
        
        let game = table::borrow(&registry.games, game_id);
        (game.white, game.black, game.fen, game.moves, game.status)
    }

    public fun get_player_rating(registry_addr: address, player: address): u64 acquires Registry {
        let registry = borrow_global<Registry>(registry_addr);
        if (table::contains(&registry.players, player)) {
            table::borrow(&registry.players, player).rating
        } else {
            1200
        }
    }

    public fun get_player_stats(registry_addr: address, player: address): (u64, u64, u64, u64) acquires Registry {
        let registry = borrow_global<Registry>(registry_addr);
        if (table::contains(&registry.players, player)) {
            let p = table::borrow(&registry.players, player);
            (p.rating, p.wins, p.losses, p.draws)
        } else {
            (1200, 0, 0, 0)
        }
    }

    // ==================== Helper Functions ====================
    fun assert_active_game(game: &Game) {
        assert!(game.status == utf8(b"active"), E_GAME_OVER);
    }

    fun is_valid_fen(fen: &String): bool {
        // Basic FEN validation - check if it's not empty
        // Full validation should be done off-chain for performance
        !string::is_empty(fen)
    }

    fun update_player_rating(
        players: &mut Table<address, Player>,
        player_addr: address,
        opponent_rating: u64,
        is_winner: bool,
    ) {
        if (table::contains(players, player_addr)) {
            let player = table::borrow_mut(players, player_addr);
            let result = if (is_winner) 1 else 0;
            let new_rating = calculate_elo_change(player.rating, opponent_rating, result);
            player.rating = new_rating;
            
            if (is_winner) {
                player.wins = player.wins + 1;
            } else {
                player.losses = player.losses + 1;
            };
        }
    }

    fun calculate_elo_change(current_rating: u64, opponent_rating: u64, result: u64): u64 {
        // ELO calculation: new_rating = current_rating + K * (result - expected_score)
        // expected_score = 1 / (1 + 10^((opponent_rating - current_rating) / 400))
        // Simplified calculation for Move lang (using fixed point arithmetic)
        
        let rating_diff = if (current_rating > opponent_rating) {
            current_rating - opponent_rating
        } else {
            opponent_rating - current_rating
        };

        let expected_score = if (rating_diff > 400) {
            if (current_rating > opponent_rating) 95 else 5
        } else if (rating_diff > 200) {
            if (current_rating > opponent_rating) 90 else 10
        } else if (rating_diff > 100) {
            if (current_rating > opponent_rating) 75 else 25
        } else {
            50
        };

        let change = if (result > expected_score) {
            ((result - expected_score) * K_FACTOR) / 100
        } else {
            ((expected_score - result) * K_FACTOR) / 100
        };

        if (result > 50) {
            current_rating + change
        } else {
            if (current_rating > change) current_rating - change else 1000
        }
    }

    fun string::is_empty(s: &String): bool {
        vector::is_empty(string::bytes(s))
    }
}

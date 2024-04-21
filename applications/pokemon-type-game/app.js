import { Type, types } from "./type.js";
import { DamageTier, Pokemon, get, getAll, highestGeneration, pokemon } from "./pokemon.js";
import { GameState, TypeGame, PokemonGame } from "./game.js";


if (!localStorage.getItem("background-gradient-index")) localStorage.setItem("background-gradient-index", 0);
if (!localStorage.getItem("easy-highest-streak")) localStorage.setItem("easy-highest-streak", 0);
if (!localStorage.getItem("medium-highest-streak")) localStorage.setItem("medium-highest-streak", 0);
if (!localStorage.getItem("hard-highest-streak")) localStorage.setItem("hard-highest-streak", 0);
for (const button of $("#medium-options").children) {
    if (!button.classList.contains("region-button")) continue;
    if (!localStorage.getItem(button.id + "-deselected")) localStorage.setItem(button.id + "-deselected", 'false');
}
for (const checkbox of $("#medium-options").children) {
    if (!checkbox.classList.contains("checkbox")) continue;
    if (!localStorage.getItem(checkbox.id + "-selected")) localStorage.setItem(checkbox.id + "-selected", 'true');
}
if (!localStorage.getItem("muted")) localStorage.setItem("muted", 'false');

function $(arg) {
    return document.querySelector(arg);
}

const HARD_MODE_INTERVAL = 5;

const GameMode = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
};

let game;
let easyGame = new TypeGame();
let mediumGame = new PokemonGame();
let hardGame = new PokemonGame(false, true, [1]);
let gameMode;

function toMenu() {
    $("#game-screen").classList.add("hidden");
    $("#menu").classList.remove("hidden");
    $("#back-button").classList.add("hidden");
    $("#streaks").classList.add("hidden");
}

function newGame(mode) {
    gameMode = mode;
    $("#menu").classList.add("hidden");
    $("#game-screen").classList.remove("hidden");
    $("#back-button").classList.remove("hidden");
    $("#streaks").classList.remove("hidden");

    switch (gameMode) {
        case GameMode.EASY:
            game = easyGame;
            $("#attacking-type-4").classList.add("hidden");
            $("#opponent-type-1").classList.add("hidden");
            $("#opponent-type-2").classList.add("hidden");
            $("#defending-title-text").textContent = "Opponent's Type";
            $("#medium-options").classList.add("hidden");
            break;
        case GameMode.MEDIUM:
            game = mediumGame;
            $("#attacking-type-4").classList.remove("hidden");
            $("#opponent-type-1").classList.remove("hidden");
            $("#opponent-type-2").classList.remove("hidden");
            $("#defending-title-text").textContent = "Opponent Pokémon";
            $("#medium-options").classList.remove("hidden");
            for (const button of $("#medium-options").children) {
                if (!button.classList.contains("region-button")) continue;
                if (localStorage.getItem(button.id + "-deselected") === 'true')
                    button.classList.add("deselected")
                else
                    button.classList.remove("deselected")
            }
            for (const checkbox of $("#medium-options").children) {
                if (!checkbox.classList.contains("checkbox")) continue;
                checkbox.selected = localStorage.getItem(checkbox.id + "-selected") === 'true';
            }
            break;
        case GameMode.HARD:
            game = hardGame;
            $("#attacking-type-4").classList.remove("hidden");
            $("#opponent-type-1").classList.add("hidden");
            $("#opponent-type-2").classList.add("hidden");
            $("#defending-title-text").textContent = "Opponent Pokémon";
            $("#medium-options").classList.add("hidden");
            break;
    }

    updateUI();
}

function updateUI() {
    $("#streak").textContent = game.streak;
    const highestStreakKey = gameMode + "-highest-streak";
    $("#highest-streak").textContent = localStorage.getItem(highestStreakKey);

    $("#opponent-name").textContent = game.getDefendingName();
    if (gameMode === GameMode.MEDIUM) {
        $("#opponent-type-1").src = game.defendingPokemon.types[0].getImagePath();
        if (game.defendingPokemon.types.length == 2) {
            $("#opponent-type-2").src = game.defendingPokemon.types[1].getImagePath();
            $("#opponent-type-2").classList.remove("hidden");
        }
        else {
            $("#opponent-type-2").classList.add("hidden");
        }
    }
    $("#opponent-image").src = game.getDefendingImagePath();

    $("#message").textContent = game.message();
    $("#message").classList.remove("correct");
    $("#message").classList.remove("incorrect");
    switch (game.state) {
        case GameState.CORRECT_GUESS:
            $("#message").classList.add("correct");
            break;
        case GameState.INCORRECT_GUESS:
            $("#message").classList.add("incorrect");
            break;
    }

    for (let i = 0; i < game.attackingTypes.length; i++) {
        $("#attacking-types").children[i].src = game.attackingTypes[i].getImagePath();
    }

    $("#next-button").disabled = game.state == GameState.HAS_NOT_MADE_GUESS;
}

function makeGuess(attackingTypeIndex) {
    if (game.state != GameState.HAS_NOT_MADE_GUESS) return;
    game.makeGuess(game.attackingTypes[attackingTypeIndex]);
    const highestStreakKey = gameMode + "-highest-streak";
    if (game.streak > localStorage.getItem(highestStreakKey)) {
        localStorage.setItem(highestStreakKey, game.streak);
    }

    updateUI();
}

function nextRound() {
    if (game.state == GameState.HAS_NOT_MADE_GUESS) return;

    switch (gameMode) {
        case GameMode.EASY:
            game.nextRound();
            break;
        case GameMode.MEDIUM:
            const regions = [];
            if (!$("#kanto-button").classList.contains("deselected")) regions.push(1);
            if (!$("#johto-button").classList.contains("deselected")) regions.push(2);
            if (!$("#hoenn-button").classList.contains("deselected")) regions.push(3);
            if (!$("#sinnoh-button").classList.contains("deselected")) regions.push(4);
            if (!$("#unova-button").classList.contains("deselected")) regions.push(5);
            if (!$("#kalos-button").classList.contains("deselected")) regions.push(6);
            if (!$("#alola-button").classList.contains("deselected")) regions.push(7);
            console.log(regions);
            game.nextRound($("#mega-checkbox").checked, $("#regional-checkbox").checked, regions);
            break;
        case GameMode.HARD:
			if (game.streak / HARD_MODE_INTERVAL + 1 > highestGeneration) {
				game.nextRound();
			}
			else {
				game.nextRound(false, true, [Math.floor(game.streak / HARD_MODE_INTERVAL) + 1]);
			}
			break;
    }
    
    updateUI();
}

$("#change-bg-button").addEventListener("click", () => cycleBackgroundGradient());

$("#easy-button").addEventListener("click", () => newGame(GameMode.EASY));
$("#medium-button").addEventListener("click", () => newGame(GameMode.MEDIUM));
$("#hard-button").addEventListener("click", () => newGame(GameMode.HARD));
for (const button of $("#play-buttons").children) {
    button.addEventListener("click", () => {
        const sound = new Audio("resources/audio/sfx/press_button.mp3");
        sound.play();
    });
}

$("#back-button").addEventListener("click", () => {
    toMenu();
    const sound = new Audio("resources/audio/sfx/press_button.mp3");
    sound.play();
});

for (let i = 0; i < $("#attacking-types").children.length; i++) {
    $("#attacking-types").children[i].addEventListener("click", () => makeGuess(i));
}

$("#next-button").addEventListener("click", () => nextRound());


for (const button of $("#medium-options").children) {
    if (!button.classList.contains("region-button")) continue;
    button.addEventListener("click", () => { 
        button.classList.toggle("deselected");
        if (allGenerationButtonsDeselected()) {
            button.classList.toggle("deselected");
        }
        localStorage.setItem(button.id + "-deselected", button.classList.contains("deselected"));
    });
}

for (const checkbox of $("#medium-options").children) {
    if (!checkbox.classList.contains("checkbox")) continue;
    checkbox.addEventListener("change", () => {
        localStorage.setItem(checkbox.id + "-selected", checkbox.checked);
    });
}

function allGenerationButtonsDeselected() {
    let selectedButtonFound = false;
    for (const button of $("#medium-options").children) {
        if (!button.classList.contains("region-button")) continue;
        if (!button.classList.contains("deselected")) {
            selectedButtonFound = true;
            break;
        }
    }
    return !selectedButtonFound;
}



const BackgroundGradient = {
    ORANGE: ["#e79c29", "#ffaa5B", "#fff2e8"],
    GREEN: ["#5ab529", "#67c236", "#e2fcd4"],
    RED: ["#ef3938", "#ff493b", "#ffdede"],
    BLUE: ["#2a94ce", "#54a8d6", "#d0e8f5"],
    PINK: ["#f2acc8", "#f5bfd4", "#f9f6f7"],
    LAVENDAR: ["#bb8fdb", "#c09adb", "#f0edf3"],
    GRAY: ["#808080", "#989898", "#f8f8f8"],
    BROWN: ["#856021", "#a88447", "#ede1cc"],
    CYAN: ["#01f7f7", "#4af0f0", "#e7f9f9"],
    GOLD: ["#f8c800", "#f2ce3d", "#f9f4e2"],
}
let backgroundGradientIndex = parseInt(localStorage.getItem("background-gradient-index"));
function cycleBackgroundGradient() {
    backgroundGradientIndex++;
    if (backgroundGradientIndex >= Object.values(BackgroundGradient).length)
        backgroundGradientIndex = 0;
    localStorage.setItem("background-gradient-index", backgroundGradientIndex)
    applyBackgroundGradient(Object.values(BackgroundGradient)[backgroundGradientIndex]);
}
function applyBackgroundGradient(backgroundGradient) {
    document.documentElement.style.setProperty("--color1", backgroundGradient[0]);
    document.documentElement.style.setProperty("--color2", backgroundGradient[1]);
    document.documentElement.style.setProperty("--color3", backgroundGradient[2]);
}
applyBackgroundGradient(Object.values(BackgroundGradient)[backgroundGradientIndex]);



const songs = [
    "b2w2_aspertia_city.mp3",
    "b2w2_battle_champion_iris.mp3",
    "b2w2_virbank_city.mp3",
    "bw_accumula_town.mp3",
    "bw_an_unwavering_heart.mp3",
    "bw_battle_elite_four.mp3",
    "bw_castelia_city.mp3",
    "bw_dragonspiral_tower.mp3",
    "bw_dreamyard.mp3",
    "bw_driftveil_city.mp3",
    "bw_gate.mp3",
    "bw_icirrus_city.mp3",
    "bw_nimbasa_city.mp3",
    "bw_skyarrow_bridge.mp3",
    "bw_undella_town_autumn_winter_spring.mp3",
    "bw_village_bridge.mp3",
    "dp_battle_champion.mp3",
    "dp_battle_uxie_mesprit_azelf.mp3",
    "dp_champion_cynthia.mp3",
    "dp_jubilife_city_day.mp3",
    "dp_lake.mp3",
    "dp_mt_coronet.mp3",
    "dp_route_201_day.mp3",
    "dp_route_209_day.mp3",
    "dp_route_216_day.mp3",
    "dp_wifi_connection.mp3",
    "frlg_celadon_city.mp3",
    "frlg_fuchsia_city.mp3",
    "frlg_lavendar_town.mp3",
    "frlg_pallet_town.mp3",
    "frlg_pokemon_center.mp3",
    "frlg_pokemon_gym.mp3",
    "frlg_route_1.mp3",
    "frlg_ss_anne.mp3",
    "frlg_viridian_forest.mp3",
    "frlg_welcome_to_the_world_of_pokemon.mp3",
    "gs_goldenrod_game_corner.mp3",
    "hgss_battle_champion.mp3",
    "hgss_battle_gym_leader.mp3",
    "hgss_bicycle.mp3",
    "hgss_ecruteak_city.mp3",
    "hgss_goldenrod_city.mp3",
    "hgss_battle_ho_oh.mp3",
    "hgss_national_park.mp3",
    "hgss_pokeathlon_venue.mp3",
    "hgss_poke_mart.mp3",
    "hgss_route_47.mp3",
    "rg_battle_final_battle_rival.mp3",
    "rg_battle_trainer.mp3",
    "rg_battle_wild_pokemon.mp3",
    "rg_opening.mp3",
    "rs_battle_trainer.mp3",
    "rs_battle_wild_pokemon.mp3",
    "rs_littleroot_town.mp3",
    "rs_may.mp3",
    "rs_opening.mp3",
    "rs_route_101.mp3",
    "rs_route_110.mp3",
    "rs_rustboro_city.mp3",
    "rs_slateport_city.mp3",
    "rs_surfing.mp3",
    "rs_verdanturf_town.mp3",
    "sm_gladions_theme.mp3",
    "sm_hauoli_city_night.mp3",
    "sm_my_home.mp3",
    "sm_poke_pelago_day.mp3",
    "sm_vast_poni_canyon.mp3",
    "xy_battle_champion.mp3",
    "xy_dendemille_town.mp3",
    "xy_friends_theme_reunited.mp3",
    "xy_hurry_along_2.mp3",
    "xy_kalos_power_plant.mp3",
    "xy_lumiose_city.mp3",
    "xy_professor_sycamores_theme.mp3",
    "xy_snowbelle_city.mp3",
];

let song = null;
let shuffleList = [];
	
function nextSong() {
    if (song != null) {
        song.pause();
    }
    if (shuffleList.length == 0)
        shuffleList = newShuffleList();
    const filename = shuffleList.splice(0, 1)[0];
    song = new Audio("resources/audio/music/" + filename);
    song.addEventListener("ended", () =>  nextSong());
    song.muted = localStorage.getItem("muted") === 'true';
    song.play();
}

function newShuffleList() {
    const arr = [];
    for (const song of songs)
        arr.push(song);
    let j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}

const documentClickListener = () => {
    nextSong()
    document.removeEventListener("click", documentClickListener);
}
document.addEventListener("click", documentClickListener);

$("#fast-forward-button").addEventListener("click", () => {nextSong()});
$("#mute-button").addEventListener("click", () => {
    localStorage.setItem("muted", localStorage.getItem("muted") !== 'true');
    if (localStorage.getItem("muted") === 'true') {
        $("#mute-button").src = "resources/img/misc/mute.png";
    }
    else {
        $("#mute-button").src = "resources/img/misc/unmute.png";
    }
    if (song != null)
        song.muted = localStorage.getItem("muted") === 'true';
});
if (localStorage.getItem("muted") === 'true') {
    $("#mute-button").src = "resources/img/misc/mute.png";
}
else {
    $("#mute-button").src = "resources/img/misc/unmute.png";
}



toMenu();
import { Type, types } from "./type.js";
import { DamageTier, Pokemon, get, getAll, highestGeneration, pokemon } from "./pokemon.js";

/**
 * Represents the possible states in which a Pokémon type game can be.
 * @author Alex Gill
 *
 */
const GameState = {
	HAS_NOT_MADE_GUESS : 0,
	CORRECT_GUESS: 1,
	INCORRECT_GUESS: 2
}



/**
 * Contains the flow and logic for a game in which the player guesses the
 * supereffective type against a defending type among a selection of types.
 * @author Alex Gill
 *
 */
class TypeGame {
	
	/**
	 * Starts a new game
	 */
	constructor() {
		
		this.numChoices = 3;
		this.attackingTypes = [];
		this.streak = 0;
		
		// User has not made guess yet
		this.guess = null;
		this.state = GameState.HAS_NOT_MADE_GUESS;
		
		// Generate initial types for the first round
		this.nextRound();
	}
	
	
	nextRound() {
		
		// Generate a defending type
		this.generateDefendingType();
		
		// Generate attacking types
		this.generateAttackingTypes();
		
		// User has not made guess yet
		this.guess = null;
		this.state = GameState.HAS_NOT_MADE_GUESS;
	}
	
	
	makeGuess(guess) {
		
		// Determine whether the user has guessed correctly
		let correct = false;
		if (this.defendingType.weaknesses.includes(guess.name)) {
			correct = true;
		}
		
		// User has made guess and update the game state
		this.guess = guess;
		if (correct)
			this.state = GameState.CORRECT_GUESS;
		else
			this.state = GameState.INCORRECT_GUESS;
		
		// Increment the streak if the guess was correct
		if (correct) {
			this.streak++;
		}
		// Otherwise, start over at 0
		else {
			this.streak = 0;
		}
		
		// Return whether the guess was correct
		return correct;
	}
	
	
	getDefendingName() {
		return this.defendingType.name;
	}
	
	
	getDefendingImagePath() {
		return this.defendingType.getImagePath();
	}
	
	
	/**
	 * Generates a new defending type.
	 */
	generateDefendingType() {
		// Randomly select the defending type
		this.defendingType = Object.values(types)[Math.floor(Math.random() * Object.values(types).length)];
	}
	
	
	/**
	 * Generates attacking types based on the current defending type. Picks one
	 * supereffective type and two non-supereffective types and randomizes the
	 * order of them.
	 */
	generateAttackingTypes() {
		
		// Create temporary list of attacking types in order to shuffle them
		let attackingTypesList = [];
		
		// Randomly select one weakness to be an attacking type
		const correctAnswer = this.defendingType.weaknesses[Math.floor(Math.random() * this.defendingType.weaknesses.length)];
		attackingTypesList.push(correctAnswer);
		
		// Randomly select the rest of the attacking types as non-weaknesses
		const incorrectAnswers = Object.keys(types);
		incorrectAnswers.splice(incorrectAnswers.indexOf(correctAnswer), 1);
		for (const weakness of this.defendingType.weaknesses)
			incorrectAnswers.splice(incorrectAnswers.indexOf(weakness), 1);
		for (let i = 1; i < this.numChoices; i++)
			attackingTypesList.push(incorrectAnswers.splice(Math.floor(Math.random() * incorrectAnswers.length), 1)[0]);
		
		// Shuffle the list so the weakness is not always first
		attackingTypesList = shuffle(attackingTypesList);
		
		// Set the values of the attacking types array
		for (let i = 0; i < this.numChoices; i++)
			this.attackingTypes[i] = types[attackingTypesList[i]];
	}
	
	
	message() {
		let str = "";
		
		// If the user has not made a guess yet, write a prompt.
		if (this.state === GameState.HAS_NOT_MADE_GUESS) {
			str += "Select the type that is supereffective against the opponent's Pokémon.";
		}
		
		// If the user guessed correctly, congratulate the user.
		else if (this.state === GameState.CORRECT_GUESS) {
			str += `Correct! ${this.defendingType.name} is weak to ${this.guess.name}.`;
			
			// Include other weaknesses.
			const otherWeaknesses = [];
			for (const weakness of this.defendingType.weaknesses) {
				otherWeaknesses.push(weakness);
			}
			otherWeaknesses.splice(otherWeaknesses.indexOf(this.guess), 1);
			if (otherWeaknesses.length > 0) {
				str += ` ${this.defendingType.name} is also weak to `;
				for (let i = 0; i < otherWeaknesses.length - 1; i++) {
					str += otherWeaknesses[i];
					if (otherWeaknesses.length > 2)
						str += ",";
					str += " ";
				}
				if (otherWeaknesses.length > 1)
					str += "and ";
				str += `${otherWeaknesses[otherWeaknesses.length - 1]}.`;
			}
		}
		
		// If the user did not guess correctly, correct the user.
		else if (this.state === GameState.INCORRECT_GUESS) {
			str += `Incorrect. ${this.defendingType.name} is weak to `;
			const weaknesses = this.defendingType.weaknesses;
			for (let i = 0; i < weaknesses.length - 1; i++) {
				str += weaknesses[i];
				if (weaknesses.length > 2)
					str += ",";
				str += " ";
			}
			if (weaknesses.length > 1)
				str += "and ";
			str += `${weaknesses[weaknesses.length - 1]}.`;
		}
		
		return str;
	}
}



/**
 * Contains the flow and logic for a game in which the player guesses the
 * supereffective type against a defending Pokémon among a selection of types.
 * @author Alex Gill
 *
 */
class PokemonGame {
	
	/**
	 * Starts a new game
	 */
	constructor(includeMega=undefined, includeRegional=undefined, generations=undefined) {
		
		this.numChoices = 4;
		this.attackingTypes = [];
		this.streak = 0;
		
		// User has not made guess yet
		this.guess = null;
		this.state = GameState.HAS_NOT_MADE_GUESS;
		
		// Generate initial types for the first round
		this.nextRound(includeMega, includeRegional, generations);
	}


	/**
	 * Moves to the next round
	 * @param includeMega Whether to include mega evolutions
	 * @param includeRegional Whether to include regional forms
	 * @param generations The generations to include
	 */
	nextRound(includeMega=undefined, includeRegional=undefined, generations=undefined) {

		if (includeMega == undefined || includeRegional == undefined || generations == undefined) {
		
			// Generate a defending type
			this.generateDefendingPokemon();
			
			// Generate attacking types
			this.generateAttackingTypes();
			
			// User has not made guess yet
			this.guess = null;
			this.state = GameState.HAS_NOT_MADE_GUESS;
		}
		else {
		
			// Generate a defending type
			this.generateDefendingPokemon(includeMega, includeRegional, generations);
			
			// Generate attacking types
			this.generateAttackingTypes();
			
			// User has not made guess yet
			this.guess = null;
			this.state = GameState.HAS_NOT_MADE_GUESS;
		}
	}
	
	
	getDefendingName() {
		return this.defendingPokemon.name;
	}
	
	
	getDefendingImagePath() {
		return this.defendingPokemon.imagePath;
	}
	
	
	makeGuess(guess) {
		
		// Determine whether the user has guessed correctly
		let correct = false;
		if (guess.name === this.answer.name)
			correct = true;
		
		// User has made guess and update the game state
		this.guess = guess;
		if (correct)
			this.state = GameState.CORRECT_GUESS;
		else
			this.state = GameState.INCORRECT_GUESS;
		
		// Increment the streak if the guess was correct
		if (correct) {
			this.streak++;
		}
		// Otherwise, start over at 0
		else {
			this.streak = 0;
		}
		
		// Return whether the guess was correct
		return correct;
	}
	
	
	/**
	 * Generates a new defending Pokémon with restrictions
	 * @param includeMega Whether to include mega evolutions
	 * @param includeRegional Whether to include regional forms
	 * @param generations Generations to include
	 */
	generateDefendingPokemon(includeMega=undefined, includeRegional=undefined, generations=undefined) {
		
		if (includeMega == undefined || includeRegional == undefined || generations == undefined) {
		
			// Randomly select the defending Pokémon
			const forms = allPokemon[Math.floor(Math.random() * Object.values(allPokemon).length)];
			
			this.defendingPokemon = forms[Math.floor(Math.random() * forms.length)];
		}
		else {
			const generationsList = [];
			for (const generation of generations) {
				generationsList.push(generation);
			}
			
			// Create temporary map of restricted map
			const curPokemon = {};
			
			// Add Pokemon with restrictions
			for (const pokemon of getAll()) {
				if ((pokemon.isMega && !includeMega) ||
						(pokemon.isRegional && !includeRegional) ||
						(!generationsList.includes(pokemon.generation))) {
					continue;
				}
				
				if (curPokemon[pokemon.number] == null) {
					curPokemon[pokemon.number] = [];
				}
				curPokemon[pokemon.number].push(pokemon);
			}
			
			// Convert the map to a list
			const curPokemonList = Object.values(curPokemon);
			
			// Randomly select the defending Pokémon
			const forms = curPokemonList[Math.floor(Math.random() * curPokemonList.length)];
			this.defendingPokemon = forms[Math.floor(Math.random() * forms.length)];
		}
	}
	
	
	/**
	 * Generates attacking types based on the current defending Pokémon.
	 */
	generateAttackingTypes() {
		
		// Create temporary list of attacking types
		const attackingTypesList = [];
		
		// Randomly select four types to start with
		const typeChoices = Object.values(types);
		for (let i = 0; i < this.numChoices; i++)
			attackingTypesList.push(typeChoices.splice(Math.floor(Math.random() * typeChoices.length), 1)[0]);
		
		// While multiple types do the most damage, take turns replacing each
		// until that is no longer the case
		while (this.multipleTypesInHighestTier(attackingTypesList)) {
			let index = this.randomHighestTierIndex(attackingTypesList);
			attackingTypesList[index] = typeChoices.splice(Math.floor(Math.random() * typeChoices.length), 1)[0];
		}
		
		// Set the correct answer to the highest damaging type
		this.answer = attackingTypesList[this.randomHighestTierIndex(attackingTypesList)];
		
		// Shuffle the list so the weakness is not always first
		shuffle(attackingTypesList);
		
		// Set the values of the attacking types array
		for (let i = 0; i < this.numChoices; i++)
			this.attackingTypes[i] = attackingTypesList[i];
	}
	
	
	/**
	 * Returns whether multiple types in a list do the most damage against the
	 * defending Pokémon.
	 * @param typeList The list of types
	 * @return Whether multiple types in the list do the most damage
	 */
	multipleTypesInHighestTier(typeList) {
		let highestTier = this.defendingPokemon.getDamageTier(typeList[0]);
		let multipleHighest = false;
		
		for (let i = 1; i < this.numChoices; i++) {
			if (this.defendingPokemon.getDamageTier(typeList[i]) == highestTier) {
				multipleHighest = true;
			}
			else if (this.defendingPokemon.getDamageTier(typeList[i]) > highestTier) {
				highestTier = this.defendingPokemon.getDamageTier(typeList[i]);
				multipleHighest = false;
			}
		}
		
		return multipleHighest;
	}
	
	
	/**
	 * Returns a random index among the indexes of the types sharing the highest
	 * damage tier.
	 * @return The index
	 */
	randomHighestTierIndex(typeList) {
		let highestTier = this.defendingPokemon.getDamageTier(typeList[0]);
		let highestTierIndexes = [];
		highestTierIndexes.push(0);
		
		for (let i = 1; i < this.numChoices; i++) {
			if (this.defendingPokemon.getDamageTier(typeList[i]) == highestTier) {
				highestTierIndexes.push(i);
			}
			else if (this.defendingPokemon.getDamageTier(typeList[i]) > highestTier) {
				highestTier = this.defendingPokemon.getDamageTier(typeList[i]);
				highestTierIndexes = [];
				highestTierIndexes.push(i);
			}
		}
		
		return highestTierIndexes[Math.floor(Math.random() * highestTierIndexes.length)];
	}
	
	
	message() {
		let str = "";
		let guessDamage = "";
		let answerDamage = "";
		
		// Get string values of damage multipliers of guess and answer
		if (this.guess != null && this.answer != null) {
			switch (this.defendingPokemon.getDamageTier(this.guess)) {
				case DamageTier.NO_DAMAGE:
					guessDamage = "0x";
					break;
					
				case DamageTier.QUARTER_DAMAGE:
					guessDamage = "¼x";
					break;
					
				case DamageTier.HALF_DAMAGE:
					guessDamage = "½x";
					break;
					
				case DamageTier.NORMAL_DAMAGE:
					guessDamage = "1x";
					break;
					
				case DamageTier.DOUBLE_DAMAGE:
					guessDamage = "2x";
					break;
					
				case DamageTier.QUADRUPLE_DAMAGE:
					guessDamage = "4x";
					break;
			};
			switch (this.defendingPokemon.getDamageTier(this.answer)) {
				case DamageTier.NO_DAMAGE:
					answerDamage = "0x";
					break;
					
				case DamageTier.QUARTER_DAMAGE:
					answerDamage = "¼x";
					break;
					
				case DamageTier.HALF_DAMAGE:
					answerDamage = "½x";
					break;
					
				case DamageTier.NORMAL_DAMAGE:
					answerDamage = "1x";
					break;
					
				case DamageTier.DOUBLE_DAMAGE:
					answerDamage = "2x";
					break;
					
				case DamageTier.QUADRUPLE_DAMAGE:
					answerDamage = "4x";
					break;
			};
		}
		
		// If the user has not made a guess yet, write a prompt.
		if (this.state === GameState.HAS_NOT_MADE_GUESS) {
			str += "Select the type that is the most effective against the opponent's Pokémon.";
		}
		
		// If the user guessed correctly, congratulate the user.
		else if (this.state === GameState.CORRECT_GUESS) {
			str += `Correct! Of the given types, ${this.answer.name} is the most effective, dealing ${answerDamage} damage to ${this.defendingPokemon.name}.`;
		}
		
		// If the user did not guess correctly, correct the user.
		else if (this.state === GameState.INCORRECT_GUESS) {
			str += "Incorrect. As ";
			switch (this.defendingPokemon.types[0].name.charAt(0).toUpperCase()) {
			case 'A':
			case 'E':
			case 'I':
			case 'O':
			case 'U':
				str += "an";
				break;
			default:
				str += "a";
			}
			str += " ";
			if (Object.values(this.defendingPokemon.types).length == 2) {
				str += `${this.defendingPokemon.types[0].name}/${this.defendingPokemon.types[1].name}`;
			}
			else {
				str += this.defendingPokemon.types[0].name;
			}
			str += " type, ";
			str += `${this.guess.name} deals ${guessDamage} damage to ${this.defendingPokemon.name}. The correct answer, ${this.answer.name}, deals ${answerDamage} damage.`;
		}
		
		return str
	}

}



/**
 * Shuffles array in place.
 * @param arr items An array containing the items.
 */
function shuffle(arr) {
    let j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}


		
// Instantiate a map of all Pokemon
const allPokemon = {};
for (const pokemon of getAll()) {
	if (allPokemon[pokemon.number] == null) {
		allPokemon[pokemon.number] = [];
	}
	allPokemon[pokemon.number].push(pokemon);
}


export { GameState, TypeGame, PokemonGame };
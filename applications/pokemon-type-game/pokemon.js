import { Type, types } from "./type.js";

const DamageTier = {
	NO_DAMAGE: 0,
	QUARTER_DAMAGE: 1,
	HALF_DAMAGE: 2,
	NORMAL_DAMAGE: 3,
	DOUBLE_DAMAGE: 4,
	QUADRUPLE_DAMAGE: 5
};

/**
 * Represents a Pokémon. Each Pokémon has a name, a National Pokédex number, and
 * one or two types.
 * @author Alex Gill
 *
 */
class Pokemon {
	
	/**
	 * This constructor instantiates a Pokémon by reading its information from
	 * a line of text
	 */
	constructor(line) {
		
		// Get a list of tokens
		const tokens = line.split(",");
		for (let i = 0; i < tokens.length; i++)
			tokens[i] = tokens[i].trim();
		
		// Parse the number
		this.number = parseInt(tokens[0]);
		
		// Parse the name
		this.name = tokens[4];
		
		// Parse the type(s).
		const numTypes = tokens[6] == "" ? 1 : 2;
		this.types = [];
		for (let i = 0; i < numTypes; i++) {
			this.types[i] = types[tokens[5 + i]];
		}
		
		// Parse the generation
		this.generation = parseInt(tokens[7]);
		
		// Get whether the Pokémon is a mega evolution
		this.isMega = !tokens[2] == undefined;
		
		// Get whether the Pokémon is a regional form
		this.isRegional = !tokens[3] == undefined;
		
		// Construct filename
		let filename =  String(this.number);
		filename = filename.padStart(3, '0');
		if (tokens[2] !== "") {
			filename += "-Mega";
		}
		if (tokens[3] !== "") {
			filename += "-Alola";
		}
		if (tokens[1] !== "") {
			filename += "-" + tokens[1];
		}
		filename += ".png";
		this.imagePath = "resources/img/pkmn/" + filename;
	}
	
	
	/**
	 * Returns a list of 4x weaknesses of the Pokémon.
	 * @return A list of 4x weaknesses
	 */
	get4xWeaknesses() {
		const quadWeaknesses = [];
		
		if (this.types.length == 1)
			return quadWeaknesses;
		
		for (const type of Object.keys(types)) {
			if (this.types[0].weaknesses.includes(type) &&
				this.types[1].weaknesses.includes(type)) {
				quadWeaknesses.push(type);
			}
		}
		return quadWeaknesses;
	}
	
	
	/**
	 * Returns a list of 2x weaknesses of the Pokémon.
	 * @return A list of 2x weaknesses
	 */
	get2xWeaknesses() {
		 const doubWeaknesses = [];
		
		if (this.types.length == 1)
			return this.types[0].weaknesses;
		
		for (const type of Object.keys(types)) {
			if (this.types[0].weaknesses.includes(type) &&
				this.types[1].getNormals().includes(type) ||
				this.types[0].getNormals().includes(type) &&
				this.types[1].weaknesses.includes(type)) {
				doubWeaknesses.push(type);
			}
		}
		return doubWeaknesses;
	}
	
	
	/**
	 * Returns a list of 1/2 resistances of the Pokémon.
	 * @return A list of 1/2 resistances
	 */
	get2xResistances() {
		const doubResistances = [];
		
		if (this.types.length == 1)
			return this.types[0].resistances;
		
		for (const type in Object.keys(Type)) {
			if (this.types[0].resistances.includes(type) &&
				this.types[1].getNormals().includes(type) ||
				this.types[0].getNormals().includes(type) &&
				this.types[1].resistances.includes(type)) {
				doubResistances.push(type);
			}
		}
		return doubResistances;
	}
	
	
	/**
	 * Returns a list of 1/4 resistances of the Pokémon.
	 * @return A list of 1/4 resistances
	 */
	get4xResistances() {
		const quadResistances = [];
		
		if (this.types.length == 1)
			return quadResistances;
		
		for (const type in Object.keys(Type)) {
			if (this.types[0].resistances.includes(type) &&
				this.types[1].resistances.includes(type)) {
				quadResistances.push(type);
			}
		}
		return quadResistances;
	}
	
	
	/**
	 * Returns a list of immunities of the Pokémon.
	 * @return A list of immunities
	 */
	getImmunities() {
		const immunities = [];
		for (const type in Object.keys(types)) {
			for (const immunity in type.immunities) {
				if (!immunities.includes(immunity))
					immunities.push(immunity);
			}
		}
		return immunities;
	}
	
	
	/**
	 * Returns the damage tier of the specified attacking type against this
	 * Pokémon.
	 * @param type The type
	 * @return The damage tier
	 */
	getDamageTier(type) {
		
		if (this.get4xWeaknesses().includes(type.name))
			return DamageTier.QUADRUPLE_DAMAGE;
		
		else if (this.get2xWeaknesses().includes(type.name))
			return DamageTier.DOUBLE_DAMAGE;
		
		else if (this.get2xResistances().includes(type.name))
			return DamageTier.HALF_DAMAGE;
		
		else if (this.get4xResistances().includes(type.name))
			return DamageTier.QUARTER_DAMAGE;
		
		else if (this.getImmunities().includes(type.name))
			return DamageTier.NO_DAMAGE;
		
		else
			return DamageTier.NORMAL_DAMAGE;
	}
}
	
	
/**
 * Returns the Pokémon at the given National Pokédex number. If there are
 * multiple forms, returns a random form.
 * @param number The National Pokédex number
 * @return The Pokémon
 */
function get(number) {
	const forms = pokemon[number];
	return forms[Math.floor(Math.random() * forms.length)];
}
	
	
/**
 * Returns a list of all Pokémon.
 * @return The Pokémon
 */
function getAll() {
	const pokemonList = [];
	for (const formsList of Object.values(pokemon)) {
		for (const form of formsList) {
			pokemonList.push(form);
		}
	}
	return pokemonList;
}
	
	
/**
 * 
 * @return The highest generation of a Pokemon
 */
function getHighestGeneration() {
	let highestGeneration = 0;
	for (const pokemon of getAll()) {
		if (pokemon.generation > highestGeneration) {
			highestGeneration = pokemon.generation;
		}
	}
	return highestGeneration;
}
	
	
/**
 * Reads a map of Pokémon objects from a string.
 * @param str A file in csv format converted to a string
 * @return The map of Pokémon
 */
function readPokemonList(str) {
	
	// Create a map with all the Pokemon in it.
	const pokemonMap = {};
	
	// Read each Pokemon from the file
	const lines = str.split('\n');
	
	for (let i = 1; i < lines.length; i++) {
		let line = lines[i];
		const newPokemon = new Pokemon(line);
		
		if (pokemonMap[newPokemon.number] == null) {
			pokemonMap[newPokemon.number] = [];
		}
		
		pokemonMap[newPokemon.number].push(newPokemon);
	}
	
	// Return the map
	return pokemonMap;
}

	
// --- Static variables ---
// All Pokémon. Each list contains all forms for a species
const pokemon = readPokemonList(`#,Image Filename Suffix,Mega Evolution,Regional Form,Name,Type 1,Type 2,Generation
	1,,,,Bulbasaur,Grass,Poison,1
	2,,,,Ivysaur,Grass,Poison,1
	3,,TRUE,,Mega Venusaur,Grass,Poison,1
	3,,,,Venusaur,Grass,Poison,1
	4,,,,Charmander,Fire,,1
	5,,,,Charmeleon,Fire,,1
	6,X,TRUE,,Mega Charizard X,Fire,Dragon,1
	6,Y,TRUE,,Mega Charizard Y,Fire,Flying,1
	6,,,,Charizard,Fire,Flying,1
	7,,,,Squirtle,Water,,1
	8,,,,Wartortle,Water,,1
	9,,TRUE,,Mega Blastoise,Water,,1
	9,,,,Blastoise,Water,,1
	10,,,,Caterpie,Bug,,1
	11,,,,Metapod,Bug,,1
	12,,,,Butterfree,Bug,Flying,1
	13,,,,Weedle,Bug,Poison,1
	14,,,,Kakuna,Bug,Poison,1
	15,,TRUE,,Mega Beedrill,Bug,Poison,1
	15,,,,Beedrill,Bug,Poison,1
	16,,,,Pidgey,Normal,Flying,1
	17,,,,Pidgeotto,Normal,Flying,1
	18,,TRUE,,Mega Pidgeot,Normal,Flying,1
	18,,,,Pidgeot,Normal,Flying,1
	19,,,,Rattata,Normal,,1
	19,,,TRUE,Rattata (Alolan Form),Dark,Normal,7
	20,,,,Raticate,Normal,Normal,1
	20,,,TRUE,Raticate (Alolan Form),Dark,Normal,7
	21,,,,Spearow,Normal,Flying,1
	22,,,,Fearow,Normal,Flying,1
	23,,,,Ekans,Poison,,1
	24,,,,Arbok,Poison,,1
	25,,,,Pikachu,Electric,,1
	26,,,,Raichu,Electric,,1
	26,,,TRUE,Raichu (Alolan Form),Electric,Psychic,7
	27,,,,Sandshrew,Ground,,1
	27,,,TRUE,Sandshrew (Alolan Form),Ice,Steel,7
	28,,,,Sandslash,Ground,,1
	28,,,TRUE,Sandslash (Alolan Form),Ice,Steel,7
	29,,,,Nidoran♀,Poison,,1
	30,,,,Nidorina,Poison,,1
	31,,,,Nidoqueen,Poison,Ground,1
	32,,,,Nidoran♂,Poison,,1
	33,,,,Nidorino,Poison,,1
	34,,,,Nidoking,Poison,Ground,1
	35,,,,Clefairy,Fairy,,1
	36,,,,Clefable,Fairy,,1
	37,,,,Vulpix,Fire,,1
	37,,,TRUE,Vulpix (Alolan Form),Ice,,7
	38,,,,Ninetales,Fire,,1
	38,,,TRUE,Ninetales (Alolan Form),Ice,Psychic,7
	39,,,,Jigglypuff,Normal,Fairy,1
	40,,,,Wigglytuff,Normal,Fairy,1
	41,,,,Zubat,Poison,Flying,1
	42,,,,Golbat,Poison,Flying,1
	43,,,,Oddish,Grass,Poison,1
	44,,,,Gloom,Grass,Poison,1
	45,,,,Vileplume,Grass,Poison,1
	46,,,,Paras,Bug,Grass,1
	47,,,,Parasect,Bug,Grass,1
	48,,,,Venonat,Bug,Poison,1
	49,,,,Venomoth,Bug,Poison,1
	50,,,,Diglett,Ground,,1
	50,,,TRUE,Diglett (Alolan Form),Ground,Steel,7
	51,,,,Dugtrio,Ground,,1
	51,,,TRUE,Dugtrio (Alolan Form),Ground,Steel,7
	52,,,,Meowth,Normal,,1
	52,,,TRUE,Meowth (Alolan Form),Dark,,7
	53,,,,Persian,Normal,,1
	53,,,TRUE,Persian (Alolan Form),Dark,,7
	54,,,,Psyduck,Water,,1
	55,,,,Golduck,Water,,1
	56,,,,Mankey,Fighting,,1
	57,,,,Primeape,Fighting,,1
	58,,,,Growlithe,Fire,,1
	59,,,,Arcanine,Fire,,1
	60,,,,Poliwag,Water,,1
	61,,,,Poliwhirl,Water,,1
	62,,,,Poliwrath,Water,Fighting,1
	63,,,,Abra,Psychic,,1
	64,,,,Kadabra,Psychic,,1
	65,,TRUE,,Mega Alakazam,Psychic,,1
	65,,,,Alakazam,Psychic,,1
	66,,,,Machop,Fighting,,1
	67,,,,Machoke,Fighting,,1
	68,,,,Machamp,Fighting,,1
	69,,,,Bellsprout,Grass,Poison,1
	70,,,,Weepinbell,Grass,Poison,1
	71,,,,Victreebel,Grass,Poison,1
	72,,,,Tentacool,Water,Poison,1
	73,,,,Tentacruel,Water,Poison,1
	74,,,,Geodude,Rock,Ground,1
	74,,,TRUE,Geodude (Alolan Form),Rock,Electric,7
	75,,,,Graveler,Rock,Ground,1
	75,,,TRUE,Graveler (Alolan Form),Rock,Electric,7
	76,,,,Golem,Rock,Ground,1
	76,,,TRUE,Golem (Alolan Form),Rock,Electric,7
	77,,,,Ponyta,Fire,,1
	78,,,,Rapidash,Fire,,1
	79,,,,Slowpoke,Water,Psychic,1
	80,,TRUE,,Mega Slowbro,Water,Psychic,1
	80,,,,Slowbro,Water,Psychic,1
	81,,,,Magnemite,Electric,Steel,1
	82,,,,Magneton,Electric,Steel,1
	83,,,,Farfetch'd,Normal,Flying,1
	84,,,,Doduo,Normal,Flying,1
	85,,,,Dodrio,Normal,Flying,1
	86,,,,Seel,Water,,1
	87,,,,Dewgong,Water,Ice,1
	88,,,,Grimer,Poison,,1
	88,,,TRUE,Grimer (Alolan Form),Poison,Dark,7
	89,,,,Muk,Poison,,1
	89,,,TRUE,Muk (Alolan Form),Poison,Dark,7
	90,,,,Shellder,Water,,1
	91,,,,Cloyster,Water,Ice,1
	92,,,,Gastly,Ghost,Poison,1
	93,,,,Haunter,Ghost,Poison,1
	94,,TRUE,,Mega Gengar,Ghost,Poison,1
	94,,,,Gengar,Ghost,Poison,1
	95,,,,Onix,Rock,Ground,1
	96,,,,Drowzee,Psychic,,1
	97,,,,Hypno,Psychic,,1
	98,,,,Krabby,Water,,1
	99,,,,Kingler,Water,,1
	100,,,,Voltorb,Electric,,1
	101,,,,Electrode,Electric,,1
	102,,,,Exeggcute,Grass,Psychic,1
	103,,,,Exeggutor,Grass,Psychic,1
	103,,,TRUE,Exeggutor (Alolan Form),Grass,Dragon,7
	104,,,,Cubone,Ground,,1
	105,,,,Marowak,Ground,,1
	105,,,TRUE,Marowak (Alolan Form),Fire,Ghost,7
	106,,,,Hitmonlee,Fighting,,1
	107,,,,Hitmonchan,Fighting,,1
	108,,,,Lickitung,Normal,,1
	109,,,,Koffing,Poison,,1
	110,,,,Weezing,Poison,,1
	111,,,,Rhyhorn,Ground,Rock,1
	112,,,,Rhydon,Ground,Rock,1
	113,,,,Chansey,Normal,,1
	114,,,,Tangela,Grass,,1
	115,,TRUE,,Mega Kangaskhan,Normal,,1
	115,,,,Kangaskhan,Normal,,1
	116,,,,Horsea,Water,,1
	117,,,,Seadra,Water,,1
	118,,,,Goldeen,Water,,1
	119,,,,Seaking,Water,,1
	120,,,,Staryu,Water,,1
	121,,,,Starmie,Water,Psychic,1
	122,,,,Mr. Mime,Psychic,Fairy,1
	123,,,,Scyther,Bug,Flying,1
	124,,,,Jynx,Ice,Psychic,1
	125,,,,Electabuzz,Electric,,1
	126,,,,Magmar,Fire,,1
	127,,TRUE,,Mega Pinsir,Bug,Flying,1
	127,,,,Pinsir,Bug,,1
	128,,,,Tauros,Normal,,1
	129,,,,Magikarp,Water,,1
	130,,TRUE,,Mega Gyarados,Water,Dark,1
	130,,,,Gyarados,Water,Flying,1
	131,,,,Lapras,Water,Ice,1
	132,,,,Ditto,Normal,,1
	133,,,,Eevee,Normal,,1
	134,,,,Vaporeon,Water,,1
	135,,,,Jolteon,Electric,,1
	136,,,,Flareon,Fire,,1
	137,,,,Porygon,Normal,,1
	138,,,,Omanyte,Rock,Water,1
	139,,,,Omastar,Rock,Water,1
	140,,,,Kabuto,Rock,Water,1
	141,,,,Kabutops,Rock,Water,1
	142,,TRUE,,Mega Aerodactyl,Rock,Flying,1
	142,,,,Aerodactyl,Rock,Flying,1
	143,,,,Snorlax,Normal,,1
	144,,,,Articuno,Ice,Flying,1
	145,,,,Zapdos,Electric,Flying,1
	146,,,,Moltres,Fire,Flying,1
	147,,,,Dratini,Dragon,,1
	148,,,,Dragonair,Dragon,,1
	149,,,,Dragonite,Dragon,Flying,1
	150,X,TRUE,,Mega Mewtwo X,Psychic,Fighting,1
	150,Y,TRUE,,Mega Mewtwo Y,Psychic,,1
	150,,,,Mewtwo,Psychic,,1
	151,,,,Mew,Psychic,,1
	152,,,,Chikorita,Grass,,2
	153,,,,Bayleef,Grass,,2
	154,,,,Meganium,Grass,,2
	155,,,,Cyndaquil,Fire,,2
	156,,,,Quilava,Fire,,2
	157,,,,Typhlosion,Fire,,2
	158,,,,Totodile,Water,,2
	159,,,,Croconaw,Water,,2
	160,,,,Feraligatr,Water,,2
	161,,,,Sentret,Normal,,2
	162,,,,Furret,Normal,,2
	163,,,,Hoothoot,Normal,Flying,2
	164,,,,Noctowl,Normal,Flying,2
	165,,,,Ledyba,Bug,Flying,2
	166,,,,Ledian,Bug,Flying,2
	167,,,,Spinarak,Bug,Poison,2
	168,,,,Ariados,Bug,Poison,2
	169,,,,Crobat,Poison,Flying,2
	170,,,,Chinchou,Water,Electric,2
	171,,,,Lanturn,Water,Electric,2
	172,,,,Pichu,Electric,,2
	173,,,,Cleffa,Fairy,,2
	174,,,,Igglybuff,Normal,Fairy,2
	175,,,,Togepi,Fairy,,2
	176,,,,Togetic,Fairy,Flying,2
	177,,,,Natu,Psychic,Flying,2
	178,,,,Xatu,Psychic,Flying,2
	179,,,,Mareep,Electric,,2
	180,,,,Flaaffy,Electric,,2
	181,,TRUE,,Mega Ampharos,Electric,Dragon,2
	181,,,,Ampharos,Electric,,2
	182,,,,Bellossom,Grass,,2
	183,,,,Marill,Water,Fairy,2
	184,,,,Azumarill,Water,Fairy,2
	185,,,,Sudowoodo,Rock,,2
	186,,,,Politoed,Water,,2
	187,,,,Hoppip,Grass,Flying,2
	188,,,,Skiploom,Grass,Flying,2
	189,,,,Jumpluff,Grass,Flying,2
	190,,,,Aipom,Normal,,2
	191,,,,Sunkern,Grass,,2
	192,,,,Sunflora,Grass,,2
	193,,,,Yanma,Bug,Flying,2
	194,,,,Wooper,Water,Ground,2
	195,,,,Quagsire,Water,Ground,2
	196,,,,Espeon,Psychic,,2
	197,,,,Umbreon,Dark,,2
	198,,,,Murkrow,Dark,Flying,2
	199,,,,Slowking,Water,Psychic,2
	200,,,,Misdreavus,Ghost,,2
	201,,,,Unown,Psychic,,2
	202,,,,Wobbuffet,Psychic,,2
	203,,,,Girafarig,Normal,Psychic,2
	204,,,,Pineco,Bug,,2
	205,,,,Forretress,Bug,Steel,2
	206,,,,Dunsparce,Normal,,2
	207,,,,Gligar,Ground,Flying,2
	208,,TRUE,,Mega Steelix,Steel,Ground,2
	208,,,,Steelix,Steel,Ground,2
	209,,,,Snubbull,Fairy,,2
	210,,,,Granbull,Fairy,,2
	211,,,,Qwilfish,Water,Poison,2
	212,,TRUE,,Mega Scizor,Bug,Steel,2
	212,,,,Scizor,Bug,Steel,2
	213,,,,Shuckle,Bug,Rock,2
	214,,TRUE,,Mega Heracross,Bug,Fighting,2
	214,,,,Heracross,Bug,Fighting,2
	215,,,,Sneasel,Dark,Ice,2
	216,,,,Teddiursa,Normal,,2
	217,,,,Ursaring,Normal,,2
	218,,,,Slugma,Fire,,2
	219,,,,Magcargo,Fire,Rock,2
	220,,,,Swinub,Ice,Ground,2
	221,,,,Piloswine,Ice,Ground,2
	222,,,,Corsola,Water,Rock,2
	223,,,,Remoraid,Water,,2
	224,,,,Octillery,Water,,2
	225,,,,Delibird,Ice,Flying,2
	226,,,,Mantine,Water,Flying,2
	227,,,,Skarmory,Steel,Flying,2
	228,,,,Houndour,Dark,Fire,2
	229,,TRUE,,Mega Houndoom,Dark,Fire,2
	229,,,,Houndoom,Dark,Fire,2
	230,,,,Kingdra,Water,Dragon,2
	231,,,,Phanpy,Ground,,2
	232,,,,Donphan,Ground,,2
	233,,,,Porygon2,Normal,,2
	234,,,,Stantler,Normal,,2
	235,,,,Smeargle,Normal,,2
	236,,,,Tyrogue,Fighting,,2
	237,,,,Hitmontop,Fighting,,2
	238,,,,Smoochum,Ice,Psychic,2
	239,,,,Elekid,Electric,,2
	240,,,,Magby,Fire,,2
	241,,,,Miltank,Normal,,2
	242,,,,Blissey,Normal,,2
	243,,,,Raikou,Electric,,2
	244,,,,Entei,Fire,,2
	245,,,,Suicune,Water,,2
	246,,,,Larvitar,Rock,Ground,2
	247,,,,Pupitar,Rock,Ground,2
	248,,TRUE,,Mega Tyranitar,Rock,Dark,2
	248,,,,Tyranitar,Rock,Dark,2
	249,,,,Lugia,Psychic,Flying,2
	250,,,,Ho-oh,Fire,Flying,2
	251,,,,Celebi,Psychic,Grass,2
	252,,,,Treecko,Grass,,3
	253,,,,Grovyle,Grass,,3
	254,,TRUE,,Mega Sceptile,Grass,Dragon,3
	254,,,,Sceptile,Grass,,3
	255,,,,Torchic,Fire,,3
	256,,,,Combusken,Fire,Fighting,3
	257,,TRUE,,Mega Blaziken,Fire,Fighting,3
	257,,,,Blaziken,Fire,Fighting,3
	258,,,,Mudkip,Water,,3
	259,,,,Marshtomp,Water,Ground,3
	260,,TRUE,,Mega Swampert,Water,Ground,3
	260,,,,Swampert,Water,Ground,3
	261,,,,Poochyena,Dark,,3
	262,,,,Mightyena,Dark,,3
	263,,,,Zigzagoon,Normal,,3
	264,,,,Linoone,Normal,,3
	265,,,,Wurmple,Bug,,3
	266,,,,Silcoon,Bug,,3
	267,,,,Beautifly,Bug,Flying,3
	268,,,,Cascoon,Bug,,3
	269,,,,Dustox,Bug,Poison,3
	270,,,,Lotad,Water,Grass,3
	271,,,,Lombre,Water,Grass,3
	272,,,,Ludicolo,Water,Grass,3
	273,,,,Seedot,Grass,,3
	274,,,,Nuzleaf,Grass,Dark,3
	275,,,,Shiftry,Grass,Dark,3
	276,,,,Taillow,Normal,Flying,3
	277,,,,Swellow,Normal,Flying,3
	278,,,,Wingull,Water,Flying,3
	279,,,,Pelipper,Water,Flying,3
	280,,,,Ralts,Psychic,Fairy,3
	281,,,,Kirlia,Psychic,Fairy,3
	282,,TRUE,,Mega Gardevoir,Psychic,Fairy,3
	282,,,,Gardevoir,Psychic,Fairy,3
	283,,,,Surskit,Bug,Water,3
	284,,,,Masquerain,Bug,Flying,3
	285,,,,Shroomish,Grass,,3
	286,,,,Breloom,Grass,Fighting,3
	287,,,,Slakoth,Normal,,3
	288,,,,Vigoroth,Normal,,3
	289,,,,Slaking,Normal,,3
	290,,,,Nincada,Bug,Ground,3
	291,,,,Ninjask,Bug,Flying,3
	292,,,,Shedinja,Bug,Ghost,3
	293,,,,Whismur,Normal,,3
	294,,,,Loudred,Normal,,3
	295,,,,Exploud,Normal,,3
	296,,,,Makuhita,Fighting,,3
	297,,,,Hariyama,Fighting,,3
	298,,,,Azurill,Normal,Fairy,3
	299,,,,Nosepass,Rock,,3
	300,,,,Skitty,Normal,,3
	301,,,,Delcatty,Normal,,3
	302,,TRUE,,Mega Sableye,Dark,Ghost,3
	302,,,,Sableye,Dark,Ghost,3
	303,,TRUE,,Mega Mawile,Steel,Fairy,3
	303,,,,Mawile,Steel,Fairy,3
	304,,,,Aron,Steel,Rock,3
	305,,,,Lairon,Steel,Rock,3
	306,,TRUE,,Mega Aggron,Steel,,3
	306,,,,Aggron,Steel,Rock,3
	307,,,,Meditite,Fighting,Psychic,3
	308,,TRUE,,Mega Medicham,Fighting,Psychic,3
	308,,,,Medicham,Fighting,Psychic,3
	309,,,,Electrike,Electric,,3
	310,,TRUE,,Mega Manectric,Electric,,3
	310,,,,Manectric,Electric,,3
	311,,,,Plusle,Electric,,3
	312,,,,Minun,Electric,,3
	313,,,,Volbeat,Bug,,3
	314,,,,Illumise,Bug,,3
	315,,,,Roselia,Grass,Poison,3
	316,,,,Gulpin,Poison,,3
	317,,,,Swalot,Poison,,3
	318,,,,Carvanha,Water,Dark,3
	319,,TRUE,,Mega Sharpedo,Water,Dark,3
	319,,,,Sharpedo,Water,Dark,3
	320,,,,Wailmer,Water,,3
	321,,,,Wailord,Water,,3
	322,,,,Numel,Fire,Ground,3
	323,,TRUE,,Mega Camerupt,Fire,Ground,3
	323,,,,Camerupt,Fire,Ground,3
	324,,,,Torkoal,Fire,,3
	325,,,,Spoink,Psychic,,3
	326,,,,Grumpig,Psychic,,3
	327,,,,Spinda,Normal,,3
	328,,,,Trapinch,Ground,,3
	329,,,,Vibrava,Ground,Dragon,3
	330,,,,Flygon,Ground,Dragon,3
	331,,,,Cacnea,Grass,,3
	332,,,,Cacturne,Grass,Dark,3
	333,,,,Swablu,Normal,Flying,3
	334,,TRUE,,Mega Altaria,Dragon,Fairy,3
	334,,,,Altaria,Dragon,Flying,3
	335,,,,Zangoose,Normal,,3
	336,,,,Seviper,Poison,,3
	337,,,,Lunatone,Rock,Psychic,3
	338,,,,Solrock,Rock,Psychic,3
	339,,,,Barboach,Water,Ground,3
	340,,,,Whiscash,Water,Ground,3
	341,,,,Corphish,Water,,3
	342,,,,Crawdaunt,Water,Dark,3
	343,,,,Baltoy,Ground,Psychic,3
	344,,,,Claydol,Ground,Psychic,3
	345,,,,Lileep,Rock,Grass,3
	346,,,,Cradily,Rock,Grass,3
	347,,,,Anorith,Rock,Bug,3
	348,,,,Armaldo,Rock,Bug,3
	349,,,,Feebas,Water,,3
	350,,,,Milotic,Water,,3
	351,,,,Castform,Normal,,3
	351,Sunny,,,Castform (Sunny Form),Fire,,3
	351,Rainy,,,Castform (Rainy Form),Water,,3
	351,Snowy,,,Castform (Snowy Form),Ice,,3
	352,,,,Kecleon,Normal,,3
	353,,,,Shuppet,Ghost,,3
	354,,TRUE,,Mega Banette,Ghost,,3
	354,,,,Banette,Ghost,,3
	355,,,,Duskull,Ghost,,3
	356,,,,Dusclops,Ghost,,3
	357,,,,Tropius,Grass,Flying,3
	358,,,,Chimecho,Psychic,,3
	359,,TRUE,,Mega Absol,Dark,,3
	359,,,,Absol,Dark,,3
	360,,,,Wynaut,Psychic,,3
	361,,,,Snorunt,Ice,,3
	362,,TRUE,,Mega Glalie,Ice,,3
	362,,,,Glalie,Ice,,3
	363,,,,Spheal,Ice,Water,3
	364,,,,Sealeo,Ice,Water,3
	365,,,,Walrein,Ice,Water,3
	366,,,,Clamperl,Water,,3
	367,,,,Huntail,Water,,3
	368,,,,Gorebyss,Water,,3
	369,,,,Relicanth,Water,Rock,3
	370,,,,Luvdisc,Water,,3
	371,,,,Bagon,Dragon,,3
	372,,,,Shelgon,Dragon,,3
	373,,TRUE,,Mega Salamence,Dragon,Flying,3
	373,,,,Salamence,Dragon,Flying,3
	374,,,,Beldum,Steel,Psychic,3
	375,,,,Metang,Steel,Psychic,3
	376,,TRUE,,Mega Metagross,Steel,Psychic,3
	376,,,,Metagross,Steel,Psychic,3
	377,,,,Regirock,Rock,,3
	378,,,,Regice,Ice,,3
	379,,,,Registeel,Steel,,3
	380,,TRUE,,Mega Latias,Dragon,Psychic,3
	380,,,,Latias,Dragon,Psychic,3
	381,,TRUE,,Mega Latios,Dragon,Psychic,3
	381,,,,Latios,Dragon,Psychic,3
	382,,,,Kyogre,Water,,3
	382,,TRUE,,Primal Kyogre,Water,,3
	383,,,,Groudon,Ground,,3
	383,,TRUE,,Primal Groudon,Ground,Fire,3
	384,,TRUE,,Mega Rayquaza,Dragon,Flying,3
	384,,,,Rayquaza,Dragon,Flying,3
	385,,,,Jirachi,Steel,Psychic,3
	386,Normal,,,Deoxys (Normal Forme),Psychic,,3
	386,Attack,,,Deoxys (Attack Forme),Psychic,,3
	386,Defense,,,Deoxys (Defense Forme),Psychic,,3
	386,Speed,,,Deoxys (Speed Forme),Psychic,,3
	387,,,,Turtwig,Grass,,4
	388,,,,Grotle,Grass,,4
	389,,,,Torterra,Grass,Ground,4
	390,,,,Chimchar,Fire,,4
	391,,,,Monferno,Fire,Fighting,4
	392,,,,Infernape,Fire,Fighting,4
	393,,,,Piplup,Water,,4
	394,,,,Prinplup,Water,,4
	395,,,,Empoleon,Water,Steel,4
	396,,,,Starly,Normal,Flying,4
	397,,,,Staravia,Normal,Flying,4
	398,,,,Staraptor,Normal,Flying,4
	399,,,,Bidoof,Normal,,4
	400,,,,Bibarel,Normal,Water,4
	401,,,,Kricketot,Bug,,4
	402,,,,Kricketune,Bug,,4
	403,,,,Shinx,Electric,,4
	404,,,,Luxio,Electric,,4
	405,,,,Luxray,Electric,,4
	406,,,,Budew,Grass,Poison,4
	407,,,,Roserade,Grass,Poison,4
	408,,,,Cranidos,Rock,,4
	409,,,,Rampardos,Rock,,4
	410,,,,Shieldon,Rock,Steel,4
	411,,,,Bastiodon,Rock,Steel,4
	412,Plant,,,Burmy (Plant Cloak),Bug,Grass,4
	412,Sandy,,,Burmy (Sandy Cloak),Bug,Ground,4
	412,Trash,,,Burmy (Trash Cloak),Bug,Steel,4
	413,Plant,,,Wormadam (Plant Cloak),Bug,Grass,4
	413,Sandy,,,Wormadam (Sandy Cloak),Bug,Ground,4
	413,Trash,,,Wormadam (Trash Cloak),Bug,Steel,4
	414,,,,Mothim,Bug,Flying,4
	415,,,,Combee,Bug,Flying,4
	416,,,,Vespiquen,Bug,Flying,4
	417,,,,Pachirisu,Electric,,4
	418,,,,Buizel,Water,,4
	419,,,,Floatzel,Water,,4
	420,,,,Cherubi,Grass,,4
	421,Overcast,,,Cherrim (Overcast Form),Grass,,4
	421,Sunshine,,,Cherrim (Sunshine Form),Grass,,4
	422,West,,,Shellos (West Sea),Water,,4
	422,East,,,Shellos (East Sea),Water,,4
	423,West,,,Gastrodon (West Sea),Water,Ground,4
	423,East,,,Gastrodon (East Sea),Water,Ground,4
	424,,,,Ambipom,Normal,,4
	425,,,,Drifloon,Ghost,Flying,4
	426,,,,Drifblim,Ghost,Flying,4
	427,,,,Buneary,Normal,,4
	428,,TRUE,,Mega Lopunny,Normal,Fighting,4
	428,,,,Lopunny,Normal,,4
	429,,,,Mismagius,Ghost,,4
	430,,,,Honchkrow,Dark,Flying,4
	431,,,,Glameow,Normal,,4
	432,,,,Purugly,Normal,,4
	433,,,,Chingling,Psychic,,4
	434,,,,Stunky,Poison,Dark,4
	435,,,,Skuntank,Poison,Dark,4
	436,,,,Bronzor,Steel,Psychic,4
	437,,,,Bronzong,Steel,Psychic,4
	438,,,,Bonsly,Rock,,4
	439,,,,Mime Jr.,Psychic,Fairy,4
	440,,,,Happiny,Normal,,4
	441,,,,Chatot,Normal,Flying,4
	442,,,,Spiritomb,Ghost,Dark,4
	443,,,,Gible,Dragon,Ground,4
	444,,,,Gabite,Dragon,Ground,4
	445,,TRUE,,Mega Garchomp,Dragon,Ground,4
	445,,,,Garchomp,Dragon,Ground,4
	446,,,,Munchlax,Normal,,4
	447,,,,Riolu,Fighting,,4
	448,,TRUE,,Mega Lucario,Fighting,Steel,4
	448,,,,Lucario,Fighting,Steel,4
	449,,,,Hippopotas,Ground,,4
	450,,,,Hippowdon,Ground,,4
	451,,,,Skorupi,Poison,Bug,4
	452,,,,Drapion,Poison,Dark,4
	453,,,,Croagunk,Poison,Fighting,4
	454,,,,Toxicroak,Poison,Fighting,4
	455,,,,Carnivine,Grass,,4
	456,,,,Finneon,Water,,4
	457,,,,Lumineon,Water,,4
	458,,,,Mantyke,Water,Flying,4
	459,,,,Snover,Grass,Ice,4
	460,,TRUE,,Mega Abomasnow,Grass,Ice,4
	460,,,,Abomasnow,Grass,Ice,4
	461,,,,Weavile,Dark,Ice,4
	462,,,,Magnezone,Electric,Steel,4
	463,,,,Lickilicky,Normal,,4
	464,,,,Rhyperior,Ground,Rock,4
	465,,,,Tangrowth,Grass,,4
	466,,,,Electivire,Electric,,4
	467,,,,Magmortar,Fire,,4
	468,,,,Togekiss,Fairy,Flying,4
	469,,,,Yanmega,Bug,Flying,4
	470,,,,Leafeon,Grass,,4
	471,,,,Glaceon,Ice,,4
	472,,,,Gliscor,Ground,Flying,4
	473,,,,Mamoswine,Ice,Ground,4
	474,,,,Porygon-Z,Normal,,4
	475,,TRUE,,Mega Gallade,Psychic,Fighting,4
	475,,,,Gallade,Psychic,Fighting,4
	476,,,,Probopass,Rock,Steel,4
	477,,,,Dusknoir,Ghost,,4
	478,,,,Froslass,Ice,Ghost,4
	479,,,,Rotom,Electric,Ghost,4
	479,Heat,,,Heat Rotom,Electric,Fire,4
	479,Wash,,,Wash Rotom,Electric,Water,4
	479,Frost,,,Frost Rotom,Electric,Ice,4
	479,Fan,,,Fan Rotom,Electric,Flying,4
	479,Mow,,,Mow Rotom,Electric,Grass,4
	480,,,,Uxie,Psychic,,4
	481,,,,Mesprit,Psychic,,4
	482,,,,Azelf,Psychic,,4
	483,,,,Dialga,Steel,Dragon,4
	484,,,,Palkia,Water,Dragon,4
	485,,,,Heatran,Fire,Steel,4
	486,,,,Regigigas,Normal,,4
	487,Altered,,,Giratina (Altered Forme),Ghost,Dragon,4
	487,Origin,,,Giratina (Origin Forme),Ghost,Dragon,4
	488,,,,Cresselia,Psychic,,4
	489,,,,Phione,Water,,4
	490,,,,Manaphy,Water,,4
	491,,,,Darkrai,Dark,,4
	492,Land,,,Shaymin (Land Forme),Grass,,4
	492,Sky,,,Shaymin (Sky Forme),Grass,Flying,4
	493,,,,Arceus,Normal,,4
	494,,,,Victini,Psychic,Fire,5
	495,,,,Snivy,Grass,,5
	496,,,,Servine,Grass,,5
	497,,,,Serperior,Grass,,5
	498,,,,Tepig,Fire,,5
	499,,,,Pignite,Fire,Fighting,5
	500,,,,Emboar,Fire,Fighting,5
	501,,,,Oshawott,Water,,5
	502,,,,Dewott,Water,,5
	503,,,,Samurott,Water,,5
	504,,,,Patrat,Normal,,5
	505,,,,Watchog,Normal,,5
	506,,,,Lillipup,Normal,,5
	507,,,,Herdier,Normal,,5
	508,,,,Stoutland,Normal,,5
	509,,,,Purrloin,Dark,,5
	510,,,,Liepard,Dark,,5
	511,,,,Pansage,Grass,,5
	512,,,,Simisage,Grass,,5
	513,,,,Pansear,Fire,,5
	514,,,,Simisear,Fire,,5
	515,,,,Panpour,Water,,5
	516,,,,Simipour,Water,,5
	517,,,,Munna,Psychic,,5
	518,,,,Musharna,Psychic,,5
	519,,,,Pidove,Normal,Flying,5
	520,,,,Tranquill,Normal,Flying,5
	521,Male,,,Unfezant,Normal,Flying,5
	521,Female,,,Unfezant,Normal,Flying,5
	522,,,,Blitzle,Electric,,5
	523,,,,Zebstrika,Electric,,5
	524,,,,Roggenrola,Rock,,5
	525,,,,Boldore,Rock,,5
	526,,,,Gigalith,Rock,,5
	527,,,,Woobat,Psychic,Flying,5
	528,,,,Swoobat,Psychic,Flying,5
	529,,,,Drilbur,Ground,,5
	530,,,,Excadrill,Ground,Steel,5
	531,,TRUE,,Mega Audino,Normal,Fairy,5
	531,,,,Audino,Normal,,5
	532,,,,Timburr,Fighting,,5
	533,,,,Gurdurr,Fighting,,5
	534,,,,Conkeldurr,Fighting,,5
	535,,,,Tympole,Water,,5
	536,,,,Palpitoad,Water,Ground,5
	537,,,,Seismitoad,Water,Ground,5
	538,,,,Throh,Fighting,,5
	539,,,,Sawk,Fighting,,5
	540,,,,Sewaddle,Bug,Grass,5
	541,,,,Swadloon,Bug,Grass,5
	542,,,,Leavanny,Bug,Grass,5
	543,,,,Venipede,Bug,Poison,5
	544,,,,Whirlipede,Bug,Poison,5
	545,,,,Scolipede,Bug,Poison,5
	546,,,,Cottonee,Grass,Fairy,5
	547,,,,Whimsicott,Grass,Fairy,5
	548,,,,Petilil,Grass,,5
	549,,,,Lilligant,Grass,,5
	550,Red-Striped,,,Basculin (Red-Striped Form),Water,,5
	550,Blue-Striped,,,Basculin (Blue-Striped Form),Water,,5
	551,,,,Sandile,Ground,Dark,5
	552,,,,Krokorok,Ground,Dark,5
	553,,,,Krookodile,Ground,Dark,5
	554,,,,Darumaka,Fire,,5
	555,Standard,,,Darmanitan (Standard Mode),Fire,,5
	555,Zen,,,Darmanitan (Zen Mode),Fire,Psychic,5
	556,,,,Maractus,Grass,,5
	557,,,,Dwebble,Bug,Rock,5
	558,,,,Crustle,Bug,Rock,5
	559,,,,Scraggy,Dark,Fighting,5
	560,,,,Scrafty,Dark,Fighting,5
	561,,,,Sigilyph,Psychic,Flying,5
	562,,,,Yamask,Ghost,,5
	563,,,,Cofagrigus,Ghost,,5
	564,,,,Tirtouga,Water,Rock,5
	565,,,,Carracosta,Water,Rock,5
	566,,,,Archen,Rock,Flying,5
	567,,,,Archeops,Rock,Flying,5
	568,,,,Trubbish,Poison,,5
	569,,,,Garbodor,Poison,,5
	570,,,,Zorua,Dark,,5
	571,,,,Zoroark,Dark,,5
	572,,,,Minccino,Normal,,5
	573,,,,Cinccino,Normal,,5
	574,,,,Gothita,Psychic,,5
	575,,,,Gothorita,Psychic,,5
	576,,,,Gothitelle,Psychic,,5
	577,,,,Solosis,Psychic,,5
	578,,,,Duosion,Psychic,,5
	579,,,,Reuniclus,Psychic,,5
	580,,,,Ducklett,Water,Flying,5
	581,,,,Swanna,Water,Flying,5
	582,,,,Vanillite,Ice,,5
	583,,,,Vanillish,Ice,,5
	584,,,,Vanilluxe,Ice,,5
	585,Spring,,,Deerling (Spring Form),Normal,Grass,5
	585,Summer,,,Deerling (Summer Form),Normal,Grass,5
	585,Autumn,,,Deerling (Autumn Form),Normal,Grass,5
	585,Winter,,,Deerling (Winter Form),Normal,Grass,5
	586,Spring,,,Sawsbuck (Spring Form),Normal,Grass,5
	586,Summer,,,Sawsbuck (Summer Form),Normal,Grass,5
	586,Autumn,,,Sawsbuck (Autumn Form),Normal,Grass,5
	586,Winter,,,Sawsbuck (Winter Form),Normal,Grass,5
	587,,,,Emolga,Electric,Flying,5
	588,,,,Karrablast,Bug,,5
	589,,,,Escavalier,Bug,Steel,5
	590,,,,Foongus,Grass,Poison,5
	591,,,,Amoonguss,Grass,Poison,5
	592,Male,,,Frillish,Water,Ghost,5
	592,Female,,,Frillish,Water,Ghost,5
	593,Male,,,Jellicent,Water,Ghost,5
	593,Female,,,Jellicent,Water,Ghost,5
	594,,,,Alomomola,Water,,5
	595,,,,Joltik,Bug,Electric,5
	596,,,,Galvantula,Bug,Electric,5
	597,,,,Ferroseed,Grass,Steel,5
	598,,,,Ferrothorn,Grass,Steel,5
	599,,,,Klink,Steel,,5
	600,,,,Klang,Steel,,5
	601,,,,Klinklang,Steel,,5
	602,,,,Tynamo,Electric,,5
	603,,,,Eelektrik,Electric,,5
	604,,,,Eelektross,Electric,,5
	605,,,,Elgyem,Psychic,,5
	606,,,,Beheeyem,Psychic,,5
	607,,,,Litwick,Ghost,Fire,5
	608,,,,Lampent,Ghost,Fire,5
	609,,,,Chandelure,Ghost,Fire,5
	610,,,,Axew,Dragon,,5
	611,,,,Fraxure,Dragon,,5
	612,,,,Haxorus,Dragon,,5
	613,,,,Cubchoo,Ice,,5
	614,,,,Beartic,Ice,,5
	615,,,,Cryogonal,Ice,,5
	616,,,,Shelmet,Bug,,5
	617,,,,Accelgor,Bug,,5
	618,,,,Stunfisk,Ground,Electric,5
	619,,,,Mienfoo,Fighting,,5
	620,,,,Mienshao,Fighting,,5
	621,,,,Druddigon,Dragon,,5
	622,,,,Golett,Ground,Ghost,5
	623,,,,Golurk,Ground,Ghost,5
	624,,,,Pawniard,Dark,Steel,5
	625,,,,Bisharp,Dark,Steel,5
	626,,,,Bouffalant,Normal,,5
	627,,,,Rufflet,Normal,Flying,5
	628,,,,Braviary,Normal,Flying,5
	629,,,,Vullaby,Dark,Flying,5
	630,,,,Mandibuzz,Dark,Flying,5
	631,,,,Heatmor,Fire,,5
	632,,,,Durant,Bug,Steel,5
	633,,,,Deino,Dark,Dragon,5
	634,,,,Zweilous,Dark,Dragon,5
	635,,,,Hydreigon,Dark,Dragon,5
	636,,,,Larvesta,Bug,Fire,5
	637,,,,Volcarona,Bug,Fire,5
	638,,,,Cobalion,Steel,Fighting,5
	639,,,,Terrakion,Rock,Fighting,5
	640,,,,Virizion,Grass,Fighting,5
	641,Incarnate,,,Tornadus (Incarnate Forme),Flying,,5
	641,Therian,,,Tornadus (Therian Forme),Flying,,5
	642,Incarnate,,,Thundurus (Incarnate Forme),Electric,Flying,5
	642,Therian,,,Thundurus (Therian Forme),Electric,Flying,5
	643,,,,Reshiram,Dragon,Fire,5
	644,,,,Zekrom,Dragon,Electric,5
	645,Incarnate,,,Landorus (Incarnate Forme),Ground,Flying,5
	645,Therian,,,Landorus (Therian Forme),Ground,Flying,5
	646,,,,Kyurem,Dragon,Ice,5
	646,Black,,,Black Kyurem,Dragon,Ice,5
	646,White,,,White Kyurem,Dragon,Ice,5
	647,Ordinary,,,Keldeo (Ordinary Forme),Water,Fighting,5
	647,Resolute,,,Keldeo (Resolute Forme),Water,Fighting,5
	648,Aria,,,Meloetta (Aria Forme),Normal,Psychic,5
	648,Pirouette,,,Meloetta (Pirouette Forme),Normal,Fighting,5
	649,,,,Genesect,Bug,Steel,5
	650,,,,Chespin,Grass,,6
	651,,,,Quilladin,Grass,,6
	652,,,,Chesnaught,Grass,Fighting,6
	653,,,,Fennekin,Fire,,6
	654,,,,Braixen,Fire,,6
	655,,,,Delphox,Fire,Psychic,6
	656,,,,Froakie,Water,,6
	657,,,,Frogadier,Water,,6
	658,,,,Greninja,Water,Dark,6
	659,,,,Bunnelby,Normal,,6
	660,,,,Diggersby,Normal,Ground,6
	661,,,,Fletchling,Normal,Flying,6
	662,,,,Fletchinder,Fire,Flying,6
	663,,,,Talonflame,Fire,Flying,6
	664,,,,Scatterbug,Bug,,6
	665,,,,Spewpa,Bug,,6
	666,,,,Vivillon,Bug,Flying,6
	667,,,,Litleo,Fire,Normal,6
	668,Male,,,Pyroar,Fire,Normal,6
	668,Female,,,Pyroar,Fire,Normal,6
	669,,,,Flabébé,Fairy,,6
	670,,,,Floette,Fairy,,6
	671,,,,Florges,Fairy,,6
	672,,,,Skiddo,Grass,,6
	673,,,,Gogoat,Grass,,6
	674,,,,Pancham,Fighting,,6
	675,,,,Pangoro,Fighting,Dark,6
	676,,,,Furfrou,Normal,,6
	676,Heart,,,Furfrou,Normal,,6
	676,Star,,,Furfrou,Normal,,6
	676,Diamond,,,Furfrou,Normal,,6
	677,,,,Espurr,Psychic,,6
	678,Male,,,Meowstic,Psychic,,6
	678,Female,,,Meowstic,Psychic,,6
	679,,,,Honedge,Steel,Ghost,6
	680,,,,Doublade,Steel,Ghost,6
	681,Blade,,,Aegislash (Blade Forme),Steel,Ghost,6
	681,Shield,,,Aegislash (Shield Forme),Steel,Ghost,6
	682,,,,Spritzee,Fairy,,6
	683,,,,Aromatisse,Fairy,,6
	684,,,,Swirlix,Fairy,,6
	685,,,,Slurpuff,Fairy,,6
	686,,,,Inkay,Dark,Psychic,6
	687,,,,Malamar,Dark,Psychic,6
	688,,,,Binacle,Rock,Water,6
	689,,,,Barbaracle,Rock,Water,6
	690,,,,Skrelp,Poison,Water,6
	691,,,,Dragalge,Poison,Dragon,6
	692,,,,Clauncher,Water,,6
	693,,,,Clawitzer,Water,,6
	694,,,,Helioptile,Electric,Normal,6
	695,,,,Heliolisk,Electric,Normal,6
	696,,,,Tyrunt,Rock,Dragon,6
	697,,,,Tyrantrum,Rock,Dragon,6
	698,,,,Amaura,Rock,Ice,6
	699,,,,Aurorus,Rock,Ice,6
	700,,,,Sylveon,Fairy,,6
	701,,,,Hawlucha,Fighting,Flying,6
	702,,,,Dedenne,Electric,Fairy,6
	703,,,,Carbink,Rock,Fairy,6
	704,,,,Goomy,Dragon,,6
	705,,,,Sliggoo,Dragon,,6
	706,,,,Goodra,Dragon,,6
	707,,,,Klefki,Steel,Fairy,6
	708,,,,Phantump,Ghost,Grass,6
	709,,,,Trevenant,Ghost,Grass,6
	710,Average,,,Pumpkaboo,Ghost,Grass,6
	710,Small,,,Pumpkaboo,Ghost,Grass,6
	710,Large,,,Pumpkaboo,Ghost,Grass,6
	710,Super,,,Pumpkaboo,Ghost,Grass,6
	711,Average,,,Gourgeist,Ghost,Grass,6
	711,Small,,,Gourgeist,Ghost,Grass,6
	711,Super,,,Gourgeist,Ghost,Grass,6
	711,Large,,,Gourgeist,Ghost,Grass,6
	712,,,,Bergmite,Ice,,6
	713,,,,Avalugg,Ice,,6
	714,,,,Noibat,Flying,Dragon,6
	715,,,,Noivern,Flying,Dragon,6
	716,,,,Xerneas,Fairy,,6
	717,,,,Yveltal,Dark,Flying,6
	718,10,,,Zygarde (10% Forme),Dragon,Ground,6
	718,50,,,Zygarde (50% Forme),Dragon,Ground,6
	718,Complete,,,Zygarde (Complete Forme),Dragon,Ground,6
	719,,TRUE,,Mega Diancie,Rock,Fairy,6
	719,,,,Diancie,Rock,Fairy,6
	720,Confined,,,Hoopa (Confined),Psychic,Ghost,6
	720,Unbound,,,Hoopa (Unbound),Psychic,Dark,6
	721,,,,Volcanion,Fire,Water,6
	722,,,,Rowlet,Grass,Flying,7
	723,,,,Dartrix,Grass,Flying,7
	724,,,,Decidueye,Grass,Ghost,7
	725,,,,Litten,Fire,,7
	726,,,,Torracat,Fire,,7
	727,,,,Incineroar,Fire,Dark,7
	728,,,,Popplio,Water,,7
	729,,,,Brionne,Water,,7
	730,,,,Primarina,Water,Fairy,7
	731,,,,Pikipek,Normal,Flying,7
	732,,,,Trumbeak,Normal,Flying,7
	733,,,,Toucannon,Normal,Flying,7
	734,,,,Yungoos,Normal,,7
	735,,,,Gumshoos,Normal,,7
	736,,,,Grubbin,Bug,,7
	737,,,,Charjabug,Bug,Electric,7
	738,,,,Vikavolt,Bug,Electric,7
	739,,,,Crabrawler,Fighting,,7
	740,,,,Crabominable,Fighting,Ice,7
	741,Pom-Pom,,,Oricorio (Pom-Pom Style),Electric,Flying,7
	741,Baile,,,Oricorio (Baile Style),Fire,Flying,7
	741,Pau,,,Oricorio (P'au Style),Psychic,Flying,7
	741,Sensu,,,Oricorio (Sensu Style),Ghost,Flying,7
	742,,,,Cutiefly,Bug,Fairy,7
	743,,,,Ribombee,Bug,Fairy,7
	744,,,,Rockruff,Rock,,7
	745,Midday,,,Lycanroc (Midday Form),Rock,,7
	745,Midnight,,,Lycanroc (Midnight Form),Rock,,7
	746,Solo,,,Wishiwashi (Solo Form),Water,,7
	746,School,,,Wishiwashi (School Form),Water,,7
	747,,,,Mareanie,Water,Poison,7
	748,,,,Toxapex,Water,Poison,7
	749,,,,Mudbray,Ground,,7
	750,,,,Mudsdale,Ground,,7
	751,,,,Dewpider,Water,Bug,7
	752,,,,Araquanid,Water,Bug,7
	753,,,,Fomantis,Grass,,7
	754,,,,Lurantis,Grass,,7
	755,,,,Morelull,Grass,Fairy,7
	756,,,,Shiinotic,Grass,Fairy,7
	757,,,,Sandalit,Poison,Fire,7
	758,,,,Salazzle,Poison,Fire,7
	759,,,,Stufful,Normal,Fighting,7
	760,,,,Bewear,Normal,Fighting,7
	761,,,,Bounsweet,Grass,,7
	762,,,,Steenee,Grass,,7
	763,,,,Tsareena,Grass,,7
	764,,,,Comfey,Fairy,,7
	765,,,,Oranguru,Normal,Psychic,7
	766,,,,Passimian,Fighting,,7
	767,,,,Wimpod,Bug,Water,7
	768,,,,Golisopod,Bug,Water,7
	769,,,,Sandygast,Ghost,Ground,7
	770,,,,Palossand,Ghost,Ground,7
	771,,,,Pyukumuku,Water,,7
	772,,,,Type: Null,Normal,,7
	773,,,,Silvally,Normal,,7
	774,Meteor,,,Minior (Meteor Form),Rock,Flying,7
	774,Red,,,Minior (Core),Rock,Flying,7
	775,,,,Komala,Normal,,7
	776,,,,Turtonator,Fire,Dragon,7
	777,,,,Togedemaru,Electric,Steel,7
	778,,,,Mimikyu,Ghost,Fairy,7
	779,,,,Bruxish,Water,Psychic,7
	780,,,,Drampa,Normal,Dragon,7
	781,,,,Dhelmise,Ghost,Grass,7
	782,,,,Jangmo-o,Dragon,,7
	783,,,,Hakamo-o,Dragon,Fighting,7
	784,,,,Kommo-o,Dragon,Fighting,7
	785,,,,Tapu Koko,Electric,Fairy,7
	786,,,,Tapu Lele,Psychic,Fairy,7
	787,,,,Tapu Bulu,Grass,Fairy,7
	788,,,,Tapu Fini,Water,Fairy,7
	789,,,,Cosmog,Psychic,,7
	790,,,,Cosmoem,Psychic,,7
	791,,,,Solgaleo,Psychic,Steel,7
	792,,,,Lunala,Psychic,Ghost,7
	793,,,,Nihilego,Rock,Poison,7
	794,,,,Buzzwole,Bug,Fighting,7
	795,,,,Pheromosa,Bug,Fighting,7
	796,,,,Xurkitree,Electric,,7
	797,,,,Celesteela,Steel,Flying,7
	798,,,,Kartana,Grass,Steel,7
	799,,,,Guzzlord,Dark,Dragon,7
	800,,,,Necrozma,Psychic,,7
	800,Dusk,,,Dusk Mane Necrozma,Psychic,Steel,7
	800,Dawn,,,Dawn Wings Necrozma,Psychic,Ghost,7
	800,Ultra,,,Ultra Necrozma,Psychic,Ghost,7
	801,,,,Magearna,Steel,Fairy,7
	802,,,,Marshadow,Fighting,Ghost,7
	803,,,,Poipole,Poison,,7
	804,,,,Nagandel,Poison,Dragon,7
	805,,,,Stakataka,Rock,Steel,7
	806,,,,Blacephalon,Fire,Ghost,7
	807,,,,Zeraora,Electric,,7
	808,,,,Meltan,Steel,,7
	809,,,,Melmetal,Steel,,7`);

const highestGeneration = getHighestGeneration();

export { DamageTier, Pokemon, get, getAll, highestGeneration, pokemon };
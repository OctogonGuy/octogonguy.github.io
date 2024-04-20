/**
 * Represents a Pokémon type. Each type has a set of weaknesses, resistances,
 * and immunities. Each Type object has these as well as an image representing
 * the type.
 * @author Alex Gill
 *
 */
class Type {
    constructor(name, weaknesses, resistances, immunities) {
        this.name = name;
        this.weaknesses = weaknesses;
        this.resistances = resistances;
        this.immunities = immunities;
    }
	
	
	/**
	 * @return The name of the type as a string
	 */
	getName() {
		return this.name.substring(0, 1).toUpperCase() + this.name.substring(1);
	}
	
	
	/**
	 * @return The filename of this type's image
	 */
	getImagePath() {
		return "resources/img/type/" + this.name.toLowerCase() + ".png";
	}
	
	
	/**
	 * Returns a list of types that deal normal damage to this type.
	 * @return A list of types that deal normal damage
	 */
	getNormals() {
		const normalDamageTypes = [];
		for (const type of Object.keys(types))
			normalDamageTypes.push(type);
		
		for (const weakness of this.weaknesses)
			normalDamageTypes.splice(normalDamageTypes.indexOf(weakness), 1);
		
		for (const resistance of this.resistances)
            normalDamageTypes.splice(normalDamageTypes.indexOf(resistance), 1);
		
		for (const immunity of this.immunities)
            normalDamageTypes.splice(normalDamageTypes.indexOf(immunity), 1);
		
		return normalDamageTypes;
	}

}

const types = {
    "Normal": new Type(
        "Normal",
        ["Fighting"],
        [],
        ["Ghost"],
    ),
    
    "Fire": new Type(
        "Fire",
        ["Water", "Ground", "Rock"],
        ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"],
        [],
    ),
    
    "Water": new Type(
        "Water",
        ["Grass", "Electric"],
        ["Fire", "Water", "Ice", "Steel"],
        [],
    ),
    
    "Grass": new Type(
        "Grass",
        ["Fire", "Ice", "Poison", "Flying", "Bug"],
        ["Water", "Grass", "Electric", "Ground"],
        [],
    ),
    
    "Electric": new Type(
        "Electric",
        ["Ground"],
        ["Electric", "Flying", "Steel"],
        [],
    ),
    
    "Ice": new Type(
        "Ice",
        ["Fire", "Fighting", "Rock", "Steel"],
        ["Ice"],
        [],
    ),
    
    "Fighting": new Type(
        "Fighting",
        ["Flying", "Psychic", "Fairy"],
        ["Bug", "Rock", "Dark"],
        [],
    ),
    
    "Poison": new Type(
        "Poison",
        ["Ground", "Psychic"],
        ["Grass", "Fighting", "Poison", "Bug", "Fairy"],
        [],
    ),
    
    "Ground": new Type(
        "Ground",
        ["Water", "Grass", "Ice"],
        ["Poison", "Rock"],
        ["Electric"],
    ),
    
    "Flying": new Type(
        "Flying",
        ["Electric", "Ice", "Rock"],
        ["Grass", "Fighting", "Bug"],
        ["Ground"],
    ),
    
    "Psychic": new Type(
        "Psychic",
        ["Bug", "Ghost", "Dark"],
        ["Fighting", "Psychic"],
        [],
    ),
    
    "Bug": new Type(
        "Bug",
        ["Fire", "Flying", "Rock"],
        ["Grass", "Fighting", "Ground"],
        [],
    ),
    
    "Rock": new Type(
        "Rock",
        ["Water", "Grass", "Fighting", "Ground", "Steel"],
        ["Normal", "Fire", "Poison", "Fighting"],
        [],
    ),
    
    "Ghost": new Type(
        "Ghost",
        ["Ghost", "Dark"],
        ["Poison", "Bug"],
        ["Normal", "Fighting"],
    ),
    
    "Dragon": new Type(
        "Dragon",
        ["Ice", "Dragon", "Fairy"],
        ["Fire", "Water", "Grass", "Electric"],
        [],
    ),
    
    "Dark": new Type(
        "Dark",
        ["Fighting", "Bug", "Fairy"],
        ["Ghost", "Dark"],
        ["Psychic"],
    ),
    
    "Steel": new Type(
        "Steel",
        ["Fire", "Fighting", "Ground"],
        ["Normal", "Grass", "Ice", "Flying", "Psychic", "Bug", "Rock", "Dragon", "Steel", "Fairy"],
        ["Poison"],
    ),
    
    "Fairy": new Type(
        "Fairy",
        ["Poison", "Steel"],
        ["Fighting", "Bug", "Dark"],
        ["Dragon"],
    ),
    
};


export { Type, types };
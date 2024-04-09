"use strict"

// --- PROPERTIES
const properties = {
"interjection": .09,
"subjectPronoun": .16,
"adjective": .18,
"adjectivePhrase": .2,
"adverb": .18,
"adverbPhrase": .2,
"prepositionalPhrase": .1,
"possessive": .08,
"compoundNoun": .08,
"compoundVerb": .05,
"compoundAdjective": .2,


"pattern1": .33,
"pattern2": .25,
"pattern3": .12,
"pattern4": .15,
// Otherwise pattern 5

"pnBeVerb": 0.9,
// Otherwise non-be verb

"paBeVerb": 0.6,
// Otherwise non-be verb

"compoundSentence": .10,
"complexSentence": .15,
// Otherwise simple sentence

"pronoun": .14,
// Otherwise noun

"possessivePronoun": .33,
// Otherwise possessive noun

"pluralNumber": .50,
// Otherwise singular

"pastTense": .44,
"futureTense": .18,
// Otherwise present

"perfectAspect": .12,
"continuousAspect": .13,
"perfectContinuousAspect": .05
// Otherwise simple
}

// --- ENUMS ---

const AdverbType = {
    MANNER: 'MANNER',
    TIME: 'TIME',
    PLACE: 'PLACE',
    FREQUENCY: 'FREQUENCY',
    DEGREE: 'DEGREE'
  };
  
  const Aspect = {
    SIMPLE: 'SIMPLE',
    PERFECT: 'PERFECT',
    CONTINUOUS: 'CONTINUOUS',
    PERFECT_CONTINUOUS: 'PERFECT_CONTINUOUS'
  };
  
  const Case = {
    SUBJECT: 'SUBJECT',
    OBJECT: 'OBJECT',
    POSSESSIVE: 'POSSESSIVE'
  };
  
  const ConjunctionType = {
    COORDINATING: 'COORDINATING',
    SUBORDINATING: 'SUBORDINATING'
  };
  
  const NounPhraseType = {
    NOUN: 'NOUN',
    PRONOUN: 'PRONOUN'
  };
  
  const Number = {
    SINGULAR: 'SINGULAR',
    PLURAL: 'PLURAL'
  };
  
  
const Person = {
    FIRST: 'FIRST',
    SECOND: 'SECOND',
    THIRD: 'THIRD'
  };
  
  
const Tense = {
    PAST: 'PAST',
    PRESENT: 'PRESENT', 
    FUTURE: 'FUTURE'
  };

const VerbType = {
    INTRANSITIVE: 'INTRANSITIVE',
    TRANSITIVE: 'TRANSITIVE',
    DITRANSITIVE: 'DITRANSITIVE',
    NOUN_LINKING: 'NOUN_LINKING',
    ADJECTIVE_LINKING: 'ADJECTIVE_LINKING',
    BE: 'BE'
  };


// --- UTIL ---
  

// Instantiate Random object for generating random numbers.
const rand = Math.random;


function randInt(max) {
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored)); // The maximum is exclusive and the minimum is inclusive
}

function randBool() {
    return Math.random() < 0.5;
}


// --- Variables ---
let randNum;

/**
 * Reads a file with words and returns an array of those words.
 * @param {string} filename The file name.
 * @returns {string[]} The array of words.
 */
function readFile(filename) {
  const items = [];

  try {
    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.trim().split('\n');

    for (const line of lines) {
      const word = line.split(',')[0].trim();
      if (word && !word.startsWith('//')) {
        items.push(word);
      }
    }
  } catch (err) {
    console.error(`Error reading file: ${filename}`, err);
    process.exit(1);
  }

  return items;
}

/**
 * Reads a file with groups of words and returns a two-dimensional array of
 * those words.
 * @param {string} filename The file name.
 * @returns {string[][]} The array of words.
 */
function readCSV(filename) {
  const items = [];

    const reader = new FileReader();
    reader.readAsText(filename);
    const lines = reader.result.trim().split('\n');

    for (const line of lines) {
      const tokens = line.split(',');
      if (tokens.length > 0 && !line.startsWith('//')) {
        items.push(tokens);
      }
    }

  return items;
}

/**
 * Returns a random element in the given array.
 * @param {any[]} arr The array from which to select.
 * @returns {any} The randomly selected element.
 */
function randElement(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

/**
 * Randomly generates a boolean value based on the probability of an event
 * happening specified in the application properties. This method must be
 * overridden in the subclass.
 * @param {string} propertyName The name of the chance property key.
 * @returns {boolean} Whether the event should occur.
 * @throws {Error} If the property value string does not contain a parsable double.
 */
function randChance(propertyName) {
  const value = properties[propertyName];
  const probability = parseFloat(value);
  randNum = rand();
  const shouldOccur = randNum < probability;
  randNum -= probability;
  return shouldOccur;
}

/**
 * Randomly generates a boolean value based on the probability of an event
 * happening specified in the application properties. This method does not
 * generate a random number and instead uses the last randomly generated
 * number from the randChance method minus the probabilities that have
 * already been used.
 * @param {string} propertyName The name of the chance property key.
 * @returns {boolean} Whether the event should occur.
 * @throws {Error} If the property value string does not contain a parsable double.
 */
function randChanceContinued(propertyName) {
  const value = properties[propertyName];
  const probability = parseFloat(value);
  const shouldOccur = randNum < probability;
  randNum -= probability;
  return shouldOccur;
}


// --- COMPONENTS ---
 
 
 
// Import any needed libraries here

/**
 * The Clause class builds a clause from words and phrases.
 * @author AJ Gill
 */
class Clause {
    constructor(pattern) {
      this.subjectIndex = undefined;
      this.clause = [];
  
      if (pattern !== undefined) {
        this.constructClause(pattern);
      } else {
        // Determine the sentence pattern.
        let pattern;
        if (randChance("pattern1")) {
          pattern = 1;
        } else if (randChanceContinued("pattern2")) {
          pattern = 2;
        } else if (randChanceContinued("pattern3")) {
          pattern = 3;
        } else if (randChanceContinued("pattern4")) {
          pattern = 4;
        } else {
          pattern = 5;
        }
  
        this.constructClause(pattern);
      }
    }
  
    /**
     * This method constructs a clause with the given parameters.
     * @param {number} pattern The pattern of the clause
     */
    constructClause(pattern) {
  
      // Build the clause
      const subject = new NounPhrase(null, Case.SUBJECT);
      const predicate = new VerbPhrase(pattern, subject.getNumber(), subject.getPerson());
      for (const object of predicate.getVerbPhrase()) {
        this.clause.push(object);
      }
  
      this.clause.splice(predicate.getFiniteVerbIndex(), 0, subject);
      this.subjectIndex = predicate.getFiniteVerbIndex();
  
      if (randChance("compoundVerb")) {
        this.clause.push(new Conjunction(ConjunctionType.COORDINATING));
        this.clause.push(new VerbPhrase(randInt(4) + 1, subject.getNumber(), subject.getPerson()));
      }
  
      for (let i = 0; i < this.clause.length; i++) {
        if (i < this.subjectIndex) {
          this.clause.splice(i + 1, 0, ",");
          i++;
          this.subjectIndex++;
        }
      }
    }
  
    /**
     * The toString method.
     * @returns {string} The contents in the form of a String
     */
    toString() {
      let str = "";
  
      for (let i = 0; i < this.clause.length - 1; i++) {
        if (this.clause[i + 1].toString() === ",") {
          str += this.clause[i];
        } else {
          str += this.clause[i] + " ";
        }
      }
      str += this.clause[this.clause.length - 1];
  
      return str;
    }
  }
  
  

/**
 * The Sentence class uses the parts of speech classes to create a string that
 * holds a randomly generated sentence.
 * @author AJ Gill
 */
class Sentence {
  sentence = [];

  /**
   * This method constructs a sentence.
   */
  constructSentence() {
    // Build the sentence
    this.sentence.push(new Clause());
    if (randChance('compoundSentence')) {
      this.sentence.push(',');
      this.sentence.push(new Conjunction(ConjunctionType.COORDINATING));
      this.sentence.push(new Clause());
    } else if (randChanceContinued('complexSentence')) {
      if (Math.random() < 0.5) {
        this.sentence.push(new Conjunction(ConjunctionType.SUBORDINATING));
        this.sentence.push(new Clause());
      } else {
        this.sentence.unshift(',');
        this.sentence.unshift(new Clause());
        this.sentence.unshift(new Conjunction(ConjunctionType.SUBORDINATING));
      }
    }
    if (randChance('interjection')) {
      this.sentence.unshift(new Interjection());
    }
  }

  /**
   * The overloaded constructor constructs a sentence.
   */
  constructor() {
    this.constructSentence();
  }

  /**
   * The toString method.
   * @return The contents in the form of a String
   */
  toString() {
    let str = '';
    let capitalizeNext = true; // Flag

    for (let i = 0; i < this.sentence.length; i++) {
      if (capitalizeNext) {
        str += this.sentence[i].toString().substring(0, 1).toUpperCase();
        str += this.sentence[i].toString().substring(1);
        capitalizeNext = false;
      } else {
        str += this.sentence[i].toString();
      }
      if (
        this.sentence[i].toString().charAt(this.sentence[i].toString().length - 1) === '.' ||
        this.sentence[i].toString().charAt(this.sentence[i].toString().length - 1) === '!' ||
        this.sentence[i].toString().charAt(this.sentence[i].toString().length - 1) === '?'
      ) {
        capitalizeNext = true;
      }
      if (i === this.sentence.length - 1) {
        str += '.';
      } else if (!(this.sentence[i + 1].toString().charAt(this.sentence[i + 1].toString().length - 1) === ',')) {
        str += ' ';
      }
    }

    return str;
  }
}



/**
 * The Word class represents a word in the sentence.
 */
class Word {
    word; // The word
  
    /**
     * Sets the word this Word represents.
     * @param {string} w The word.
     */
    setWord(w) {
      this.word = w;
    }
  
    /**
     * Returns the word as a string.
     * @returns {string} The word.
     */
    toString() {
      return this.word;
    }
  
    /**
     * Compares this object to another Word object.
     * @param {Word} object2 The other Word object to compare.
     * @returns {boolean} True if they contain the same word, false otherwise.
     */
    equals(object2) {
      return this.word === object2.word;
    }
  }



/**
 * The Adjective class simulates an adjective.
 * @author AJ Gill
 */
class Adjective extends Word {
  /**
   * Constructor
   */
  constructor() {
    super();
    // Set the adjective.
    this.word = randElement(adjectives);
  }
}


/**
 * The Adverb class simulates an adverb.
 * @author AJ Gill
 */
class Adverb extends Word {
  // --- Fields ---------------------------------------------------------------
  type;

  // --- Constructors ---------------------------------------------------------

  /**
   * Constructor
   * @param {AdverbType} type The type of adverb.
   */
  constructor(type=null) {
    super();
    if (type === null) {
        
    // Determine the type index
    let tempIndex, totalSize;
    totalSize = 0;
    for (const arr in adverbs)
      totalSize += arr.length;
    tempIndex = Math.floor(Math.random() * totalSize);
    if (tempIndex < adverbs['MANNER'].length) {
      this.type = 'MANNER';
    } else if (tempIndex < adverbs['MANNER'].length +
                           adverbs['TIME'].length) {
      this.type = 'TIME';
    } else if (tempIndex < adverbs['MANNER'].length +
                           adverbs['TIME'].length +
                           adverbs['PLACE'].length) {
      this.type = 'PLACE';
    } else {
      this.type = 'FREQUENCY';
    }//end else-if

    // Set the adverb.
    this.word = randElement(adverbs[this.type]);
    }
    else {
    // Set the fields to parameter values.
    this.type = type;

    // Set the adverb.
    this.word = randElement(adverbs[type]);
    }
  }

  // --- Methods --------------------------------------------------------------

  /**
   * The getType method returns the type of this adverb.
   * @returns {AdverbType} The value stored in type.
   */
  getType() {
    return this.type;
  }
}


/**
 * The Conjunction class simulates a conjunction.
 * @author AJ Gill
 */
class Conjunction extends Word {
  /**
   * Constructor
   */
  constructor(type) {
    super();
    
    // Set the conjunction
    this.word = randElement(conjunctions[type]);
  }
}


// Import any needed libraries or modules

/**
 * The Interjection class contains fields and methods pertaining to interjections.
 * @author AJ Gill
 */
class Interjection extends Word {
    /**
     * Constructor
     */
    constructor() {
        super();
      // Set the interjection.
      this.word = randElement(interjections);
  
      // If there is no punctuation specified, add a comma
      if (!['.', '!', '?'].includes(this.word.charAt(this.word.length - 1))) {
        this.word += ',';
      }
    }
  
    /**
     * Getter for the word property
     * @returns {string} The interjection word
     */
    toString() {
      return this.word;
    }
  }
  

/**
 * The Noun class represents a noun.
 * @author AJ Gill
 */
class Noun extends Word {
  // --- Fields ---------------------------------------------------------------

  /**
   * The noun's number
   * @type {Number}
   */
  #number;

  // --- Constructors ---------------------------------------------------------

  /**
   * The constructor selects a random noun whose form depends on the
   * parameters given.
   * @param {Number} number Whether the noun is singular or plural.
   */
  constructor(number) {
    super();
    // Set the nounIndex to a random index.
    const nounGroup = randElement(nouns);

    // Set other indexes to the corresponding index.
    let numberIndex;
    if (number === Number.SINGULAR) {
      numberIndex = 0;
    } else {
      numberIndex = 1;
    }

    // Set the noun.
    this.word = nounGroup[numberIndex];
    this.number = number;
  }

  // --- Methods --------------------------------------------------------------

  /**
   * The getNumber method returns whether the noun is singular or plural.
   * @returns {Number} The value stored in number.
   */
  getNumber() {
    return this.#number;
  }
}


/**
 * The Preposition class simulates a preposition.
 * @author AJ Gill
 */
class Preposition extends Word {
    // --- Constructors ---------------------------------------------------------
  
    /**
     * Constructor
     */
    constructor() {
      super();
  
      // The list of prepositions
      const prepositions = [
        "aboard", "about", "above", "across", "after",
        "against", "along", "among", "around", "as",
        "at", "before", "behind", "below", "beneath",
        "beside", "between", "beyond", "but", "by",
        "despite", "down", "during", "except", "for",
        "from", "in", "inside", "into", "like",
        "near", "of", "off", "on", "out",
        "outside", "over", "past", "since", "through",
        "throughout", "to", "toward", "under", "underneath",
        "until", "up", "upon", "with", "within",
        "without"
      ];
  
      // Randomly generate the preposition index.
      const prepositionIndex = Math.floor(Math.random() * prepositions.length);
  
      // Set the preposition.
      this.word = prepositions[prepositionIndex];
    }
  }


// Import any needed libraries

/**
 * The Pronoun class simulates a pronoun.
 * @author AJ Gill
 */
class Pronoun extends Word {
    // --- Fields ---------------------------------------------------------------
  
    number;
    person;
  
    // --- Constructors ---------------------------------------------------------
  
    /**
     * The default constructor chooses a pronoun with the given parameters.
     * @param {string} pronounCase Whether the pronoun is a subject or object
     */
    constructor(pronounCase) {
        super();
  
      // Assign the case index to the value passed as an argument (row)
      let caseIndex;
      if (pronounCase === 'SUBJECT')
        caseIndex = 0;
      else if (pronounCase === 'OBJECT')
        caseIndex = 1;
      else
        caseIndex = 2;
  
      // Assign a random pronoun (column)
      const pronounIndex = randInt(7);
  
      // Determine the number.
      if (pronounIndex <= 0)
        this.number = 'SINGULAR';
      else if (pronounIndex <= 1)
        this.number = 'PLURAL';
      else if (pronounIndex <= 4)
        this.number = 'SINGULAR';
      else
        this.number = 'PLURAL';
  
      // Determine the person.
      if (pronounIndex <= 1)
        this.person = 'FIRST';
      else if (pronounIndex <= 5)
        this.person = 'THIRD';
      else
        this.person = 'SECOND';
  
      // Set the pronoun.
      this.word = pronouns[caseIndex][pronounIndex];
    }
  
    // --- Methods --------------------------------------------------------------
  
    /**
     * The getNumber method returns whether the pronoun is singular or plural.
     * @returns {string} The value of number
     */
    getNumber() {
      return this.number;
    }
  
    /**
     * The getPerson method returns whether the pronoun is first, second, or
     * third person.
     * @returns {string} The value of person
     */
    getPerson() {
      return this.person;
    }
  }
  
  
/**
 * The Verb class simulates a verb.
 * @author AJ Gill
 */
class Verb extends Word {
    // --- Fields ---------------------------------------------------------------
    type;
  
    // --- Constructors ---------------------------------------------------------
  
    /**
     * The default constructor selects a random verb based on the parameters
     * given.
     * @param {VerbType} type The type of verb
     * @param {Number} number Whether the subject is singular or plural
     * @param {Person} person Whether the subject is first, second, or third person
     * @param {Tense} tense The tense of the verb
     * @param {Aspect} aspect The aspect of the verb
     */
    constructor(type, number, person, tense, aspect) {
      super();
  
      // Set fields to parameter values.
      this.type = type;
  
      // Determine the inflection
      let inflectionIndex;
      if (type !== VerbType.BE) { // Non-be verbs
        // Standard
        if (aspect === Aspect.SIMPLE && tense === Tense.PRESENT && person === Person.FIRST)
          inflectionIndex = 1;
        // -s
        else if (aspect === Aspect.SIMPLE && tense === Tense.PRESENT && number === Number.SINGULAR)
          inflectionIndex = 0;
        // Standard
        else if (aspect === Aspect.SIMPLE && (tense === Tense.PRESENT || tense === Tense.FUTURE))
          inflectionIndex = 1;
        // -ed
        else if (aspect === Aspect.SIMPLE && tense === Tense.PAST)
          inflectionIndex = 2;
        // -ed or exception
        else if (aspect === Aspect.PERFECT)
          inflectionIndex = 3;
        // -ing
        else
          inflectionIndex = 4;
      } else {                         // Be verbs
        // am
        if (aspect === Aspect.SIMPLE && tense === Tense.PRESENT && number === Number.SINGULAR && person === Person.FIRST)
          inflectionIndex = 0;
        // is
        else if (aspect === Aspect.SIMPLE && tense === Tense.PRESENT && number === Number.SINGULAR)
          inflectionIndex = 1;
        // are
        else if (aspect === Aspect.SIMPLE && tense === Tense.PRESENT)
          inflectionIndex = 2;
        // was
        else if (aspect === Aspect.SIMPLE && tense === Tense.PAST && number === Number.SINGULAR)
          inflectionIndex = 3;
        // were
        else if (aspect === Aspect.SIMPLE && tense === Tense.PAST)
          inflectionIndex = 4;
        // be
        else if (aspect === Aspect.SIMPLE && tense === Tense.FUTURE)
          inflectionIndex = 5;
        // been
        else if (aspect === Aspect.PERFECT)
          inflectionIndex = 7;
        // being
        else
          inflectionIndex = 6;
      }
  
      // Set the verb.
      this.setWord(randElement(verbs[type])[inflectionIndex]);
    }
  
    // --- Methods --------------------------------------------------------------
  
    /**
     * The getType method returns the type of this verb.
     * @returns {VerbType} The value stored in type.
     */
    getType() {
      return this.type;
    }
  }
  
// Import any needed libraries here

/**
 * The AdjectivePhrase class constructs an adjective phrase using Adjective and Adverb.
 * @author AJ Gill
 */
class AdjectivePhrase {
    constructor() {
      this.adjectivePhrase = [];
      this.adjectivePhrase.push(new Adverb(AdverbType.DEGREE));
      this.adjectivePhrase.push(new Adjective());
    }
  
    /**
     * The toString method.
     * @returns {string} The contents in the form of a string
     */
    toString() {
      let str = "";
      for (let i = 0; i < this.adjectivePhrase.length - 1; i++) {
        str += `${this.adjectivePhrase[i]} `;
      }
      str += this.adjectivePhrase[this.adjectivePhrase.length - 1];
      return str;
    }
  }
  
// Import any needed libraries

/**
 * The AdverbPhrase class constructs an adverb phrase using Adverb.
 * @author AJ Gill
 */
class AdverbPhrase {
    constructor() {
      this.adverbPhrase = [];
      this.adverbPhrase.push(new Adverb(AdverbType.DEGREE));
      this.adverbPhrase.push(new Adverb());
    }
  
    /**
     * The toString method.
     * @returns {string} The contents in the form of a string
     */
    toString() {
      let str = "";
      for (let i = 0; i < this.adverbPhrase.length - 1; i++) {
        str += `${this.adverbPhrase[i]} `;
      }
      str += this.adverbPhrase[this.adverbPhrase.length - 1];
      return str;
    }
  }
  
  // Note: The Adverb and AdverbType classes/enums are not provided in the input code,
  // so they would need to be defined or imported separately.
  

/**
 * The NounPhrase class constructs a noun phrase using Noun and Adjective.
 * @author AJ Gill
 */
class NounPhrase {
  /**
   * This method constructs the noun phrase.
   * @param {Number} number - Whether the noun phrase is to be singular or plural
   */
  constructNounPhrase(number) {
    const rand = Math.random();

    // Get the noun
    this.nounPhrase = [new Noun(number)];
    this.number = number;
    this.person = Person.THIRD;

    // Get a number of adjectives
    while (randChance('adjective')) {
      if (randChance('adjectivePhrase')) {
        this.nounPhrase.unshift(new AdjectivePhrase());
      } else {
        this.nounPhrase.unshift(new Adjective());
      }
    }

    // Add a possessive
    if (randChance('possessive')) {
      if (randChance('possessivePronoun')) {
        this.nounPhrase.unshift(new Pronoun(Case.POSSESSIVE));
      } else {
        this.nounPhrase.unshift(new NounPhrase());
        if (this.nounPhrase[0].toString().charAt(this.nounPhrase[0].toString().length - 1) !== 's') {
          this.nounPhrase.splice(1, 0, "'s");
        } else {
          this.nounPhrase.splice(1, 0, "'");
        }
      }
    // Add an article adjective
    } else if (this.number === Number.SINGULAR) {
      if (rand < 0.5) {
        switch (this.nounPhrase[0].toString().charAt(0)) {
          case 'a':
          case 'e':
          case 'i':
          case 'o':
          case 'u':
            this.nounPhrase.unshift('an');
            break;
          default:
            this.nounPhrase.unshift('a');
            break;
        }
      } else {
        this.nounPhrase.unshift('the');
      }
    } else if (rand < 0.5) {
      this.nounPhrase.unshift('the');
    }

    // Add a prepositional phrase
    if (randChance('prepositionalPhrase')) {
      this.nounPhrase.push(new PrepositionalPhrase());
    }

    // Add a compound noun
    if (randChance('compoundNoun')) {
      this.nounPhrase.push('and');
      this.nounPhrase.push(new NounPhrase());
      this.number = Number.PLURAL;
    }
  }

  /**
   * The overloaded constructor constructs a noun phrase with the given parameters.
   */
  constructor(number=null, pronounCase=null) {
    if (number !== null) {
        this.constructNounPhrase(number);
    }
    else if (pronounCase !== null) {
        let type;
        let number;
    
        // Determine the type
        if (randChance('pronoun')) {
          type = NounPhraseType.PRONOUN;
        } else {
          type = NounPhraseType.NOUN;
        }
    
        // Determine the number
        if (randChance('pluralNumber')) {
          number = Number.PLURAL;
        } else {
          number = Number.SINGULAR;
        }
    
        // Get the noun or pronoun
        if (type === NounPhraseType.NOUN) {
          this.constructNounPhrase(number);
        } else {
          this.nounPhrase = [new Pronoun(pronounCase)];
          this.number = this.nounPhrase[0].getNumber();
          this.person = this.nounPhrase[0].getPerson();
        }
    }
    else {
        let number;

        // Determine the number
        if (randChance('pluralNumber')) {
        number = Number.PLURAL;
        } else {
        number = Number.SINGULAR;
        }

        this.constructNounPhrase(number);
    }
  }

  /**
   * The getNumber method returns whether the noun phrase is singular or plural.
   * @returns {Number} The value in number
   */
  getNumber() {
    return this.number;
  }

  /**
   * The getPerson method returns whether the noun phrase is first, second, or third person.
   * @returns {Person} The value in person
   */
  getPerson() {
    return this.person;
  }

  /**
   * The toString method.
   * @returns {string} The contents in the form of a String
   */
  toString() {
    let str = '';

    for (let i = 0; i < this.nounPhrase.length; i++) {
      if (i < this.nounPhrase.length - 1 && this.nounPhrase[i + 1].toString().charAt(0) !== '\'') {
        str += this.nounPhrase[i] + ' ';
      } else {
        str += this.nounPhrase[i];
      }
    }

    return str;
  }
}


/**
 * The PrepositionalPhrase class constructs a prepositional phrase.
 * @author AJ Gill
 */
class PrepositionalPhrase {
    constructor() {
      this.prepositionalPhrase = [];
      this.prepositionalPhrase.push(new Preposition());
      this.prepositionalPhrase.push(new NounPhrase(Case.OBJECT));
    }
  
    /**
     * The toString method.
     * @returns {string} The contents in the form of a String
     */
    toString() {
      let str = "";
      for (let i = 0; i < this.prepositionalPhrase.length - 1; i++) {
        str += `${this.prepositionalPhrase[i]} `;
      }
      str += this.prepositionalPhrase[this.prepositionalPhrase.length - 1];
      return str;
    }
  }
  
  // Note: You need to import the required classes/libraries for Preposition and NounPhrase
  
  class VerbPhrase {
    constructor(pattern, number, person, tense=null, aspect=null) {
        if (tense === null && aspect === null) {
            
       let tense;   // The tense of the verb
       let aspect; // The aspect of the verb
       
       // Determine the tense.
       if (randChance("pastTense"))
           tense = Tense.PAST;
       else if (randChanceContinued("futureTense"))
           tense = Tense.FUTURE;
       else
           tense = Tense.PRESENT;
       
       // Determine the aspect.
       if (randChance("perfectAspect"))
           aspect = Aspect.PERFECT;
       else if (randChanceContinued("continuousAspect"))
           aspect = Aspect.CONTINUOUS;
       else if (randChanceContinued("perfectContinuousAspect"))
           aspect = Aspect.PERFECT_CONTINUOUS;
       else
           aspect = Aspect.SIMPLE;
       
       this.constructVerbPhrase(pattern, number, person, tense, aspect);
        }
        else {
       this.constructVerbPhrase(pattern, number, person, tense, aspect);
        }
    }
    
    
   
    constructVerbPhrase(pattern, number, person, tense, aspect) {
        this.verbPhrase = [];
       // Set modifier fields to parameter values.
       this.tense = tense;
       this.aspect = aspect;
       this.pattern = pattern;
       this.number = number;
       this.person = person;
       
       // Set index fields to default values.
       this.mainVerbIndex = -1;
       this.finiteVerbIndex = -1;
       
       // Build the verb phrase with the current pattern.
       this.generateSentencePattern();
       this.mainVerbIndex = 0;
       
       // Construct the verb tense and aspect
       this.conjugateVerb();
       
       // Add a random number of adverbs and prepositional phrases.
       this.addAdverbialPhrase();
    }
    
    generateSentencePattern() {
       switch (this.pattern) {
          case 1:
             this.verbPhrase.push(new Verb(VerbType.INTRANSITIVE, this.number, this.person, this.tense, this.aspect));
             break;
          case 2:
             this.verbPhrase.push(new Verb(VerbType.TRANSITIVE, this.number, this.person, this.tense, this.aspect));
             this.verbPhrase.push(new NounPhrase(null, Case.OBJECT));
             break;
          case 3:
             this.verbPhrase.push(new Verb(VerbType.DITRANSITIVE, this.number, this.person, this.tense, this.aspect));
             this.verbPhrase.push(new NounPhrase(null, Case.OBJECT));
             this.verbPhrase.push(new NounPhrase(null, Case.OBJECT));
             break;
          case 4:
             if (randChance("pnBeVerb"))
                 this.verbPhrase.push(new Verb(VerbType.BE, this.number, this.person, this.tense, this.aspect));
             else
                 this.verbPhrase.push(new Verb(VerbType.NOUN_LINKING, this.number, this.person, this.tense, this.aspect));
             this.verbPhrase.push(new NounPhrase(null, Case.OBJECT));
             break;
          default:
             if (randChance("paBeVerb"))
                 this.verbPhrase.push(new Verb(VerbType.BE, this.number, this.person, this.tense, this.aspect));
             else
                 this.verbPhrase.push(new Verb(VerbType.ADJECTIVE_LINKING, this.number, this.person, this.tense, this.aspect));
             if (randChance("adjectivePhrase"))
                this.verbPhrase.push(new AdjectivePhrase());
             else
                this.verbPhrase.push(new Adjective());
             if (randChance("compoundAdjective")) {
                this.verbPhrase.push("and");
                if (randChance("adjectivePhrase"))
                   this.verbPhrase.push(new AdjectivePhrase());
                else
                   this.verbPhrase.push(new Adjective());
             }
       }
    }
    
    conjugateVerb() {
       if (this.aspect === Aspect.SIMPLE && this.tense === Tense.FUTURE) {
          this.verbPhrase.unshift("will");
          this.finiteVerbIndex = 0;
          this.mainVerbIndex++;
          
       } else if (this.aspect === Aspect.PERFECT) {
          if (this.tense === Tense.PRESENT) {
             if (this.number === Number.SINGULAR && this.person !== Person.FIRST) {
                this.verbPhrase.unshift("has");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex++;
             } else {
                this.verbPhrase.unshift("have");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex++;
             }
          } else if (this.tense === Tense.PAST) {
             this.verbPhrase.unshift("had");
             this.finiteVerbIndex = 0;
             this.mainVerbIndex++;
          } else {
             this.verbPhrase.unshift("have");
             this.verbPhrase.unshift("will");
             this.finiteVerbIndex = 0;
             this.mainVerbIndex += 2;
          }
       } else if (this.aspect === Aspect.CONTINUOUS) {
          if (this.tense === Tense.PRESENT) {
             if (this.number === Number.SINGULAR && this.person === Person.FIRST) {
                this.verbPhrase.unshift("am");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex++;
             } else if (this.number === Number.SINGULAR) {
                this.verbPhrase.unshift("is");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex++;
             } else {
                this.verbPhrase.unshift("are");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex++;
             }
          } else if (this.tense === Tense.PAST) {
             if (this.number === Number.SINGULAR) {
                this.verbPhrase.unshift("was");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex++;
             } else {
                this.verbPhrase.unshift("were");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex++;
             }
          } else {
             this.verbPhrase.unshift("be");
             this.verbPhrase.unshift("will");
             this.finiteVerbIndex = 0;
             this.mainVerbIndex += 2;
          }
       } else if (this.aspect === Aspect.PERFECT_CONTINUOUS) {
          if (this.tense === Tense.PRESENT) {
             if (this.number === Number.SINGULAR && this.person !== Person.FIRST) {
                this.verbPhrase.unshift("been");
                this.verbPhrase.unshift("has");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex += 2;
             } else {
                this.verbPhrase.unshift("been");
                this.verbPhrase.unshift("have");
                this.finiteVerbIndex = 0;
                this.mainVerbIndex += 2;
             }
          } else if (this.tense === Tense.PAST) {
             this.verbPhrase.unshift("been");
             this.verbPhrase.unshift("had");
             this.finiteVerbIndex = 0;
             this.mainVerbIndex += 2;
          } else {
             this.verbPhrase.unshift("been");
             this.verbPhrase.unshift("will have");
             this.finiteVerbIndex = 0;
             this.mainVerbIndex += 2;
          }
       }
    }
    
    addAdverbialPhrase() {
       
       // Flags
       let tryAnotherAdverb = true;
       let tryAnotherPrepPhrase = true;
       let addAdverb = false;
       
       // Keep trying to add an adverb or prepositional phrase until both
       // tryAnotherAdverb and tryAnotherPrepPhrase are false.
       while (tryAnotherAdverb || tryAnotherPrepPhrase) {
          // Figure out whether to add an adverb or prepositional phrase this
          // iteration.
          if (tryAnotherAdverb && tryAnotherPrepPhrase)
             if (randBool())
                addAdverb = true;
          else if (tryAnotherAdverb)
             addAdverb = true;
          
          // If addAdverb is activated, add an adverb.
          if (addAdverb) {
             if (randChance("adverb")) {
                
                // Determine the position of the adverb
                let pos;
                // If there is no finite verb...
                if (this.finiteVerbIndex === -1) {
                   switch (randInt(3)) {
                      case 0:  // Beginning of the sentence
                         pos = 0;
                         this.mainVerbIndex++;
                         break;
                      case 1:  // End of the sentence
                         pos = this.verbPhrase.length;
                         break;
                      default: // Before the main verb
                         pos = this.mainVerbIndex;
                         this.mainVerbIndex++;
                         break;
                   }
                // If there is a finite verb...
                } else {
                   switch (randInt(4)) {
                      case 0:  // Beginning of the sentence
                         pos = 0;
                         this.mainVerbIndex++;
                         this.finiteVerbIndex++;
                         break;
                      case 1:  // End of the sentence
                         pos = this.verbPhrase.length;
                         break;
                      case 2:  // Before the main verb
                         pos = this.mainVerbIndex;
                         this.mainVerbIndex++;
                         break;
                      default: // After the finite verb
                         pos = this.finiteVerbIndex + 1;
                         this.mainVerbIndex++;
                         break;
                   }
                }
                // Add an adverb or adverb phrase at the indicated position.
                if (randChance("adverbPhrase"))
                   this.verbPhrase.splice(pos, 0, new AdverbPhrase());
                else
                   this.verbPhrase.splice(pos, 0, new Adverb());
                
             } else
                tryAnotherAdverb = false;
          // If addAdverb is not activated, add a prepositional phrase.
          
          } else {
             if (randChance("prepositionalPhrase")) {
                // Determine the position of the prepositional phrase.
                let pos;
                switch (randInt(2)) {
                   case 0:  // Beginning of the sentence
                      pos = 0;
                      this.mainVerbIndex++;
                      if (this.finiteVerbIndex !== -1)
                         this.finiteVerbIndex++;
                      break;
                   default: // End of the sentence
                      pos = this.verbPhrase.length;
                      break;
                }
                
                // Add a prepositional phrase at the indicated position.
                this.verbPhrase.splice(pos, 0, new PrepositionalPhrase());
             } else
                tryAnotherPrepPhrase = false;
          }
          addAdverb = false;
       }// End while
    }
    
    getVerbPhrase() {
       return this.verbPhrase;
    }
    
    getTense() {
       return this.tense;
    }
    
    getAspect() {
       return this.aspect;
    }
    
    getFiniteVerbIndex() {
       if (this.finiteVerbIndex === -1)
          return this.mainVerbIndex;
       else
          return this.finiteVerbIndex;
    }
    
    toString() {
       let str = "";
       
       for (let i = 0; i < this.verbPhrase.length - 1; i++)
          str += this.verbPhrase[i] + " ";
       str += this.verbPhrase[this.verbPhrase.length - 1];
       
       return str;
    }
 }

// --- WORD LISTS ---

const adjectives_quantity = ['some', 'any', 'many', 'few', 'enough', 'no'];

const adjectives = ["blue", "yellow", "red", "green", "orange", "purple", "black", "white",
"pink", "cyan", "brown", "quick", "fast", "slow", "fun", "funny", "boring", "big",
"small", "cheerful", "grumpy", "nice", "kind", "mean", "plump", "stocky", "lanky",
"dazzling", "dull", "jealous", "embarrassed", "bewildered", "silly", "proud",
"brave", "weird", "crazy", "hilarious", "jittery", "lumpy", "sweet", "bitter",
"salty", "wobbly", "furry", "pretty", "beautiful", "ugly", "good", "bad", "new",
"first", "last", "long", "short", "tall", "great", "little", "young", "old",
"important", "public", "favorable", "delicious", "stinky", "poisonous", "each",
"every", "splendid", "invaluable", "cool", "cute", "gentle", "healthy",
"peaceful", "such", "slimy", "majestic", "dirty", "clean", "cold", "hot", "cool",
"warm", "dark", "light", "bright", "soft", "hard", "easy", "difficult",
"convenient", "inconvenient", "wild", "lively", "suspicious", "high", "low",
"expensive", "inexpensive", "cheap", "invisible", "precious", "spiky", "formal",
"casual", "wet", "dry", "round", "smooth", "dull", "vibrant", "winged", "wooden",
"metal", "golden", "cardboard", "relaxing", "calming", "satisfying", "awesome",
"busy", "lazy", "magical", "smart", "clever", "wise", "stupid", "dumb",
"special", "tired", "sleepy", "male", "female", "spicy", "simple",
"complicated", "complex", "professional", "limp", "stiff", "thin", "thick",
"skinny", "fat", "wide", "narrow", "bald", "true", "fluffy", "scary", "other",
"different", "same", "private", "able", "wet", "dry", "tiny"];

const adverbs_degree = [
    'very', 'extremely', 'quite', 'really', 'fairly', 'especially', 'totally',
    'almost', 'too', 'so', 'fully'
  ];
  
  
const adverbs_frequency = ['constantly', 'always', 'occasionally', 'regularly', 'periodically',
'frequently', 'usually', 'never', 'sometimes', 'generally', 'seldom', 'rarely'];


const adverbs_manner = ['also', 'quickly', 'slowly', 'peacefully', 'cheerfully', 'easily', 
'sheepishly', 'obediently', 'oddly', 'angrily', 'accidentally', 'skillfully', 
'bravely', 'wisely', 'thankfully', 'naturally', 'awkwardly', 'arrogantly', 
'officially', 'surely', 'abnormally', 'diligently', 'hopelessly', 'hungrily', 
'deliberatley', 'mysteriously', 'honestly', 'nicely', 'safely', 'fully', 
'coaxingly', 'longingly', 'shakily', 'openly', 'hardly', 'elegantly', 'arguably', 
'well', 'unfortunately', 'finally', 'nearly', 'gently', 'loyally', 'loudly', 
'lovingly', 'generously', 'rudely', 'generally', 'truly', 'repeatedly', 
'seemingly', 'unexpectedly', 'jovially', 'delightfully', 'sadly', 'truthfully', 
'reluctantly', 'gladly', 'merrily', 'closely', 'technically', 'literally', 
'seriously', 'funnily', 'actually', 'quietly', 'really', 'intensely', 'wildly', 
'lazily', 'daringly', 'unintentionally', 'extensively', 'calmly', 'greedily', 
'randomly', 'rapidly', 'hungrily', 'eagerly', 'unenthusiastically'];



const adverbs_place = [
    'here', 'there', 'over there', 'anywhere', 'everywhere', 'nowhere', 'outside',
    'inside', 'away', 'nearby'
    ];
    
    
const adverbs_time = [
    'now', 'soon', 'still', 'later', 'again', 'sometime', 'afterward', 'beforehand',
    'today', 'yesterday', 'tomorrow', 'tonight', 'last week', 'this week', 'next week',
    'last month', 'this month', 'next month', 'last year', 'this year', 'next year'
  ];
  
  const conjunctions_subordinating = ['after', 'although', 'as', 'as if', 'as long as', 'as much as', 
'as soon as', 'as though', 'because', 'before', 'by the time', 'even if', 
'even though', 'if', 'in case', 'in order that', 'in the event that', 'lest', 
'now that', 'once', 'only if', 'provided', 'provided that', 'since', 'so', 
'so that', 'supposing', 'that', 'though', 'till', 'unless', 'until', 'when', 
'whenever', 'where', 'whereas', 'wherever', 'whether', 'whether or not', 
'while', 'why'];

const interjections = [
    "Hey", "Wow!", "Woah!", "Hello.", "Hi.", "Howdy.", "Amazing!", "Hallelujah!",
    "Hooray!", "Well", "Oh my gosh!", "Oh no!", "Eww!", "Yuck!", "Oops!", "Mhm",
    "Aww.", "Aha!", "Eureka!", "Boo!", "Ouch!", "Oh", "Huh?", "Phew!", "Shh.",
    "Zoinks!", "Alas", "Crikey!", "Uh", "Um", "Er", "Eh.", "Ugh.", "Yay!", "Yes",
    "No", "So", "Darn", "Yippee!", "Hmm", "Ah", "Ahem."
  ];


  const nouns = [
    ['rain', 'rains'],
    ['snow', 'snows'],
    ['ice', 'ices'],
    ['lava', 'lavas'],
    ['smoke', 'smokes'],
    ['honey', 'honeys'],
    ['money', 'monies'],
    ['monkey', 'monkeys'],
    ['gorilla', 'gorillas'],
    ['sheep', 'sheep'],
    ['ox', 'oxen'],
    ['octopus', 'octopuses'],
    ['umbrella', 'umbrellas'],
    ['mirror', 'mirrors'],
    ['eraser', 'erasers'],
    ['tree', 'trees'],
    ['pencil', 'pencils'],
    ['pen', 'pens'],
    ['couch', 'couches'],
    ['person', 'people'],
    ['turkey', 'turkeys'],
    ['lasagna', 'lasagne'],
    ['curry', 'curries'],
    ['piano', 'pianos'],
    ['man', 'men'],
    ['woman', 'women'],
    ['boy', 'boys'],
    ['girl', 'girls'],
    ['boyfriend', 'boyfriends'],
    ['girlfriend', 'girlfriends'],
    ['family', 'families'],
    ['husband', 'husbands'],
    ['wife', 'wives'],
    ['aunt', 'aunts'],
    ['uncle', 'uncles'],
    ['grandpa', 'grandpas'],
    ['grandma', 'grandmas'],
    ['cousin', 'cousins'],
    ['cat', 'cats'],
    ['dog', 'dogs'],
    ['school', 'schools'],
    ['apple', 'apples'],
    ['shoe', 'shoes'],
    ['rock', 'rocks'],
    ['clown', 'clowns'],
    ['book', 'books'],
    ['dictionary', 'dictionaries'],
    ['pizza', 'pizzas'],
    ['sushi', 'sushis'],
    ['pineapple', 'pineapples'],
    ['employee', 'employees'],
    ['home', 'homes'],
    ['house', 'houses'],
    ['apartment', 'apartments'],
    ['time', 'times'],
    ['clock', 'clocks'],
    ['philosopher', 'philosophers'],
    ['robot', 'robots'],
    ['business', 'businesses'],
    ['businessman', 'businessmen'],
    ['dancer', 'dancers'],
    ['cucumber', 'cucumbers'],
    ['computer', 'computers'],
    ['adult', 'adults'],
    ['child', 'children'],
    ['jacket', 'jackets'],
    ['T-shirt', 'T-shirts'],
    ['hat', 'hats'],
    ['tie', 'ties'],
    ['cap', 'caps'],
    ['belt', 'belts'],
    ['pant', 'pants'],
    ['suit', 'suits'],
    ['dress', 'dresses'],
    ['party', 'parties'],
    ['kid', 'kids'],
    ['car', 'cars'],
    ['boat', 'boats'],
    ['train', 'trains'],
    ['plane', 'planes'],
    ['food', 'foods'],
    ['salt', 'salts'],
    ['baby', 'babies'],
    ['magazine', 'magazines'],
    ['newspaper', 'newspapers'],
    ['sock', 'socks'],
    ['glove', 'gloves'],
    ['government', 'governments'],
    ['yam', 'yams'],
    ['skateboarder', 'skateboarders'],
    ['kid', 'kids'],
    ['bicycle', 'bicycles'],
    ['motorcycle', 'motorcycles'],
    ['kidney', 'kidneys'],
    ['giraffe', 'giraffes'],
    ['sword', 'swords'],
    ['shield', 'shields'],
    ['spear', 'spears'],
    ['axe', 'axes'],
    ['bow', 'bows'],
    ['drink', 'drinks'],
    ['laptop', 'laptops'],
    ['foot', 'feet'],
    ['weed', 'weeds'],
    ['planet', 'planets'],
    ['leg', 'legs'],
    ['road', 'roads'],
    ['street', 'streets'],
    ['avenue', 'avenues'],
    ['sidewalk', 'sidewalks'],
    ['lion', 'lions'],
    ['shark', 'sharks'],
    ['lawyer', 'lawyers'],
    ['insect', 'insects'],
    ['website', 'websites'],
    ['mouse', 'mice'],
    ['ocean', 'oceans'],
    ['state', 'states'],
    ['biscuit', 'biscuits'],
    ['mountain', 'mountains'],
    ['building', 'buildings'],
    ['castle', 'castles'],
    ['table', 'tables'],
    ['desk', 'desks'],
    ['sofa', 'sofas'],
    ['couch', 'couches'],
    ['plastic', 'plastics'],
    ['morning', 'mornings'],
    ['toy', 'toys'],
    ['chocolate', 'chocolates'],
    ['fish', 'fish'],
    ['fisherman', 'fishermen'],
    ['flower', 'flowers'],
    ['fruit', 'fruits'],
    ['vegetable', 'vegetables'],
    ['animal', 'animals'],
    ['herb', 'herbs'],
    ['lady', 'ladies'],
    ['gentleman', 'gentlemen'],
    ['language', 'languages'],
    ['movie', 'movies'],
    ['president', 'presidents'],
    ['student', 'students'],
    ['teacher', 'teachers'],
    ['life', 'lives'],
    ['company', 'companies'],
    ['eye', 'eyes'],
    ['eyeball', 'eyeballs'],
    ['eyebrows', 'eyebrows'],
    ['problem', 'problems'],
    ['firework', 'fireworks'],
    ['breeze', 'breezes'],
    ['aroma', 'aromas'],
    ['color', 'colors'],
    ['campfire', 'campfires'],
    ['fire', 'fires'],
    ['firefighter', 'firefighters'],
    ['soul', 'souls'],
    ['asteroid', 'asteroids'],
    ['meteor', 'meteors'],
    ['moon', 'moons'],
    ['sky', 'skies'],
    ['day', 'days'],
    ['elephant', 'elephants'],
    ['giraffe', 'giraffes'],
    ['boot', 'boots'],
    ['helmet', 'helmets'],
    ['actor', 'actors'],
    ['actress', 'actresses'],
    ['waitor', 'waitors'],
    ['waitress', 'waitresses'],
    ['singer', 'singers'],
    ['program', 'programs'],
    ['truck', 'trucks'],
    ['airplane', 'airplanes'],
    ['guitar', 'guitars'],
    ['ant', 'ants'],
    ['anteater', 'anteaters'],
    ['tablet', 'tablets'],
    ['phone', 'phones'],
    ['smartphone', 'smartphones'],
    ['telephone', 'telephones'],
    ['telegraph', 'telegraphs'],
    ['telegram', 'telegrams'],
    ['song', 'songs'],
    ['library', 'libraries'],
    ['post office', 'post offices'],
    ['department store', 'department stores'],
    ['homework', 'homeworks'],
    ['friend', 'friends'],
    ['coffee', 'coffees'],
    ['tea', 'teas'],
    ['hospital', 'hospitals'],
    ['pharmacy', 'pharmacies'],
    ['pharmacist', 'pharmacists'],
    ['box', 'boxes'],
    ['ball', 'balls'],
    ['question', 'questions'],
    ['blackboard', 'blackboards'],
    ['laundry', 'laundries'],
    ['dish', 'dishes'],
    ['bed', 'beds'],
    ['window', 'windows'],
    ['floor', 'floors'],
    ['ceiling', 'ceilings'],
    ['chair', 'chairs'],
    ['television', 'televisions'],
    ['juice', 'juices'],
    ['test', 'tests'],
    ['exam', 'exams'],
    ['college', 'colleges'],
    ['restaurant', 'restaurants'],
    ['morning', 'mornings'],
    ['afternoon', 'afternoons'],
    ['evening', 'evenings'],
    ['day', 'days'],
    ['night', 'nights'],
    ['breakfast', 'breakfasts'],
    ['lunch', 'lunches'],
    ['dinner', 'dinners'],
    ['meal', 'meals'],
    ['orange', 'oranges'],
    ['strawberry', 'strawberries'],
    ['straw', 'straws'],
    ['plum', 'plums'],
    ['peach', 'peaches'],
    ['banana', 'bananas'],
    ['watermelon', 'watermelons'],
    ['melon', 'melons'],
    ['grape', 'grapes'],
    ['tomato', 'tomatoes'],
    ['cucumber', 'cucumbers'],
    ['carrot', 'carrots'],
    ['onion', 'onions'],
    ['potato', 'potatoes'],
    ['corn', 'corns'],
    ['egg', 'eggs'],
    ['eggplant', 'eggplants'],
    ['broccolo', 'broccoli'],
    ['bean', 'beans'],
    ['mushroom', 'mushrooms'],
    ['hippopotamus', 'hippopotamuses'],
    ['alligator', 'alligators'],
    ['crocodile', 'crocodiles'],
    ['camel', 'camels'],
    ['tiger', 'tigers'],
    ['bear', 'bears'],
    ['zebra', 'zebras'],
    ['pig', 'pigs'],
    ['wig', 'wigs'],
    ['cow', 'cows'],
    ['rabbit', 'rabbits'],
    ['bird', 'birds'],
    ['chicken', 'chickens'],
    ['chick', 'chicks'],
    ['frog', 'frogs'],
    ['note', 'notes'],
    ['notebook', 'notebooks'],
    ['camera', 'cameras'],
    ['sun', 'suns'],
    ['moon', 'moons'],
    ['star', 'stars'],
    ['heart', 'hearts'],
    ['stomach', 'stomachs'],
    ['elbow', 'elbows'],
    ['foot', 'feet'],
    ['hand', 'hands'],
    ['arm', 'arms'],
    ['leg', 'legs'],
    ['face', 'faces'],
    ['soda', 'sodas'],
    ['cake', 'cakes'],
    ['spoon', 'spoons'],
    ['fork', 'forks'],
    ['knife', 'knives'],
    ['chopstick', 'chopsticks'],
    ['napkin', 'napkins'],
    ['market', 'markets'],
    ['bank', 'banks'],
    ['person', 'people'],
    ['family', 'families'],
    ['history', 'histories'],
    ['music', 'musics'],
    ['theory', 'theories'],
    ['software', 'softwares'],
    ['society', 'societies'],
    ['thing', 'things'],
    ['paper', 'papers'],
    ['disease', 'diseases'],
    ['world', 'worlds'],
    ['log', 'logs'],
    ['square', 'squares'],
    ['circle', 'circles'],
    ['triangle', 'triangles'],
    ['hair', 'hairs'],
    ['baseball', 'baseballs'],
    ['bat', 'bats'],
    ['basketball', 'basketballs'],
    ['basket', 'baskets'],
    ['football', 'footballs'],
    ['backpack', 'backpacks'],
    ['document', 'documents'],
    ['folder', 'folders'],
    ['paint', 'paints'],
    ['paintbrush', 'paintbrushes'],
    ['glass', 'glasses'],
    ['scarf', 'scarves'],
    ['fly', 'flies'],
    ['butterfly', 'butterflies'],
    ['mosquito', 'mosquitos'],
    ['dragon', 'dragons'],
    ['unicorn', 'unicorns'],
    ['goat', 'goats'],
    ['sheep', 'sheep'],
    ['slime', 'slimes'],
    ['wizard', 'wizards'],
    ['fairy', 'fairies'],
    ['elf', 'elves'],
    ['shelf', 'shelves'],
    ['drawer', 'drawers'],
    ['closet', 'closets'],
    ['dirt', 'dirts'],
    ['candle', 'candles'],
    ['candy', 'candies'],
    ['water', 'waters'],
    ['bottle', 'bottles'],
    ['beer', 'beers'],
    ['wine', 'wines'],
    ['cough', 'coughs'],
    ['door', 'doors'],
    ['deer', 'deer'],
    ['trash', 'trashes'],
    ['dream', 'dreams'],
    ['hamburger', 'hamburgers'],
    ['cheeseburger', 'cheeseburgers'],
    ['cheese', 'cheeses'],
    ['injury', 'injuries'],
    ['hobby', 'hobbies'],
    ['heater', 'heaters'],
    ['air conditioner', 'air conditioners'],
    ['key', 'keys'],
    ['ring', 'rings'],
    ['king', 'kings'],
    ['queen', 'queens'],
    ['lizard', 'lizards'],
    ['kangaroo', 'kangaroos'],
    ['violin', 'violins'],
    ['flute', 'flutes'],
    ['xylophone', 'xylophones'],
    ['yo-yo', 'yo-yos'],
    ['island', 'islands'],
    ['ocean', 'oceans'],
    ['sea', 'seas'],
    ['pirate', 'pirates'],
    ['ninja', 'ninjas'],
    ['samurai', 'samurai'],
    ['continent', 'continents'],
    ['land', 'lands'],
    ['rainbow', 'rainbows'],
    ['snail', 'snails'],
    ['slug', 'slugs'],
    ['volcano', 'volcanoes'],
    ['worm', 'worms'],
    ['watch', 'watches'],
    ['igloo', 'igloos'],
    ['net', 'nets'],
    ['jet', 'jets'],
    ['hammer', 'hammers'],
    ['nail', 'nails'],
    ['screwdriver', 'screwdrivers'],
    ['screw', 'screws'],
    ['kite', 'kites'],
    ['feather', 'feathers'],
    ['bush', 'bushes'],
    ['leaf', 'leaves'],
    ['penguin', 'penguins'],
    ['bug', 'bugs'],
    ['doctor', 'doctors'],
    ['nurse', 'nurses'],
    ['office', 'offices'],
    ['crab', 'crabs'],
    ['turtle', 'turtles'],
    ['tortoise', 'tortoises'],
    ['keyboard', 'keyboards'],
    ['bag', 'bags'],
    ['wallet', 'wallets'],
    ['purse', 'purses'],
    ['pickpocket', 'pickpockets'],
    ['wheel', 'wheels'],
    ['card', 'cards'],
    ['medal', 'medals'],
    ['minister', 'ministers'],
    ['sign', 'signs'],
    ['intersection', 'intersections'],
    ['string', 'strings'],
    ['rope', 'ropes'],
    ['moustache', 'moustaches'],
    ['beard', 'beards'],
    ['scissor', 'scissors'],
    ['stapler', 'staplers'],
    ['glue', 'glues'],
    ['monster', 'monsters'],
    ['ghost', 'ghosts'],
    ['vampire', 'vampires'],
    ['werewolf', 'werewolves'],
    ['alien', 'aliens'],
    ['barbarian', 'barbarians'],
    ['viking', 'vikings'],
    ['guy', 'guys'],
    ['squid', 'squids'],
    ['grasshopper', 'grasshoppers'],
    ['cabinet', 'cabinets'],
    ['theater', 'theaters'],
    ['ship', 'ships'],
    ['rowboat', 'rowboats'],
    ['canoe', 'canoes'],
    ['pickle', 'pickles'],
    ['crown', 'crowns'],
    ['science', 'sciences'],
    ['scientist', 'scientists'],
    ['historian', 'historians'],
    ['anthropologist', 'anthropologists'],
    ['rollercoaster', 'rollercoasters'],
    ['text', 'texts'],
    ['textbook', 'textbooks'],
    ['milk', 'milks'],
    ['tooth', 'teeth'],
    ['toothbrush', 'toothbrushes'],
    ['toothpaste', 'toothpastes'],
    ['cactus', 'cacti'],
    ['dessert', 'desserts'],
    ['desert', 'deserts'],
    ['forest', 'forests'],
    ['cave', 'caves'],
    ['word', 'words'],
    ['sentence', 'sentences'],
    ['nose', 'noses'],
    ['ear', 'ears'],
    ['mouth', 'mouths'],
    ['article', 'articles'],
    ['dentist', 'dentists'],
    ['lollipop', 'lollipops'],
    ['ice cream', 'ice creams'],
    ['cookie', 'cookies'],
    ['jail', 'jails'],
    ['prison', 'prisons'],
    ['plant', 'plants'],
    ['pupil', 'pupils'],
    ['bookstore', 'bookstores'],
    ['librarian', 'librarians'],
    ['kitten', 'kittens'],
    ['puppy', 'puppies'],
    ['snake', 'snakes'],
    ['ladder', 'ladders'],
    ['calculator', 'calculators'],
    ['abacus', 'abaci'],
    ['speaker', 'speakers'],
    ['genius', 'geniuses'],
    ['horse', 'horses'],
    ['pony', 'ponies'],
    ['medicine', 'medicines'],
    ['medication', 'medications'],
    ['video', 'videos'],
    ['photo', 'photos'],
    ['photograph', 'photographs'],
    ['picture', 'pictures'],
    ['painting', 'paintings'],
    ['graph', 'graphs'],
    ['brick', 'bricks'],
    ['muscle', 'muscles'],
    ['room', 'rooms'],
    ['gift', 'gifts'],
    ['present', 'presents'],
    ['shop', 'shops'],
    ['stores', 'stores'],
    ['billboard', 'billboards'],
    ['bill', 'bills'],
    ['amoeba', 'amoebas'],
    ['rose', 'roses'],
    ['violet', 'violets'],
    ['sunflower', 'sunflowers'],
    ['lily', 'lilies'],
    ['daisy', 'daisies'],
    ['orchid', 'orchids'],
    ['tulip', 'tulips'],
    ['dandelion', 'dandelions'],
    ['screen', 'screens'],
    ['bookmark', 'bookmarks'],
    ['finger', 'fingers'],
    ['thumb', 'thumbs'],
    ['sound', 'sounds'],
    ['noise', 'noises'],
    ['puzzle', 'puzzles'],
    ['neck', 'necks'],
    ['ring', 'rings'],
    ['necklace', 'necklaces'],
    ['dude', 'dudes'],
    ['magic', 'magics'],
    ['statue', 'statues'],
    ['sculpture', 'sculptures'],
    ['dirt', 'dirts'],
    ['mud', 'muds'],
    ['marble', 'marbles'],
    ['stone', 'stones'],
    ['rock', 'rocks'],
    ['pebble', 'pebbles'],
    ['boulder', 'boulders'],
    ['sand', 'sands'],
    ['quicksand', 'quicksands'],
    ['bubble', 'bubbles'],
    ['treasure', 'treasures'],
    ['fan', 'fans'],
    ['lamp', 'lamps'],
    ['beach', 'beaches'],
    ['whale', 'whales'],
    ['dolphin', 'dolphins'],
    ['head', 'heads'],
    ['body', 'bodies'],
    ['headphone', 'headphones'],
    ['soup', 'soups'],
    ['salad', 'salads'],
    ['machine', 'machines'],
    ['flamingo', 'flamingos'],
    ['crowbar', 'crowbars'],
    ['saw', 'saws'],
    ['blade', 'blades'],
    ['remote', 'remotes'],
    ['controller', 'controllers'],
    ['war', 'wars'],
    ['battle', 'battles'],
    ['washing machine', 'washing machines'],
    ['drier', 'driers'],
    ['refrigerator', 'refrigerators'],
    ['fridge', 'fridges'],
    ['tray', 'trays'],
    ['bucket', 'buckets'],
    ['barrel', 'barrels'],
    ['cinderblock', 'cinderblocks'],
    ['elevator', 'elevators'],
    ['escalator', 'escalators'],
    ['pot', 'pots'],
    ['vase', 'vases'],
    ['jar', 'jars'],
    ['pan', 'pans'],
    ['bowl', 'bowls'],
    ['kettle', 'kettles'],
    ['teapot', 'teapots'],
    ['saucer', 'saucers'],
    ['map', 'maps'],
    ['diagram', 'diagrams'],
    ['gun', 'guns'],
    ['bath', 'baths'],
    ['bathtub', 'bathtubs'],
    ['bathroom', 'bathrooms'],
    ['restroom', 'restrooms'],
    ['toilet', 'toilets'],
    ['wall', 'walls'],
    ['ground', 'grounds'],
    ['wave', 'waves'],
    ['tsunami', 'tsunamis'],
    ['whirlpool', 'whirlpools'],
    ['pool', 'pools'],
    ['saxophone', 'saxophones'],
    ['forehead', 'foreheads'],
    ['tornado', 'tornadoes'],
    ['earthquake', 'earthquakes'],
    ['earth', 'earths'],
    ['shed', 'sheds'],
    ['shack', 'shacks'],
    ['gate', 'gates'],
    ['fox', 'foxes'],
    ['wolf', 'wolves'],
    ['mayonnaise', 'mayonnaises'],
    ['instrument', 'instruments'],
    ['net', 'nets'],
    ['crystal', 'crystals'],
    ['ostrich', 'ostriches'],
    ['fingerprint', 'fingerprints'],
    ['footprint', 'footprints'],
    ['wallpaper', 'wallpapers'],
    ['trumpet', 'trumpets'],
    ['horn', 'horns'],
    ['tuba', 'tubas'],
    ['oboe', 'oboes'],
    ['clarinet', 'clarinets'],
    ['harp', 'harps'],
    ['acid', 'acids'],
    ['powder', 'powders'],
    ['skeleton', 'skeletons'],
    ['bomb', 'bombs'],
    ['carpet', 'carpets'],
    ['park', 'parks'],
    ['pier', 'piers'],
    ['dock', 'docks'],
    ['beginner', 'beginners'],
    ['class', 'classes'],
    ['classroom', 'classrooms'],
    ['classmate', 'classmates'],
    ['cloud', 'clouds'],
    ['poster', 'posters'],
    ['receipt', 'receipts'],
    ['noodle', 'noodles'],
    ['error', 'errors'],
    ['inn', 'inns'],
    ['weapon', 'weapons'],
    ['armor', 'armors'],
    ['shovel', 'shovels'],
    ['cliff', 'cliffs'],
    ['bridge', 'bridges'],
    ['towel', 'towels'],
    ['cloth', 'cloths'],
    ['tissue', 'tissues'],
    ['wood', 'woods'],
    ['furnace', 'furnaces'],
    ['ponytail', 'ponytails'],
    ['afro', 'afros'],
    ['cigarette', 'cigarettes'],
    ['tobacco', 'tobaccos'],
    ['drug', 'drugs'],
    ['bee', 'bees'],
    ['honeybee', 'honeybees'],
    ['wasp', 'wasps'],
    ['balloon', 'balloons'],
    ['blimp', 'blimps'],
    ['zeppelin', 'zeppelins'],
    ['knight', 'knights'],
    ['price', 'prices'],
    ['cost', 'costs'],
    ['tax', 'taxes'],
    ['fee', 'fees'],
    ['salary', 'salaries'],
    ['pumpkin', 'pumpkins'],
    ['journal', 'journals'],
    ['kitchen', 'kitchens'],
    ['light', 'lights'],
    ['churro', 'churros'],
    ['flame', 'flames'],
    ['flashlight', 'flashlights'],
    ['thermometer', 'thermometers'],
    ['barn', 'barns'],
    ['farm', 'farms'],
    ['farmer', 'farmers'],
    ['seed', 'seeds'],
    ['game', 'games'],
    ['shell', 'shells'],
    ['pufferfish', 'pufferfish'],
    ['orchestra', 'orchestras'],
    ['way', 'ways'],
    ['year', 'years'],
    ['group', 'groups'],
    ['part', 'parts'],
    ['place', 'places'],
    ['week', 'weeks'],
    ['case', 'cases'],
    ['system', 'systems'],
    ['number', 'numbers'],
    ['letter', 'letters'],
    ['notepad', 'notepads'],
    ['point', 'points'],
    ['fact', 'facts'],
    ['demon', 'demons'],
    ['angel', 'angels'],
    ['tail', 'tails'],
    ['stair', 'stairs'],
    ['step', 'steps'],
    ['bannister', 'bannisters'],
    ['handrail', 'handrails'],
    ['rail', 'rails'],
    ['tower', 'towers'],
    ['cowboy', 'cowboys']
  ];

  const verbs_ditransitive = [
    ['gives', 'give', 'gave', 'given', 'giving'],
    ['gets', 'get', 'got', 'gotten', 'getting'],
    ['lends', 'lend', 'lent', 'lent', 'lending'],
    ['brings', 'bring', 'brought', 'brought', 'bringing'],
    ['passes', 'pass', 'passed', 'passed', 'passing'],
    ['reads', 'read', 'read', 'read', 'reading'],
    ['teaches', 'teach', 'taught', 'taught', 'teaching'],
    ['shows', 'show', 'showed', 'showed', 'showing'],
    ['throws', 'throw', 'threw', 'thrown', 'throwing'],
    ['sends', 'send', 'sent', 'sent', 'sending'],
    ['offers', 'offer', 'offered', 'offered', 'offering']
  ];
  
  const verbs_intransitive = [
    ['goes', 'go', 'went', 'gone', 'going'],
    ['comes', 'come', 'came', 'come', 'coming'],
    ['leaves', 'leave', 'left', 'left', 'leaving'],
    ['returns', 'return', 'returned', 'returned', 'returning'],
    ['dances', 'dance', 'danced', 'danced', 'dancing'],
    ['swims', 'swim', 'swam', 'swum', 'swimming'],
    ['jumps', 'jump', 'jumped', 'jumped', 'jumping'],
    ['sings', 'sing', 'sang', 'sung', 'singing'],
    ['falls', 'fall', 'fell', 'fallen', 'falling'],
    ['runs', 'run', 'ran', 'run', 'running'],
    ['sits', 'sit', 'sat', 'sat', 'sitting'],
    ['stands', 'stand', 'stood', 'stood', 'standing'],
    ['flies', 'fly', 'flew', 'flown', 'flying'],
    ['floats', 'float', 'floated', 'floated', 'floating'],
    ['complains', 'complain', 'complained', 'complained', 'complaining'],
    ['lives', 'live', 'lived', 'lived', 'living'],
    ['dies', 'die', 'died', 'died', 'dying'],
    ['laughs', 'laugh', 'laughed', 'laughed', 'laughing'],
    ['works', 'work', 'worked', 'worked', 'working'],
    ['plays', 'play', 'played', 'played', 'playing'],
    ['rests', 'rest', 'rested', 'rested', 'resting'],
    ['cries', 'cry', 'cried', 'cried', 'crying'],
    ['chirps', 'chirp', 'chirped', 'chirped', 'chirping'],
    ['thinks', 'think', 'thought', 'thought', 'thinking'],
    ['bounces', 'bounce', 'bounced', 'bounced', 'bouncing'],
    ['speaks', 'speak', 'spoke', 'spoken', 'speaking'],
    ['prays', 'pray', 'prayed', 'prayed', 'praying'],
    ['erupts', 'erupt', 'erupted', 'erupted', 'erupting'],
    ['swings', 'swing', 'swung', 'swung', 'swinging'],
    ['waltzes', 'waltz', 'waltzed', 'waltzed', 'waltzing'],
    ['walks', 'walk', 'walked', 'walked', 'walking'],
    ['awakens', 'awaken', 'awakened', 'awoken', 'awakening'],
    ['exercises', 'exercise', 'exercised', 'exercised', 'exercising'],
    ['talks', 'talk', 'talked', 'talked', 'talking'],
    ['moves', 'move', 'moved', 'moved', 'moving'],
    ['grows', 'grow', 'grew', 'grown', 'growing'],
    ['shrinks', 'shrink', 'shrank', 'shrunk', 'shrinking'],
    ['slips', 'slip', 'slipped', 'slipped', 'slipping'],
    ['screams', 'scream', 'screamed', 'screamed', 'screaming'],
    ['yells', 'yell', 'yelled', 'yelled', 'yelling'],
    ['speaks', 'speak', 'spoke', 'spoken', 'speaking'],
    ['coughs', 'cough', 'coughed', 'coughed', 'coughing'],
    ['exits', 'exit', 'exited', 'exited', 'exiting'],
    ['enters', 'enter', 'entered', 'entered', 'entering'],
    ['knits', 'knit', 'knitted', 'knitted', 'knitting'],
    ['occurs', 'occur', 'occurred', 'occurred', 'occurring'],
    ['sleeps', 'sleep', 'slept', 'slept', 'sleeping'],
    ['waits', 'wait', 'waited', 'waited', 'waiting'],
    ['cleans', 'clean', 'cleaned', 'cleaned', 'cleaning'],
    ['arrives', 'arrive', 'arrived', 'arrived', 'arriving'],
    ['explores', 'explore', 'explored', 'explored', 'exploring'],
    ['apologizes', 'apologize', 'apologized', 'apologized', 'apologizes'],
    ['sinks', 'sink', 'sunk', 'sunk', 'sinking'],
    ['ponders', 'ponder', 'pondered', 'pondered', 'pondering'],
    ['squirms', 'squirm', 'squirmed', 'squirmed', 'squirming'],
    ['rolls', 'roll', 'rolled', 'rolled', 'rolling'],
    ['scribbles', 'scribble', 'scribbled', 'scribbled', 'scribbling'],
    ['travels', 'travel', 'traveled', 'traveled', 'traveling'],
    ['relaxes', 'relax', 'relaxed', 'relaxed', 'relaxing'],
    ['studies', 'study', 'studied', 'studied', 'studying'],
    ['starts', 'start', 'started', 'started', 'starting'],
    ['stops', 'stop', 'stopped', 'stopped', 'stopping'],
    ['ends', 'end', 'ended', 'ended', 'ending'],
    ['breaks', 'break', 'broke', 'broken', 'breaking'],
    ['snaps', 'snap', 'snapped', 'snapped', 'snapping'],
    ['breathes', 'breathe', 'breathed', 'breathed', 'breathing'],
    ['sighs', 'sigh', 'sighed', 'sighed', 'sighing'],
    ['shakes', 'shake', 'shook', 'shook', 'shaking'],
    ['flexes', 'flex', 'flexed', 'flexed', 'flexing'],
    ['squelches', 'squelch', 'squelched', 'squelched', 'squelching'],
    ['dissolves', 'dissolve', 'dissolved', 'dissolved', 'dissolving'],
    ['disintegrates', 'disintegrate', 'disintegrated', 'disintegrated', 'disintegrating'],
    ['melts', 'melt', 'melted', 'melted', 'melting'],
    ['rises', 'rise', 'rose', 'risen', 'rising'],
    ['wiggles', 'wiggle', 'wiggled', 'wiggled', 'wiggling'],
    ['lies', 'lie', 'lay', 'lain', 'lieing'],
    ['rotates', 'rotate', 'rotated', 'rotated', 'rotating'],
    ['revolves', 'revolve', 'revolved', 'revolved', 'revolving'],
    ['begins', 'begin', 'began', 'begun', 'beginning'],
    ['happens', 'happen', 'happened', 'happened', 'happening'],
    ['changes', 'change', 'changed', 'changed', 'changing'],
    ['wins', 'win', 'won', 'won', 'winning'],
    ['loses', 'lose', 'lost', 'lost', 'losing'],
    ['stays', 'stay', 'stayed', 'stayed', 'staying'],
    ['remains', 'remain', 'remained', 'remained', 'remaining'],
    ['rings', 'ring', 'rung', 'rung', 'ringing'],
    ['writes', 'write', 'wrote', 'written', 'writing'],
    ['fights', 'fight', 'fought', 'fought', 'fighting']
  ];


  const verbs_palinking = [
    ['feels', 'feel', 'felt', 'felt', 'feeling'],
    ['seems', 'seem', 'seemed', 'seemed', 'seeming'],
    ['looks', 'look', 'looked', 'looked', 'looking'],
    ['smells', 'smell', 'smelled', 'smelled', 'smelling'],
    ['sounds', 'sound', 'sounded', 'sounded', 'sounding'],
    ['tastes', 'taste', 'tasted', 'tasted', 'tasting'],
    ['acts', 'act', 'acted', 'acted', 'acting'],
    ['appears', 'appear', 'appeared', 'appeared', 'appearing'],
    ['becomes', 'become', 'became', 'become', 'becoming'],
    ['gets', 'get', 'got', 'gotten', 'getting'],
    ['goes', 'go', 'went', 'gone', 'going'],
    ['grows', 'grow', 'grew', 'grown', 'growing'],
    ['proves', 'prove', 'proved', 'proved', 'proving'],
    ['remains', 'remain', 'remained', 'remained', 'remaining'],
    ['stays', 'stay', 'stayed', 'stayed', 'staying'],
    ['turns', 'turn', 'turned', 'turned', 'turning']
  ];
  

  const verbs_pnlinking = [
    ['becomes', 'become', 'became', 'become', 'becoming'],
    ['resembles', 'resemble', 'resembled', 'resembled', 'resembling']
  ];
  
  
const verbs_transitive = [
    ['opens', 'open', 'opened', 'opened', 'opening'],
    ['closes', 'close', 'closed', 'closed', 'closing'],
    ['gets', 'get', 'got', 'gotten', 'getting'],
    ['receives', 'receive', 'received', 'received', 'receiving'],
    ['accepts', 'accept', 'accepted', 'accepted', 'accepting'],
    ['gives', 'give', 'gave', 'given', 'giving'],
    ['brings', 'bring', 'brought', 'brought', 'bringing'],
    ['takes', 'take', 'took', 'taken', 'taking'],
    ['catches', 'catch', 'fcaught', 'caught', 'catching'],
    ['throws', 'throw', 'threw', 'thrown', 'throwing'],
    ['breaks', 'break', 'broke', 'broken', 'breaking'],
    ['studies', 'study', 'studied', 'studied', 'studying'],
    ['fixes', 'fix', 'fixed', 'fixed', 'fixing'],
    ['makes', 'make', 'made', 'made', 'making'],
    ['creates', 'create', 'created', 'created', 'creating'],
    ['builds', 'build', 'built', 'built', 'building'],
    ['needs', 'need', 'needed', 'needed', 'needing'],
    ['uses', 'use', 'used', 'used', 'using'],
    ['tries', 'try', 'tried', 'tried', 'trying'],
    ['wants', 'want', 'wanted', 'wanted', 'wanting'],
    ['enjoys', 'enjoy', 'enjoyed', 'enjoyed', 'enjoying'],
    ['buys', 'buy', 'bought', 'bought', 'buying'],
    ['sells', 'sell', 'sold', 'sold', 'selling'],
    ['steals', 'steal', 'stole', 'stolen', 'stealing'],
    ['donates', 'donate', 'donated', 'donated', 'donating'],
    ['eats', 'eat', 'ate', 'eaten', 'eating'],
    ['drinks', 'drink', 'drank', 'drunk', 'drinking'],
    ['likes', 'like', 'liked', 'liked', 'liking'],
    ['dislikes', 'dislike', 'disliked', 'disliked', 'disliking'],
    ['loves', 'love', 'loved', 'loved', 'loving'],
    ['hates', 'hate', 'hated', 'hated', 'hating'],
    ['knows', 'know', 'knew', 'known', 'knowing'],
    ['calls', 'call', 'called', 'called', 'calling'],
    ['takes', 'take', 'took', 'taken', 'taking'],
    ['finds', 'find', 'found', 'found', 'finding'],
    ['has', 'have', 'had', 'had', 'having'],
    ['sprays', 'spray', 'sprayed', 'sprayed', 'spraying'],
    ['announces', 'announce', 'announced', 'announced', 'announcing'],
    ['calms', 'calm', 'calmed', 'calmed', 'calming'],
    ['fills', 'fill', 'filled', 'filled', 'filling'],
    ['reads', 'read', 'read', 'read', 'reading'],
    ['writes', 'write', 'wrote', 'wrote', 'writing'],
    ['cooks', 'cook', 'cooked', 'cooked', 'cooking'],
    ['teaches', 'teach', 'taught', 'taught', 'teaching'],
    ['says', 'say', 'said', 'said', 'saying'],
    ['does', 'do', 'did', 'done', 'doing'],
    ['sees', 'see', 'saw', 'seen', 'seeing'],
    ['puts', 'put', 'put', 'put', 'putting'],
    ['keeps', 'keep', 'kept', 'kept', 'keeping'],
    ['meets', 'meet', 'met', 'met', 'meeting'],
    ['loses', 'lose', 'lost', 'lost', 'losing'],
    ['wins', 'win', 'won', 'won', 'winning'],
    ['follows', 'follow', 'followed', 'followed', 'following'],
    ['dodges', 'dodge', 'dodged', 'dodged', 'dodging'],
    ['knits', 'knit', 'knitted', 'knitted', 'knitting'],
    ['memorizes', 'memorize', 'memorized', 'memorized', 'memorizing'],
    ['watches', 'watch', 'watched', 'watched', 'watching'],
    ['understands', 'understand', 'understood', 'understood', 'understanding'],
    ['recognizes', 'recognize', 'recognized', 'recognized', 'recognizing'],
    ['rescues', 'rescue', 'rescued', 'rescued', 'rescuing'],
    ['saves', 'save', 'saved', 'saved', 'saving'],
    ['accumulates', 'accumulate', 'accumulated', 'accumulated', 'accumulating'],
    ['includes', 'include', 'included', 'included', 'including'],
    ['sends', 'send', 'sent', 'sent', 'sending'],
    ['cleans', 'clean', 'cleaned', 'cleaned', 'cleaning'],
    ['lifts', 'lift', 'lifted', 'lifted', 'lifting'],
    ['drops', 'drop', 'dropped', 'dropped', 'dropping'],
    ['forgives', 'forgive', 'forgave', 'forgiven', 'forgiving'],
    ['publishes', 'publish', 'published', 'published', 'publishing'],
    ['uses', 'use', 'used', 'used', 'using'],
    ['deletes', 'delete', 'deleted', 'deleted', 'deleting'],
    ['erases', 'erase', 'erased', 'erased', 'erasing'],
    ['plants', 'plant', 'planted', 'planted', 'planting'],
    ['shows', 'show', 'showed', 'showed', 'showing'],
    ['raises', 'raise', 'raised', 'raised', 'raising'],
    ['lowers', 'lower', 'lowered', 'lowered', 'lowering'],
    ['launches', 'launch', 'launched', 'launched', 'launching'],
    ['praises', 'praise', 'praised', 'praised', 'praising'],
    ['arrests', 'arrest', 'arrested', 'arresed', 'arresting'],
    ['spills', 'spill', 'spilled', 'spilled', 'spilling'],
    ['hunts', 'hunt', 'hunted', 'hunted', 'hunting'],
    ['studies', 'study', 'studied', 'studied', 'studying'],
    ['bites', 'bite', 'bit', 'bitten', 'biting'],
    ['licks', 'lick', 'licked', 'licked', 'licking'],
    ['chews', 'chew', 'chewed', 'chewed', 'chewing'],
    ['breaks', 'break', 'broke', 'broken', 'breaking'],
    ['snaps', 'snap', 'snapped', 'snapped', 'snapping'],
    ['scratches', 'scratch', 'scratched', 'scratched', 'scratching'],
    ['surprises', 'surprise', 'surprised', 'surprised', 'surprising'],
    ['waters', 'water', 'watered', 'watered', 'watering'],
    ['wears', 'wear', 'wore', 'worn', 'wearing'],
    ['rips', 'rip', 'ripped', 'ripped', 'ripping'],
    ['tears', 'tear', 'tore', 'torn', 'tearing'],
    ['plucks', 'pluck', 'plucked', 'plucked', 'plucking'],
    ['joins', 'join', 'joined', 'joined', 'joining'],
    ['fights', 'fight', 'fought', 'fought', 'fighting'],
    ['battles', 'battle', 'battled', 'battled', 'battling'],
    ['shakes', 'shake', 'shook', 'shook', 'shaking'],
    ['squeezes', 'squeeze', 'squeezed', 'squeezed', 'squeezing'],
    ['secretes', 'secrete', 'secreted', 'secreted', 'secreting'],
    ['obeys', 'obey', 'obeyed', 'obeyed', 'obeying'],
    ['starts', 'start', 'started', 'started', 'starting'],
    ['stops', 'stop', 'stopped', 'stopped', 'stopping'],
    ['lays', 'lay', 'laid', 'laid', 'laying'],
    ['turns', 'turn', 'turned', 'turned', 'turning'],
    ['rotates', 'rotate', 'rotated', 'rotated', 'rotating'],
    ['feels', 'feel', 'felt', 'felt', 'feeling'],
    ['leaves', 'leave', 'left', 'left', 'leaving'],
    ['believes', 'believe', 'believed', 'believed', 'believing'],
    ['adds', 'add', 'added', 'added', 'adding'],
    ['grows', 'grow', 'grew', 'grown', 'growing'],
    ['remembers', 'remember', 'remembered', 'remembered', 'remembering'],
    ['serves', 'serve', 'served', 'served', 'serving'],
    ['kills', 'kill', 'killed', 'killed', 'killing'],
    ['reaches', 'reach', 'reached', 'reached', 'reaching'],
    ['requires', 'require', 'required', 'required', 'requiring'],
    ['pulls', 'pull', 'pulled', 'pulled', 'pulling'],
    ['pushes', 'push', 'pushed', 'pushed', 'pushing'],
    ['draws', 'draw', 'drew', 'drawn', 'drawing'],
    ['disturbs', 'disturb', 'disturbed', 'disturbed', 'disturbing']
  ];
  



const pronouns = [
  ['I', 'we', 'he', 'she', 'it', 'they', 'you'],
  ['me', 'us', 'him', 'her', 'it', 'them', 'you'],
  ['my', 'our', 'his', 'her', 'its', 'their', 'your']
];

const verbs = {
  INTRANSITIVE: verbs_intransitive,
  TRANSITIVE: verbs_transitive,
  DITRANSITIVE: verbs_ditransitive,
  NOUN_LINKING: verbs_pnlinking,
  ADJECTIVE_LINKING: verbs_palinking,
  BE: [['am', 'is', 'are', 'was', 'were', 'be', 'being', 'been']]
};

const adverbs = {
  MANNER: adverbs_manner,
  TIME: adverbs_time,
  PLACE: adverbs_place,
  FREQUENCY: adverbs_frequency,
  DEGREE: adverbs_degree
};

const prepositions = [
  'aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'among',
  'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside',
  'between', 'beyond', 'but', 'by', 'despite', 'down', 'during', 'except',
  'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on',
  'out', 'outside', 'over', 'past', 'since', 'through', 'throughout', 'to',
  'toward', 'under', 'underneath', 'until', 'up', 'upon', 'with', 'within',
  'without'
];

const conjunctions = {
  COORDINATING: ['and', 'or', 'but'],
  SUBORDINATING: conjunctions_subordinating
};

document.querySelector("#random-sentence-generator-button").addEventListener("click", () => {
  document.querySelector("#sentence").textContent = new Sentence();
});
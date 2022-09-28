interface Definitions {
  definition: string;
  example: string;
  synonyms: Array<string>;
  antonyms: Array<string>;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Array<Definitions>;
}

interface Phonetic {
  text: string;
  audio?: string;
}

export interface WordDetail {
  word: string;
  phonetic: string;
  phonetics: Array<Phonetic>;
  origin?: string;
  meanings: Array<Meaning>;
  sourceUrls?: Array<string>;
}

export interface WordDetailError {
  title: string;
  message: string;
  resolution: string;
}

export interface RandomWord {
  word: string;
  definition: string;
  pronunciation: string;
}

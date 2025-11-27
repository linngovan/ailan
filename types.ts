
export enum AppMode {
  Translate = 'TRANSLATE',
  Grammar = 'GRAMMAR',
  WordMeaning = 'WORD_MEANING',
}

export type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

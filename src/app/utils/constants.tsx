export const genderParse = {
    male: 'Homem',
    female: 'Mulher'
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fingerParse = {
    thumb: 'Polegar',
    index: 'Indicador',
    middle: 'Médio',
    ring: 'Anelar',
    pinky: 'Mínimo'
  };

export enum HandEnum {
  LEFT = 'left',
  RIGHT = 'right'
}

export enum FingerEnum {
  THUMB = 'THUMB',
  INDEX = 'INDEX',
  MIDDLE = 'MIDDLE',
  RING = 'RING',
  PINKY = 'PINKY'
}

export type HandKey = 'leftHand' | 'rightHand';
export type FingerKey = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export const enumToFingerKey: Record<FingerEnum, FingerKey> = {
  [FingerEnum.THUMB]: 'thumb',
  [FingerEnum.INDEX]: 'index',
  [FingerEnum.MIDDLE]: 'middle',
  [FingerEnum.RING]: 'ring',
  [FingerEnum.PINKY]: 'pinky'
};

export const enumToHandKey: Record<HandEnum, HandKey> = {
  [HandEnum.LEFT]: 'leftHand',
  [HandEnum.RIGHT]: 'rightHand'
};


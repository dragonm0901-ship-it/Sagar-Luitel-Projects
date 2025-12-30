
export enum Language {
  EN = 'EN',
  NE = 'NE'
}

export enum VotingStage {
  LANDING = 'LANDING',
  VERIFY = 'VERIFY',
  OTP = 'OTP',
  BALLOT = 'BALLOT',
  CONFIRMING = 'CONFIRMING',
  SUCCESS = 'SUCCESS',
  RESULTS = 'RESULTS',
  AUDIT_LOG = 'AUDIT_LOG',
  DETAIL_IDENTIFY = 'DETAIL_IDENTIFY',
  DETAIL_AUTHENTICATE = 'DETAIL_AUTHENTICATE',
  DETAIL_VOTE = 'DETAIL_VOTE',
  DETAIL_SECURE = 'DETAIL_SECURE'
}

export interface PoliticalParty {
  id: string;
  nameEn: string;
  nameNe: string;
  symbol: string;
  color: string;
  descriptionEn: string;
  descriptionNe: string;
}

export interface ProvinceData {
  name: string;
  turnout: number;
  votes: number;
}

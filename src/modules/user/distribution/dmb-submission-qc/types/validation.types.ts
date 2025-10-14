export enum ValidationStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  WARNING = 'warning',
}

export interface ValidationItem {
  field: string;
  status: ValidationStatus;
  message: string;
  required: boolean;
}

export interface TrackValidation {
  trackId: string;
  trackNumber: string;
  trackIsrc: string;
  trackGrid: string;
  trackTitle: string;
  trackVersion: string | null;
  trackArtistName: string;
  validationItems: ValidationItem[];
  isValid: boolean;
}

export interface DiscTracks {
  discNumber: string;
  tracks: TrackValidation[];
}

export interface AlbumValidationResult {
  isValid: boolean;
  albumId: string;
  albumTitle: string;
  albumVersion: string | null;
  albumArtistName: string;
  albumEan: string | null;
  albumUpc: string | null;
  albumGrid: string;
  albumArticleNumber: string | null;
  albumValidationItems: ValidationItem[];
  discs: DiscTracks[];
  summary: {
    album: {
      totalChecks: number;
      passed: number;
      failed: number;
      warnings: number;
    };
    tracks: {
      totalTracks: number;
      validTracks: number;
      invalidTracks: number;
      totalChecks: number;
      passed: number;
      failed: number;
      warnings: number;
    };
    overall: {
      isValid: boolean;
      totalChecks: number;
      passed: number;
      failed: number;
      warnings: number;
    };
  };
}

export interface ValidationApiResponse {
  success: boolean;
  data: AlbumValidationResult;
}

/**
 * Types for WordPress Gravity Forms submission
 * Maps to backend DTOs in wordpress-release-submission.dto.ts
 */

/**
 * Track change for WordPress submission
 * Represents a single track that needs title/version correction
 */
export interface WordPressTrackChange {
  /** DMB Track ID (more reliable than ISRC which can be null) */
  trackId: string;
  /** New title for the track (if capitalization override is enabled) */
  newTitle?: string;
  /** New version for the track (if capitalization override is enabled) */
  newVersion?: string;
}

/**
 * Request payload for submitting a release to WordPress
 * Only requires productCode - backend fetches other data from DMB and user context
 */
export interface SubmitReleaseToWordPressRequest {
  /** Product code (EAN/UPC) - 12 or 13 digit number */
  productCode: string;
  /** New album title (only if capitalization override is enabled) */
  newAlbumTitle?: string;
  /** New album version (only if capitalization override is enabled) */
  newAlbumVersion?: string;
  /** Track changes (only tracks with capitalization overrides) */
  trackChanges?: WordPressTrackChange[];
}

/**
 * Response from WordPress submission
 * Contains entry ID and URL to view in WordPress admin
 */
export interface WordPressSubmissionResponse {
  /** WordPress Gravity Forms entry ID */
  entryId: number;
  /** Product code that was submitted */
  productCode: string;
  /** Release title from DMB */
  releaseTitle: string;
  /** Timestamp when the submission was created */
  submittedAt: string;
  /** URL to view the entry in WordPress admin panel */
  gravityFormsUrl?: string;
}

/**
 * Error response when duplicate EAN is found
 * Backend throws BadRequestException with this structure
 */
export interface WordPressDuplicateEANError {
  message: string;
  existingEntryId: number;
  existingEntryUrl: string;
}

/**
 * Error response when release is not ready for QC
 * Backend throws BadRequestException with this structure
 */
export interface WordPressValidationError {
  message: string;
  failedChecks: Array<{
    field: string;
    message: string;
  }>;
  summary: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
  };
}

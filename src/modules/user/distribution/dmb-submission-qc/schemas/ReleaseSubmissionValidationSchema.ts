import * as yup from 'yup';

/**
 * Track schema for editable track information
 */
const TrackSchema = yup.object().shape({
  trackId: yup.string().required(), // DMB Track ID - used for WordPress submission
  trackIsrc: yup.string().nullable().optional(), // ISRC code (can be null in DMB)
  trackTitle: yup.string().required(),
  trackVersion: yup.string().nullable().optional(),
  overrideTrackTitleCapitalization: yup.boolean().optional().default(false),
  overrideTrackVersionCapitalization: yup.boolean().optional().default(false),
});

/**
 * Validation schema for Release Submission for Review using Yup
 */
export const ReleaseSubmissionValidationSchema = yup.object().shape({
  // User input - Product code for validation
  upc: yup
    .string()
    .required('UPC/EAN/GTIN-13 is required')
    .matches(/^\d{12,13}$/, 'UPC must be a 12 or 13 digit number'),

  // Auto-filled from API (read-only)
  albumId: yup.string().optional(),
  albumGrid: yup.string().optional(),
  albumArticleNumber: yup.string().nullable().optional(),
  albumArtist: yup.string().optional(), // Read-only

  // Editable fields from API with optional capitalization override
  albumTitle: yup
    .string()
    .required('Album title is required')
    .max(200, 'Album title must not exceed 200 characters'),
  albumVersion: yup
    .string()
    .nullable()
    .max(100, 'Album version must not exceed 100 characters')
    .optional(),

  // Capitalization override flags (only for title and version)
  overrideAlbumTitleCapitalization: yup.boolean().optional().default(false),
  overrideAlbumVersionCapitalization: yup.boolean().optional().default(false),

  // Tracks with editable titles and versions
  tracks: yup.array().of(TrackSchema).optional().default([]),

  // Validation state - used to control Submit button
  isReleaseValid: yup.boolean().optional().default(false),
});

export type ReleaseSubmissionFormData = yup.InferType<typeof ReleaseSubmissionValidationSchema>;

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFormContext } from 'react-hook-form';
import { DiscTracks } from '../../types/validation.types';
import ValidationItem from '../molecules/ValidationItem';
import EditableFieldWithCapitalization from '../molecules/EditableFieldWithCapitalization';

interface TrackAccordionProps {
  discs: DiscTracks[];
}

const TrackAccordion: React.FC<TrackAccordionProps> = ({ discs }) => {
  const { watch } = useFormContext();

  // Get track title from form to show in header (if edited)
  const getTrackTitle = (trackId: string, defaultTitle: string, defaultVersion: string | null) => {
    const tracks = watch('tracks') || [];
    const formTrack = tracks.find((t: any) => t.trackId === trackId);

    const title = formTrack?.trackTitle || defaultTitle;
    const version = formTrack?.trackVersion || defaultVersion;

    return version ? `${title} (${version})` : title;
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Tracks Validation
      </Typography>

      {discs.map((disc) => (
        <Box key={disc.discNumber}>
          {disc.tracks.map((track, trackIndex) => {
            // Generate field names for this specific track
            const trackFieldPrefix = `tracks.${discs.slice(0, discs.indexOf(disc)).reduce((acc, d) => acc + d.tracks.length, 0) + trackIndex}`;

            return (
              <Accordion key={track.trackId}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography sx={{ fontWeight: 500, minWidth: 150 }}>
                      Disc N°{disc.discNumber} / Track N°{track.trackNumber}
                    </Typography>
                    <Typography sx={{ flexGrow: 1 }}>
                      {getTrackTitle(track.trackId, track.trackTitle, track.trackVersion)}
                    </Typography>
                    <Chip
                      label={track.isValid ? 'PASSED' : 'ERROR'}
                      color={track.isValid ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Track Information */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Track Information
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Track ID:</strong> {track.trackId}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>ISRC:</strong> {track.trackIsrc || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>GRID:</strong> {track.trackGrid || 'N/A'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Artist:</strong> {track.trackArtistName}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Editable Track Title and Version */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Editable Track Information
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <EditableFieldWithCapitalization
                          name={`${trackFieldPrefix}.trackTitle`}
                          overrideName={`${trackFieldPrefix}.overrideTrackTitleCapitalization`}
                          label="Track Title"
                          placeholder="Enter track title"
                          required
                        />

                        {track.trackVersion && (
                          <EditableFieldWithCapitalization
                            name={`${trackFieldPrefix}.trackVersion`}
                            overrideName={`${trackFieldPrefix}.overrideTrackVersionCapitalization`}
                            label="Track Version"
                            placeholder="Enter track version"
                          />
                        )}
                      </Box>
                    </Box>

                    <Divider />

                    {/* Validation Items */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Validation Checks
                      </Typography>
                      <Box sx={{ pl: 2 }}>
                        {track.validationItems.map((item, index) => (
                          <ValidationItem key={`${track.trackId}-${index}`} item={item} />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default TrackAccordion;

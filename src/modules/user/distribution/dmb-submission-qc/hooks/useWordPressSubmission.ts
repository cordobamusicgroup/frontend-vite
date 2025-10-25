import { useMutation } from '@tanstack/react-query';
import { apiRoutes } from '@/routes/api.routes';
import { useApiRequest } from '@/hooks/useApiRequest';
import {
  SubmitReleaseToWordPressRequest,
  WordPressSubmissionResponse,
} from '../types/wordpress-submission.types';

/**
 * Hook for submitting releases to WordPress Gravity Forms (legacy system)
 *
 * This hook handles the submission of DMB releases to the legacy WordPress system
 * for the QC workflow. It automatically:
 * - Validates the release is ready for QC
 * - Fetches release details from DMB
 * - Submits to WordPress Gravity Forms (Form ID 91)
 * - Returns entry ID and admin URL
 *
 * @returns Mutation hook with submit function and state
 */
export function useWordPressSubmission() {
  const { apiRequest } = useApiRequest();

  return useMutation<
    WordPressSubmissionResponse,
    Error,
    SubmitReleaseToWordPressRequest
  >({
    mutationFn: async (data: SubmitReleaseToWordPressRequest) => {
      const response = await apiRequest<WordPressSubmissionResponse>({
        method: 'post',
        url: apiRoutes.external.wordpress.submitRelease,
        data,
      });

      return response;
    },
  });
}

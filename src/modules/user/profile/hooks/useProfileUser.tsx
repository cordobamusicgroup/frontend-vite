import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiRequest } from '@/hooks/useApiRequest';
import { apiRoutes } from '@/lib/api.routes';
import { formatError } from '@/lib/formatApiError.util';

/**
 * Hook to manage fetching and downloading reports for a user.
 *
 * @param {string} distributor - Distributor identifier.
 * @returns {object} Object with data, loading/error states, and mutation functions.
 */
export const useProfileUser = () => {
  const { apiRequest } = useApiRequest();
  const queryClient = useQueryClient();

  // Query key for fetching reports
  const queryKey = ['profile'];

  /**
   * Function to fetch current reports for a distributor.
   */
  const fetchCurrentUser = async () => {
    try {
      const url = apiRoutes.users.getCurrent;
      return await apiRequest({
        url,
        method: 'get',
        requireAuth: true,
      });
    } catch (error) {
      throw formatError(error);
    }
  };

  const query = useQuery({
    queryKey,
    queryFn: fetchCurrentUser,
    retry: false,
  });

  /**
   * Mutation to download a report by its ID.
   */
  const editProfile = useMutation({
    mutationFn: async (updateUserPayload: Record<string, any>) => {
      try {
        const url = apiRoutes.users.editProfile;
        const response = await apiRequest({
          url,
          method: 'patch',
          requireAuth: true,
          data: updateUserPayload,
        });
        return response;
      } catch (error) {
        throw formatError(error);
      }
    },
    onSuccess: () => {
      // Invalidate queries to ensure updated data is fetched
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    profileData: query.data,

    loading: {
      profileFetchLoading: query.isPending,
      profileEditLoading: editProfile.isPending,
    },

    error: {
      profileFetchError: query.error,
      profileEditError: editProfile.error,
    },

    mutations: {
      editProfile,
    },
  };
};
/**
 * Hook to manage fetching and editing the current user's profile.
 *
 * @returns Object with profile data, loading/error states, and mutation for editing the profile
 */

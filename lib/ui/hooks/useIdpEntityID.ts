import useSWR from 'swr';
import type { ApiError, ApiSuccess } from 'types';
import { fetcher } from '@lib/ui/utils';

const useIdpEntityID = (setupLinkToken: string) => {
  const url = setupLinkToken ? `/api/setup/${setupLinkToken}/sso-connection/idp-entityid` : null;

  const { data, error, isLoading } = useSWR<ApiSuccess<{ idpEntityID: string }>, ApiError>(url, fetcher);

  return {
    idpEntityID: data?.data.idpEntityID,
    isLoading,
    error,
  };
};

export default useIdpEntityID;

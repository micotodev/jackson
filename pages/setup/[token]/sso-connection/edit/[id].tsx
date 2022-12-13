import type { NextPage, GetServerSidePropsContext, GetStaticPaths } from 'next';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetcher } from '@lib/ui/utils';
import Edit from '@components/connection/Edit';

const EditConnection: NextPage = () => {
  const router = useRouter();

  const { id, token } = router.query;
  const { data: setup } = useSWR<any>(token ? `/api/setup/${token}` : null, fetcher, {
    revalidateOnFocus: false,
  });
  const { data: connection, error } = useSWR(
    token ? (id ? `/api/setup/${token}/connections/${id}` : null) : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (error) {
    return (
      <div className='rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
        {error.info ? JSON.stringify(error.info) : error.status}
      </div>
    );
  }

  if (!connection) {
    return null;
  }

  return (
    <Edit
      connection={connection}
      setup={{
        ...setup,
        token,
      }}
    />
  );
};

export default EditConnection;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
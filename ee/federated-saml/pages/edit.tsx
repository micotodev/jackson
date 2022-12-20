import type { NextPage } from 'next';
import type { SAMLFederationApp } from '@boxyhq/saml-jackson';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { fetcher } from '@lib/ui/utils';
import Loading from '@components/Loading';
import LicenseRequired from '@components/LicenseRequired';
import { errorToast, successToast } from '@components/Toast';
import ConfirmationModal from '@components/ConfirmationModal';
import type { ApiError, ApiResponse, ApiSuccess } from 'types';

const UpdateApp: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [app, setApp] = useState<SAMLFederationApp>({
    id: '',
    name: '',
    tenant: '',
    product: '',
    acsUrl: '',
    entityId: '',
  });

  const { id } = router.query as { id: string };

  const { data, error } = useSWR<ApiSuccess<SAMLFederationApp>, ApiError>(
    `/api/admin/federated-saml/${id}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (data) {
      setApp(data.data);
    }
  }, [data]);

  if (error) {
    errorToast(error.message);
    return null;
  }

  if (!data) {
    return <Loading />;
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    const rawResponse = await fetch(`/api/admin/federated-saml/${app.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(app),
    });

    setLoading(false);

    const response: ApiResponse<SAMLFederationApp> = await rawResponse.json();

    if ('error' in response) {
      errorToast(response.error.message);
      return;
    }

    if ('data' in response) {
      successToast(t('saml_federation_update_success'));
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.target as HTMLInputElement;

    setApp({
      ...app,
      [target.id]: target.value,
    });
  };

  return (
    <LicenseRequired>
      <Link href='/admin/federated-saml' className='btn-outline btn items-center space-x-2'>
        <ArrowLeftIcon aria-hidden className='h-4 w-4' />
        <span>{t('back')}</span>
      </Link>
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='mt-5 font-bold text-gray-700 md:text-xl'>{t('saml_federation_update_app')}</h2>
        <div>
          <Link href={'/.well-known/idp-configuration'} target='_blank' className='btn-secondary btn m-2'>
            {t('view_idp_configuration')}
          </Link>
        </div>
      </div>
      <div className='rounded border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
        <form onSubmit={onSubmit}>
          <div className='flex flex-col space-y-3'>
            <div className='form-control w-full md:w-1/2'>
              <label className='label'>
                <span className='label-text'>{t('tenant')}</span>
              </label>
              <input type='text' className='input-bordered input' defaultValue={app.tenant} disabled />
            </div>
            <div className='form-control w-full md:w-1/2'>
              <label className='label'>
                <span className='label-text'>{t('product')}</span>
              </label>
              <input type='text' className='input-bordered input' defaultValue={app.product} disabled />
            </div>
            <div className='form-control w-full md:w-1/2'>
              <label className='label'>
                <span className='label-text'>{t('name')}</span>
              </label>
              <input
                type='text'
                id='name'
                className='input-bordered input'
                required
                onChange={onChange}
                value={app.name}
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>{t('acs_url')}</span>
              </label>
              <input
                type='url'
                id='acsUrl'
                className='input-bordered input'
                required
                onChange={onChange}
                value={app.acsUrl}
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>{t('entity_id')}</span>
              </label>
              <input
                type='url'
                id='entityId'
                className='input-bordered input'
                required
                onChange={onChange}
                value={app.entityId}
              />
            </div>
            <div>
              <button className={classNames('btn-primary btn', loading ? 'loading' : '')}>
                {t('save_changes')}
              </button>
            </div>
          </div>
        </form>
      </div>
      <DeleteApp app={app} />
    </LicenseRequired>
  );
};

export const DeleteApp = ({ app }: { app: SAMLFederationApp }) => {
  const { t } = useTranslation('common');
  const [delModalVisible, setDelModalVisible] = useState(false);

  const deleteApp = async () => {
    const rawResponse = await fetch(`/api/admin/federated-saml/${app.id}`, {
      method: 'DELETE',
    });

    const response: ApiResponse<unknown> = await rawResponse.json();

    if ('error' in response) {
      errorToast(response.error.message);
      return;
    }

    if ('data' in response) {
      successToast(t('saml_federation_delete_success'));
      window.location.href = '/admin/federated-saml';
    }
  };

  return (
    <>
      <section className='mt-5 flex items-center rounded bg-red-100 p-6 text-red-900'>
        <div className='flex-1'>
          <h6 className='mb-1 font-medium'>{t('delete_this_saml_federation_app')}</h6>
          <p className='font-light'>{t('all_your_apps_using_this_connection_will_stop_working')}</p>
        </div>
        <button
          type='button'
          className='btn-error btn'
          data-modal-toggle='popup-modal'
          onClick={() => {
            setDelModalVisible(true);
          }}>
          Delete
        </button>
      </section>
      <ConfirmationModal
        title={t('delete_the_saml_federation_app')}
        description={t('confirmation_modal_description')}
        visible={delModalVisible}
        onConfirm={deleteApp}
        onCancel={() => {
          setDelModalVisible(false);
        }}
      />
    </>
  );
};

export default UpdateApp;
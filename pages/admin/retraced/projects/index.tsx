import type { NextPage } from 'next';
import useSWR from 'swr';
import Link from 'next/link';
import { InformationCircleIcon, DocumentSearchIcon } from '@heroicons/react/outline';

import type { ApiResponse, Project } from 'types';
import { fetcher } from '@lib/ui/utils';
import EmptyState from '@components/EmptyState';

const ProjectList: NextPage = () => {
  const { data, error } = useSWR<ApiResponse<{ projects: Project[] }>>(['/api/retraced/projects'], fetcher, {
    revalidateOnFocus: false,
  });

  if (!data && !error) {
    return <>Loading...</>;
  }

  if (error) {
    return (
      <div className='rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
        {error.info ? JSON.stringify(error.info) : error.status}
      </div>
    );
  }

  const projects = data?.data?.projects;

  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='font-bold text-gray-700 dark:text-white md:text-xl'>Projects</h2>
        <Link href={'/admin/retraced/projects/new'}>
          <a className='btn btn-primary'>+ New Project</a>
        </Link>
      </div>
      {projects?.length === 0 ? (
        <EmptyState title='No projects found.' href='/admin/retraced/projects/new' />
      ) : (
        <>
          <div className='rounder border'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    Name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Id
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Created At
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects?.map((project) => (
                  <tr key={project.id} className='border-b bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <td className='whitespace-nowrap px-6 py-3 text-sm text-gray-500 dark:text-gray-400'>
                      {project.name}
                    </td>
                    <td className='whitespace-nowrap px-6 py-3 text-sm text-gray-500 dark:text-gray-400'>
                      {project.id}
                    </td>
                    <td className='whitespace-nowrap px-6 py-3 text-sm text-gray-500 dark:text-gray-400'>
                      {project.created}
                    </td>
                    <td className='px-6 py-3'>
                      <div className='flex gap-2'>
                        <Link href={`/admin/saml/config/edit/${project.id}`}>
                          <a className='link-primary'>
                            <InformationCircleIcon className='h-5 w-5 text-secondary' />
                          </a>
                        </Link>
                        <Link href={`/admin/saml/config/edit/${project.id}`}>
                          <a className='link-primary'>
                            <DocumentSearchIcon className='h-5 w-5 text-secondary' />
                          </a>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectList;

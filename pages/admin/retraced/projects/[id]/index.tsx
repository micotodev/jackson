import ErrorMessage from '@components/Error';
import { LinkBack } from '@components/LinkBack';
import Loading from '@components/Loading';
import ProjectDetails from '@components/retraced/ProjectDetails';
import { useProject } from '@lib/ui/retraced';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const ProjectInfo: NextPage = () => {
  const router = useRouter();

  const { id: projectId } = router.query;

  const { project, isError, isLoading } = useProject(projectId as string);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorMessage />;
  }

  return (
    <div>
      <LinkBack href='/admin/retraced/projects' />
      <div className='mb-5 flex items-center justify-between'>
        <h2 className='font-bold text-gray-700 dark:text-white md:text-xl'>{project?.name}</h2>
      </div>
      {project && <ProjectDetails project={project} />}
    </div>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ProjectInfo;

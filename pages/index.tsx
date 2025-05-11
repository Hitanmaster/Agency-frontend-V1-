import { GetServerSideProps } from 'next';

interface Project {
  _id: string;
  title: string;
  description: string;
  media_url: string;
  project_page_url: string;
}

interface Props {
  projects: Project[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/projects`);
  const projects: Project[] = await res.json();
  return { props: { projects } };
};

export default function Home({ projects }: Props) {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Our Projects</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
        {projects.map((proj) => (
          <a key={proj._id} href={proj.project_page_url} target="_blank" rel="noreferrer">
            <img src={proj.media_url} alt={proj.title} style={{ width: '100%', borderRadius: '8px' }} />
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}

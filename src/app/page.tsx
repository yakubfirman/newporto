import { fetchAPI, getSettings, Project, Skill, Post, Testimonial } from '@/lib/api';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60;

export default async function Home() {
  let projects: Project[] = [];
  let skills: Skill[] = [];
  let posts: Post[] = [];
  let testimonials: Testimonial[] = [];
  let settings: Record<string, string> = {};

  try {
    projects = await fetchAPI<Project[]>('/projects');
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  try {
    testimonials = await fetchAPI<Testimonial[]>('/testimonials');
  } catch (error) {
    console.error('Error fetching testimonials:', error);
  }

  try {
    skills = await fetchAPI<Skill[]>('/skills');
  } catch (error) {
    console.error('Error fetching skills:', error);
  }

  try {
    posts = await fetchAPI<Post[]>('/posts');
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  settings = await getSettings();

  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-hidden">
      {/* Background Animated Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full animate-orb-1"
          style={{
            background: 'radial-gradient(circle, rgba(26,86,219,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        ></div>
        <div
          className="absolute -bottom-48 -right-48 w-[700px] h-[700px] rounded-full animate-orb-2"
          style={{
            background: 'radial-gradient(circle, rgba(99,143,230,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        ></div>
        <div
          className="absolute top-10 right-0 w-[350px] h-[350px] rounded-full animate-orb-3"
          style={{
            background: 'radial-gradient(circle, rgba(147,197,253,0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.2) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 40%, rgba(255,255,255,0.85) 75%, white 100%)',
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full overflow-x-hidden">
        <HomeClient
          projects={projects}
          skills={skills}
          posts={posts}
          settings={settings}
          testimonials={testimonials}
        />
      </div>
    </div>
  );
}

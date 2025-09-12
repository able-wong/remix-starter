import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { createContextLogger } from '~/utils/logger';
import { 
  Timeline, 
  TimelineItem, 
  TimelinePoint, 
  TimelineContent, 
  TimelineTime, 
  TimelineTitle, 
  TimelineBody,
  Carousel, 
  Badge, 
  Progress, 
  Kbd, 
  Button 
} from 'flowbite-react';
import { HiArrowNarrowRight, HiCalendar, HiCheck } from 'react-icons/hi';

type _ActionData = 
  | { success: false; error: string }
  | { success: true; message: string; submittedData: { name: string; email: string; message: string } };

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix + TailwindCSS + DaisyUI + Flowbite Demo' },
    {
      name: 'description',
      content: 'A demo showcasing Remix with both DaisyUI and Flowbite components',
    },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const logger = createContextLogger(context);

  logger.info('Index page loaded', {
    route: '/_index',
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substring(7),
  });

  return json({ success: true });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const logger = createContextLogger(context);
  const formData = await request.formData();
  
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Validate required fields
  if (!name || !email || !message) {
    return json({ 
      error: 'All fields are required',
      success: false as const
    }, { status: 400 });
  }

  // Log the contact form submission
  logger.info('Contact form submitted', {
    name: String(name),
    email: String(email),
    messageLength: String(message).length,
    timestamp: new Date().toISOString(),
  });

  // In a real app, you would save this to a database or send an email
  // For this demo, we'll just return success
  return json({ 
    success: true as const, 
    message: 'Thank you for your message! We\'ll get back to you soon.',
    submittedData: {
      name: String(name),
      email: String(email),
      message: String(message)
    }
  });
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme', newTheme);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <span className="btn btn-ghost text-xl">
            Remix + DaisyUI + Flowbite Demo
          </span>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost">
              Theme
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l-1.5 4.5h-6l4.5 3.5-1.5 4.5 4.5-3.5 4.5 3.5-1.5-4.5 4.5-3.5h-6L12 2z" />
              </svg>
            </button>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button onClick={() => handleThemeChange('light')}>
                  ☀️ Light Mode
                </button>
              </li>
              <li>
                <button onClick={() => handleThemeChange('dark')}>🌙 Dark Mode</button>
              </li>
              <li>
                <button onClick={() => handleThemeChange('system')}>
                  💻 System Default
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-8">
        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Card Title</h2>
              <p>This is a basic card component from DaisyUI.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Action</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <figure className="px-10 pt-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-32 w-32 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </figure>
            <div className="card-body">
              <h2 className="card-title">Card with Icon</h2>
              <p>This card includes an icon and some content.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-secondary">Details</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Interactive Card</h2>
              <p>This card has some interactive elements.</p>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Toggle me</span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="card bg-base-200 shadow-xl max-w-md mx-auto">
          <div className="card-body space-y-4">
            <h2 className="card-title">Contact Form</h2>
            
            {/* Success Message */}
            {actionData?.success === true && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{actionData.message}</span>
              </div>
            )}

            {/* Error Message */}
            {actionData?.success === false && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{actionData.error}</span>
              </div>
            )}

            <Form method="post">
              <div className="form-control w-full">
                <label htmlFor="name" className="label">
                  <span className="label-text font-medium">Name</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label htmlFor="email" className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control w-full">
                <label htmlFor="message" className="label">
                  <span className="label-text font-medium">Message</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="textarea textarea-bordered w-full"
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary">Send Message</button>
              </div>
            </Form>
          </div>
        </div>

        {/* Alert Section */}
        <div className="space-y-4">
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>This is an info alert</span>
          </div>
          <div className="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>This is a success alert</span>
          </div>
        </div>

        {/* Flowbite Section - Components not available in DaisyUI */}
        <div className="divider">Flowbite Components (Not in DaisyUI)</div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timeline Component - Flowbite Exclusive */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Project Timeline</h2>
              <Timeline>
                <TimelineItem>
                  <TimelinePoint icon={HiCalendar} />
                  <TimelineContent>
                    <TimelineTime>February 2025</TimelineTime>
                    <TimelineTitle>Project Kickoff</TimelineTitle>
                    <TimelineBody>
                      Initial planning phase with stakeholder meetings and requirement gathering.
                    </TimelineBody>
                    <Button color="gray">
                      Learn More
                      <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelinePoint icon={HiCheck} />
                  <TimelineContent>
                    <TimelineTime>March 2025</TimelineTime>
                    <TimelineTitle>Development Phase</TimelineTitle>
                    <TimelineBody>
                      Full-stack development with iterative sprints and continuous integration.
                    </TimelineBody>
                  </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                  <TimelinePoint />
                  <TimelineContent>
                    <TimelineTime>April 2025</TimelineTime>
                    <TimelineTitle>Beta Launch</TimelineTitle>
                    <TimelineBody>
                      Limited release to select users for feedback and testing.
                    </TimelineBody>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </div>
          </div>

          {/* Advanced Carousel with Indicators - More complex than DaisyUI carousel */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Feature Showcase</h2>
              <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                <Carousel>
                  <div className="flex h-full items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">AI-Powered Features</h3>
                      <p>Integrated with Gemini AI for intelligent assistance</p>
                      <Badge color="info" className="mt-2">NEW</Badge>
                    </div>
                  </div>
                  <div className="flex h-full items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Real-time Sync</h3>
                      <p>Firebase integration for live data updates</p>
                      <Badge color="success" className="mt-2">ACTIVE</Badge>
                    </div>
                  </div>
                  <div className="flex h-full items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 text-white">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Type-Safe</h3>
                      <p>Full TypeScript support with Vitest testing</p>
                      <Badge color="warning" className="mt-2">TESTED</Badge>
                    </div>
                  </div>
                </Carousel>
              </div>
            </div>
          </div>
        </div>

        {/* Flowbite Progress and Keyboard Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Progress Tracking</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium">Frontend Development</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress progress={75} color="blue" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium">Backend API</span>
                    <span className="text-sm font-medium">90%</span>
                  </div>
                  <Progress progress={90} color="green" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-base font-medium">Testing Coverage</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <Progress progress={60} color="yellow" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Keyboard Shortcuts</h3>
              <p className="text-sm mb-4">Quick actions for power users:</p>
              <div className="space-y-2">
                <div>
                  <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> - Quick search
                </div>
                <div>
                  <Kbd>Shift</Kbd> + <Kbd>?</Kbd> - Show help
                </div>
                <div>
                  <Kbd>Cmd</Kbd> + <Kbd>Enter</Kbd> - Submit form
                </div>
                <div>
                  <Kbd>Esc</Kbd> - Close modal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

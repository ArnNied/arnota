import Image from 'next/image';

export default function HeroSection(): JSX.Element {
  return (
    <section className='h-screen px-24 flex flex-row justify-center items-center'>
      <div className='w-1/2 my-auto space-y-4'>
        <h1 className='font-bold text-5xl leading-tight'>
          Capture your ideas quickly and easily with{' '}
          <span className='text-primary inline'>Arnota</span>
        </h1>
        <p className='font-semibold text-xl text-gray-700'>
          The powerful note-taking application that makes taking and sharing
          notes simple and efficient
        </p>
      </div>
      <div className='w-1/2 h-3/4 relative'>
        <Image
          src='/assets/img/landing-hero-image.svg'
          alt='Hero image'
          className='p-4'
          fill
        />
        <a
          href='https://storyset.com/work'
          className='absolute inset-x-0 bottom-0 text-sm text-gray-500 text-center hover:underline'
        >
          Work illustrations by Storyset
        </a>
      </div>
    </section>
  );
}

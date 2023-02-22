import Image from 'next/image';

import LandingFeatureSectionItemLayout from '../layouts/LandingFeatureSectionItemLayout';

export default function FeatureSectionVisibility(): JSX.Element {
  return (
    <LandingFeatureSectionItemLayout>
      <div className='relative'>
        <Image
          src='/assets/img/landing-feature-visibility.svg'
          alt='To Share or Not to Share'
          className='p-4 object-contain'
          fill
        />
        <a
          href='https://storyset.com/security'
          className='absolute inset-x-0 bottom-0 text-sm text-gray-500 text-center hover:underline'
        >
          Security illustrations by Storyset
        </a>
      </div>
      <div className='flex flex-col justify-center'>
        <h3 className='w-full font-semibold text-2xl text-primary'>
          To Share or Not to Share
        </h3>
        <p>
          Arnota provides three levels of visibility for your notes, allowing
          you to decide who can access them.
        </p>
        <ul className='mt-4'>
          <li>
            <span className='font-semibold text-primary'>PUBLIC</span>: Make
            your notes visible to anyone - they can be found with a search and
            accessed with a direct link.
          </li>
          <li>
            <span className='font-semibold text-primary'>LIMITED</span>: Only
            those with a direct link can access your notes.
          </li>
          <li>
            <span className='font-semibold text-primary'>PRIVATE</span>: Keep
            your notes private - only you have access to them.
          </li>
        </ul>
      </div>
    </LandingFeatureSectionItemLayout>
  );
}

import Image from 'next/image';

import LandingFeatureSectionItemLayout from '../layouts/LandingFeatureSectionItemLayout';

export default function FeatureSectionCategory(): JSX.Element {
  return (
    <LandingFeatureSectionItemLayout>
      <div className='flex flex-col justify-center'>
        <h3 className='w-full font-semibold text-2xl text-primary'>
          Get Organized with Categories and Tags
        </h3>
        <p>
          Organize your notes into categories, and organize it even further with
          multiple tags. This makes it easy to search for specific notes or
          categories and quickly find what you&apos;re looking for.
        </p>
      </div>
      <div className='relative'>
        <Image
          src='/assets/img/landing-feature-organize.svg'
          alt='Category & Tags'
          className='p-4 object-contain'
          fill
        />
        <a
          href='https://storyset.com/office'
          className='absolute inset-x-0 bottom-0 text-sm text-gray-500 text-center hover:underline'
        >
          Office illustrations by Storyset
        </a>
      </div>
    </LandingFeatureSectionItemLayout>
  );
}

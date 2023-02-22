import Image from 'next/image';

import LandingFeatureSectionItemLayout from '../layouts/LandingFeatureSectionItemLayout';

export default function FeatureSectionFavorite(): JSX.Element {
  return (
    <LandingFeatureSectionItemLayout>
      <div className='relative'>
        <Image
          src='/assets/img/landing-feature-favorites.svg'
          alt='Favorites & Duplicate'
          className='p-4 object-contain'
          fill
        />
        <a
          href='https://storyset.com/check'
          className='absolute inset-x-0 bottom-0 text-sm text-gray-500 text-center hover:underline'
        >
          Check illustrations by Storyset
        </a>
      </div>
      <div className='flex flex-col justify-center'>
        <h3 className='w-full font-semibold text-2xl text-primary'>
          Discover, Favorite, and Duplicate Notes
        </h3>
        <p>
          Browse and discover interesting notes made by other users. Easily add
          them to your favorites for easy access or duplicate them for your own
          use.
        </p>
      </div>
    </LandingFeatureSectionItemLayout>
  );
}

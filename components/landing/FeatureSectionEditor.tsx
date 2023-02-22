import Image from 'next/image';

import LandingFeatureSectionItemLayout from '../layouts/LandingFeatureSectionItemLayout';

export default function FeatureSectionEditor(): JSX.Element {
  return (
    <LandingFeatureSectionItemLayout>
      <div className='flex flex-col justify-center'>
        <h3 className='w-full font-semibold text-2xl text-primary'>
          WYSIWYG Editor
        </h3>
        <p>
          Leverage the power of Tiptap, a{' '}
          <a
            href='https://en.wikipedia.org/wiki/WYSIWYG'
            className='font-semibold underline decoration-2 decoration-primary'
          >
            WYSIWYG
          </a>{' '}
          editor to create captivating notes with headers, colors, lists, and
          even images. Bring your ideas to life and express yourself in an
          imaginative way.
        </p>
      </div>
      <div className='relative'>
        <Image
          src='https://i.morioh.com/201221/ce8bbbec.webp'
          alt='Tiptap Editor'
          className='p-4 object-contain'
          fill
        />
      </div>
    </LandingFeatureSectionItemLayout>
  );
}

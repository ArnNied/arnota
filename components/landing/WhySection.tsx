import Image from 'next/image';

import LandingSectionLayout from '../layouts/LandingSectionLayout';

export default function WhySection(): JSX.Element {
  return (
    <LandingSectionLayout id='why' additionalClassName='grid grid-cols-2 gap-8'>
      <div className=''>
        <h2 className='my-8 font-bold text-4xl text-primary tracking-wide'>
          WHY USE ARNOTA?
        </h2>
        <p className='text-lg text-darker'>
          <span className='text-primary font-bold'>Arnota</span> is designed to
          bridge the gap between Google Keep and Notion, providing users with
          the best of both worlds - the advanced features of Notion, but with
          the simplicity and ease of use that Google Keep offers.
        </p>
      </div>
      <div className='grid grid-cols-2'>
        <div className='relative'>
          <Image
            src='https://play-lh.googleusercontent.com/9bJoeaPbGTB8Tz_h4N-p-6ReRd8vSS-frZb2tmJulaGIoTKElKj3zpmcFJvnS96ANZP5'
            alt='Google Keep'
            className='p-4 object-contain'
            fill
          />
        </div>
        <div className='relative'>
          <Image
            src='https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png'
            alt='Notion'
            className='p-4 object-contain'
            fill
          />
        </div>
      </div>
    </LandingSectionLayout>
  );
}

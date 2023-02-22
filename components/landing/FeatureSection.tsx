import LandingSectionLayout from '../layouts/LandingSectionLayout';

import FeatureSectionCategory from './FeatureSectionCategory';
import FeatureSectionEditor from './FeatureSectionEditor';
import FeatureSectionFavorite from './FeatureSectionFavorite';
import FeatureSectionVisibility from './FeatureSectionVisibility';

export default function FeatureSection(): JSX.Element {
  return (
    <LandingSectionLayout id='feature'>
      <h2 className='my-8 font-bold text-4xl text-primary text-center tracking-wide'>
        FEATURES
      </h2>
      <FeatureSectionEditor />
      <FeatureSectionVisibility />
      <FeatureSectionCategory />
      <FeatureSectionFavorite />
    </LandingSectionLayout>
  );
}

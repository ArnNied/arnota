type LandingFeatureSectionItemLayoutProps = {
  children: JSX.Element | JSX.Element[];
};

export default function LandingFeatureSectionItemLayout({
  children
}: LandingFeatureSectionItemLayoutProps): JSX.Element {
  return <div className='h-96 grid grid-cols-2 gap-8'>{children}</div>;
}

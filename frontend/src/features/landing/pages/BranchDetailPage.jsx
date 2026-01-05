import BranchInfo from '../components/branch/BranchInfo';
import BranchGallery from '../components/branch/BranchGallery';
import BranchServices from '../components/branch/BranchServices';
import BranchPT from '../components/branch/BranchPT';
import RegisterCTA from '../components/RegisterCTA';
import { useParams } from 'react-router-dom';
import Banner from '../components/branch/Banner';
import Location from '../components/branch/Location';

export default function BranchDetailPage() {
  const { city, slug } = useParams();

  // sau này map data theo city + slug
  console.log(city, slug);

  return (
    <div className="bg-(--bg) text-(--text-primary)">
      <Banner
        title="ENERGYM QUẬN 1"
        image="/images/branch-banner.jpg"
        breadcrumb={[
          { label: 'Chi nhánh', to: '/branches' },
          { label: `TP. ${city?.toUpperCase()}` },
          { label: `Energym Quận 1` },
        ]}
        showSearch={false}
      />
      <BranchInfo />
      <BranchGallery />
      <BranchServices />
      <BranchPT />
      <Location />
      <RegisterCTA />
    </div>
  );
}

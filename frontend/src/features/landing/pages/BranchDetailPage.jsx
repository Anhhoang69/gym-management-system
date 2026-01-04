import BranchHero from '../components/branch/BranchHero';
import BranchInfo from '../components/branch/BranchInfo';
import BranchGallery from '../components/branch/BranchGallery';
import BranchServices from '../components/branch/BranchServices';
import BranchPT from '../components/branch/BranchPT';
import RegisterCTA from '../components/RegisterCTA';
import { useParams } from 'react-router-dom';

export default function BranchDetailPage() {
  const { city, slug } = useParams();

  // sau này map data theo city + slug
  console.log(city, slug);

  return (
    <div className="bg-(--bg) text-(--text-primary)">
      <BranchHero />
      <BranchInfo />
      <BranchGallery />
      <BranchServices />
      <BranchPT />
      <RegisterCTA />
    </div>
  );
}

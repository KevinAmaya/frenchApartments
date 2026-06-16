import type { FC } from 'react';
import { HomepageWrapper } from './Homepage.styled';
import Link from 'next/link'
import { imageUrl } from '@/lib/imageUrl';

interface HomepageProps {}

const Homepage: FC<HomepageProps> = () => (
 <HomepageWrapper data-testid="Homepage">
    <div className="homepage">
      <div className="homepage__gifs">
        <img alt="" src={imageUrl('/images/france.gif')} width={200} height={150} />
        <img alt="" src={imageUrl('/images/dancebignew.gif')} width={200} height={150} />
        <img alt="" src={imageUrl('/images/Home.gif')} width={200} height={150} />
        <img alt="" src={imageUrl('/images/XAAB2582.gif')} width={200} height={150} />
      </div>
      <div className="homepage__divisor"> </div>
      <h1 className="homepage__title-main"> Welcome to </h1>
      <div className="homepage__divisor"> </div>
      <h1 className="homepage__title"> French Apartments for Wendo! </h1>
      <div className="homepage__divisor"> </div>
      <nav className="homepage__nav">
        <p className="homepage__text">click here ----- </p>
        <Link href="/lists">
          <img alt="" src={imageUrl('/images/Naakosh.gif')} width={200} height={100} />
        </Link>
      </nav>


      <div className="homepage__gifs">
        <img alt="" src={imageUrl('/images/flyline.gif')} width={600} height={200} />
        <img alt="" src={imageUrl('/images/ns_ruu01.gif')} width={200} height={200} />
      </div>

    </div>
 </HomepageWrapper>
);

export default Homepage;

import type { FC } from 'react';
import { HomepageWrapper } from './Homepage.styled';
import Image from 'next/image'
import Link from 'next/link'

interface HomepageProps {}

const Homepage: FC<HomepageProps> = () => (
 <HomepageWrapper data-testid="Homepage">
    <div className="homepage">
      <div className="homepage__gifs">
        <Image alt="" src="/images/france.gif" width="200" height="150"></Image>
        <Image alt="" src="/images/dancebignew.gif" width="200" height="150"></Image>
        <Image alt="" src="/images/Home.gif" width="200" height="150"></Image>
        <Image alt="" src="/images/XAAB2582.gif" width="200" height="150"></Image>
      </div>
      <div className="homepage__divisor"> </div>
      <h1 className="homepage__title-main"> Welcome to </h1>
      <div className="homepage__divisor"> </div>
      <h1 className="homepage__title"> French Apartments for Wendo! </h1>
      <div className="homepage__divisor"> </div>
      <nav className="homepage__nav">
        <p className="homepage__text">click here ----- </p>
        <Link href="/lists">
          <Image alt="" src="/images/Naakosh.gif" width="200" height="100"></Image>
        </Link>
      </nav>


      <div className="homepage__gifs">
        <Image alt="" src="/images/flyline.gif" width="600" height="200"></Image>
        <Image alt="" src="/images/ns_ruu01.gif" width="200" height="200"></Image>
      </div>

    </div>
 </HomepageWrapper>
);

export default Homepage;

import BestItem from "../../components/BestItem/BestItem";
import { PageBestWrapper } from './page.styled';
import Link from 'next/link'
import itemsData from "./data.json";
import { imageUrl } from '@/lib/imageUrl';

export default function Best() {
  return (<PageBestWrapper>
    <div className="page-best">
      <ul className="link-list">
        <li>
          <Link className="link" href="/">Home</Link>
        </li>
        <li>
          <Link className="link" href="/lists">List</Link>
        </li>
      </ul>
      <div className="page-best__title-wrap">
        <img alt="" src={imageUrl('/images/france.gif')} width={100} height={100} />
        <img alt="" src={imageUrl('/images/best1.gif')} width={100} height={100} />
        <h1 className="page-best__title"> Best Apartments!! </h1>
        <img alt="" src={imageUrl('/images/best2.gif')} width={100} height={100} />
        <img alt="" src={imageUrl('/images/france.gif')} width={100} height={100} />
      </div>
      <div className="page-best__list-best-items">
        {itemsData.map((item, index) => (
          <BestItem
            key={index} 
            title={item.title}
            description={item.description}
            url={item.url}
            score={item.score}
            price={item.price}
          />
        ))}
      </div>
   </div>
  </PageBestWrapper>);
}

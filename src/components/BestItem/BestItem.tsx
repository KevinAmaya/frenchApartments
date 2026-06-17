import type { FC } from 'react';
import { BestItemWrapper } from './BestItem.styled';

interface BestItemProps {
  title: string;
  description: string;
  url: string;
  score: string;
  price: string;
}

const BestItem: FC<BestItemProps> = ({ title, description, url, score, price}) => {

  return (
    <BestItemWrapper data-testid="BestItem">
      <div className="best-item">
        <div className="best-item__content">
          <h2 className="best-item__title">{title}</h2>
          <p className="best-item__description">{description}</p>
          <div className="best-item__footer">
            <p className="best-item__score">Score: {score}</p>
            <p className="best-item__price">Price: {price}</p>
          </div>
          <a className="best-item__link" href={url} target="_blank" rel="noopener noreferrer">Go to Website</a>
        </div>
     </div>
    </BestItemWrapper>
  );
};

export default BestItem;

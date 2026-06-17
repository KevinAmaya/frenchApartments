import styled from 'styled-components';

export const BestItemWrapper = styled.div`
  .best-item { 
    display: flex;
    border: 4px inset white;
    flex-direction: row;
    max-width: 800px;
  }

  .best-item__image { 
    margin-inline-end: 44px;
  }

  .best-item__content { 
    margin: 24px auto;
    padding-inline: 48px;
  }

  .best-item__title { 
    font-size: 36px;
    font-family: "Comic Sans MS", "Comic Sans", cursive, sans-serif; 
    font-weight: bold;
  }

  .best-item__description { 
    border-bottom: 2px solid white;
    padding-block-end: 24px;
  }

  .best-item__score { 
    margin-block-start: 24px;
    font-size: 24px;
  }

  .best-item__price { 
    margin-block-start: 24px;
    font-size: 24px;
  }

  .best-item__price::after{ 
    content: '€';
    margin-inline-start: 6px;
  }

  .best-item__footer { 
    display: flex;
    gap: 24px;
  }

  .best-item__link { 
    color: #ddd;
    font-size: 24px;
    background: #3c7ba0;
    height: 41px;
    display: flex;
    border-radius: 20px;
    width: 208px;
    align-items: center;
    justify-content: center;
    margin-top: 18px;
    border: 2px dotted;
  }
`;

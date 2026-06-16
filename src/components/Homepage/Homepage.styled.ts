import styled from 'styled-components';

export const HomepageWrapper = styled.div`
  .homepage {
    padding-inline: 24px;
  }

  .homepage__title-main { 
    color: yellow;
    font-size: 128px;
    -webkit-text-stroke: 2px red;
  }

  .homepage__title { 
    color: white;
    font-size: 64px;
  }

  .homepage__nav { 
    display: flex;
    align-items: center;
    margin-top: 40px;
    justify-content: flex-end;
    gap: 20px;
  }

  .homepage__text { 
    font-size: 40px;
  }

  .homepage__arrow { 
    height: 100px;
  }

  .homepage__gifs { 
    display: flex;
    justify-content: space-between;
    margin-block: 64px;
    width: 100%;
  }

  .homepage__divisor { 
    background: #2A7B9B;
    height: 10px;
    width: 100%;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-size: 100% 100%;
    animation: gradient-radial 8s ease alternate infinite;
    overflow: hidden;
  }
`;

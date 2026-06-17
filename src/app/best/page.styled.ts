import styled from 'styled-components';

export const PageBestWrapper = styled.div`
  .page-best { 
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .page-best__title { 
    font-size: 64px;
    margin-inline: 32px;
  }

  .page-best__title-wrap {
    display: flex;
  }

  .page-best__list-best-items {
    display: flex;
    margin-block-start: 48px;
    flex-direction: column;
    gap: 24px;
  }
`;

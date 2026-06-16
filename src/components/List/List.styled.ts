import styled from 'styled-components';

export const ListWrapper = styled.div`
  .list {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 48px;
    justify-content: center;
    height: 100%;
  }

  .list__title {
    font-size: 64px;
  }

  .list__title-wrap {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
`;

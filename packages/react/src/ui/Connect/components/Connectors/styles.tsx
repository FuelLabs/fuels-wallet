import styled from 'styled-components';

export const ConnectorItem = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent;
  box-sizing: border-box;
  cursor: pointer;
  width: 100%;
  color: var(--fuel-font-color);
  gap: var(--fuel-items-gap);
  padding: 0.8em;
  border: var(--fuel-border);
  border-radius: var(--fuel-border-radius);
  transition: background-color border-color opacity 50ms
    cubic-bezier(0.16, 1, 0.3, 1);

  &:active {
    opacity: 0.8;
  }
  &:hover {
    border-color: var(--fuel-border-hover);
    background-color: var(--fuel-connector-hover);
  }
`;

export const ConnectorList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--fuel-items-gap);
`;

export const ConnectorName = styled.div`
  font-size: var(--fuel-font-size);
`;

export const ConnectorImg = styled.img`
  object-fit: cover;
`;

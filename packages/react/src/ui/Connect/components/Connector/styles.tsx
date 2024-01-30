import styled from 'styled-components';

export const ConnectorTitle = styled.h2`
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  color: var(--fuel-color-bold);
  margin: 0 0 0.8em 0;
`;

export const ConnectorDescription = styled.p`
  text-align: center;
  margin: 0 1.2em;
  line-height: 1.2em;
`;

export const ConnectorImage = styled.div`
  display: flex;
  justify-content: center;
  height: 6.2em;
  width: 100%;
  margin-top: 1.4em;
  margin-bottom: 1.2em;
`;

export const ConnectorButton = styled.a`
  display: flex;
  box-sizing: border-box;
  text-decoration: none;
  justify-content: center;
  align-items: center;
  margin-top: 1.4em;
  width: 100%;
  padding: 0.6em 1em;
  font-size: 1.1em;
  color: var(--fuel-color-bold);
  border-radius: var(--fuel-border-radius);
  background-color: var(--fuel-button-background);

  &:visited {
    color: var(--fuel-color-bold);
  }

  &:hover {
    background-color: var(--fuel-button-background-hover);
  }
`;

export const ConnectorContent = styled.div`
  display: flex;
  flex-direction: column;
`;

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Dialog from '@radix-ui/react-dialog';
import styled, { keyframes } from 'styled-components';

import { BackIcon as CBackIcon } from './icons/BackIcon';
import { CloseIcon as CCloseIcon } from './icons/CloseIcon';

const overlayShow = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const contentShow = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const placeholderLoader = keyframes`
  0%{
    background-position: -468px 0
  }
  100%{
    background-position: 468px 0
  }
`;

export const DialogOverlay = styled(Dialog.Overlay)`
  background-color: var(--fuel-overlay-background);
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const DialogContent = styled(Dialog.Content)`
  overflow: hidden;
  color: var(--fuel-color);
  user-select: none;
  width: 300px;
  max-width: calc(100% - 20px);
  max-height: calc(100% - 20px);
  box-sizing: border-box;
  background-color: var(--fuel-dialog-background);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: var(--fuel-border-radius);
  padding: 14px;
  padding-bottom: 18px;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow:
    hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;

  &:focus {
    outline: none;
  }
` as any as typeof Dialog.Content;

export const DialogTitle = styled(Dialog.Title)`
  margin: 0;
  font-weight: normal;
  text-align: center;
  font-size: 16px;
`;

export const DialogMain = styled.div`
  margin-top: 20px;
  position: relative;
`;

export const BackIcon = styled(CBackIcon)`
  fill: var(--fuel-color);
  padding: 4px;
  opacity: 0.5;
  font-family: inherit;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;

  &[data-connector='false'] {
    display: none;
  }

  &:hover,
  &:active {
    background-color: var(--mauve-1);
    opacity: 1;
  }
`;

export const CloseIcon = styled(CCloseIcon)`
  fill: var(--fuel-color);
  padding: 4px;
  opacity: 0.5;
  font-family: inherit;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: var(--mauve-1);
    opacity: 1;
  }
`;

export const FuelRoot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  z-index: 9999;
  font-size: var(--fuel-font-size);

  & * {
    font-family: var(--fuel-font-family);
  }
`;

export const PlaceholderLoader = styled.div`
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${placeholderLoader};
  animation-timing-function: linear;
  background: #d1d5d9;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 1000px 104px;
  height: fit-content;
  position: relative;
  overflow: hidden;
  color: transparent !important;
  pointer-events: none !important;
`;

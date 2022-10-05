import {
  SideBarActionTypes,
  sidebarMachine,
  SideBarStateValues,
} from './sidebarMachine';

describe('sidebarMachine', () => {
  it('should open the sideBar', () => {
    const nextState = sidebarMachine.transition(SideBarStateValues.Minimized, {
      type: SideBarActionTypes.TOGGLE,
    });
    expect(nextState.value).toBe(SideBarStateValues.Expanded);
  });
  it('should close the sideBar', () => {
    const nextState = sidebarMachine.transition(SideBarStateValues.Expanded, {
      type: SideBarActionTypes.TOGGLE,
    });
    expect(nextState.value).toBe(SideBarStateValues.Minimized);
  });
});

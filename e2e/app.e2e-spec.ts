import { FreelanceSimulatorPage } from './app.po';

describe('freelance-simulator App', () => {
  let page: FreelanceSimulatorPage;

  beforeEach(() => {
    page = new FreelanceSimulatorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

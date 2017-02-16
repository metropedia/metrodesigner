import { MetrodesignerPage } from './app.po';

describe('metrodesigner App', function() {
  let page: MetrodesignerPage;

  beforeEach(() => {
    page = new MetrodesignerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

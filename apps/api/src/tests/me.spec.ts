import { MeModule } from '../me/me.module';

describe('Me', () => {
  it('should be defined', () => {
    expect(new MeModule()).toBeDefined();
  });
});

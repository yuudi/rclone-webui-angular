import { TestBed } from '@angular/core/testing';
import { AppStorageService } from './app-storage.service';

describe('AppStorageService', () => {
  let service: AppStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStorageService],
    });
    service = TestBed.inject(AppStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a storage item with default value', () => {
    const item = service.getItem<string>('test_key', () => 'default_value');
    expect(item.get()).toBe('default_value');
  });

  it('should set and get values correctly', () => {
    const item = service.getItem<string>('test_key2', () => 'default');
    item.set('new_value');
    expect(item.get()).toBe('new_value');
    expect(localStorage.getItem('rwa-test_key2')).toBe(JSON.stringify('new_value'));
  });

  it('should work as observable and notify updates', async () => {
    const item = service.getObservableItem<number>('test_obs', () => 42);
    let lastValue: number | undefined;

    const sub = item.asObservable().subscribe((v) => {
      lastValue = v;
    });

    await new Promise<void>((resolve) => setTimeout(resolve, 10));

    expect(lastValue).toBe(42);

    item.set(100);
    expect(lastValue).toBe(100);
    expect(await item.get()).toBe(100);

    item.destructor();
    sub.unsubscribe();
  });
});

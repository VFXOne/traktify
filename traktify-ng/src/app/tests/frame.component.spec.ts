import { TestBed } from '@angular/core/testing';
import { FrameComponent } from '../components/containers/frame/frame.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FrameComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'traktify-ng' title`, () => {
    const fixture = TestBed.createComponent(FrameComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('traktify-ng');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(FrameComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, traktify-ng');
  });
});

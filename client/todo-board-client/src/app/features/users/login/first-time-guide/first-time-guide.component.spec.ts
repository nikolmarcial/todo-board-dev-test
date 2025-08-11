import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimeGuideComponent } from './first-time-guide.component';

describe('FirstTimeGuideComponent', () => {
  let component: FirstTimeGuideComponent;
  let fixture: ComponentFixture<FirstTimeGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTimeGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstTimeGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

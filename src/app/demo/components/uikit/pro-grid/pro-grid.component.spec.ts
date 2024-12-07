import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProGridComponent } from './pro-grid.component';

describe('ProGridComponent', () => {
  let component: ProGridComponent;
  let fixture: ComponentFixture<ProGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

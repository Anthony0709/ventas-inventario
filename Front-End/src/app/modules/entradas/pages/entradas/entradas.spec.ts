import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Entradas } from './entradas';

describe('Entradas', () => {
  let component: Entradas;
  let fixture: ComponentFixture<Entradas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Entradas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Entradas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

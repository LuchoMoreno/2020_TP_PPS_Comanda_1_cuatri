import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaClientePage } from './alta-cliente.page';

describe('AltaClientePage', () => {
  let component: AltaClientePage;
  let fixture: ComponentFixture<AltaClientePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaClientePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

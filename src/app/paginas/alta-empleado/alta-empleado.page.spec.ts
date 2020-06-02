import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AltaEmpleadoPage } from './alta-empleado.page';

describe('AltaEmpleadoPage', () => {
  let component: AltaEmpleadoPage;
  let fixture: ComponentFixture<AltaEmpleadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltaEmpleadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AltaEmpleadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

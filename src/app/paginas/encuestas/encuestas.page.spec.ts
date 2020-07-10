import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EncuestasPage } from './encuestas.page';

describe('EncuestasPage', () => {
  let component: EncuestasPage;
  let fixture: ComponentFixture<EncuestasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuestasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EncuestasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

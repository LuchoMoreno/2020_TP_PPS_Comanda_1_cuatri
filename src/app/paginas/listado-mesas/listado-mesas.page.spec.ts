import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListadoMesasPage } from './listado-mesas.page';

describe('ListadoMesasPage', () => {
  let component: ListadoMesasPage;
  let fixture: ComponentFixture<ListadoMesasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoMesasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoMesasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

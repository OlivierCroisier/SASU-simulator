import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSankeyComponent } from './graph-sankey.component';

describe('GraphSankeyComponent', () => {
  let component: GraphSankeyComponent;
  let fixture: ComponentFixture<GraphSankeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphSankeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphSankeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

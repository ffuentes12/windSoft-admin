import { TestBed } from '@angular/core/testing';

import { CarritoProductoService } from './carrito-producto.service';

describe('CarritoProductoService', () => {
  let service: CarritoProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

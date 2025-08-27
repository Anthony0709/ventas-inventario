import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from '../../../services/sale.service'
import { ToastrService } from 'ngx-toastr';
import { StoresService } from '../../../services/store.service';
import { Sale, SaleCreate } from '../../../models/sale.model';
import { Store } from '../../../models/store.model';

import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-sale-list',
  standalone: false,
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.css'
})
export class SaleList  implements OnInit {
sales: any[] = [];
  selected: any = null;
  isEdit = false;
  showModal = false;

  constructor(private service: SalesService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.service.getAll().subscribe(res => this.sales = res);
  }

  openCreate(): void {
  this.selected = {
    product_id: null,
    store_id: null,
    quantity: 1
  };
  this.isEdit = false;
  this.showModal = true;
}

  openEdit(sale: any): void {
    this.selected = { ...sale };
    this.isEdit = true;
    this.showModal = true;
  }

  save(): void {
  // Garantizamos que se envían números, no strings
  const payload = {
    product_id: Number(this.selected.product_id),
    store_id: Number(this.selected.store_id),
    quantity: Number(this.selected.quantity)
  };

  const request = this.isEdit
    ? this.service.update(this.selected.id, payload)
    : this.service.create(payload);

  request.subscribe(() => {
    this.showModal = false;
    this.loadSales();
  });
}


  delete(id: number): void {
    if (confirm('¿Eliminar esta venta?')) {
      this.service.delete(id).subscribe(() => this.loadSales());
    }
  }
}

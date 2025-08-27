import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../../../services/products.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: any[] = [];
  selected: any = null;
  isEdit = false;
  showModal = false;

  constructor(private service: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.service.getAll().subscribe(res => this.products = res);
  }

  openCreate(): void {
    this.selected = { name: '', stock: 0, price: 0, store_id: null };
    this.isEdit = false;
    this.showModal = true;
  }

  openEdit(product: any): void {
    this.selected = { ...product };
    this.isEdit = true;
    this.showModal = true;
  }

  save(): void {
    const request = this.isEdit
      ? this.service.update(this.selected.id, this.selected)
      : this.service.create(this.selected);

    request.subscribe(() => {
      this.showModal = false;
      this.loadProducts();
    });
  }

  delete(id: number): void {
    if (confirm('¿Eliminar este producto?')) {
      this.service.delete(id).subscribe(() => this.loadProducts());
    }
  }
}

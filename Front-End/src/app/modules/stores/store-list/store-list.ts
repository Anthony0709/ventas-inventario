import { Component, OnInit } from '@angular/core';
import { Store } from '../../../models/store.model';
import { StoresService } from '../../../services/store.service';

@Component({
  selector: 'app-store-list',
  standalone: false,
  templateUrl: './store-list.html',
  styleUrl: './store-list.css'
})
export class StoreList implements OnInit {
stores: any[] = [];
  selected: any = null;
  isEdit = false;
  showModal = false;

  constructor(private service: StoresService) {}

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.service.getAll().subscribe(res => this.stores = res);
  }

  openCreate(): void {
    this.selected = { name: '', location: '' };
    this.isEdit = false;
    this.showModal = true;
  }

  openEdit(store: any): void {
    this.selected = { ...store };
    this.isEdit = true;
    this.showModal = true;
  }

  save(): void {
    const request = this.isEdit
      ? this.service.update(this.selected.id, this.selected)
      : this.service.create(this.selected);

    request.subscribe(() => {
      this.showModal = false;
      this.loadStores();
    });
  }

  delete(id: number): void {
    if (confirm('¿Eliminar esta tienda?')) {
      this.service.delete(id).subscribe(() => this.loadStores());
    }
  }
}

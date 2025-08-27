import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from './sidebar/sidebar';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';



@NgModule({
  declarations: [
    Sidebar,
    Header,
    Footer
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkWithHref,
    RouterLinkActive
  ],
  exports: [
    Sidebar,
    Header,
    Footer
  ]
})
export class SharedModule { }

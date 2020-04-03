import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    href?: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/info', title: 'Groceries Finder',  icon: 'dashboard', class: '' },
    { path: '/pharmacy', title: 'Pharmacy Finder',  icon: 'local_pharmacy', class: '' },
    { path: '/covid', title: 'Covid 19 Stats',  icon: 'timeline', class: '', href: 'https://imanshu15.github.io/covid-nineteen/'}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}

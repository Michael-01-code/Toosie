import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchTerm
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  search(){
    console.log(this.searchTerm);
    this.router.navigate(['shop/product/search'])
  }

}

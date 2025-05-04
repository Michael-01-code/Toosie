import { Injectable } from "@angular/core";

import { CanLoad, Router } from "@angular/router";
// import { BehaviorSubject, from, Observable } from 'rxjs';
// import { filter, switchMap, take } from 'rxjs/operators';

export const INTRO_KEY = "intro-seen";
@Injectable({
  providedIn: "root",
})
export class CustomStorageService {
  constructor() {}
}

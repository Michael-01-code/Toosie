import { authEndpoints, baseEndpoints } from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import jwt_decode from "jwt-decode";

const TOKEN_KEY = 'my-token';
const CURRENT_USER = 'current-user';
const UNVERIFIED_USER = 'unverified-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';

  constructor(private reqS: RequestService) {
    this.loadToken();
  }

  async loadToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    return (token && token) ? token : null;
  }

  login(credentials: { email: any; password: any }): Observable<any> {
    return this.reqS.post(authEndpoints.login, credentials).pipe(
      tap(res => {
        console.log(res.data);
        localStorage.setItem(CURRENT_USER, JSON.stringify(res.data));
        const { token } = res.token;
        localStorage.setItem(TOKEN_KEY, token);
        this.isAuthenticated.next(true);

        // Debug role
        console.log('User role:', res.data.role || res.data.user?.role);
      })
    );
  }

  signup(credentials: { name: any; email: any; password: any }): Observable<any> {
    return this.reqS.post(authEndpoints.signup, credentials).pipe(
      tap(res => {
        console.log(res);
        localStorage.setItem(UNVERIFIED_USER, JSON.stringify(res.data));
        return res;
      })
    );
  }

  updateUser(id, credentials): Observable<any> {
    return this.reqS.put(baseEndpoints.user + '/' + id, credentials).pipe(
      tap(res => {
        console.log(res);
        localStorage.setItem(CURRENT_USER, JSON.stringify(res.data));
        this.isAuthenticated.next(true);
      })
    );
  }

  deleteUser(id): Observable<any> {
    return this.reqS.delete(baseEndpoints.user + '/' + id);
  }

  getUsers(): Observable<any> {
    return this.reqS.get(baseEndpoints.user);
  }

  getReferrals(): Observable<any> {
    return this.reqS.get(baseEndpoints.referrals);
  }

  getUser(id): Observable<any> {
    return this.reqS.get(baseEndpoints.user + '/' + id);
  }

  verifyUser(id, obj): Observable<any> {
    return this.reqS.post(authEndpoints.activate + '/' + id, obj).pipe(
      tap(res => {
        console.log(res);
        const { token, user } = res.data;
        localStorage.setItem(CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(TOKEN_KEY, token.token);
        this.isAuthenticated.next(true);
        return res;
      })
    );
  }

  private save_token(data: { success: any; token: string; }) {
    if (data.success) {
      localStorage.setItem('token', data.token);
      return;
    }
  }

  currentUser() {
    const user = localStorage.getItem(CURRENT_USER);
    return JSON.parse(user || '{}');
  }

  logout() {
    this.isAuthenticated.next(false);
    localStorage.clear();
  }

  public userAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const decode = jwt_decode(token);
      if (Date.now() >= decode['exp'] * 1000) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  // ✅ New method: Get current user's role
  getUserRole(): string {
    const user = localStorage.getItem(CURRENT_USER);
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser?.role || ''; // Adjust this if your user structure is different
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        return '';
      }
    }
    return '';
  }
}

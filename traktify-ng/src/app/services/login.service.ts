import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environment';
import {AuthSession} from '../models/auth-session.model';

class AuthState {
  session: AuthSession;
  error?: string;

  constructor(session?: AuthSession, error?: string) {
    this.session = session ?? {authenticated: false};
    this.error = error;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginManagerService {

  private state$ = new BehaviorSubject<AuthState>(new AuthState());

  private url: string = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  loadSession(): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      try {
        this.http.get<AuthSession>(this.url + 'session').subscribe(session => {
          this.state$.next(new AuthState(session));
          subscriber.next(session.authenticated);
        });
      } catch (e: any) {
        this.state$.next(new AuthState(e));
        subscriber.next(false);
      }
    });
  }

  loginByRedirect(): Observable<string> {
    return new Observable(subscriber => {
      this.http.get(this.url + 'login-url', {responseType: 'text'}).subscribe(url => {
        subscriber.next(url);
      })
    })
  }

  isLoggedIn(): boolean {
    return this.state$.value.session.authenticated;
  }

  isSetupComplete(): Observable<boolean> {
    return this.http.get<boolean>(this.url + 'isSetupComplete');
  }

  completeSetup(): Observable<any> {
    return this.http.put(this.url + 'completeSetup', null);
  }

}
